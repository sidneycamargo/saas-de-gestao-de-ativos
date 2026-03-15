import { useState } from 'react'
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
  const [searchTerm, setSearchTerm] = useState('')

  const filteredParts = parts.filter((item) => {
    const search = searchTerm.toLowerCase()
    return item.name.toLowerCase().includes(search) || item.sku?.toLowerCase().includes(search)
  })

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Buscar por nome ou SKU..."
          className="w-full sm:max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            {filteredParts.length > 0 ? (
              filteredParts.map((item) => {
                const stockPercentage = Math.min((item.stock / item.minStock) * 100, 100)
                const isLowStock = item.stock < item.minStock
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku || '-'}</TableCell>
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
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  Nenhuma peça encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
