"use client";

import { useState } from "react";
import { Search, Plus, User, MoreHorizontal, Filter } from "lucide-react";

const initialPatients = [
  { id: 1, name: "Sarah Jenkins", dob: "1988-06-12", gender: "Female", lastVisit: "Today", appointments: 12 },
  { id: 2, name: "Michael Chen", dob: "1975-04-20", gender: "Male", lastVisit: "Today", appointments: 8 },
  { id: 3, name: "Emily Rodriguez", dob: "1992-11-05", gender: "Female", lastVisit: "Yesterday", appointments: 15 },
  { id: 4, name: "Arthur Shelby", dob: "1960-03-30", gender: "Male", lastVisit: "2 days ago", appointments: 45 },
  { id: 5, name: "Thomas Shelby", dob: "1958-05-15", gender: "Male", lastVisit: "2 days ago", appointments: 32 },
  { id: 6, name: "Grace Burgess", dob: "1965-02-14", gender: "Female", lastVisit: "3 days ago", appointments: 10 },
  { id: 7, name: "Alfie Solomons", dob: "1955-09-09", gender: "Male", lastVisit: "Last week", appointments: 25 },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = initialPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Patients</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage and view your patient records.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-medium transition-all active:scale-95 shadow-lg shadow-blue-500/25">
          <Plus className="w-5 h-5" /> Add Patient
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="glass dark:glass-dark rounded-2xl overflow-hidden shadow-sm shadow-zinc-900/5 dark:shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">Patient Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">DOB</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">Gender</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">Last Visit</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white text-right">Appts</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-white">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{patient.dob}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{patient.gender}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{patient.lastVisit}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400 text-right">{patient.appointments}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className="py-20 text-center">
              <User className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
              <h3 className="text-zinc-900 dark:text-white font-medium">No patients found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
