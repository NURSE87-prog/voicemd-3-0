import Link from "next/link";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass dark:glass-dark border-b border-zinc-200/20 dark:border-zinc-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-outfit font-black text-xl tracking-tighter text-slate-900 dark:text-white">
                VoiceMD
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-4 py-2 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
