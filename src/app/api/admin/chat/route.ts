import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import * as github from "@/lib/admin/github";
import { validateHomeContent } from "@/lib/admin/validateContent";
import { diffContent } from "@/lib/admin/diff";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the content editor assistant for the Communication Resources website (home of the "Straight Talk by Tom DeLapp" podcast).

Your ONLY job right now is editing the homepage's content — the hero section, latest-episode section, about-the-host section, and the subscribe band. You cannot edit anything else: not other pages, not navigation, not styling, not layout, not any code or configuration. If asked to do something outside that scope, politely decline and explain what you can help with instead.

## Workflow
1. Always call read_home_content first to see the exact current values before proposing any change — never guess or assume a current value.
2. When ready, call propose_home_content_change with the COMPLETE home content object (every field, including the ones you are NOT changing, copied over unchanged) plus a short summary of what changed. This does not publish anything — the user reviews and explicitly approves or rejects it afterward.
3. Never fabricate facts, phone numbers, names, or claims that weren't provided by the user or already present in the content. If a request is ambiguous, ask a clarifying question in plain text instead of proposing a change.
4. Only propose ONE change per request unless the user clearly asked for multiple distinct edits in the same message.

## What you must NEVER do
- Never claim to have "published," "saved," or "deployed" anything — proposals require the user's explicit approval and a separate publish step you are not part of.
- Never invent a new field, section, or structure not already present in the schema below.
- Never propose changing the site's navigation, layout, design, or any code.

## Home content schema
(hero) eyebrow, heading, tagline, body: strings. primaryCta / secondaryCta: {label, href}. listenLabel, onAirLabel, captionTitle, captionSubtitle: strings. imageSrc, imageAlt: strings.
(latestEpisode) eyebrow, allEpisodesHref, allEpisodesLabel, meta, title, summary, playerDisclaimer, audioSrc: strings. subtitle: optional string (omit or leave blank if there's no subtitle). episodeArt: {src, alt}.
(aboutHost) eyebrow, pullQuote: strings. paragraphs: string[]. checklistLabel: string. checklist: string[]. readMoreHref, readMoreLabel, headshotSrc, headshotAlt, name, role: strings.
(subscribeBand) heading, body: strings. showEmailForm: boolean.

If the user's message notes an image was already uploaded (e.g. "Image already uploaded to /uploads/whatever.jpg"), use that EXACT path for the relevant image field — never invent or guess a path yourself.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "read_home_content",
    description:
      "Read the current homepage content as JSON. Always call this before proposing a change, so edits are based on real current values.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "propose_home_content_change",
    description:
      "Propose an updated version of the homepage content for the user to review and approve. Provide the COMPLETE home content object (every field, not just the changed ones).",
    input_schema: {
      type: "object",
      properties: {
        content: { type: "object", description: "The complete, updated home content object." },
        summary: { type: "string", description: "A short (under 12 words) description of the change, used as the commit message." },
      },
      required: ["content", "summary"],
    },
  },
];

function sse(data: object) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: object) => controller.enqueue(encoder.encode(sse(data)));

      try {
        const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        for (let iteration = 0; iteration < 6; iteration++) {
          const result = await anthropic.messages.stream({
            model: "claude-sonnet-5",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: anthropicMessages,
            tools: TOOLS,
          });

          result.on("text", (delta) => send({ type: "text_delta", text: delta }));

          const finalMessage = await result.finalMessage();
          anthropicMessages.push({ role: "assistant", content: finalMessage.content });

          const toolUses = finalMessage.content.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
          );

          if (toolUses.length === 0) break;

          let proposed = false;
          const toolResults: Anthropic.ToolResultBlockParam[] = [];

          for (const toolUse of toolUses) {
            if (toolUse.name === "read_home_content") {
              const file = await github.getFile("content/home.json");
              toolResults.push({
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: file ? file.content : "File not found.",
              });
              continue;
            }

            if (toolUse.name === "propose_home_content_change") {
              const input = toolUse.input as { content: unknown; summary: string };
              if (!validateHomeContent(input.content)) {
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: toolUse.id,
                  content:
                    "Rejected: the proposed content doesn't match the required schema (missing or wrong-typed fields). Call read_home_content again and try once more.",
                  is_error: true,
                });
                continue;
              }

              const current = await github.getFile("content/home.json");
              const before = current ? JSON.parse(current.content) : null;
              const changes = diffContent(before, input.content);

              send({
                type: "proposal",
                content: input.content,
                summary: input.summary,
                changes,
              });
              proposed = true;
              break;
            }

            toolResults.push({
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: `Unknown tool: ${toolUse.name}`,
              is_error: true,
            });
          }

          if (proposed) break;

          anthropicMessages.push({ role: "user", content: toolResults });
        }

        send({ type: "done" });
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
