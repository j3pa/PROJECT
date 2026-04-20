import Sidebar   from '@/app/ui/dashboard/sidebar'
import StatusBar from '@/app/ui/dashboard/status-bar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
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
  )
}