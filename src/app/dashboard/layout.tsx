import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100%', background: 'var(--bg-color)', overflow: 'hidden' }}>
      {/* Fixed sidebar area */}
      <aside style={{ width: '260px', minWidth: '260px', height: '100%', borderRight: '1px solid var(--border-subtle)', position: 'relative', zIndex: 50, background: 'var(--bg-card)' }}>
        <Sidebar aria-label="Main Navigation" />
      </aside>
      
      {/* Scrollable main content area */}
      <main className="flex-1 h-full overflow-y-auto bg-[#fbfaf9] dark:bg-[#0f0e0d] relative">
        <div className="max-w-[1400px] mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
