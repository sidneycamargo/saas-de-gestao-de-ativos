import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const mockWarranties = [
  {
    id: 1,
    type: 'Equipamento',
    item: 'Torno CNC Romi',
    provider: 'Fabricante Oficial',
    start: '2022-05-10',
    end: '2027-05-10',
    progress: 80,
    status: 'Ativa',
  },
  {
    id: 2,
    type: 'Peça',
    item: 'Motor Elétrico M2 (Torno CNC)',
    provider: 'Fornecedor A',
    start: '2025-01-01',
    end: '2026-01-01',
    progress: 20,
    status: 'Ativa',
  },
  {
    id: 3,
    type: 'Equipamento',
    item: 'Empilhadeira Yale',
    provider: 'Revenda B',
    start: '2020-10-10',
    end: '2023-10-10',
    progress: 100,
    status: 'Expirada',
  },
]

export default function Warranties() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Garantias</h2>
        <p className="text-muted-foreground">
          Acompanhamento de prazos de garantia para equipamentos e peças substituídas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockWarranties.map((w) => (
          <Card
            key={w.id}
            className={w.status === 'Expirada' ? 'border-danger/50 bg-danger/5' : ''}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant={w.type === 'Equipamento' ? 'default' : 'secondary'}>{w.type}</Badge>
                {w.status === 'Expirada' ? (
                  <AlertTriangle className="h-5 w-5 text-danger" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-success" />
                )}
              </div>
              <CardTitle className="text-lg mt-2">{w.item}</CardTitle>
              <CardDescription>{w.provider}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Início: {new Date(w.start).toLocaleDateString('pt-BR')}
                  </span>
                  <span
                    className={
                      w.status === 'Expirada'
                        ? 'text-danger font-medium'
                        : 'text-foreground font-medium'
                    }
                  >
                    Vence: {new Date(w.end).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <Progress
                  value={w.progress}
                  className={`h-2 ${w.status === 'Expirada' ? '[&>div]:bg-danger' : '[&>div]:bg-success'}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
