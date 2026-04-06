"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Users, 
  FileText, 
  Activity, 
  ShieldCheck, 
  UserCheck,
  TrendingUp,
  Server
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
    try {
      const { count: patientCount } = await supabase.from('patients').select('*', { count: 'exact', head: true });
      const { count: noteCount } = await supabase.from('clinical_notes').select('*', { count: 'exact', head: true });
      
      const { data: activeDoctors } = await supabase.from('clinical_notes').select('doctor_id');
      const uniqueDoctors = new Set(activeDoctors?.map(d => d.doctor_id)).size;

      setStats({
        doctors: uniqueDoctors || 0,
        patients: patientCount || 0,
        notes: noteCount || 0,
      });

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'pulse 2s infinite' }}>
          <ShieldCheck size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1152px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.5s ease' }}>
      
      <header style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'var(--accent-soft)', padding: '0.4rem', borderRadius: '8px', color: 'var(--accent)' }}>
            <ShieldCheck size={20} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>Admin Panel</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          System Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Global data and usage statistics across all doctors.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--accent-soft)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent)' }}>
              <UserCheck size={22} />
            </div>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
              <TrendingUp size={12} style={{ marginRight: '0.25rem' }} /> Active
            </span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>{stats.doctors}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clinicians</p>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.6rem', borderRadius: '12px', color: '#0284c7' }}>
              <Users size={22} />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>{stats.patients}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Patients</p>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.6rem', borderRadius: '12px', color: '#9333ea' }}>
              <FileText size={22} />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>{stats.notes}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes Generated</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Recent Global Activity */}
        <div style={{ gridColumn: 'span 2', background: 'var(--bg-card)', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Global Transactions Log</h2>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <li key={idx} style={{ padding: '1.25rem 0', borderBottom: idx !== recentActivity.length - 1 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Activity size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {activity.patients?.first_name} {activity.patients?.last_name}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {activity.chief_complaint || "Clinical Note"}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '999px', background: activity.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: activity.status === 'Completed' ? '#059669' : '#d97706' }}>
                      {activity.status}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-color)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic' }}>No recent activity detected on the platform.</p>
              </div>
            )}
          </ul>
        </div>

        {/* System Health / Policies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>System Health</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              All systems operational. Services running at optimal capacity.
            </p>
            
            <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Server size={20} color="var(--accent)" />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', marginBottom: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '6px', height: '6px', background: '#059669', borderRadius: '50%', display: 'inline-block' }} /> Live Connection
                </p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Supabase Auth Active</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.05)', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#d97706', marginBottom: '0.5rem' }}>Security Policy</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Ensure "Admin Bypass" is enabled in Supabase SQL Editor to globally ignore standard Row Level Security for this view.
            </p>
            <button style={{ width: '100%', background: '#d97706', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
