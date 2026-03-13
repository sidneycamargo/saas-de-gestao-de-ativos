import { Plus, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/StatusBadge'
import { maintenances } from '@/lib/mock-data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

export default function Maintenance() {
  const handleSave = () => {
    toast({
      title: 'Ordem criada',
      description: 'A nova ordem de manutenção foi agendada com sucesso.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manutenção</h2>
          <p className="text-muted-foreground">Agendamento e histórico de ordens de serviço.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Nova OS
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Ordem de Serviço</DialogTitle>
              <DialogDescription>Crie uma nova ordem preventiva ou corretiva.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="equip">Equipamento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eq1">Torno CNC Romi</SelectItem>
                    <SelectItem value="eq2">Empilhadeira Yale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prev">Preventiva</SelectItem>
                    <SelectItem value="corr">Corretiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data Programada</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="date" id="date" className="pl-9" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSave}>
                Salvar Ordem
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximas Manutenções</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OS</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenances.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.id}</TableCell>
                  <TableCell>{m.equip}</TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell>{new Date(m.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{m.technician}</TableCell>
                  <TableCell>
                    <StatusBadge status={m.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
