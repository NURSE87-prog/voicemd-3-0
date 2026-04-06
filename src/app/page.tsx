"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Copy, Check, Plus, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

type NoteData = {
  chiefComplaint: string;
  history: string;
  assessment: string;
  plan: string;
} | null;

type Toast = { id: number; message: string; type: "success" | "error" };

function escapeHtml(text: string): string {
  const div = typeof document !== "undefined" ? document.createElement("div") : null;
  if (div) {
    div.textContent = text;
    return div.innerHTML;
  }
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function VoiceMD() {
  const [lang, setLang] = useState<"EN" | "FR">("EN");
  const [status, setStatus] = useState<"idle" | "listening" | "processing">("idle");
  const [note, setNote] = useState<NoteData>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 2500);
  }, []);

  const handleRecord = async () => {
    if (status === "idle") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setStatus("processing");
          stream.getTracks().forEach((track) => track.stop());
          await processAudio(audioBlob);
        };

        mediaRecorder.start();
        setStatus("listening");
        setNote(null);
        setTranscript("");
      } catch {
        showToast("Microphone access denied", "error");
      }
    } else if (status === "listening") {
      mediaRecorderRef.current?.stop();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", new File([audioBlob], "rec.webm", { type: "audio/webm" }));
      formData.append("language", lang);

      console.log("Starting transcription...");
      const transcribeRes = await fetch("/api/transcribe", { method: "POST", body: formData });
      const transcribeData = await transcribeRes.json();
      
      if (!transcribeRes.ok) {
        throw new Error(transcribeData.error || "Transcription failed");
      }
      
      console.log("Transcription complete:", transcribeData.text);
      setTranscript(transcribeData.text);

      console.log("Generating note...");
      const noteRes = await fetch("/api/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcribeData.text, language: lang }),
      });
      const noteData = await noteRes.json();
      
      if (!noteRes.ok) {
        throw new Error(noteData.error || "Note generation failed");
      }
      
      console.log("Note generated:", noteData.note);
      setNote(noteData.note);
      setStatus("idle");
      showToast("Note generation completed securely");
    } catch (error) {
      console.error("Processing error:", error);
      showToast(error instanceof Error ? error.message : "Processing error. Please try again.", "error");
      setStatus("idle");
    }
  };

  const copyToClipboard = () => {
    if (!note) return;
    const text = `CHIEF COMPLAINT: ${note.chiefComplaint}\nHISTORY: ${note.history}\nASSESSMENT: ${note.assessment}\nPLAN: ${note.plan}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        showToast("Copied to clipboard securely");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => showToast("Failed to copy", "error"));
  };

  const resetNote = () => {
    setNote(null);
    setTranscript("");
    setCopied(false);
  };

  return (
    <>
      <header className="header flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6 w-full max-w-6xl mx-auto">
        <div className="logo-container flex items-center gap-3">
          <div className="logo text-2xl font-black tracking-tight flex items-center gap-1">
            VoiceMD<Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="badge animate-pulse bg-gradient-to-r from-amber-500/10 to-amber-500/30 text-amber-700 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest hidden sm:block">Diamond Access: 2 Months Free</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="lang-selector bg-[#e5e5e5] dark:bg-[#222] p-1 rounded-full flex gap-1">
            <button className={`lang-btn px-4 py-1.5 rounded-full text-xs ${lang === "EN" ? "bg-white dark:bg-black font-bold shadow-sm" : ""}`} onClick={() => setLang("EN")}>
              EN
            </button>
            <button className={`lang-btn px-4 py-1.5 rounded-full text-xs ${lang === "FR" ? "bg-white dark:bg-black font-bold shadow-sm" : ""}`} onClick={() => setLang("FR")}>
              FR
            </button>
          </div>
          <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700 hidden sm:block"></div>
          <Link href="/signup" className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-semibold text-sm hover:scale-105 transition-transform shadow-lg">
            Create Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="main max-w-4xl mx-auto">
        <div className="hero-section mb-12 text-center flex flex-col items-center">
          <div className="promo-tag bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Enterprise-Grade AI Protocol Active
          </div>
          <h1 className="hero-title text-5xl md:text-6xl font-black tracking-tighter mb-4 text-[#111] dark:text-[#eee]">Clinical Documentation, <span className="text-highlight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-serif italic">Elevated.</span></h1>
          <p className="hero-subtitle text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-2 leading-relaxed">
            Experience ambient intelligence. Transform your patient consultations into perfectly structured clinical narratives in an instant. <br className="hidden md:block"/>Enjoy <strong>2 MONTHS OF UNLIMITED CONCIERGE ACCESS</strong>.
          </p>
        </div>

        <div className="record-container">
          <div className={`pulse-ring ${status === "listening" ? "listening" : ""}`} />
          <div className={`pulse-ring ${status === "listening" ? "listening" : ""}`} />
          <div className={`pulse-ring ${status === "listening" ? "listening" : ""}`} />
          <button
            className="record-btn"
            onClick={handleRecord}
            disabled={status === "processing"}
            aria-label={status === "listening" ? "Stop recording" : "Start recording"}
          >
            {status === "listening" ? (
              <Square size={30} fill="currentColor" />
            ) : (
              <Mic size={38} />
            )}
          </button>
        </div>

        {status === "listening" && (
          <div className="waveform">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="waveform-bar"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        <div className="status-text">
          {status === "idle"
            ? "Tap to dictate"
            : status === "listening"
            ? "Listening..."
            : "Processing note..."}
        </div>

        {status === "processing" && (
          <div className="loading-indicator">
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
            <p className="loading-text">Analyzing clinical data...</p>
          </div>
        )}

        {note && (
          <div className="output-card">
            {transcript && (
              <div className="transcript-strip">
                <div className="transcript-label">Raw Transcript</div>
                <div className="transcript-text">&ldquo;{transcript}&rdquo;</div>
              </div>
            )}

            <table className="note-table">
              <tbody>
                {[
                  { label: "Chief Complaint", val: note.chiefComplaint },
                  { label: "History", val: note.history },
                  { label: "Assessment", val: note.assessment },
                  { label: "Plan", val: note.plan },
                ].map(({ label, val }) => (
                  <tr key={label} className="note-row">
                    <td className="note-label">{label}</td>
                    <td className="note-value" dangerouslySetInnerHTML={{ __html: escapeHtml(val) }} />
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="card-actions">
              <button className="btn-secondary" onClick={resetNote}>
                <Plus size={16} />
                New Note
              </button>
              <button className="btn-primary" onClick={copyToClipboard}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Note"}
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
