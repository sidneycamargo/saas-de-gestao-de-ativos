import {
  Package,
  Wrench,
  ShieldAlert,
  Activity,
  Building,
  CreditCard,
  Users,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { kpis, recentActivity, stockData, equipment, maintenances, parts } from '@/lib/mock-data'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts'
import { useMemo, useState, useEffect } from 'react'
import useCompanyStore from '@/stores/useCompanyStore'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DashboardMaintenance {
  id: string
  description: string | null
  date: string | null
  forecast_date: string | null
  status: string | null
  type: string | null
  assets: any
}

export default function Dashboard() {
  const { activeCompanyId } = useCompanyStore()
  const { profile } = useAuth()

  const kpisStats = useMemo(() => {
    const totalEq = equipment.filter((e) => e.companyId === activeCompanyId).length
    const pMaint = maintenances.filter(
      (m) =>
        m.companyId === activeCompanyId && (m.status === 'Pendente' || m.status === 'Em Andamento'),
    ).length
    const lParts = parts.filter(
      (p) => p.companyId === activeCompanyId && p.stock < p.minStock,
    ).length

    return {
      totalEquipment: totalEq || kpis.totalEquipment,
      pendingMaintenance: pMaint || kpis.pendingMaintenance,
      lowStockParts: lParts || kpis.lowStockParts,
      activeWarranties: kpis.activeWarranties,
    }
  }, [activeCompanyId])

  const filteredActivity = useMemo(
    () => recentActivity.filter((a) => a.companyId === activeCompanyId),
    [activeCompanyId],
  )

  const [upcomingMaintenances, setUpcomingMaintenances] = useState<DashboardMaintenance[]>([])

  useEffect(() => {
    if (!activeCompanyId) return

    async function loadMaintenances() {
      const { data } = await supabase
        .from('maintenances')
        .select(`
          id,
          description,
          date,
          forecast_date,
          status,
          type,
          assets ( name )
        `)
        .eq('company_id', activeCompanyId)
        .order('date', { ascending: false, nullsFirst: false })
        .limit(10)

      if (data) {
        setUpcomingMaintenances(data)
      }
    }

    loadMaintenances()
  }, [activeCompanyId])

  const chartConfig = {
    atual: { label: 'Estoque Atual', color: 'hsl(var(--primary))' },
    minimo: { label: 'Estoque Mínimo', color: 'hsl(var(--danger))' },
  }

  const processedStockData = useMemo(() => {
    return stockData
      .filter((s) => s.companyId === activeCompanyId)
      .map((item) => ({
        ...item,
        fill: item.atual < item.minimo ? 'hsl(var(--destructive))' : 'hsl(var(--success))',
      }))
  }, [activeCompanyId])

  if (profile?.is_super_admin) {
    return <SuperAdminOverview />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do sistema e alertas recentes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-slide-right" style={{ animationDelay: '0ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipamentos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpisStats.totalEquipment}</div>
            <p className="text-xs text-muted-foreground">Ativos registrados na unidade</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-right" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenções Pendentes</CardTitle>
            <Wrench className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpisStats.pendingMaintenance}</div>
            <p className="text-xs text-muted-foreground">Ordens e chamados em aberto</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-right" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peças em Baixa</CardTitle>
            <Package className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpisStats.lowStockParts}</div>
            <p className="text-xs text-muted-foreground">Requer reposição urgente</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-right" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garantias Ativas</CardTitle>
            <ShieldAlert className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpisStats.activeWarranties}</div>
            <p className="text-xs text-muted-foreground">Equipamentos cobertos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Níveis de Estoque Críticos</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            {processedStockData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={processedStockData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Bar dataKey="atual" radius={4}>
                    {processedStockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                Sem dados de estoque críticos.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {filteredActivity.length > 0 ? (
                filteredActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.user}{' '}
                        <span className="font-normal text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.target}</p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma atividade recente registrada.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agenda de Manutenções e Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMaintenances.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingMaintenances.map((m) => {
                  const assetName = Array.isArray(m.assets) ? m.assets[0]?.name : m.assets?.name
                  const eventDate = m.date || m.forecast_date

                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center whitespace-nowrap text-sm">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {eventDate
                            ? format(parseISO(eventDate), 'dd/MM/yyyy', { locale: ptBR })
                            : 'Não definida'}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {assetName || 'Múltiplos/Não definido'}
                      </TableCell>
                      <TableCell
                        className="max-w-[250px] truncate"
                        title={m.description || 'Manutenção'}
                      >
                        {m.description || 'Manutenção'}
                      </TableCell>
                      <TableCell>{m.type || '-'}</TableCell>
                      <TableCell>
                        {(() => {
                          switch (m.status) {
                            case 'Concluído':
                              return (
                                <Badge className="bg-success hover:bg-success/80 text-white border-transparent">
                                  {m.status}
                                </Badge>
                              )
                            case 'Em Andamento':
                              return (
                                <Badge className="bg-warning hover:bg-warning/80 text-white border-transparent">
                                  {m.status}
                                </Badge>
                              )
                            case 'Atrasado':
                              return <Badge variant="destructive">{m.status}</Badge>
                            case 'Pendente':
                            case 'Agendado':
                              return <Badge variant="secondary">{m.status}</Badge>
                            default:
                              return <Badge variant="outline">{m.status || 'N/A'}</Badge>
                          }
                        })()}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Nenhuma manutenção ou evento registrado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SuperAdminOverview() {
  const [stats, setStats] = useState({ companies: 0, activeSubs: 0, totalUsers: 0 })

  useEffect(() => {
    async function load() {
      const { count: cCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
      const { count: sCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active')
      const { count: uCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      setStats({ companies: cCount || 0, activeSubs: sCount || 0, totalUsers: uCount || 0 })
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
          Visão Global do Sistema
        </h2>
        <p className="text-muted-foreground">Resumo administrativo da plataforma SaaS.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="animate-slide-right" style={{ animationDelay: '0ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Cadastradas</CardTitle>
            <Building className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companies}</div>
          </CardContent>
        </Card>
        <Card className="animate-slide-right" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubs}</div>
          </CardContent>
        </Card>
        <Card className="animate-slide-right" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
