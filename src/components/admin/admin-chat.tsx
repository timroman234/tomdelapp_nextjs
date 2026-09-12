"use client";

import { useEffect, useRef, useState } from "react";
import type { ContentDiffEntry } from "@/lib/admin/diff";

type ChatMessage = { role: "user" | "assistant"; content: string };

type ProposalItem = {
  type: "proposal";
  id: string;
  content: unknown;
  summary: string;
  changes: ContentDiffEntry[];
  status: "pending" | "applying" | "applied" | "discarded" | "error";
  error?: string;
};

type TextItem = { type: "text"; id: string; role: "user" | "assistant"; text: string };

type DisplayItem = TextItem | ProposalItem;

function AttachIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 6.5l-6 6a3 3 0 0 0 4.24 4.24l6.5-6.5a5 5 0 0 0-7.07-7.07l-6.5 6.5a7 7 0 0 0 9.9 9.9" />
    </svg>
  );
}

function MicIcon({ recording }: { recording: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2.5" width="6" height="10" rx="3" fill={recording ? "currentColor" : "none"} />
      <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0" />
      <path d="M10 15v3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 2.5L2.5 8.5l6 2.5 2.5 6 6.5-14.5z" />
      <path d="M8.8 11.2l4.7-4.7" />
    </svg>
  );
}

function formatValue(v: unknown): string {
  if (typeof v === "string") return v || "(empty)";
  return JSON.stringify(v);
}

function ProposalCard({ item, onApply, onDiscard }: { item: ProposalItem; onApply: () => void; onDiscard: () => void }) {
  return (
    <div className="mr-auto w-full max-w-[70%] border border-line-2 bg-white p-5">
      <div className="mb-3 text-sm font-semibold text-ink">{item.summary}</div>
      <div className="mb-4 flex flex-col gap-2">
        {item.changes.length === 0 && <div className="text-sm text-muted">No changes detected.</div>}
        {item.changes.map((c) => (
          <div key={c.path} className="text-sm leading-[1.5]">
            <div className="font-mono text-xs text-muted-3">{c.path}</div>
            <div className="text-ink-soft line-through decoration-muted-4">{formatValue(c.before)}</div>
            <div className="text-ink">{formatValue(c.after)}</div>
          </div>
        ))}
      </div>

      {item.status === "pending" || item.status === "applying" ? (
        <div className="flex gap-3">
          <button
            type="button"
            disabled={item.status === "applying"}
            onClick={onApply}
            className="rounded-[2px] bg-red px-5 py-2 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
          >
            {item.status === "applying" ? "Applying…" : "Apply"}
          </button>
          <button
            type="button"
            disabled={item.status === "applying"}
            onClick={onDiscard}
            className="rounded-[2px] border border-line px-5 py-2 text-sm font-medium text-ink-soft hover:border-ink disabled:opacity-60"
          >
            Discard
          </button>
        </div>
      ) : item.status === "applied" ? (
        <div className="text-sm font-medium text-teal">Applied — live on the site in about a minute.</div>
      ) : item.status === "discarded" ? (
        <div className="text-sm text-muted">Discarded — no changes were made.</div>
      ) : (
        <div className="text-sm font-medium text-red-dark">{item.error ?? "Failed to apply."}</div>
      )}
    </div>
  );
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `item-${idCounter}`;
}

const TIPS = [
  {
    heading: "Be specific",
    body: 'Name the section you mean — e.g. "the hero tagline" or "the About the host paragraphs" — so the assistant edits the right spot. Right now only the homepage is editable; more pages will be added soon.',
  },
  {
    heading: "Images",
    body: "Attach a photo directly in the chat, or use the mic to describe what you want changed. Accepted formats: JPG, PNG, WebP, GIF — up to 5MB.",
  },
  {
    heading: "Nothing publishes automatically",
    body: "You'll always see the exact before/after change first. Click Apply to make it live, or Discard to cancel — nothing is saved until you approve it.",
  },
];

