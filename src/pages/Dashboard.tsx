import { Package, Wrench, ShieldAlert, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { kpis, recentActivity, stockData } from '@/lib/mock-data'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts'
import { useMemo } from 'react'

export default function Dashboard() {
  const chartConfig = {
    atual: { label: 'Estoque Atual', color: 'hsl(var(--primary))' },
    minimo: { label: 'Estoque Mínimo', color: 'hsl(var(--danger))' },
  }

  const processedStockData = useMemo(
    () =>
      stockData.map((item) => ({
        ...item,
        fill: item.atual < item.minimo ? 'hsl(var(--destructive))' : 'hsl(var(--success))',
      })),
    [],
  )

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
            <div className="text-2xl font-bold">{kpis.totalEquipment}</div>
            <p className="text-xs text-muted-foreground">+4 adicionados este mês</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-right" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenções Pendentes</CardTitle>
            <Wrench className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.pendingMaintenance}</div>
            <p className="text-xs text-muted-foreground">3 para esta semana</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-right" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peças em Baixa</CardTitle>
            <Package className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.lowStockParts}</div>
            <p className="text-xs text-muted-foreground">Requer reposição urgente</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-right" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garantias Ativas</CardTitle>
            <ShieldAlert className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activeWarranties}</div>
            <p className="text-xs text-muted-foreground">2 expiram em 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Níveis de Estoque Críticos</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
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
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
