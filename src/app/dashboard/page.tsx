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
  Mic
} from "lucide-react";

export default function DashboardOverview() {
  const [userName, setUserName] = useState("Doctor");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const first = user.user_metadata?.first_name || "";
        const last = user.user_metadata?.last_name || "";
        if (first && last) {
          setUserName(`Dr. ${first} ${last}`);
        } else if (first) {
          setUserName(`Dr. ${first}`);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }
      }
    };
    getUser();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1152px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.5s ease', position: 'relative' }}>
      
      <header style={{ marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', position: 'relative', zIndex: 10 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Good morning, {userName}.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Here's an overview of your schedule and recent clinical notes.</p>
        </div>
        <Link 
          href="/dashboard/patients"
          className="premium-btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontSize: '0.95rem' }}
        >
          <Plus size={18} /> New Patient
        </Link>
      </header>

      {/* Hero Quick Action */}
      <div style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 10 }}>
        <Link 
          href="/dashboard/record"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', padding: '2rem 2.5rem', borderRadius: '24px', background: 'var(--text-primary)', color: 'var(--bg-color)', boxShadow: 'var(--shadow-xl)', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          className="hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
            <Mic size={36} color="var(--bg-color)" />
          </div>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.25rem', color: 'var(--bg-color)' }}>Start New Dictation</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', maxWidth: '400px', lineHeight: 1.5 }}>
              Tap here to launch the ambient AI scribe for your next patient visit. Generates structured SOAP notes instantly.
            </p>
          </div>
          <div style={{ background: 'var(--bg-color)', color: 'var(--text-primary)', padding: '0.875rem 1.75rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', boxShadow: 'var(--shadow-sm)' }}>
            Start Scribing
          </div>
        </Link>
      </div>

      {/* Stats overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.6rem', borderRadius: '12px', color: '#0284c7' }}>
              <Users size={22} />
            </div>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
              <TrendingUp size={12} style={{ marginRight: '0.25rem' }} /> +12%
            </span>
          </div>
          <h3 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1 }}>124</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Patients</p>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--accent-soft)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent)' }}>
              <FileText size={22} />
            </div>
          </div>
          <h3 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1 }}>42</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes this week</p>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.6rem', borderRadius: '12px', color: '#9333ea' }}>
              <Clock size={22} />
            </div>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', background: 'var(--border-subtle)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
              -4 hours
            </span>
          </div>
          <h3 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1 }}>11.5h</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time saved charting</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', position: 'relative', zIndex: 10 }}>
        {/* Recent Notes */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Recent Notes</h2>
            <button style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              View all <ChevronRight size={16} />
            </button>
          </div>
          
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentNotes.map((note, index) => (
                <li key={note.id} style={{ padding: '1.25rem 1.5rem', borderBottom: index !== recentNotes.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 0.2s', cursor: 'pointer' }} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        <FileText size={20} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {note.patientName} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({note.type})</span>
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <Stethoscope size={14} /> {note.chiefComplaint}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, marginLeft: '1rem' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{note.date}</p>
                      <span style={{ marginTop: '0.4rem', display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: note.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: note.status === 'Completed' ? '#059669' : '#d97706' }}>
                        {note.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions / Today */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Today's Schedule</h2>
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ position: 'relative', paddingLeft: '1.25rem', borderLeft: '2px solid var(--text-primary)' }}>
                <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-primary)', boxShadow: '0 0 0 4px var(--bg-card)' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>09:00 AM</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Sarah Jenkins</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Annual Physical</p>
              </div>
              <div style={{ position: 'relative', paddingLeft: '1.25rem', borderLeft: '2px solid var(--border-subtle)' }}>
                <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)', boxShadow: '0 0 0 4px var(--bg-card)' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>10:30 AM</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Michael Chen</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hypertension follow-up</p>
              </div>
              <div style={{ position: 'relative', paddingLeft: '1.25rem', borderLeft: '2px solid transparent' }}>
                <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)', boxShadow: '0 0 0 4px var(--bg-card)' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>11:15 AM</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Emily Rodriguez</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Migraine consultation</p>
              </div>
              
              <button style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                View Full Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const recentNotes = [
  { id: 1, patientName: "Arthur Shelby", type: "SOAP Note", chiefComplaint: "Chest pain", date: "Today", status: "Completed" },
  { id: 2, patientName: "Thomas Shelby", type: "Consultation", chiefComplaint: "Insomnia, stress", date: "Today", status: "Needs Review" },
  { id: 3, patientName: "Grace Burgess", type: "SOAP Note", chiefComplaint: "Routine checkup", date: "Yesterday", status: "Completed" },
  { id: 4, patientName: "Alfie Solomons", type: "Follow-up", chiefComplaint: "Post-surgery check", date: "Yesterday", status: "Completed" },
];
