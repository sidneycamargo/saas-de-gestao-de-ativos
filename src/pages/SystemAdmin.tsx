import { Navigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CompaniesManager from './system-admin/CompaniesManager'
import UsersManager from './system-admin/UsersManager'
import { useAuth } from '@/hooks/use-auth'

export default function SystemAdmin() {
  const { profile } = useAuth()

  if (!profile?.is_super_admin) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <Shield className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
            Super Admin
          </h2>
          <p className="text-muted-foreground">Gestão global da plataforma SAAS.</p>
        </div>
      </div>
      <Tabs defaultValue="companies" className="w-full">
        <TabsList>
          <TabsTrigger value="companies">Empresas & Assinaturas</TabsTrigger>
          <TabsTrigger value="users">Associações de Usuários</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="companies">
            <CompaniesManager />
          </TabsContent>
          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
