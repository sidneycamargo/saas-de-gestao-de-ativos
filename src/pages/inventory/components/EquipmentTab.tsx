import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/StatusBadge'
import { equipment } from '@/lib/mock-data'

export function EquipmentTab() {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <Input placeholder="Filtrar equipamentos..." className="max-w-sm" />
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Novo Equipamento
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificador</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Número de Série</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Garantia</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.serial}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.warranty}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
