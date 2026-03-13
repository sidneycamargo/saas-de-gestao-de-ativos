import { Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { auditLogs } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

export default function History() {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-success hover:bg-success/80'
      case 'UPDATE':
        return 'bg-warning text-warning-foreground hover:bg-warning/80'
      case 'DELETE':
        return 'bg-danger hover:bg-danger/80'
      default:
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Histórico e Auditoria</h2>
        <p className="text-muted-foreground">
          Registro cronológico de todas as ações realizadas na plataforma.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Timeline de Eventos
          </CardTitle>
          <CardDescription>Visualizando os últimos 50 registros.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-card shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-sm">{log.user}</div>
                    <time className="text-xs text-muted-foreground">{log.timestamp}</time>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                    <span>{log.entity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
