import { redirect } from 'next/navigation';
import Sidebar from '@/app/ui/dashboard/sidebar';
import StatusBar from '@/app/ui/dashboard/status-bar';
import RealtimeRefresh from '@/app/ui/dashboard/realtime-refresh';
import { getServerSession } from '@/app/lib/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/notauthorized');
  }

  return (
    <div className="dashboard-readable flex h-screen bg-gray-100 overflow-hidden">
      <RealtimeRefresh />

      {/* Fixed sidebar */}
      <Sidebar />

      {/* Right side: topbar + scrollable content + statusbar */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Fixed bottom status bar */}
        <StatusBar />
      </div>
    </div>
  );
}
