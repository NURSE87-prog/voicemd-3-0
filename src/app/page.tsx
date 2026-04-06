"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Copy, Check, Plus, AlertCircle, Sparkles, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
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
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
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
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const handleRecord = async () => {
    if (status === "idle") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
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

      const transcribeRes = await fetch("/api/transcribe", { method: "POST", body: formData });
      const transcribeData = await transcribeRes.json();
      if (!transcribeRes.ok) throw new Error(transcribeData.error || "Transcription failed");
      setTranscript(transcribeData.text);

      const noteRes = await fetch("/api/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcribeData.text, language: lang }),
      });
      const noteData = await noteRes.json();
      if (!noteRes.ok) throw new Error(noteData.error || "Note generation failed");
      
      setNote(noteData.note);
      setStatus("idle");
      showToast("Note generation completed securely");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Processing error. Please try again.", "error");
      setStatus("idle");
    }
  };

  const copyToClipboard = () => {
    if (!note) return;
    const text = `CHIEF COMPLAINT: ${note.chiefComplaint}\nHISTORY: ${note.history}\nASSESSMENT: ${note.assessment}\nPLAN: ${note.plan}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast("Copied to clipboard securely");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Premium Navigation Header */}
      <nav style={{ padding: '1.5rem 2.5rem', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }} className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--text-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} />
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.02em' }}>VoiceMD</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ display: 'flex', padding: '0.2rem', background: 'var(--bg-color)', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>
              <button onClick={() => setLang("EN")} style={{ padding: '0.4rem 1.25rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', background: lang === 'EN' ? 'var(--text-primary)' : 'transparent', color: lang === 'EN' ? '#fff' : 'var(--text-secondary)', border: 'none' }}>EN</button>
              <button onClick={() => setLang("FR")} style={{ padding: '0.4rem 1.25rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', background: lang === 'FR' ? 'var(--text-primary)' : 'transparent', color: lang === 'FR' ? '#fff' : 'var(--text-secondary)', border: 'none' }}>FR</button>
           </div>
           <Link href="/signup" style={{ padding: '0.75rem 1.5rem', background: 'var(--text-primary)', color: '#fff', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
             Get Started
           </Link>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '6rem 1.5rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
        
        {/* Premium Hero Section */}
        <div style={{ marginBottom: '5rem' }}>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-soft)', padding: '0.5rem 1rem', borderRadius: '999px', marginBottom: '2rem', border: '1px solid var(--border-subtle)' }}>
              <ShieldCheck size={14} color="var(--accent)" />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>HIPAA Secure Documentation</span>
           </div>
           <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Documentation, <br /> <span style={{ color: 'var(--record-btn)' }}>Without the Typing.</span>
           </h1>
           <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Designed for modern clinicians. Record your consultation and watch as AI generates perfectly structured medical notes in seconds.
           </p>
        </div>

        {/* Master Pulse Record Button */}
        <div style={{ position: 'relative', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', background: 'var(--record-glow)', animation: status === "listening" ? 'pulse 2s infinite' : 'none', opacity: status === "listening" ? 0.3 : 0 }} />
          <button 
            onClick={handleRecord}
            disabled={status === "processing"}
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              background: status === "listening" ? 'var(--text-primary)' : 'var(--record-btn)', 
              color: '#fff', 
              border: '8px solid rgba(255,255,255,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xl)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              zIndex: 10
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {status === "listening" ? <Square size={36} fill="#fff" /> : <Mic size={48} />}
          </button>
          
          <div style={{ position: 'absolute', bottom: '1rem', width: '100%' }}>
             <p style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: status === "listening" ? 'var(--record-btn)' : 'var(--text-muted)' }}>
               {status === "idle" ? "Start Transcription" : status === "listening" ? "Listening..." : "Generating Note..."}
             </p>
          </div>
        </div>

        {/* Note Generation Output (Glass Card) */}
        {note && (
          <div 
            style={{ 
              marginTop: '4rem', 
              background: 'var(--bg-card)', 
              borderRadius: '32px', 
              padding: '3rem', 
              textAlign: 'left', 
              boxShadow: 'var(--shadow-xl)', 
              border: '1px solid var(--border-subtle)',
              animation: 'fadeInUp 0.6s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
               <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-primary)' }}>Structured Note Output</h2>
               <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setNote(null)} style={{ background: 'var(--bg-color)', border: 'none', padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', cursor: 'pointer' }}>Delete</button>
                  <button onClick={copyToClipboard} style={{ background: 'var(--text-primary)', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy to EMR"}
                  </button>
               </div>
            </div>

            <div style={{ display: 'grid', gap: '2.5rem' }}>
               {[ 
                 { label: "Chief Complaint", val: note.chiefComplaint },
                 { label: "History of Present Illness", val: note.history },
                 { label: "Clinical Assessment", val: note.assessment },
                 { label: "Management Plan", val: note.plan }
               ].map((item, idx) => (
                 <div key={idx}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent)', marginBottom: '0.75rem' }}>{item.label}</p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{item.val}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Live Transcript Strip */}
        {transcript && status === "idle" && !note && (
           <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--accent-soft)', borderRadius: '16px', border: '1px dashed var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              &ldquo;{transcript}&rdquo;
           </div>
        )}
      </main>

      {/* Trust Badges Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
         <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2rem' }}>Trusted by Modern Healthcare Networks</p>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', opacity: 0.4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-serif)' }}>ScribeAI</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-serif)' }}>MedNote.pro</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-serif)' }}>ClinicOS</span>
         </div>
      </footer>

      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ background: toast.type === 'error' ? 'var(--record-btn)' : 'var(--text-primary)', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', animation: 'fadeInUp 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
             <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
