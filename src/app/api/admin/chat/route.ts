import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import * as github from "@/lib/admin/github";
import { validateHomeContent } from "@/lib/admin/validateContent";
import { diffContent } from "@/lib/admin/diff";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the content editor assistant for the Communication Resources website (home of the "Straight Talk by Tom DeLapp" podcast).

Your ONLY job right now is editing the homepage's content — the hero section, latest-episode section, about-the-host section, and the subscribe band. You cannot edit anything else: not other pages, not navigation, not styling, not layout, not any code or configuration. If asked to do something outside that scope, politely decline and explain what you can help with instead.

## Workflow
1. Always call read_home_content first to see the exact current values before making any change — never guess or assume a current value.
2. When ready, call update_home_content with the COMPLETE home content object (every field, including the ones you are NOT changing, copied over unchanged) plus a short summary of what changed. This writes the change immediately — there is no separate approval step, and it typically goes live on the site within about a minute. Because there's no review step, don't call it unless the request is clear; ask a clarifying question in plain text first if anything is ambiguous.
3. Never fabricate facts, phone numbers, names, or claims that weren't provided by the user or already present in the content. If a request is ambiguous, ask a clarifying question in plain text instead of making a change.
4. Only change ONE thing per request unless the user clearly asked for multiple distinct edits in the same message.
5. After update_home_content's tool result confirms success, reply with one or two plain-language sentences confirming what changed — don't repeat the whole content object back.

## What you must NEVER do
- Never claim to have applied a change that update_home_content did not confirm succeeded.
- Never invent a new field, section, or structure not already present in the schema below.
- Never change the site's navigation, layout, design, or any code.

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
      "Read the current homepage content as JSON. Always call this before making a change, so edits are based on real current values.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "update_home_content",
    description:
      "Apply an updated version of the homepage content immediately — this writes directly to the live site, there is no approval step. Provide the COMPLETE home content object (every field, not just the changed ones).",
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

            if (toolUse.name === "update_home_content") {
              const input = toolUse.input as { content: unknown; summary: string };
              if (!validateHomeContent(input.content)) {
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: toolUse.id,
                  content:
                    "Rejected: the content doesn't match the required schema (missing or wrong-typed fields). Call read_home_content again and try once more.",
                  is_error: true,
                });
                continue;
              }

              const current = await github.getFile("content/home.json");
              const before = current ? JSON.parse(current.content) : null;
              const changes = diffContent(before, input.content);
              const message = (input.summary || "Update homepage content").slice(0, 200);

              try {
                const serialized = JSON.stringify(input.content, null, 2) + "\n";
                await github.writeFile("content/home.json", serialized, `admin: ${message}`);
              } catch (err) {
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: toolUse.id,
                  content: `Failed to write content: ${err instanceof Error ? err.message : "unknown error"}. Tell the user this failed — do not claim success.`,
                  is_error: true,
                });
                continue;
              }

              send({
                type: "applied",
                content: input.content,
                before,
                summary: input.summary,
                changes,
              });

              toolResults.push({
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: "Applied successfully — now live on the site in about a minute.",
              });
              continue;
            }

            toolResults.push({
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: `Unknown tool: ${toolUse.name}`,
              is_error: true,
            });
          }

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
