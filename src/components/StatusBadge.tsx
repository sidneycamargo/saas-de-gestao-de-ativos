import { Badge } from '@/components/ui/badge'

interface Props {
  status: string
}

export function StatusBadge({ status }: Props) {
  switch (status.toLowerCase()) {
    case 'operacional':
    case 'concluído':
      return <Badge className="bg-success hover:bg-success/80">{status}</Badge>
    case 'em manutenção':
    case 'pendente':
    case 'em andamento':
      return (
        <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">{status}</Badge>
      )
    case 'inativo':
    case 'expirada':
      return <Badge className="bg-danger hover:bg-danger/80">{status}</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}
