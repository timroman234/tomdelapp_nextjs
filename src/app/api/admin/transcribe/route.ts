import { auth } from "@/auth";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const LOW_CONFIDENCE_THRESHOLD = 0.6;

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = (await req.json()) as { audio?: string };
  const match = body.audio ? /^data:([^;]+);base64,(.+)$/.exec(body.audio) : null;
  if (!match) return Response.json({ error: "Invalid audio data URL." }, { status: 400 });

  const contentType = match[1];
  const decoded = Buffer.from(match[2], "base64");
  if (decoded.length > MAX_AUDIO_BYTES) {
    return Response.json({ error: "Audio exceeds the 10MB limit." }, { status: 400 });
  }

  try {
    const res = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&punctuate=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": contentType,
        },
        body: decoded,
        signal: AbortSignal.timeout(20000),
      },
    );

    if (!res.ok) {
      return Response.json({ error: `Transcription failed (${res.status}).` }, { status: 502 });
    }

    const data = await res.json();
    const transcript: string = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
    const confidence: number = data?.results?.channels?.[0]?.alternatives?.[0]?.confidence ?? 0;

    return Response.json({
      transcript,
      confidence,
      lowConfidence: confidence < LOW_CONFIDENCE_THRESHOLD,
    });
  } catch {
    return Response.json({ error: "Transcription request failed." }, { status: 502 });
  }
}
