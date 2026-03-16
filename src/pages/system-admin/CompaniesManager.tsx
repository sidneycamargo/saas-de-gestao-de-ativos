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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import useCompanyStore from '@/stores/useCompanyStore'

export default function CompaniesManager() {
  const { refreshCompanies } = useCompanyStore()
  const [companies, setCompanies] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    legal_identifier: '',
    contact_email: '',
    status: 'Active',
  })

  const fetchAll = async () => {
    const { data } = await supabase
      .from('companies')
      .select('*, subscriptions(*)')
      .order('created_at', { ascending: false })
    if (data) setCompanies(data)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const openDialog = (comp?: any) => {
    if (comp) {
      setEditingId(comp.id)
      setFormData({
        name: comp.name,
        legal_identifier: comp.legal_identifier || '',
        contact_email: comp.contact_email || '',
        status: comp.subscriptions?.[0]?.status || 'Active',
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', legal_identifier: '', contact_email: '', status: 'Active' })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        await supabase
          .from('companies')
          .update({
            name: formData.name,
            legal_identifier: formData.legal_identifier,
            contact_email: formData.contact_email,
          })
          .eq('id', editingId)

        await supabase
          .from('subscriptions')
          .update({ status: formData.status })
          .eq('company_id', editingId)
        toast({ title: 'Empresa atualizada' })
      } else {
        const { data: comp } = await supabase
          .from('companies')
          .insert({
            name: formData.name,
            legal_identifier: formData.legal_identifier,
            contact_email: formData.contact_email,
          })
          .select()
          .single()

        if (comp) {
          await supabase
            .from('subscriptions')
            .insert({ company_id: comp.id, status: formData.status })
        }
        toast({ title: 'Empresa criada' })
      }
      setIsOpen(false)
      fetchAll()
      refreshCompanies()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir empresa? Esta ação é irreversível.')) return
    await supabase.from('companies').delete().eq('id', id)
    fetchAll()
    refreshCompanies()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Empresas da Plataforma</CardTitle>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Nova Empresa
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Identificador Legal</TableHead>
              <TableHead>Email de Contato</TableHead>
              <TableHead>Assinatura</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((c) => {
              const status = c.subscriptions?.[0]?.status || 'N/A'
              const badgeVariant =
                status === 'Active'
                  ? 'default'
                  : status === 'Suspended'
                    ? 'destructive'
                    : 'secondary'
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.legal_identifier || '-'}</TableCell>
                  <TableCell>{c.contact_email || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant}>{status}</Badge>
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
              )
            })}
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhuma empresa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Empresa</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome Fantasia"
              />
            </div>
            <div className="space-y-2">
              <Label>Documento Legal (CNPJ)</Label>
              <Input
                value={formData.legal_identifier}
                onChange={(e) => setFormData({ ...formData, legal_identifier: e.target.value })}
                placeholder="Ex: 00.000.000/0001-00"
              />
            </div>
            <div className="space-y-2">
              <Label>Email de Contato</Label>
              <Input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="contato@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Status da Assinatura</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                  <SelectItem value="Pending Payment">Pending Payment</SelectItem>
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
    </Card>
  )
}
