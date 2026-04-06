"use client";

import { useState } from "react";
import { User, Bell, Shield, Laptop, Globe, Save, ChevronRight, Stethoscope } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Dr. John Doe");
  const [specialty, setSpecialty] = useState("Cardiology");
  const [email, setEmail] = useState("admin@medinote.local");

  return (
    <div className="p-8 max-w-4xl mx-auto w-full animate-fade-in relative z-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage your account and medical practice preferences.</p>
      </header>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="glass dark:glass-dark rounded-2xl p-8 shadow-sm shadow-zinc-900/5 dark:shadow-black/20">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold border-4 border-white dark:border-zinc-900 shadow-xl">
              JD
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{name}</h3>
              <p className="text-zinc-500 dark:text-zinc-400">{specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Medical Specialty</label>
              <select 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              >
                <option>Cardiology</option>
                <option>General Practice</option>
                <option>Pediatrics</option>
                <option>Neurology</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </section>

        {/* Categories */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-sm hover:border-blue-500/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">Notifications</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage alerts and emails.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-sm hover:border-blue-500/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">Security</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Password and privacy.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-sm hover:border-blue-500/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">Appearance</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Theme and interface settings.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-sm hover:border-blue-500/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">EHR Integration</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Sync with Epic or Cerner.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
