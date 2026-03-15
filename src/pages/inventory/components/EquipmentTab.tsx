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
import { equipment, systemLocators } from '@/lib/mock-data'
import useCompanyStore from '@/stores/useCompanyStore'

export function EquipmentTab() {
  const { activeCompanyId } = useCompanyStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEquipment = equipment.filter((item) => {
    if (item.companyId !== activeCompanyId) return false

    const search = searchTerm.toLowerCase()
    return (
      item.name.toLowerCase().includes(search) ||
      item.patrimony?.toLowerCase().includes(search) ||
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
          placeholder="Buscar por nome, patrimônio ou ID..."
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
              <TableHead>Patrimônio</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {item.name}
                    <div className="text-xs text-muted-foreground font-normal">{item.id}</div>
                  </TableCell>
                  <TableCell>{item.patrimony || '-'}</TableCell>
                  <TableCell>{getLocationName(item.locatorId)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
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
