import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-screen w-full bg-white dark:bg-[#020617] overflow-hidden">
      {/* Fixed sidebar area */}
      <div className="w-64 flex-shrink-0 h-full border-r border-slate-100 dark:border-slate-800">
        <Sidebar aria-label="Main Navigation" />
      </div>
      
      {/* Scrollable main content area */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-50/30 dark:bg-[#020617] relative">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
