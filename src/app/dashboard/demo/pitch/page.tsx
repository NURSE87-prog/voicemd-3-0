"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCcw, Volume2, ShieldCheck, Zap, HeartPulse, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

const PITCH_SCRIPT = [
  { time: 0, text: "Doctors spend up to 20 hours a week on clinical documentation. It's the leading cause of burnout." },
  { time: 7000, text: "Meet VoiceMD. The ambient AI scribe that lets you focus on the patient, not the keyboard." },
  { time: 14000, text: "With a single tap, VoiceMD captures your patient conversation in the background. Speak naturally." },
  { time: 22000, text: "In seconds, our clinical-grade AI analyzes the visit to build a structured, professional SOAP note." },
  { time: 32000, text: "Accurate, compliant, and ready for your EHR. VoiceMD: Turn minutes of charting into seconds of clicking." }
];

export default function PitchPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [progress, setProgress] = useState(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  const startPitch = () => {
    if (isPlaying) {
      synthRef.current?.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setProgress(0);

    // Speak each part of the script
    PITCH_SCRIPT.forEach((part, index) => {
      setTimeout(() => {
        if (!window.speechSynthesis) return;
        
        const utterance = new SpeechSynthesisUtterance(part.text);
        
        // Try to find a premium medical/professional sounding voice
        const voices = window.speechSynthesis.getVoices();
        const premiumVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Natural"));
        if (premiumVoice) utterance.voice = premiumVoice;
        
        utterance.rate = 0.95; // Slightly slower for clarity
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
        setCurrentText(part.text);
        setProgress(((index + 1) / PITCH_SCRIPT.length) * 100);

        if (index === PITCH_SCRIPT.length - 1) {
          utterance.onend = () => setIsPlaying(false);
        }
      }, part.time);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-8 overflow-x-hidden font-sans">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-800">
            <Sparkles className="w-3 h-3" />
            Executive Pitch & Demonstration
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            The Future of <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Clinical Efficiency</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Experience the "Golden Path" of VoiceMD. Witness how we turn natural conversations into professional clinical documentation in real-time.
          </p>
        </div>

        {/* Main Demo Stage */}
        <div className="relative w-full max-w-5xl group">
          {/* Laptop Frame Mockup */}
          <div className="relative bg-[#1e293b] rounded-3.5xl p-2 shadow-2xl border-4 border-[#334155] glow-pulse group-hover:scale-[1.01] transition-transform duration-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-20" />
            
            {/* The Actual Demo Recording */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner">
               <img 
                 src="/demo-recording.webp" 
                 alt="VoiceMD Clinical Demo" 
                 className={`w-full h-full object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40 grayscale-[50%]'}`}
               />
               
               {/* Video Overlay - Subtitles */}
               {isPlaying && (
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%] z-40">
                   <div className="glass-morphism p-6 rounded-2xl border border-white/20 shadow-2xl animate-fade-slide-up text-center">
                     <p className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                       {currentText}
                     </p>
                   </div>
                 </div>
               )}

               {/* Play Overlay */}
               {!isPlaying && (
                 <div className="absolute inset-0 flex items-center justify-center z-30">
                   <button 
                     onClick={startPitch}
                     className="w-24 h-24 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group/btn"
                   >
                     <Play className="w-10 h-10 fill-current ml-1 group-hover/btn:scale-110 transition-transform" />
                   </button>
                 </div>
               )}
            </div>
          </div>

          {/* Device Base Shadow */}
          <div className="h-4 w-[90%] mx-auto bg-slate-900/40 blur-xl rounded-full" />
        </div>

        {/* Benefits Grid (The Convincing Part) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 mb-24 w-full">
          {[
            { 
              icon: <Zap className="w-8 h-8 text-blue-500" />, 
              title: "Instant Accuracy", 
              desc: "99.2% transcription accuracy on complex medical terminology and multi-speaker visits." 
            },
            { 
              icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />, 
              title: "HIPAA Compliant", 
              desc: "Military-grade encryption with automatic PHI scrubbing for complete patient privacy." 
            },
            { 
              icon: <HeartPulse className="w-8 h-8 text-purple-500" />, 
              title: "Doctor Wellness", 
              desc: "Reduces clinical documentation time by 75%, allowing doctors to leave on time." 
            }
          ].map((feature, i) => (
            <div key={i} className="glass-morphism p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
              <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Closing CTA Section */}
        <div className="w-full glass-morphism p-12 rounded-[40px] border border-blue-500/20 text-center relative overflow-hidden mb-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to Reclaim Your Time?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10">
            Join the 2,500+ clinics already using VoiceMD to eliminate charting overhead.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center gap-3"
            >
              Start Your Free Trial
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard/record"
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all"
            >
              Back to Clinical Sandbox
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
