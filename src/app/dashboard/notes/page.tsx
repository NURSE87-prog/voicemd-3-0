"use client";

import { useState } from "react";
import { Search, FileText, Filter, Calendar, CheckCircle, Clock } from "lucide-react";

const initialNotes = [
  { id: 1, patient: "Arthur Shelby", type: "SOAP Note", chiefComplaint: "Chest pain", date: "2024-04-04", status: "Completed" },
  { id: 2, patient: "Thomas Shelby", type: "Consultation", chiefComplaint: "Insomnia, stress", date: "2024-04-03", status: "Needs Review" },
  { id: 3, patient: "Grace Burgess", type: "SOAP Note", chiefComplaint: "Routine checkup", date: "2024-04-02", status: "Completed" },
  { id: 4, patient: "Alfie Solomons", type: "Follow-up", chiefComplaint: "Post-surgery check", date: "2024-04-01", status: "Completed" },
  { id: 5, patient: "Michael Chen", type: "SOAP Note", chiefComplaint: "Hypertension follow-up", date: "2024-03-30", status: "Completed" },
  { id: 6, patient: "Sarah Jenkins", type: "Annual Physical", chiefComplaint: "General wellness", date: "2024-03-29", status: "Completed" },
  { id: 7, patient: "Emily Rodriguez", type: "Consultation", chiefComplaint: "Migraine management", date: "2024-03-28", status: "Needs Review" },
];

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = initialNotes.filter(note =>
    note.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Medical Notes</h1>
        <p className="text-zinc-500 dark:text-zinc-400">View and manage all generated clinical documentation.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search notes by patient or complaint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Calendar className="w-4 h-4" /> Date Range
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Filter className="w-4 h-4" /> All Types
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.map((note) => (
          <div key={note.id} className="glass dark:glass-dark rounded-2xl p-6 shadow-sm shadow-zinc-900/5 dark:shadow-black/20 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                note.status === 'Completed' 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
              }`}>
                {note.status === 'Completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                {note.status}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{note.patient}</h3>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">{note.type}</p>
            
            <div className="space-y-2 mb-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center">
                <span className="w-4 h-4 mr-2 text-zinc-400"><FileText className="w-full h-full" /></span>
                {note.chiefComplaint}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center">
                <span className="w-4 h-4 mr-2 text-zinc-400"><Calendar className="w-full h-full" /></span>
                {note.date}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                View Note
              </button>
              <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="py-32 text-center">
          <FileText className="w-16 h-16 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
          <h3 className="text-zinc-900 dark:text-white font-medium text-xl">No notes found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">No records match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
