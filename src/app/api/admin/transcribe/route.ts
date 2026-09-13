import { auth } from "@/auth";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
// Below this Deepgram confidence score, the transcript is still returned
// (a low-confidence guess is a useful starting point to edit) but flagged
// to the user rather than trusted silently.
const LOW_CONFIDENCE_THRESHOLD = 0.6;

type TranscribePayload = {
  audio?: string;
  mimeType?: string;
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.DEEPGRAM_API_KEY) {
    console.error("DEEPGRAM_API_KEY is not configured — voice input is unavailable.");
    return Response.json(
      { error: "Voice input isn't set up yet. Please type your message instead." },
      { status: 500 },
    );
  }

  const body: TranscribePayload = await req.json();
  if (!body.audio) {
    return Response.json({ error: "No audio was provided." }, { status: 400 });
  }

  // Split on the first comma rather than assuming a semicolon-free mime
  // type: a data URL for a real MediaRecorder recording looks like
  // "data:audio/webm;codecs=opus;base64,AAAA...", and a mime-type-only
  // regex stops at the first ";" and never matches, silently leaving the
  // whole data URL (including "data:", the mime type, and "base64,") to
  // be base64-decoded as if it were audio — Buffer.from() drops the
  // non-base64 characters rather than erroring, so the corruption only
  // surfaces later as Deepgram's opaque "corrupt or unsupported data".
  const raw = body.audio.replace(/^data:[^,]*,/, "");
  const decoded = Buffer.from(raw, "base64");
  if (decoded.length === 0) {
    return Response.json({ error: "That recording was empty." }, { status: 400 });
  }
  if (decoded.length > MAX_AUDIO_BYTES) {
    return Response.json({ error: "That recording is too long — please keep it under 2 minutes." }, { status: 400 });
  }

  const contentType = body.mimeType?.split(";")[0]?.trim() || "audio/webm";

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
      const errText = await res.text().catch(() => "");
      console.error("[Greenroom transcribe] Deepgram error", res.status, errText);
      return Response.json({ error: "Sorry, transcription failed — please try again or type your message." }, { status: 502 });
    }

    const data = await res.json();
    const alternative = data?.results?.channels?.[0]?.alternatives?.[0];
    const transcript: string = typeof alternative?.transcript === "string" ? alternative.transcript.trim() : "";
    const confidence: number = typeof alternative?.confidence === "number" ? alternative.confidence : 0;

    if (!transcript) {
      return Response.json({ error: "Couldn't make out any words — please try again." }, { status: 422 });
    }

    return Response.json({ transcript, confidence, lowConfidence: confidence < LOW_CONFIDENCE_THRESHOLD });
  } catch (err) {
    console.error("[Greenroom transcribe] error", err);
    return Response.json({ error: "Sorry, something went wrong transcribing that — please try again." }, { status: 500 });
  }
}
