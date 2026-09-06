import { auth } from "@/auth";
import * as github from "@/lib/admin/github";
import { validateHomeContent } from "@/lib/admin/validateContent";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = (await req.json()) as { content: unknown; summary?: string };

  // Never trust the client-held proposal — re-validate independently of the chat
  // route before this content is allowed to actually reach GitHub.
  if (!validateHomeContent(body.content)) {
    return Response.json({ error: "Content failed schema validation." }, { status: 400 });
  }

  const message = (body.summary || "Update homepage content").slice(0, 200);
  const serialized = JSON.stringify(body.content, null, 2) + "\n";

  try {
    await github.writeFile("content/home.json", serialized, `admin: ${message}`);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to write content." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
