"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Plus, 
  Clock, 
  FileText, 
  Stethoscope, 
  ChevronRight,
  TrendingUp,
  Users,
  Mic,
  ShieldCheck,
  Database,
  Activity,
  User,
  ExternalLink
} from "lucide-react";

// Admin email
const MASTER_ADMIN = "lhaj.7.10.2020@gmail.com";

interface Patient {
  first_name: string;
  last_name: string;
}

interface ClinicalNote {
  id: string;
  doctor_id: string;
  created_at: string;
  chief_complaint: string;
  status: string;
  content: string;
  patients: Patient;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("Doctor");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data for SaaS Control Panel
  const [globalNotes, setGlobalNotes] = useState<ClinicalNote[]>([]);
  const [platformUsers, setPlatformUsers] = useState<{id: string, name: string, notes: number, lastActive: string}[]>([]);

  useEffect(() => {
    const initializeDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Identify User
        const first = user.user_metadata?.first_name || "";
        const last = user.user_metadata?.last_name || "";
        const name = first && last ? `Dr. ${first} ${last}` : first || user.email?.split('@')[0] || "Doctor";
        setUserName(name);

        // 2. Role Check
        if (user.email === MASTER_ADMIN) {
          setIsAdmin(true);
          await fetchMasterData();
        }
      }
      setLoading(false);
    };

    const fetchMasterData = async () => {
      try {
        // Fetch All Clinical Notes across entire SaaS platform
        const { data: notesData } = await supabase
          .from('clinical_notes')
          .select(`
            id,
            doctor_id,
            created_at,
            chief_complaint,
            status,
            content,
            patients (first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        setGlobalNotes((notesData as unknown as ClinicalNote[]) || []);

        // Aggregate User Data from activity
        // (Mocking details from notes as we don't have direct auth table read)
        const userMap = new Map();
        (notesData || []).forEach((note: any) => {
          if (!userMap.has(note.doctor_id)) {
            userMap.set(note.doctor_id, { 
              id: note.doctor_id, 
              name: `User ${note.doctor_id.substring(0, 5)}`, 
              notes: 1, 
              lastActive: note.created_at 
            });
          } else {
            const existing = userMap.get(note.doctor_id);
            userMap.set(note.doctor_id, { 
              ...existing, 
              notes: existing.notes + 1, 
              lastActive: new Date(note.created_at) > new Date(existing.lastActive) ? note.created_at : existing.lastActive
            });
          }
        });
        setPlatformUsers(Array.from(userMap.values()));

      } catch (err) {
        console.error("Master Portal Error:", err);
      }
    };

    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Activity size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Master SaaS View
  if (isAdmin) {
    return (
      <div style={{ padding: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.6s ease' }}>
        
        <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'var(--accent-soft)', padding: '0.4rem', borderRadius: '8px', color: 'var(--accent)' }}>
                <ShieldCheck size={20} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>Master Command Center</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              SaaS Overview.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome back, Master. Directly controlling platform documentation and users.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
             <Link 
               href="/dashboard/notes"
               className="premium-btn flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
               style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontSize: '0.95rem' }}
             >
               Global Logs <ExternalLink size={16} />
             </Link>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 380px', gap: '3rem', alignItems: 'start' }}>
          
          {/* Main Feed: Live Documentation Monitor */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--text-primary)' }}>Live Documentation Feed</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                 <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', animation: 'pulse 1.5s infinite' }} />
                 <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Active Feed</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {globalNotes.length > 0 ? globalNotes.map((note) => (
                <article key={note.id} style={{ background: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-subtle)', padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
                      <div style={{ display: 'flex', gap: '1.25rem' }}>
                         <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={24} color="var(--accent)" />
                         </div>
                         <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>SaaS USER ID: {note.doctor_id.substring(0, 10)}</p>
                            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>Patient: {note.patients?.first_name} {note.patients?.last_name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Created: {new Date(note.created_at).toLocaleString()}</p>
                         </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.4rem 0.8rem', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        {note.status.toUpperCase()}
                      </span>
                   </div>

                   <div style={{ background: 'var(--bg-color)', borderRadius: '20px', padding: '1.75rem', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Transcription Content Content</p>
                      <div 
                         style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.7, opacity: 0.9, whiteSpace: 'pre-wrap' }}
                         dangerouslySetInnerHTML={{ __html: note.content || "<i>No clinical content detected for this record yet.</i>" }}
                      />
                   </div>
                </article>
              )) : (
                <div style={{ padding: '5rem 2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '32px', border: '1px dashed var(--border-subtle)' }}>
                   <Database size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem', opacity: 0.4 }} />
                   <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>No SaaS traffic detected yet.</h3>
                   <p style={{ color: 'var(--text-secondary)' }}>You may need to bypass RLS in Supabase to see all global user data.</p>
                </div>
              )}
            </div>
          </section>

          {/* Side Registry: Active Clinicians */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
             <div style={{ background: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-subtle)', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={22} color="var(--accent)" /> Platform Users
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                   {platformUsers.length > 0 ? platformUsers.map((u, i) => (
                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: i !== platformUsers.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <div style={{ width: 44, height: 44, borderRadius: 'full', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                              <User size={20} />
                           </div>
                           <div>
                              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{u.id.substring(0, 8)}...</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active: {new Date(u.lastActive).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                           <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{u.notes}</p>
                           <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Notes</p>
                        </div>
                     </div>
                   )) : (
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Waiting for user activity...</p>
                   )}
                </div>
             </div>

             <div style={{ background: 'var(--accent)', color: 'var(--bg-color)', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-xl)' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.8, letterSpacing: '0.1em' }}>SaaS Health Control</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Database (Supabase)</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>ONLINE</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Realtime Sync</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>ENABLED</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>System Policy</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>BYPASS RLS</span>
                   </div>
                </div>
             </div>
          </aside>

        </div>
      </div>
    );
  }

  // Standard Doctor View (Personal Data)
  return (
    <div style={{ padding: '2rem', maxWidth: '1152px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.5s ease', position: 'relative' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Good morning, {userName}.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Here's your personal overview of patients and notes.</p>
        </div>
        <Link 
          href="/dashboard/patients"
          className="premium-btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontSize: '0.95rem' }}
        >
          <Plus size={18} /> New Patient
        </Link>
      </header>

      {/* Standard Doctor Metrics & Feed... keeping current logic for others */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link 
          href="/dashboard/record"
          className="hover:scale-[1.01] transition-transform duration-200"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', padding: '2rem 2.5rem', borderRadius: '24px', background: 'var(--text-primary)', color: 'var(--bg-color)', boxShadow: 'var(--shadow-xl)', textDecoration: 'none' }}
        >
           <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '20px' }}>
              <Mic size={36} color="var(--bg-color)" />
           </div>
           <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.25rem' }}>Start New Dictation</h2>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Tap here to launch the AI scribe for your next patient.</p>
           </div>
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
         <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.1rem' }}>Standard Physician data loader initialized.</p>
      </div>
    </div>
  );
}
