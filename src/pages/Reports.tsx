import { useState, useEffect, useMemo } from 'react'
import { BarChart3, AlertTriangle, PackageSearch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'
import { Badge } from '@/components/ui/badge'

export default function Reports() {
  const { activeCompanyId } = useCompanyStore()
  const [loading, setLoading] = useState(true)
  const [problems, setProblems] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      if (!activeCompanyId) return
      setLoading(true)

      const { data } = await supabase
        .from('maintenance_assets')
        .select(`
          problem_description,
          created_at,
          assets!inner (
            name,
            categories ( name )
          ),
          maintenances!inner (
            company_id
          )
        `)
        .eq('maintenances.company_id', activeCompanyId)
        .not('problem_description', 'is', null)
        .neq('problem_description', '')

      setProblems(data || [])
      setLoading(false)
    }
    loadData()
  }, [activeCompanyId])

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {}
    problems.forEach((p) => {
      const catName = p.assets?.categories?.name || 'Sem Categoria'
      counts[catName] = (counts[catName] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [problems])

  const chartConfig = {
    value: { label: 'Ocorrências', color: 'hsl(var(--primary))' },
  }

  const processedData = categoryStats.map((item, i) => ({
    ...item,
    fill: `hsl(var(--primary) / ${1 - i * 0.15 > 0.3 ? 1 - i * 0.15 : 0.3})`,
  }))

  const recentProblems = useMemo(() => {
    return [...problems]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
  }, [problems])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">Carregando relatórios...</div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatório de Falhas Recorrentes</h2>
        <p className="text-muted-foreground">
          Análise de problemas registrados em manutenções por categoria de ativo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="animate-slide-up" style={{ animationDelay: '0ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{problems.length}</div>
            <p className="text-xs text-muted-foreground">Registradas nos eventos</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categoria mais Crítica</CardTitle>
            <BarChart3 className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate" title={categoryStats[0]?.name || '-'}>
              {categoryStats[0]?.name || '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {categoryStats[0]?.value || 0} falhas registradas
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias Afetadas</CardTitle>
            <PackageSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats.length}</div>
            <p className="text-xs text-muted-foreground">Tipos de equipamentos com falha</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle>Ocorrências por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            {processedData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <BarChart data={processedData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {processedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                Dados insuficientes para o gráfico.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Falhas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentProblems.length > 0 ? (
                recentProblems.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-warning shrink-0" />
                    <div className="space-y-1 overflow-hidden">
                      <p
                        className="text-sm font-medium leading-none truncate"
                        title={p.assets?.name}
                      >
                        {p.assets?.name || 'Ativo Desconhecido'}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Badge variant="secondary" className="text-[10px]">
                          {p.assets?.categories?.name || 'Sem Categoria'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p
                        className="text-xs text-slate-600 line-clamp-2 mt-1"
                        title={p.problem_description}
                      >
                        {p.problem_description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma falha recente encontrada.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
