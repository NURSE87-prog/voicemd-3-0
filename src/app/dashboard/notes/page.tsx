"use client";

import { useState } from "react";
import { Search, FileText, Filter, Calendar, CheckCircle, Clock, ChevronRight, Stethoscope, ListFilter } from "lucide-react";

// Keeping the dummy data but upgrading its presentation in the UI
const initialNotes = [
  { id: 1, patient: "Arthur Shelby", type: "SOAP Note", chiefComplaint: "Chest pain", date: "2024-04-04", status: "Completed" },
  { id: 2, patient: "Thomas Shelby", type: "Consultation", chiefComplaint: "Insomnia, stress", date: "2024-04-03", status: "Review Required" },
  { id: 3, patient: "Grace Burgess", type: "SOAP Note", chiefComplaint: "Routine checkup", date: "2024-04-02", status: "Completed" },
  { id: 4, patient: "Alfie Solomons", type: "Follow-up", chiefComplaint: "Post-surgery check", date: "2024-04-01", status: "Completed" },
  { id: 5, patient: "Michael Chen", type: "SOAP Note", chiefComplaint: "Hypertension follow-up", date: "2024-03-30", status: "Completed" },
  { id: 6, patient: "Sarah Jenkins", type: "Annual Physical", chiefComplaint: "General wellness", date: "2024-03-29", status: "Completed" },
  { id: 7, patient: "Emily Rodriguez", type: "Consultation", chiefComplaint: "Migraine management", date: "2024-03-28", status: "Review Required" },
];

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = initialNotes.filter(note =>
    note.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-in fade-in duration-700">
      
      {/* Premium Header */}
      <header className="mb-12 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Platform Notes</h1>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>View and manage all generated clinical documentation across the SaaS.</p>
        </div>
        
        {/* Total Count Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '999px', background: 'var(--accent-soft)', padding: '0.5rem 1rem', border: '1px solid var(--border-subtle)' }}>
           <FileText size={16} color="var(--accent)" />
           <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{initialNotes.length} Total Records</span>
        </div>
      </header>

      {/* Advanced Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search notes by patient identifier or complaint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', borderRadius: '16px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', padding: '0.875rem 1rem 0.875rem 3rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', outline: 'none', boxShadow: 'var(--shadow-sm)' }}
          />
        </div>
        <div className="flex gap-3">
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', padding: '0.875rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
            <Calendar className="w-4 h-4" /> Date Range
          </button>
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', padding: '0.875rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
            <ListFilter className="w-4 h-4" /> Filter Types
          </button>
        </div>
      </div>

      {/* Note Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredNotes.map((note) => (
          <div key={note.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '32px', background: 'var(--bg-card)', padding: '2rem', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-subtle)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            
            <div>
               {/* Card Header & Status */}
               <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                 <div style={{ display: 'flex', height: '48px', width: '48px', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                   <Stethoscope className="w-6 h-6" />
                 </div>
                 <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: note.status === 'Completed' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(217, 119, 6, 0.1)', color: note.status === 'Completed' ? '#059669' : '#d97706' }}>
                   {note.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                   {note.status}
                 </span>
               </div>
               
               {/* Content */}
               <div style={{ marginBottom: '0.5rem' }}>
                 <p style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Target Patient</p>
                 <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{note.patient}</h3>
               </div>
               
               <p style={{ display: 'inline-block', marginBottom: '1.5rem', borderRadius: '8px', background: 'var(--accent-soft)', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                 {note.type}
               </p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', height: '32px', width: '32px', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: 'var(--bg-color)' }}>
                       <FileText className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div>
                       <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Context</p>
                       <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{note.chiefComplaint}</p>
                    </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', height: '32px', width: '32px', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: 'var(--bg-color)' }}>
                       <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div>
                       <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Date Logged</p>
                       <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{note.date}</p>
                    </div>
                 </div>
               </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <button style={{ background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', cursor: 'pointer' }}>
                Export Data
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', borderRadius: '12px', background: 'var(--text-primary)', color: 'var(--bg-card)', padding: '0.625rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                Inspect <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '40px', border: '1px dashed var(--border-subtle)', padding: '8rem 2rem', textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', height: '80px', width: '80px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--text-muted)' }}>
            <Search className="w-8 h-8" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>No records found</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', maxWidth: '24rem' }}>
            We couldn't find any platform notes matching your current filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
