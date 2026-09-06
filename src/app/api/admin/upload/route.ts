import { auth } from "@/auth";
import * as github from "@/lib/admin/github";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = (await req.json()) as { filename?: string; dataUrl?: string };
  if (!body.filename || !body.dataUrl) {
    return Response.json({ error: "filename and dataUrl are required." }, { status: 400 });
  }

  try {
    const path = await github.uploadImage(body.filename, body.dataUrl);
    return Response.json({ path });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 },
    );
  }
}
