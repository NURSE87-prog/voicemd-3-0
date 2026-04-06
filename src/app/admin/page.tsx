"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Users, 
  FileText, 
  Activity, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  UserCheck,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

const ADMIN_EMAIL = "lhaj.7.10.2020@gmail.com";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    notes: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/dashboard");
        return;
      }
      setIsAdmin(true);
      fetchStats();
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const fetchStats = async () => {
    // Note: These will only work if you have applied the admin policies in Supabase
    try {
      const { count: patientCount } = await supabase.from('patients').select('*', { count: 'exact', head: true });
      const { count: noteCount } = await supabase.from('clinical_notes').select('*', { count: 'exact', head: true });
      
      // For total doctors, we ideally fetch from auth.users (requires service role)
      // As a fallback, we fetch unique doctor_ids from notes
      const { data: activeDoctors } = await supabase.from('clinical_notes').select('doctor_id');
      const uniqueDoctors = new Set(activeDoctors?.map(d => d.doctor_id)).size;

      setStats({
        doctors: uniqueDoctors || 0,
        patients: patientCount || 0,
        notes: noteCount || 0,
      });

      // Fetch latest 10 notes
      const { data: latestNotes } = await supabase
        .from('clinical_notes')
        .select(`
          id,
          created_at,
          chief_complaint,
          status,
          patients (first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentActivity(latestNotes || []);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f2ed] dark:bg-[#141210]">
        <div className="animate-pulse flex flex-col items-center">
          <ShieldCheck className="w-12 h-12 text-[#8b7355] mb-4" />
          <p className="text-[#6b6560] font-medium">Verifying Administrator Access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#f5f2ed] dark:bg-[#141210] p-6 md:p-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#8b7355]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#8b7355]">Admin Control Panel</span>
            </div>
            <h1 className="text-4xl font-bold font-serif text-[#1a1816] dark:text-[#f0ede8]">VoiceMD Performance</h1>
            <p className="text-[#6b6560] dark:text-[#a8a29e] mt-2">SaaS overview and usage analytics</p>
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-[#6b6560] hover:text-[#1a1816] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Doctor View
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Doctors */}
          <div className="bg-white dark:bg-[#1e1c1a] p-8 rounded-3xl shadow-xl shadow-black/5 border border-white/50 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b7355]/5 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#8b7355]/10 p-3 rounded-2xl text-[#8b7355]">
                <UserCheck className="w-7 h-7" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> Active
              </span>
            </div>
            <div className="text-5xl font-serif font-bold text-[#1a1816] dark:text-[#f0ede8] mb-1">{stats.doctors}</div>
            <p className="text-[#6b6560] dark:text-[#a8a29e] text-sm font-semibold uppercase tracking-wider">Total Clinicians</p>
          </div>

          {/* Total Patients */}
          <div className="bg-white dark:bg-[#1e1c1a] p-8 rounded-3xl shadow-xl shadow-black/5 border border-white/50 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c45c4a]/5 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#c45c4a]/10 p-3 rounded-2xl text-[#c45c4a]">
                <Users className="w-7 h-7" />
              </div>
            </div>
            <div className="text-5xl font-serif font-bold text-[#1a1816] dark:text-[#f0ede8] mb-1">{stats.patients}</div>
            <p className="text-[#6b6560] dark:text-[#a8a29e] text-sm font-semibold uppercase tracking-wider">Total Patients</p>
          </div>

          {/* Total Clinical Notes */}
          <div className="bg-white dark:bg-[#1e1c1a] p-8 rounded-3xl shadow-xl shadow-black/5 border border-white/50 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b7355]/5 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#8b7355]/10 p-3 rounded-2xl text-[#8b7355]">
                <FileText className="w-7 h-7" />
              </div>
            </div>
            <div className="text-5xl font-serif font-bold text-[#1a1816] dark:text-[#f0ede8] mb-1">{stats.notes}</div>
            <p className="text-[#6b6560] dark:text-[#a8a29e] text-sm font-semibold uppercase tracking-wider">Clinical Notes Generated</p>
          </div>
        </div>

        {/* Recent Global Activity */}
        <div className="bg-white dark:bg-[#1e1c1a] rounded-[40px] shadow-2xl shadow-black/5 border border-white flex flex-col md:flex-row overflow-hidden">
          <div className="p-8 md:p-12 w-full md:w-2/3 border-r border-[#f5f2ed] dark:border-[#2d2a28]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-[#1a1816] dark:text-[#f0ede8]">Recent Global Transactions</h2>
              <button className="text-sm font-bold text-[#8b7355] flex items-center hover:opacity-80">
                Full Log <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="space-y-6">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-black/20 p-4 rounded-2xl transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f5f2ed] dark:bg-[#141210] flex items-center justify-center text-[#8b7355]">
                        <Activity className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1816] dark:text-[#f0ede8]">
                          {activity.patients?.first_name} {activity.patients?.last_name} 
                          <span className="font-normal text-[#6b6560] dark:text-[#a8a29e]"> - Clinical Note</span>
                        </p>
                        <p className="text-sm text-[#9c9690] mt-0.5">{activity.chief_complaint || "Routine checkup"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#6b6560] dark:text-[#a8a29e] mb-1">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                        activity.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-[#f5f2ed]/50 dark:bg-[#141210]/50 rounded-3xl border-2 border-dashed border-[#e5e2dd] dark:border-[#2d2a28]">
                  <p className="text-[#6b6560] dark:text-[#a8a29e] font-serif italic text-lg">No recent activity detected on the platform.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12 w-full md:w-1/3 bg-[#f5f2ed]/30 dark:bg-black/10 flex flex-col justify-center gap-8">
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-[#1a1816] dark:text-[#f0ede8]">System Health</h3>
              <p className="text-sm text-[#6b6560] dark:text-[#a8a29e]">All systems operational. Transcription speeds at optimal levels.</p>
            </div>
            
            <div className="p-6 bg-white dark:bg-[#1e1c1a] rounded-3xl shadow-sm border border-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#6b6560] dark:text-[#a8a29e]">Live Connection</span>
              </div>
              <p className="text-sm font-semibold text-[#1a1816] dark:text-[#f0ede8]">Supabase Realtime Sync Active</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b7355]">Admin Instructions</h3>
              <p className="text-xs leading-relaxed text-[#6b6560] dark:text-[#a8a29e]">
                To see data for ALL users here, ensure you have enabled the "Admin Bypass" policy in your Supabase SQL Editor.
              </p>
              <button className="text-[10px] font-bold bg-[#8b7355] text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                COPY SQL POLICY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
