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
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in relative">
      {/* Background glow for the dashboard */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-outfit">Good morning, {userName}</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Here's an overview of your schedule and recent notes.</p>
        </div>
        <Link 
          href="/dashboard/patients"
          className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-zinc-900/20 dark:shadow-white/10"
        >
          <Plus className="w-5 h-5" /> New Patient
        </Link>
      </header>

      {/* Hero Quick Action */}
      <div className="mb-10 relative z-10 group">
        <Link 
          href="/dashboard/record"
          className="relative overflow-hidden flex flex-col md:flex-row items-center gap-6 p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-1 active:scale-[0.98]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <Mic className="w-10 h-10" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-1">Start New AI Recording</h2>
            <p className="text-blue-100 text-sm md:text-base opacity-90 max-w-md">
              Tap here to start the ambient AI scribe for your next patient visit. Accurate notes in seconds.
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto bg-white text-blue-600 px-6 py-2.5 rounded-full font-bold shadow-lg">
            Start Scribing
          </div>
        </Link>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        <div className="glass dark:glass-dark rounded-2xl p-6 shadow-sm shadow-zinc-900/5 dark:shadow-black/20">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">124</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Total Patients</p>
        </div>

        <div className="glass dark:glass-dark rounded-2xl p-6 shadow-sm shadow-zinc-900/5 dark:shadow-black/20">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">42</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Notes this week</p>
        </div>

        <div className="glass dark:glass-dark rounded-2xl p-6 shadow-sm shadow-zinc-900/5 dark:shadow-black/20">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl text-purple-600 dark:text-purple-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
              -4 hours
            </span>
          </div>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">11.5h</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Time saved charting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Recent Notes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Notes</h2>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="glass dark:glass-dark rounded-2xl overflow-hidden shadow-sm shadow-zinc-900/5 dark:shadow-black/20">
            <ul className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              {recentNotes.map((note) => (
                <li key={note.id} className="p-4 sm:px-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 gap-4">
                      <div className="hidden sm:flex h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                          {note.patientName} <span className="font-normal text-zinc-500 dark:text-zinc-400">({note.type})</span>
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                          <Stethoscope className="w-3.5 h-3.5" /> {note.chiefComplaint}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-4">
                      <p className="text-sm text-zinc-900 dark:text-white whitespace-nowrap">{note.date}</p>
                      <p className="flex items-center text-xs mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                          note.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        }`}>
                          {note.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions / Today */}
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Today's Schedule</h2>
          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-sm shadow-zinc-900/5 dark:shadow-black/20">
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-blue-500">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-zinc-950" />
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">09:00 AM</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Sarah Jenkins</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Annual Physical</p>
              </div>
              <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-950" />
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">10:30 AM</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Michael Chen</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Hypertension follow-up</p>
              </div>
              <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 border-transparent">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-950" />
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">11:15 AM</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Emily Rodriguez</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Migraine consultation</p>
              </div>
              
              <button className="w-full mt-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
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
