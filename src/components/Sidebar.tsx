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
    <div className="flex h-full w-64 flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-xl text-white group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-outfit font-black text-xl tracking-tighter text-zinc-900 dark:text-white">
            VoiceMD
          </span>
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        <div className="mb-8">
          <Link 
            href="/dashboard/record"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-sm shadow-blue-600/20"
          >
            <Mic className="w-5 h-5" /> Start Recording
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-zinc-700 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-300'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
            {userProfile.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{userProfile.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{userProfile.specialty}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all w-full text-left"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
          Sign out
        </button>
      </div>
    </div>
  );
}
