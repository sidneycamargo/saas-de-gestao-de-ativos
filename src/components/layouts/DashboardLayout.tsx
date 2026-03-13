import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
