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
import { Progress } from '@/components/ui/progress'
import { parts } from '@/lib/mock-data'

export function PartsTab() {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <Input placeholder="Filtrar peças..." className="max-w-sm" />
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Nova Peça
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificador</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Preço Unit.</TableHead>
              <TableHead className="w-[200px]">Estoque</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map((item) => {
              const stockPercentage = Math.min((item.stock / item.minStock) * 100, 100)
              const isLowStock = item.stock < item.minStock
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={stockPercentage}
                        className={`h-2 ${isLowStock ? '[&>div]:bg-danger' : '[&>div]:bg-success'}`}
                      />
                      <span
                        className={`text-xs font-medium w-12 text-right ${isLowStock ? 'text-danger' : ''}`}
                      >
                        {item.stock} / {item.minStock}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