function TipsSidebar() {
  return (
    <aside className="hidden w-[240px] flex-none nav:block">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-3">Tips</div>
      <div className="mt-4 flex flex-col gap-5">
        {TIPS.map((tip) => (
          <div key={tip.heading}>
            <div className="mb-1 text-sm font-semibold text-ink">{tip.heading}</div>
            <p className="text-sm leading-[1.5] text-ink-muted">{tip.body}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function AdminChat() {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{ filename: string; dataUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [items]);

  function handleFileSelect(file: File) {
    const reader = new FileReader();
    reader.onload = () => setAttachedImage({ filename: file.name, dataUrl: reader.result as string });
    reader.readAsDataURL(file);
  }

  async function toggleRecording() {
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    audioChunksRef.current = [];
    recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch("/api/admin/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: reader.result }),
          });
          const data = await res.json();
          if (data.transcript) setInput((prev) => (prev ? `${prev} ${data.transcript}` : data.transcript));
          if (data.error) setError(data.error);
        } catch {
          setError("Voice transcription failed.");
        }
      };
      reader.readAsDataURL(blob);
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setError(null);
    setSending(true);
    setInput("");

    let messageText = text;
    if (attachedImage) {
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: attachedImage.filename, dataUrl: attachedImage.dataUrl }),
        });
        const data = await res.json();
        if (data.path) {
          messageText += `\n\n(Image already uploaded to ${data.path} — use this exact path if updating an image field.)`;
        } else {
          setError(data.error ?? "Image upload failed.");
        }
      } catch {
        setError("Image upload failed.");
      }
      setAttachedImage(null);
    }

    const userItem: TextItem = { type: "text", id: nextId(), role: "user", text };
    setItems((prev) => [...prev, userItem]);

    const nextHistory = [...history, { role: "user" as const, content: messageText }];
    setHistory(nextHistory);

    const assistantId = nextId();
    setItems((prev) => [...prev, { type: "text", id: assistantId, role: "assistant", text: "" }]);

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });
      if (!res.body) throw new Error("No response stream.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const event = JSON.parse(line.slice(5).trim());

          if (event.type === "text_delta") {
            assistantText += event.text;
            setItems((prev) =>
              prev.map((it) => (it.id === assistantId ? { ...it, text: assistantText } : it)),
            );
          } else if (event.type === "proposal") {
            setItems((prev) => [
              ...prev,
              {
                type: "proposal",
                id: nextId(),
                content: event.content,
                summary: event.summary,
                changes: event.changes,
                status: "pending",
              },
            ]);
          } else if (event.type === "error") {
            setError(event.message);
          }
        }
      }

      if (assistantText) {
        setHistory((prev) => [...prev, { role: "assistant", content: assistantText }]);
      }
    } catch {
      setError("The assistant didn't respond. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function applyProposal(item: ProposalItem) {
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "applying" } : it)));
    try {
      const res = await fetch("/api/admin/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: item.content, summary: item.summary }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to apply.");
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "applied" } : it)));
    } catch (err) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? { ...it, status: "error", error: err instanceof Error ? err.message : "Failed to apply." }
            : it,
        ),
      );
    }
  }

  function discardProposal(item: ProposalItem) {
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "discarded" } : it)));
  }

  return (
    <div className="container-cr flex flex-1 gap-12 overflow-hidden py-8">
      <div className="flex min-h-0 w-full flex-1 flex-col">
      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {items.length === 0 && (
          <p className="text-sm leading-[1.6] text-ink-muted">
            Tell me what to update on the homepage — for example, &ldquo;change the hero tagline to
            Communication, on your side.&rdquo; I&apos;ll show you the exact change before anything goes
            live.
          </p>
        )}
        {items.map((item) =>
          item.type === "text" ? (
            <div
              key={item.id}
              className={
                item.role === "user"
                  ? "ml-auto max-w-[70%] bg-ink px-4 py-3 text-[15px] leading-[1.5] text-cream"
                  : "mr-auto max-w-[70%] border border-line bg-white px-4 py-3 text-[15px] leading-[1.5] text-ink-soft"
              }
            >
              {item.text || (item.role === "assistant" ? "…" : "")}
            </div>
          ) : (
            <ProposalCard
              key={item.id}
              item={item}
              onApply={() => applyProposal(item)}
              onDiscard={() => discardProposal(item)}
            />
          ),
        )}
      </div>

      {error && <div className="mt-4 flex-none border border-red-dark bg-[#FBEAEA] px-4 py-2 text-sm text-red-dark">{error}</div>}

      {attachedImage && (
        <div className="mt-4 flex flex-none items-center gap-2 border border-line bg-white px-3 py-2 text-sm text-ink-soft">
          <span>Attached: {attachedImage.filename}</span>
          <button type="button" onClick={() => setAttachedImage(null)} className="ml-auto border-0 bg-transparent p-0 text-red hover:text-red-dark">
            Remove
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-none items-center gap-2 border border-line-3 bg-white px-3 py-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
        <button
          type="button"
          aria-label="Attach image"
          onClick={() => fileInputRef.current?.click()}
          className="flex-none border-0 bg-transparent p-1 text-ink-soft hover:text-red"
        >
          <AttachIcon />
        </button>
        <button
          type="button"
          aria-label={recording ? "Stop recording" : "Dictate"}
          onClick={toggleRecording}
          className={`flex-none border-0 bg-transparent p-1 ${recording ? "text-red" : "text-ink-soft hover:text-red"}`}
        >
          <MicIcon recording={recording} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Tell the assistant what to update…"
          className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-[15px] text-ink outline-none placeholder:text-muted-3"
        />
        <button
          type="button"
          aria-label="Send"
          disabled={sending || !input.trim()}
          onClick={send}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-[2px] bg-red text-white hover:bg-red-dark disabled:opacity-50"
        >
          <SendIcon />
        </button>
      </div>
      </div>
      <TipsSidebar />
    </div>
  );
}
