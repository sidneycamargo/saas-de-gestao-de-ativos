import { Package, Wrench, ShieldAlert, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { kpis, recentActivity, stockData, equipment, maintenances, parts } from '@/lib/mock-data'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts'
import { useMemo } from 'react'
import useCompanyStore from '@/stores/useCompanyStore'

export default function Dashboard() {
  const { activeCompanyId } = useCompanyStore()

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
    </div>
  )
}
