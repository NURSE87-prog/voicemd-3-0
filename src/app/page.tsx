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
      <header className="flex flex-col md:flex-row items-center justify-between p-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            VoiceMD
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            <button className={`px-4 py-1.5 rounded-full text-xs transition-all ${lang === "EN" ? "bg-white dark:bg-black font-semibold text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`} onClick={() => setLang("EN")}>
              EN
            </button>
            <button className={`px-4 py-1.5 rounded-full text-xs transition-all ${lang === "FR" ? "bg-white dark:bg-black font-semibold text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`} onClick={() => setLang("FR")}>
              FR
            </button>
          </div>
          <Link href="/signup" className="text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-black px-5 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Try Free
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
            Effortless clinical documentation.
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Designed for healthcare professionals. Record your consultation and instantly generate perfectly structured clinical notes with zero typing.
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
