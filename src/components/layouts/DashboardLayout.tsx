import { Outlet, Navigate } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useAuth } from '@/hooks/use-auth'
import useCompanyStore from '@/stores/useCompanyStore'
import { AlertTriangle, Loader2 } from 'lucide-react'

export default function DashboardLayout() {
  const { session, profile, loading: authLoading } = useAuth()
  const { activeCompany, loading: companyLoading } = useCompanyStore()

  if (authLoading || companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) return <Navigate to="/" />

  const subStatus = activeCompany?.subscriptions?.[0]?.status || 'Active'
  const isSuspended =
    (subStatus === 'Suspended' || subStatus === 'Inactive') && !profile?.is_super_admin

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6 animate-fade-in relative">
            {isSuspended ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>
                <div className="text-center max-w-md">
                  <h2 className="text-2xl font-bold">Acesso Suspenso</h2>
                  <p className="text-muted-foreground mt-2">
                    A assinatura desta empresa encontra-se inativa ou suspensa. Por favor, entre em
                    contato com o administrador do sistema para regularizar o acesso.
                  </p>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
