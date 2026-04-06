"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Activity,
  User,
  MoreVertical,
  ShieldAlert,
  Database,
  ArrowUpRight,
  UserX,
  FileText
} from "lucide-react";

interface ClinicalNote {
  id: string;
  doctor_id: string;
  created_at: string;
  chief_complaint: string;
  status: string;
  content: string;
  patients: { first_name: string; last_name: string; };
}

export default function SaaSAdminController() {
  const [loading, setLoading] = useState(true);
  
  // Data for SaaS Control Panel
  const [globalNotes, setGlobalNotes] = useState<ClinicalNote[]>([]);
  const [platformUsers, setPlatformUsers] = useState<{id: string, name: string, notes: number, lastActive: string, status: string}[]>([]);

  useEffect(() => {
    const fetchSaaSData = async () => {
      try {
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
          .limit(25);

        setGlobalNotes((notesData as unknown as ClinicalNote[]) || []);

        const userMap = new Map();
        (notesData || []).forEach((note: any) => {
          if (!userMap.has(note.doctor_id)) {
            userMap.set(note.doctor_id, { 
              id: note.doctor_id, 
              name: `Dr. ${note.patients?.last_name || note.doctor_id.substring(0,4)}`, 
              notes: 1, 
              lastActive: note.created_at,
              status: 'Active'
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
        setLoading(false);

      } catch (err) {
        console.error("Master Portal Error:", err);
        setLoading(false);
      }
    };

    fetchSaaSData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Activity size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Connecting to SaaS Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1600px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.6s ease' }}>
      
      {/* Header */}
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            VoiceMD SaaS Control
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Complete platform supervision: User management & data streams.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
           <div style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '24px', display: 'flex', gap: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Platform State</span>
                <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669', display: 'inline-block', animation: 'pulse 2s infinite' }} /> Online
                </span>
             </div>
             <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Active Users (24h)</span>
                <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '0.2rem', lineHeight: 1 }}>{platformUsers.length}</span>
             </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1.2fr)', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Column: User Management */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <Users size={28} color="var(--accent)" /> Users Management
            </h2>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-subtle)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            
            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 60px', padding: '1.5rem 2rem', background: 'var(--bg-color)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
               <span>User ID / Doctor</span>
               <span>Last Active</span>
               <span>Notes Generated</span>
               <span style={{ textAlign: 'center' }}>Ctrl</span>
            </div>

            {/* User List */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               {platformUsers.length > 0 ? platformUsers.map((u, i) => (
                 <div key={i} className="group" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 60px', padding: '1.25rem 2rem', borderBottom: i !== platformUsers.length - 1 ? '1px solid var(--border-subtle)' : 'none', alignItems: 'center', transition: 'background 0.2s', cursor: 'default' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: 44, height: 44, borderRadius: '16px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          <User size={20} />
                       </div>
                       <div>
                          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{u.id.substring(0, 10)}...</p>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px', mt: '0.2rem' }}>
                             {u.status}
                          </span>
                       </div>
                    </div>

                    <div>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(u.lastActive).toLocaleDateString()}</p>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(u.lastActive).toLocaleTimeString()}</p>
                    </div>

                    <div>
                       <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--text-primary)' }}>{u.notes}</span>
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>total</span>
                    </div>

                    {/* Admin Action Buttons */}
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                       <button className="hover:bg-zinc-100 dark:hover:bg-zinc-800" style={{ padding: '0.5rem', borderRadius: '8px', color: 'var(--text-muted)', transition: 'all 0.2s', cursor: 'pointer' }}>
                          <MoreVertical size={20} />
                       </button>
                       {/* Dropdown mock (visible on hover theoretically, keeping it simple for UI) */}
                       <div className="opacity-0 group-hover:opacity-100 absolute right-12 top-0 bg-white dark:bg-[#1a1816] border border-zinc-200 dark:border-white/10 shadow-xl rounded-xl w-32 flex flex-col overflow-hidden transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto">
                           <button style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, width: '100%', textAlign: 'left', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', background: 'transparent' }} className="hover:bg-zinc-50 dark:hover:bg-white/5">View Profile</button>
                           <button style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, width: '100%', textAlign: 'left', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent' }} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                             <UserX size={14} /> Ban User
                           </button>
                       </div>
                    </div>
                 </div>
               )) : (
                 <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <ShieldAlert size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No active users detected on the platform.</p>
                 </div>
               )}
            </div>
          </div>
        </section>

        {/* Right Column: Deep Content Stream */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <Database size={28} color="var(--accent)" /> Live Data Stream
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {globalNotes.length > 0 ? globalNotes.map((note) => (
                <article key={note.id} style={{ background: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-subtle)', padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '1.25rem' }}>
                         <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={20} color="var(--text-secondary)" />
                         </div>
                         <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', letterSpacing: '0.05em' }}>Gen Timestamp: {new Date(note.created_at).toLocaleString()}</p>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>User Hash: {note.doctor_id.substring(0,8)}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Complaint Context: <span style={{ color: 'var(--text-primary)' }}>{note.chief_complaint || "None provided"}</span></p>
                         </div>
                      </div>
                      <button style={{ background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.5rem', color: 'var(--text-secondary)' }} className="hover:text-primary hover:border-zinc-400 transition-colors">
                         <ArrowUpRight size={18} />
                      </button>
                   </div>

                   {/* Raw Data Output */}
                   <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Data Payload (Content)</p>
                      <div style={{ background: 'var(--bg-color)', borderRadius: '20px', padding: '1.75rem', border: '1px dashed var(--border-subtle)' }}>
                        <div 
                           style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}
                           dangerouslySetInnerHTML={{ __html: note.content || "<i style='color:var(--text-muted)'>Awaiting transcription processing...</i>" }}
                        />
                      </div>
                   </div>
                </article>
              )) : (
                <div style={{ background: 'var(--bg-card)', borderRadius: '32px', border: '1px dashed var(--border-subtle)', padding: '5rem 2rem', textAlign: 'center' }}>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>SaaS Stream is currently empty.</p>
                </div>
              )}
            </div>
        </section>

      </div>
    </div>
  );
}
