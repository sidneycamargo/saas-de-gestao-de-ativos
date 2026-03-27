import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useCompanyStore from '@/stores/useCompanyStore'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

export default function Suppliers() {
  const { activeCompanyId } = useCompanyStore()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    whatsapp: '',
  })

  const fetchSuppliers = async () => {
    if (!activeCompanyId) return
    const { data } = await supabase
      .from('suppliers')
      .select('*')
      .eq('company_id', activeCompanyId)
      .order('name')
    if (data) setSuppliers(data)
  }

  useEffect(() => {
    fetchSuppliers()
  }, [activeCompanyId])

  const openDialog = (sup?: any) => {
    if (sup) {
      setEditingId(sup.id)
      setFormData({
        name: sup.name,
        contact_name: sup.contact_name || '',
        email: sup.email || '',
        phone: sup.phone || '',
        whatsapp: sup.whatsapp || '',
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', contact_name: '', email: '', phone: '', whatsapp: '' })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name) return
    if (editingId) {
      const { error } = await supabase.from('suppliers').update(formData).eq('id', editingId)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Fornecedor atualizado' })
        setIsOpen(false)
        fetchSuppliers()
      }
    } else {
      const { error } = await supabase
        .from('suppliers')
        .insert({ ...formData, company_id: activeCompanyId })
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Fornecedor cadastrado' })
        setIsOpen(false)
        fetchSuppliers()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este fornecedor?')) {
      const { error } = await supabase.from('suppliers').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Fornecedor removido' })
        fetchSuppliers()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fornecedores</h2>
          <p className="text-muted-foreground">
            Gestão de empresas terceirizadas e prestadores de serviço.
          </p>
        </div>
        <Button onClick={() => openDialog()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Novo Fornecedor
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone / WhatsApp</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.contact_name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>
                    {s.phone} <br />
                    <span className="text-xs text-muted-foreground">WA: {s.whatsapp}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(s)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(s.id)}
                      className="text-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum fornecedor cadastrado nesta unidade.
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
            <DialogTitle>{editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Empresa</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nome do Contato</Label>
              <Input
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
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
