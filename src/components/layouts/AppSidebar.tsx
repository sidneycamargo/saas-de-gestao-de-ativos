import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShieldCheck,
  History,
  Settings,
  LogOut,
  Box,
  Building2,
  ChevronDown,
  FileText,
  Truck,
  Building,
  CreditCard,
  Users,
  Tag,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useCompanyStore from '@/stores/useCompanyStore'
import { useAuth } from '@/hooks/use-auth'

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Ativos', url: '/assets', icon: Box },
  { title: 'Marcas', url: '/brands', icon: Tag },
  { title: 'Inventário', url: '/inventory', icon: Package },
  { title: 'Manutenção', url: '/maintenance', icon: Wrench },
  { title: 'Fornecedores', url: '/suppliers', icon: Truck },
  { title: 'Contratos', url: '/contracts', icon: FileText },
  { title: 'Garantias', url: '/warranties', icon: ShieldCheck },
  { title: 'Histórico', url: '/history', icon: History },
  { title: 'Configurações', url: '/settings', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const { profile, signOut } = useAuth()
  const { activeCompany, companies, setActiveCompanyId } = useCompanyStore()
  const { setOpenMobile, isMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-between w-full p-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors">
              <div className="flex items-center gap-2 font-bold text-sm text-primary-foreground">
                <Building2 className="w-5 h-5 text-accent" />
                <span className="truncate max-w-[150px]">
                  {activeCompany?.name || 'Selecione uma empresa'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            {companies.map((c) => (
              <DropdownMenuItem key={c.id} onClick={() => setActiveCompanyId(c.id)}>
                {c.name}
              </DropdownMenuItem>
            ))}
            {companies.length === 0 && (
              <DropdownMenuItem disabled>Nenhuma empresa</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith(item.url)}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <Link to={item.url} onClick={handleLinkClick}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {profile?.is_super_admin && (
                <>
                  <SidebarMenuItem className="mt-4 border-t border-sidebar-border pt-4">
                    <SidebarGroupLabel className="px-2 py-2 font-semibold text-amber-600 dark:text-amber-500">
                      Administração Global
                    </SidebarGroupLabel>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith('/admin/companies')}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      <Link to="/admin/companies" onClick={handleLinkClick}>
                        <Building className="w-5 h-5 text-amber-500" />
                        <span className="font-semibold text-amber-600 dark:text-amber-500">
                          Empresas
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith('/admin/subscriptions')}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      <Link to="/admin/subscriptions" onClick={handleLinkClick}>
                        <CreditCard className="w-5 h-5 text-amber-500" />
                        <span className="font-semibold text-amber-600 dark:text-amber-500">
                          Assinaturas
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith('/admin/users')}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      <Link to="/admin/users" onClick={handleLinkClick}>
                        <Users className="w-5 h-5 text-amber-500" />
                        <span className="font-semibold text-amber-600 dark:text-amber-500">
                          Usuários Globais
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-muted-foreground hover:text-primary-foreground cursor-pointer"
              onClick={() => {
                handleLinkClick()
                signOut()
              }}
            >
              <div>
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
