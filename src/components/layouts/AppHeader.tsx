import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export function AppHeader() {
  const { profile, session, signOut } = useAuth()
  const { activeCompanyId } = useCompanyStore()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    if (profile?.is_super_admin) {
      setRole('Super Administrador')
      return
    }

    if (!activeCompanyId || !session?.user?.id) {
      setRole(null)
      return
    }

    const fetchRole = async () => {
      const { data } = await supabase
        .from('company_memberships')
        .select('role')
        .eq('company_id', activeCompanyId)
        .eq('user_id', session.user.id)
        .single()

      if (data) {
        setRole(data.role === 'Admin' ? 'Administrador' : 'Membro')
      } else {
        setRole('Usuário')
      }
    }

    fetchRole()
  }, [activeCompanyId, session?.user?.id, profile?.is_super_admin])

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-card">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ativos, manutenções..."
            className="w-full pl-9 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={`https://img.usecurling.com/ppl/thumbnail?seed=${profile?.id || '42'}`}
                  alt={profile?.name || 'Avatar'}
                />
                <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.name || 'Usuário'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                </div>
                {role && (
                  <div className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md w-fit mt-1">
                    {role}
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={signOut}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
