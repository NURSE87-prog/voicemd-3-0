"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCcw, Volume2, ShieldCheck, Zap, HeartPulse, Sparkles, ChevronRight, Home } from "lucide-react";
import Link from "next/link";

const PITCH_SCRIPT = [
  { time: 0, text: "Doctors spend up to 20 hours a week on clinical documentation. It's the leading cause of burnout." },
  { time: 7000, text: "Meet VoiceMD. The ambient AI scribe that lets you focus on the patient, not the keyboard." },
  { time: 14000, text: "With a single tap, VoiceMD captures your patient conversation in the background. Speak naturally." },
  { time: 22000, text: "In seconds, our clinical-grade AI analyzes the visit to build a structured, professional SOAP note." },
  { time: 32000, text: "Accurate, compliant, and ready for your EHR. VoiceMD: Turn minutes of charting into seconds of clicking." }
];

export default function StandalonePitchPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [progress, setProgress] = useState(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    // Check for dark mode via class, but we hard-code the dark bg anyway
    document.documentElement.classList.add('dark');
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

    // Identify and prioritize premium/natural sounding voices
    const voices = window.speechSynthesis.getVoices();
    const premiumVoices = voices.filter(v => 
      v.name.includes("Google") || 
      v.name.includes("Natural") || 
      v.name.includes("Neural") ||
      v.name.includes("Premium")
    );
    
    // Select a deep, professional male or clear authoritative female voice
    const targetVoice = premiumVoices.find(v => v.name.includes("US English") || v.name.includes("UK English")) || voices[0];

    // Speak each part of the script with professional pauses
    PITCH_SCRIPT.forEach((part, index) => {
      setTimeout(() => {
        if (!window.speechSynthesis) return;
        
        const utterance = new SpeechSynthesisUtterance(part.text);
        if (targetVoice) utterance.voice = targetVoice;
        
        utterance.rate = 0.88; // Professional, measured cadence for medical reliability
        utterance.pitch = 1.0; 
        utterance.volume = 1.0;
        
        // Add a slight natural delay (breathing room)
        window.speechSynthesis.speak(utterance);
        setCurrentText(part.text);
        setProgress(((index + 1) / PITCH_SCRIPT.length) * 100);

        if (index === PITCH_SCRIPT.length - 1) {
          utterance.onend = () => setIsPlaying(false);
        }
      }, part.time + (index * 500)); // Cumulative 0.5s natural pause per section
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8 overflow-x-hidden font-sans selection:bg-blue-500/30">
      
      {/* 🚀 FIXED PREMIUM BACKGROUND (MESH GRADIENT) */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Subtle grid pattern for clinical feel */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Navbar-style CTA */}
        <div className="w-full flex justify-between items-center mb-16 animate-fade-in">
          <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">VoiceMD</div>
          <Link 
            href="/dashboard/record"
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Sparkles className="w-3 h-3" />
            Executive Pitch & Demonstration
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            The Future of <span className="text-blue-500">Clinical Efficiency</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Experience the "Golden Path" of VoiceMD. Witness how we turn natural conversations into professional clinical documentation in seconds.
          </p>
        </div>

        {/* Main Demo Stage - Centered laptop frame */}
        <div className="relative w-full max-w-4xl px-4">
          <div className="relative bg-[#1e293b] rounded-3xl p-1.5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-slate-800 transition-transform duration-700 overflow-hidden">
            {/* Screen Reflective Overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20" />
            
            {/* The Actual Demo Recording */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner group">
               <img 
                 src="/demo-recording.webp" 
                 alt="VoiceMD Clinical Demo" 
                 className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-30 scale-105 blur-sm'}`}
               />
               
               {/* Video Overlay - Subtitles */}
               {isPlaying && (
                 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[85%] z-40 animate-fade-in">
                   <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
                     <p className="text-xl font-bold text-white leading-relaxed drop-shadow-sm">
                       {currentText}
                     </p>
                   </div>
                 </div>
               )}

               {/* Play Overlay */}
               {!isPlaying && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                   <button 
                     onClick={startPitch}
                     className="w-24 h-24 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all hover:scale-110 active:scale-95 group/btn mb-4"
                   >
                     <Play className="w-10 h-10 fill-current ml-1 group-hover/btn:scale-110 transition-transform" />
                   </button>
                   <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs">Begin Interactive Pitch</p>
                 </div>
               )}
            </div>
          </div>

          {/* Floor Shadow */}
          <div className="h-6 w-[80%] mx-auto bg-blue-500/10 blur-3xl rounded-full mt-4" />
        </div>

        {/* Clinical Proof - Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 mb-32 w-full">
          {[
            { 
              icon: <Zap className="w-7 h-7 text-blue-400" />, 
              title: "Instant Accuracy", 
              desc: "99.2% accuracy on complex medical terminology and multi-speaker visits." 
            },
            { 
              icon: <ShieldCheck className="w-7 h-7 text-blue-400" />, 
              title: "HIPAA Compliant", 
              desc: "Military-grade encryption with automatic PHI scrubbing for privacy." 
            },
            { 
              icon: <HeartPulse className="w-7 h-7 text-blue-400" />, 
              title: "Doctor Wellness", 
              desc: "Reduces clinical documentation time by 75%. Reclaim 2 hours per day." 
            }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-sm p-10 rounded-[32px] border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500 group">
              <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Final CTA Section */}
        <div className="w-full bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-md p-16 rounded-[48px] border border-blue-500/20 text-center mb-32 relative group border-t-blue-500/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to Modernize Your Practice?</h2>
          <p className="text-xl text-slate-400 max-w-xl mx-auto mb-12 font-medium">
            Join the forward-thinking clinics already using VoiceMD to eliminate charting overhead.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/signup"
              className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-1 flex items-center gap-3"
            >
              Start Clinical Trial
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard/record"
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl border border-slate-700 hover:bg-slate-800 transition-all"
            >
              Back to Sandbox
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
