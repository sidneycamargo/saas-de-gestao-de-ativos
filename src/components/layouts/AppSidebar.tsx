import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShieldCheck,
  History,
  Settings,
  LogOut,
  Hexagon,
  Box,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Inventário', url: '/inventory', icon: Package },
  { title: 'Produtos', url: '/products/new', icon: Box },
  { title: 'Manutenção', url: '/maintenance', icon: Wrench },
  { title: 'Garantias', url: '/warranties', icon: ShieldCheck },
  { title: 'Histórico', url: '/history', icon: History },
  { title: 'Configurações', url: '/settings', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 font-bold text-lg text-primary-foreground">
          <Hexagon className="w-6 h-6 text-accent" />
          <span>AssetPro SaaS</span>
        </div>
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
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-muted-foreground hover:text-primary-foreground"
            >
              <Link to="/">
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
