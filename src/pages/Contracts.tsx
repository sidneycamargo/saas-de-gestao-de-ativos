import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCompanyStore from '@/stores/useCompanyStore'
import { contracts as initialContracts, suppliers } from '@/lib/mock-data'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export default function Contracts() {
  const { activeCompanyId } = useCompanyStore()
  const [contracts, setContracts] = useState(initialContracts)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    supplierId: '',
    registrationDate: '',
    startDate: '',
    endDate: '',
    renewalWithin: false,
    renewalAfter: false,
  })

  const filteredContracts = contracts.filter((c) => c.companyId === activeCompanyId)
  const activeSuppliers = suppliers.filter((s) => s.companyId === activeCompanyId)

  const openDialog = (con?: any) => {
    if (con) {
      setEditingId(con.id)
      setFormData(con)
    } else {
      setEditingId(null)
      setFormData({
        supplierId: '',
        registrationDate: new Date().toISOString().split('T')[0],
        startDate: '',
        endDate: '',
        renewalWithin: false,
        renewalAfter: false,
      })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (editingId) {
      setContracts(contracts.map((c) => (c.id === editingId ? { ...c, ...formData } : c)))
      toast({ title: 'Contrato atualizado' })
    } else {
      setContracts([
        ...contracts,
        { ...formData, id: `con-${Date.now()}`, companyId: activeCompanyId },
      ])
      toast({ title: 'Contrato cadastrado' })
    }
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    setContracts(contracts.filter((c) => c.id !== id))
    toast({ title: 'Contrato removido', variant: 'destructive' })
  }

  const getSupplierName = (id: string) =>
    activeSuppliers.find((s) => s.id === id)?.name || 'Desconhecido'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contratos</h2>
          <p className="text-muted-foreground">Gestão de contratos com empresas terceirizadas.</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Contrato
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Renovação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{getSupplierName(c.supplierId)}</TableCell>
                  <TableCell>
                    {new Date(c.registrationDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </TableCell>
                  <TableCell>
                    {new Date(c.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} até{' '}
                    {new Date(c.endDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </TableCell>
                  <TableCell className="space-y-1">
                    {c.renewalWithin && (
                      <Badge variant="outline" className="text-xs mr-1">
                        Dentro do período
                      </Badge>
                    )}
                    {c.renewalAfter && (
                      <Badge variant="outline" className="text-xs">
                        Após período
                      </Badge>
                    )}
                    {!c.renewalWithin && !c.renewalAfter && (
                      <span className="text-muted-foreground text-xs">Sem renovação</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(c)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(c.id)}
                      className="text-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredContracts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum contrato cadastrado nesta unidade.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Contrato' : 'Novo Contrato'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(v) => setFormData({ ...formData, supplierId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {activeSuppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Data de Registro</Label>
                <Input
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3 mt-2 border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ren-in"
                  checked={formData.renewalWithin}
                  onCheckedChange={(c) => setFormData({ ...formData, renewalWithin: !!c })}
                />
                <Label htmlFor="ren-in">
                  Possibilidade de renovação dentro do período inicial e final
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ren-out"
                  checked={formData.renewalAfter}
                  onCheckedChange={(c) => setFormData({ ...formData, renewalAfter: !!c })}
                />
                <Label htmlFor="ren-out">Possibilidade de renovação após o período final</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
