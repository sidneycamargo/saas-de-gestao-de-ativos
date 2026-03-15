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
import { parts, systemLocators } from '@/lib/mock-data'
import useCompanyStore from '@/stores/useCompanyStore'

export function PartsTab() {
  const { activeCompanyId } = useCompanyStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredParts = parts.filter((item) => {
    if (item.companyId !== activeCompanyId) return false

    const search = searchTerm.toLowerCase()
    return (
      item.name.toLowerCase().includes(search) ||
      item.sku?.toLowerCase().includes(search) ||
      item.id.toLowerCase().includes(search)
    )
  })

  const getLocationName = (locatorId: string) => {
    return systemLocators.find((loc) => loc.id === locatorId)?.name || 'Não atribuído'
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Buscar por nome, SKU ou ID..."
          className="w-full sm:max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>SKU / Ref</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead className="w-[200px]">Quantidade (Estoque)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParts.length > 0 ? (
              filteredParts.map((item) => {
                const stockPercentage = Math.min((item.stock / item.minStock) * 100, 100)
                const isLowStock = item.stock < item.minStock
                return (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {item.name}
                      <div className="text-xs text-muted-foreground font-normal">{item.id}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.sku || '-'}</TableCell>
                    <TableCell>{getLocationName(item.locatorId)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={stockPercentage}
                          className={`h-2 ${isLowStock ? '[&>div]:bg-danger' : '[&>div]:bg-success'}`}
                        />
                        <span
                          className={`text-xs font-medium w-16 text-right ${isLowStock ? 'text-danger' : ''}`}
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
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  Nenhuma peça encontrada nesta unidade.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
