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
  Mic,
  ShieldCheck
} from "lucide-react";
import { supabase } from "@/lib/supabase";

import { useState, useEffect } from "react";

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Platform Notes', href: '/dashboard/notes', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState({ name: "Doctor", specialty: "Medical Scribe", initials: "DR" });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email === "lhaj.7.10.2020@gmail.com") {
          setIsAdmin(true);
        }
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'var(--bg-card)', borderRight: '1px solid var(--border-subtle)', position: 'relative', zIndex: 100 }}>
      {/* Logo Section */}
      <div style={{ display: 'flex', height: '80px', alignItems: 'center', padding: '0 2rem', flexShrink: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--text-primary)', color: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={18} />
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            VoiceMD
          </span>
        </Link>
      </div>
      
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto', padding: '1rem 1rem 0' }}>
        {/* Primary Action: Start Recording */}
        <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <Link 
            href="/dashboard/record"
            style={{ 
              display: 'flex', 
              width: '100%', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem', 
              padding: '0.875rem', 
              borderRadius: '12px', 
              background: 'var(--text-primary)', 
              color: 'var(--bg-card)', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              boxShadow: 'var(--shadow-md)', 
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Mic size={18} /> 
            Start Recording
          </Link>
        </div>

        {/* Navigation Blocks */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem 0.5rem' }}>Menu</p>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '12px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-soft)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.background = 'var(--accent-soft)'; }}
                  onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <item.icon size={18} style={{ opacity: isActive ? 1 : 0.6 }} />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          {isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--record-btn)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '1rem 0 1rem 0.5rem' }}>Administration</p>
              <Link
                href="/dashboard/admin"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: pathname === '/dashboard/admin' ? 'var(--record-btn)' : 'var(--text-secondary)',
                  background: pathname === '/dashboard/admin' ? 'rgba(196, 92, 74, 0.08)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { if(pathname !== '/dashboard/admin') e.currentTarget.style.background = 'rgba(196, 92, 74, 0.04)'; }}
                onMouseLeave={(e) => { if(pathname !== '/dashboard/admin') e.currentTarget.style.background = 'transparent'; }}
              >
                <ShieldCheck size={18} style={{ opacity: pathname === '/dashboard/admin' ? 1 : 0.6 }} />
                Admin & Users
              </Link>
            </div>
          )}
        </nav>
      </div>
      
      {/* Footer Area: User Profile & Logout */}
      <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', border: '1px solid var(--border-subtle)' }}>
            {userProfile.initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userProfile.name}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userProfile.specialty}</p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          style={{ 
            display: 'flex', 
            width: '100%', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem', 
            borderRadius: '12px', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            color: 'var(--text-secondary)', 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(196, 92, 74, 0.08)'; e.currentTarget.style.color = 'var(--record-btn)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}
