"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield, Laptop, Globe, Save, ChevronRight, Stethoscope, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "admin@medvoice.ai",
    specialty: "Physician",
    initials: "JD"
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const first = user.user_metadata?.first_name || "";
        const last = user.user_metadata?.last_name || "";
        setProfile({
          firstName: first || "Doctor",
          lastName: last,
          email: user.email || "",
          specialty: user.user_metadata?.specialty || "Physician",
          initials: (first[0] || "") + (last[0] || "D")
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1a1816] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-in fade-in duration-700">
      <header className="mb-12 border-b border-[#f5f2ed] dark:border-white/5 pb-8">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-[#1a1816] dark:text-[#f0ede8]">Settings</h1>
        <p className="mt-2 text-[#6b6560] dark:text-[#a8a29e]">Manage your professional profile and clinical environment.</p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        
        {/* Navigation Sidebar (Mobile Hidden or styled) */}
        <nav className="space-y-2 lg:col-span-1">
          <button className="flex w-full items-center gap-3 rounded-xl bg-[#fbfaf9] dark:bg-white/5 px-4 py-3 text-sm font-bold text-[#1a1816] dark:text-white shadow-sm ring-1 ring-[#f5f2ed] dark:ring-white/10">
            <User size={18} className="text-[#c45c4a]" /> 
            Profile Account
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#6b6560] dark:text-[#a8a29e] hover:bg-[#fbfaf9] dark:hover:bg-white/5 transition-all">
            <Bell size={18} /> 
            Notifications
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#6b6560] dark:text-[#a8a29e] hover:bg-[#fbfaf9] dark:hover:bg-white/5 transition-all">
            <ShieldCheck size={18} /> 
            Security & Privacy
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#6b6560] dark:text-[#a8a29e] hover:bg-[#fbfaf9] dark:hover:bg-white/5 transition-all">
            <Laptop size={18} /> 
            EHR Integrations
          </button>
        </nav>

        {/* Content Area */}
        <div className="space-y-12 lg:col-span-2">
          
          {/* Profile Card */}
          <section className="rounded-[32px] bg-white dark:bg-[#0f0e0d] p-8 shadow-xl shadow-black/[0.02] ring-1 ring-[#f5f2ed] dark:ring-white/5">
            <div className="mb-10 flex items-center gap-8">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#f5f2ed] dark:bg-white/5 font-serif text-3xl font-bold text-[#1a1816] dark:text-[#f0ede8] shadow-inner ring-1 ring-[#e5e1dc] dark:ring-white/10">
                {profile.initials}
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-2xl font-bold text-[#1a1816] dark:text-[#f0ede8]">Doctor Profile</h2>
                <p className="text-sm font-medium text-[#c45c4a]">{profile.specialty}</p>
                <button className="mt-4 text-xs font-bold uppercase tracking-widest text-[#9c9690] hover:text-[#1a1816] transition-colors">
                  Upload New Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#9c9690]">First Name</label>
                <input 
                  type="text" 
                  defaultValue={profile.firstName}
                  className="w-full rounded-xl border border-[#f5f2ed] dark:border-white/10 bg-[#fbfaf9] dark:bg-white/5 px-4 py-3 text-sm font-semibold text-[#1a1816] dark:text-white outline-none focus:border-[#c45c4a] focus:ring-1 focus:ring-[#c45c4a] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#9c9690]">Last Name</label>
                <input 
                  type="text" 
                  defaultValue={profile.lastName}
                  className="w-full rounded-xl border border-[#f5f2ed] dark:border-white/10 bg-[#fbfaf9] dark:bg-white/5 px-4 py-3 text-sm font-semibold text-[#1a1816] dark:text-white outline-none focus:border-[#c45c4a] focus:ring-1 focus:ring-[#c45c4a] transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#9c9690]">Clinical Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9c9690]" size={16} />
                  <input 
                    type="email" 
                    readOnly 
                    value={profile.email}
                    className="w-full rounded-xl border border-[#f5f2ed] dark:border-white/10 bg-[#fbfaf9] dark:bg-white/5 px-11 py-3 text-sm font-semibold text-[#6b6560] dark:text-[#a8a29e] cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#9c9690]">Medical Specialty</label>
                <select className="w-full rounded-xl border border-[#f5f2ed] dark:border-white/10 bg-[#fbfaf9] dark:bg-white/5 px-4 py-3 text-sm font-semibold text-[#1a1816] dark:text-white outline-none focus:border-[#c45c4a] focus:ring-1 focus:ring-[#c45c4a] transition-all appearance-none">
                  <option>{profile.specialty}</option>
                  <option>Cardiology</option>
                  <option>Emergency Medicine</option>
                  <option>Pediatrics</option>
                  <option>Family Medicine</option>
                </select>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button className="rounded-xl bg-[#1a1816] dark:bg-[#f0ede8] px-8 py-3.5 text-sm font-bold text-white dark:text-[#1a1816] shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Save Profile Changes
              </button>
            </div>
          </section>

          {/* Quick Actions / Other Controls */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group rounded-[28px] bg-[#fbfaf9] dark:bg-white/5 p-6 ring-1 ring-[#f5f2ed] dark:ring-white/10 transition-all hover:shadow-xl hover:shadow-black/[0.02]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-[#1a1816] text-[#1a1816] dark:text-white shadow-sm ring-1 ring-[#f5f2ed] dark:ring-white/10">
                <Stethoscope size={22} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1a1816] dark:text-white">EHR Direct Sync</h3>
              <p className="mt-1 text-xs font-medium text-[#6b6560] dark:text-[#a8a29e]">Sync transcribes directly to Epic/Cerner.</p>
              <button className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c45c4a]">
                Configure Sync <ChevronRight size={14} />
              </button>
            </div>

            <div className="group rounded-[28px] bg-[#fbfaf9] dark:bg-white/5 p-6 ring-1 ring-[#f5f2ed] dark:ring-white/10 transition-all hover:shadow-xl hover:shadow-black/[0.02]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-[#1a1816] text-[#1a1816] dark:text-white shadow-sm ring-1 ring-[#f5f2ed] dark:ring-white/10">
                <Globe size={22} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1a1816] dark:text-white">Public Directory</h3>
              <p className="mt-1 text-xs font-medium text-[#6b6560] dark:text-[#a8a29e]">Manage how you appear to other clinicians.</p>
              <button className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c45c4a]">
                Privacy Settings <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
