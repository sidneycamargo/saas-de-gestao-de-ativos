import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export function LocatorsTab() {
  const { activeCompanyId } = useCompanyStore()
  const [locators, setLocators] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  const fetchLocators = async () => {
    if (!activeCompanyId) return
    const { data } = await supabase
      .from('locators')
      .select('*')
      .eq('company_id', activeCompanyId)
      .order('name')
    if (data) setLocators(data)
  }

  useEffect(() => {
    fetchLocators()
  }, [activeCompanyId])

  const openDialog = (locator?: any) => {
    if (locator) {
      setEditingId(locator.id)
      setFormData({ name: locator.name, description: locator.description || '' })
    } else {
      setEditingId(null)
      setFormData({ name: '', description: '' })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Aviso', description: 'O nome é obrigatório.', variant: 'destructive' })
      return
    }

    if (editingId) {
      const { error } = await supabase
        .from('locators')
        .update({
          name: formData.name,
          description: formData.description,
        })
        .eq('id', editingId)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Localizador atualizado', description: 'As alterações foram salvas.' })
        setIsOpen(false)
        fetchLocators()
      }
    } else {
      const { error } = await supabase.from('locators').insert({
        company_id: activeCompanyId,
        name: formData.name,
        description: formData.description,
      })
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Localizador criado', description: 'O novo localizador foi adicionado.' })
        setIsOpen(false)
        fetchLocators()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza? Esta ação removerá o vínculo deste local dos ativos associados.')) {
      const { error } = await supabase.from('locators').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Localizador removido' })
        fetchLocators()
      }
    }
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Localizadores</CardTitle>
          <CardDescription>
            Gerencie as posições físicas (prateleiras, corredores, salas) para vincular aos ativos.
          </CardDescription>
        </div>
        <Button onClick={() => openDialog()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Novo Localizador
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locators.map((l: any) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell className="text-muted-foreground">{l.description || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(l)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(l.id)}
                    className="text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {locators.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  Nenhum localizador cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Localizador' : 'Novo Localizador'}</DialogTitle>
            <DialogDescription>
              Identifique uma localização física para rastreio de estoque e equipamentos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Localizador</Label>
              <Input
                placeholder="Ex: Prateleira A1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                placeholder="Ex: Corredor 1, Setor de Ferramentas"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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
    </Card>
  )
}
