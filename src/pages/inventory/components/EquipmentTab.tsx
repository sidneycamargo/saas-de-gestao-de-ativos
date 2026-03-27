import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/StatusBadge'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export function EquipmentTab() {
  const { activeCompanyId } = useCompanyStore()
  const [equipment, setEquipment] = useState<any[]>([])
  const [locators, setLocators] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', patrimony: '', locator_id: '', status: '' })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [eqRes, locsRes] = await Promise.all([
      supabase
        .from('assets')
        .select('*, locators(name)')
        .eq('company_id', activeCompanyId)
        .eq('type', 'equipment')
        .order('created_at', { ascending: false }),
      supabase.from('locators').select('*').eq('company_id', activeCompanyId).order('name'),
    ])
    if (eqRes.data) setEquipment(eqRes.data)
    if (locsRes.data) setLocators(locsRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const filteredEquipment = equipment.filter((item) => {
    const search = searchTerm.toLowerCase()
    return (
      item.name.toLowerCase().includes(search) || item.patrimony?.toLowerCase().includes(search)
    )
  })

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      patrimony: item.patrimony || '',
      locator_id: item.locator_id || '',
      status: item.status || 'Operacional',
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este equipamento?')) {
      const { error } = await supabase.from('assets').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Equipamento removido' })
        fetchData()
      }
    }
  }

  const handleSave = async () => {
    if (!formData.name) return
    const { error } = await supabase
      .from('assets')
      .update({
        name: formData.name,
        patrimony: formData.patrimony,
        locator_id: formData.locator_id || null,
        status: formData.status,
      })
      .eq('id', editingId)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Atualizado' })
      setIsOpen(false)
      fetchData()
    }
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Buscar por nome ou patrimônio..."
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
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.patrimony || '-'}</TableCell>
                  <TableCell>{item.locators?.name || '-'}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status || 'Operacional'} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  Nenhum equipamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Equipamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Patrimônio</Label>
              <Input
                value={formData.patrimony}
                onChange={(e) => setFormData({ ...formData, patrimony: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Localização</Label>
              <Select
                value={formData.locator_id}
                onValueChange={(v) => setFormData({ ...formData, locator_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem Local</SelectItem>
                  {locators.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operacional">Operacional</SelectItem>
                  <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.name}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
