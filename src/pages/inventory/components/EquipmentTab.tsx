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
import { StatusBadge } from '@/components/StatusBadge'
import { equipment } from '@/lib/mock-data'
import useCompanyStore from '@/stores/useCompanyStore'

export function EquipmentTab() {
  const { activeCompanyId } = useCompanyStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEquipment = equipment.filter((item) => {
    if (item.companyId !== activeCompanyId) return false

    const search = searchTerm.toLowerCase()
    return (
      item.name.toLowerCase().includes(search) ||
      item.sku?.toLowerCase().includes(search) ||
      item.patrimony?.toLowerCase().includes(search) ||
      item.serial.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    )
  })

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Buscar por nome, SKU, patrimônio, série..."
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
              <TableHead>Patrimônio</TableHead>
              <TableHead>Número de Série</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.sku || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{item.patrimony || '-'}</TableCell>
                  <TableCell>{item.serial}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  Nenhum equipamento encontrado nesta unidade.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
