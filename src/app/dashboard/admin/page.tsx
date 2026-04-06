"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Users, 
  FileText, 
  ShieldCheck, 
  ChevronRight,
  Database,
  Activity,
  User
} from "lucide-react";
import Link from "next/link";

const ADMIN_EMAIL = "lhaj.7.10.2020@gmail.com";

// Type definitions for our expected data
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

export default function SaaSControlPanel() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveNotes, setLiveNotes] = useState<ClinicalNote[]>([]);
  const [activeUsers, setActiveUsers] = useState<{id: string, noteCount: number, lastActive: string}[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/dashboard");
        return;
      }
      setIsAdmin(true);
      fetchSaaSData();
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const fetchSaaSData = async () => {
    try {
      // 1. Fetch deep documentation data (The actual content users are writing)
      const { data: notesData, error } = await supabase
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
        .limit(20);

      if (error) throw error;
      
      const notes = (notesData || []) as unknown as ClinicalNote[];
      setLiveNotes(notes);

      // 2. Aggregate active users from the notes data
      // For a real SaaS, this would use a secure server-side RPC to query auth.users directly.
      const userMap = new Map<string, { count: number, lastActive: string }>();
      
      notes.forEach(note => {
        if (!userMap.has(note.doctor_id)) {
          userMap.set(note.doctor_id, { count: 1, lastActive: note.created_at });
        } else {
          const current = userMap.get(note.doctor_id)!;
          userMap.set(note.doctor_id, { 
            count: current.count + 1, 
            lastActive: new Date(note.created_at) > new Date(current.lastActive) ? note.created_at : current.lastActive 
          });
        }
      });

      const usersArr = Array.from(userMap.entries()).map(([id, info]) => ({
        id: id,
        noteCount: info.count,
        lastActive: info.lastActive
      }));

      setActiveUsers(usersArr);

    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'pulse 2s infinite' }}>
          <ShieldCheck size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Authenticating Master Controller...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.5s ease' }}>
      
      <header style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div style={{ background: 'var(--accent-soft)', padding: '0.4rem', borderRadius: '8px', color: 'var(--accent)' }}>
                <Database size={20} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>SaaS Command Center</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Platform Supervision
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Direct monitoring of user activity and documentation output.</p>
          </div>
          
          <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', display: 'flex', gap: '2rem', boxShadow: 'var(--shadow-sm)' }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Admin Account</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ADMIN_EMAIL}</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Status</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block' }} /> Live Feed
                </span>
             </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Live Content Feed */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--text-primary)' }}>Live Documentation Feed</h2>
            <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={fetchSaaSData}>
              Refresh Data
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {liveNotes.length > 0 ? (
              liveNotes.map((note) => (
                <article key={note.id} style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID: {note.doctor_id.substring(0, 8)}...</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{new Date(note.created_at).toLocaleString()}</span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Patient: {note.patients?.first_name || "Unknown"} {note.patients?.last_name || ""}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>Complaint: <strong style={{ color: 'var(--text-primary)' }}>{note.chief_complaint || "Unspecified"}</strong></p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.3rem 0.8rem', borderRadius: '999px', background: note.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: note.status === 'Completed' ? '#059669' : '#d97706' }}>
                      {note.status}
                    </span>
                  </div>
                  
                  {/* The actual content that the user wrote */}
                  <div style={{ background: 'var(--bg-color)', border: '1px dashed var(--border-subtle)', borderRadius: '12px', padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Transcribed Note Content</p>
                    {note.content ? (
                      <div 
                         style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}
                         dangerouslySetInnerHTML={{ __html: note.content }} // Assuming the content is HTML from the editor
                      />
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No clinical content has been processed for this record yet.</p>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--border-subtle)' }}>
                <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Data Available</h3>
                <p style={{ color: 'var(--text-secondary)' }}>You may need to enable Admin Bypass in your Supabase SQL editor to read all user notes.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Platform Usage */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '1.75rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Users size={20} color="var(--accent)" /> Active Users
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeUsers.length > 0 ? (
                activeUsers.map((user, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: idx !== activeUsers.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color="var(--text-secondary)" />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>ID: {user.id.substring(0, 6)}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(user.lastActive).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
                      {user.noteCount} notes
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>No active user data loaded.</p>
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>Security Configuration</h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <ShieldCheck size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                You are viewing restricted data explicitly granted to your email. You bypass standard app Row Level Security. All records below belong to external clients.
              </p>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
