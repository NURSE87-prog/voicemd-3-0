"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Mic
} from "lucide-react";
import { supabase } from "@/lib/supabase";

import { useState, useEffect } from "react";

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/dashboard/patients', icon: Users },
  { name: 'All Notes', href: '/dashboard/notes', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState({ name: "Doctor", specialty: "Medical Scribe", initials: "DR" });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const firstName = user.user_metadata?.first_name || "";
        const lastName = user.user_metadata?.last_name || "";
        const specialty = user.user_metadata?.specialty || "Physician";
        const fullName = firstName && lastName ? `Dr. ${firstName} ${lastName}` : firstName || user.email?.split('@')[0] || "Doctor";
        
        setUserProfile({
          name: fullName,
          specialty: specialty,
          initials: (firstName[0] || "") + (lastName[0] || "D")
        });
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-full w-64 flex-col" style={{ background: 'var(--bg-color)', borderRight: '1px solid var(--border-subtle)' }}>
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div style={{ background: 'var(--accent-soft)', padding: '0.4rem', borderRadius: '10px', color: 'var(--accent)', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}>
            <Activity className="w-5 h-5" />
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', fontWeight: 600 }}>
            VoiceMD
          </span>
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <div className="mb-8">
          <Link 
            href="/dashboard/record"
            className="premium-btn w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all shadow-md"
            style={{ background: 'var(--text-primary)', color: 'var(--bg-color)', fontSize: '0.95rem' }}
          >
            <Mic className="w-4 h-4" /> Start Recording
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5">
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1rem 0.5rem' }}>Menu</p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
                style={{ 
                  background: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent'
                }}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? 'var(--accent)' : 'inherit', opacity: isActive ? 1 : 0.6 }} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4" style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            {userProfile.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{userProfile.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{userProfile.specialty}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all w-full text-left"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}
