"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Loader2, CheckCircle, Copy, Plus } from "lucide-react";

type NoteData = {
  chiefComplaint: string;
  history: string;
  assessment: string;
  plan: string;
} | null;

export default function RecordPage() {
  const [status, setStatus] = useState<"idle" | "listening" | "processing">("idle");
  const [note, setNote] = useState<NoteData>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [lang] = useState<"EN" | "FR">("EN"); // Default to EN for now or fetch from user settings

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    } else if (status === "listening") {
      mediaRecorderRef.current?.stop();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", new File([audioBlob], "rec.webm"));
      formData.append("language", lang);

      // Transcription
      const transcribeRes = await fetch("/api/transcribe", { method: "POST", body: formData });
      if (!transcribeRes.ok) throw new Error("Transcription failed");
      const { text } = await transcribeRes.json();
      setTranscript(text);

      // Note Generation
      const noteRes = await fetch("/api/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, language: lang }),
      });
      if (!noteRes.ok) throw new Error("Note generation failed");
      const { note: structuredNote } = await noteRes.json();
      
      setNote(structuredNote);
      setStatus("idle");
    } catch (err) {
      console.error("Processing error:", err);
      setStatus("idle");
    }
  };

  const copyToClipboard = () => {
    if (!note) return;
    const text = `CHIEF COMPLAINT: ${note.chiefComplaint}\nHISTORY: ${note.history}\nASSESSMENT: ${note.assessment}\nPLAN: ${note.plan}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full animate-fade-in text-center relative overflow-hidden">
      
      {/* Background glow for the clinical feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-soft rounded-full blur-[120px] pointer-events-none opacity-50" />

      {status !== "processing" && !note && (
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="mb-12">
            <h1 className="text-5xl font-serif text-text-primary mb-6 tracking-tight">
              {status === "listening" ? "Listening..." : "Clinical Scribe"}
            </h1>
            <p className="text-text-secondary max-w-md mx-auto text-lg leading-relaxed">
              {status === "listening" 
                ? "Ambient intelligence is capturing the consultation. Speak naturally." 
                : "Press to start the AI scribe for your patient encounter. We'll handle the notes."}
            </p>
          </div>

          <div className="relative mb-20">
            <div className={`pulse-ring ${status === "listening" ? "listening" : ""}`} />
            <div className={`pulse-ring ${status === "listening" ? "listening" : ""}`} />
            
            <button
              onClick={handleRecord}
              className={`relative z-20 w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${
                status === "listening" 
                  ? 'bg-record-btn text-white' 
                  : 'bg-text-primary text-white hover:bg-black'
              }`}
            >
              {status === "listening" ? (
                <Square className="w-12 h-12 fill-current" />
              ) : (
                <Mic className="w-14 h-14" />
              )}
            </button>
          </div>

          {status === "listening" && (
             <div className="waveform">
               {[...Array(7)].map((_, i) => (
                 <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.1}s` }} />
               ))}
             </div>
          )}
        </div>
      )}

      {status === "processing" && (
        <div className="relative z-10 w-full max-w-lg mx-auto py-20 flex flex-col items-center">
          <Loader2 className="w-20 h-20 text-accent animate-spin mb-8" />
          <h2 className="text-3xl font-serif text-text-primary mb-2">Analyzing Consultation</h2>
          <p className="text-text-secondary text-lg">Structuring medical notation using AI...</p>
        </div>
      )}

      {note && (
        <div className="relative z-10 w-full max-w-2xl mx-auto py-10 animate-fade-in overflow-auto max-h-[80vh]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-full bg-accent-soft flex items-center justify-center text-accent mb-6 shadow-sm">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-serif text-text-primary mb-2">Documentation Complete</h2>
            <p className="text-text-secondary text-lg">Your structured SOAP note is ready.</p>
          </div>

          <div className="bg-bg-card p-10 rounded-[2.5rem] border border-border shadow-xl text-left relative overflow-hidden">
             {transcript && (
               <div className="transcript-strip mb-8">
                 <div className="transcript-label font-black">Raw Audio Capture</div>
                 <p className="transcript-text">&ldquo;{transcript}&rdquo;</p>
               </div>
             )}

             <div className="space-y-12">
               {[
                 { label: "Chief Complaint", val: note.chiefComplaint },
                 { label: "History", val: note.history },
                 { label: "Assessment", val: note.assessment },
                 { label: "Plan", val: note.plan }
               ].map((item) => (
                 <div key={item.label} className="border-b border-border/50 pb-8 last:border-0 last:pb-0">
                   <h3 className="text-accent font-serif text-xl mb-4">{item.label}</h3>
                   <p className="text-text-primary leading-relaxed text-lg">{item.val}</p>
                 </div>
               ))}
             </div>

             <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                  onClick={() => { setNote(null); setTranscript(""); }} 
                  className="px-8 py-4 border border-border rounded-2xl text-text-secondary hover:bg-bg-color transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" /> New Patient
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="px-10 py-4 bg-text-primary text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copied" : "Copy to Clipboard"}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
