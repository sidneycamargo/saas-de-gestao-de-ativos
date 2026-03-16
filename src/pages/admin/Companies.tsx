import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, Building } from 'lucide-react'
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

export default function AdminCompanies() {
  const { profile } = useAuth()
  const [companies, setCompanies] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    legal_identifier: '',
    contact_email: '',
    configuration: '{}',
  })

  const fetchAll = async () => {
    const { data } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setCompanies(data)
  }

  useEffect(() => {
    if (profile?.is_super_admin) fetchAll()
  }, [profile])

  if (!profile?.is_super_admin) return <Navigate to="/" />

  const openDialog = (comp?: any) => {
    if (comp) {
      setEditingId(comp.id)
      setFormData({
        name: comp.name,
        legal_identifier: comp.legal_identifier || '',
        contact_email: comp.contact_email || '',
        configuration: JSON.stringify(comp.configuration || {}, null, 2),
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', legal_identifier: '', contact_email: '', configuration: '{\n  \n}' })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    try {
      let configJson = {}
      try {
        if (formData.configuration.trim()) {
          configJson = JSON.parse(formData.configuration)
        }
      } catch (e) {
        throw new Error('Configuração deve ser um JSON válido')
      }

      if (editingId) {
        await supabase
          .from('companies')
          .update({
            name: formData.name,
            legal_identifier: formData.legal_identifier,
            contact_email: formData.contact_email,
            configuration: configJson,
          })
          .eq('id', editingId)
        toast({ title: 'Empresa atualizada' })
      } else {
        const { data: comp, error } = await supabase
          .from('companies')
          .insert({
            name: formData.name,
            legal_identifier: formData.legal_identifier,
            contact_email: formData.contact_email,
            configuration: configJson,
          })
          .select()
          .single()

        if (error) throw error

        if (comp) {
          await supabase.from('subscriptions').insert({ company_id: comp.id, status: 'Trial' })
        }
        toast({ title: 'Empresa criada com sucesso' })
      }
      setIsOpen(false)
      fetchAll()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir empresa? Esta ação é irreversível e excluirá as assinaturas associadas.'))
      return
    await supabase.from('companies').delete().eq('id', id)
    fetchAll()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <Building className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
              Empresas
            </h2>
            <p className="text-muted-foreground">Gestão global de contas SaaS.</p>
          </div>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Nova Empresa
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Identificador Legal</TableHead>
                <TableHead>Email de Contato</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.legal_identifier || '-'}</TableCell>
                  <TableCell>{c.contact_email || '-'}</TableCell>
                  <TableCell>{new Date(c.created_at).toLocaleDateString('pt-BR')}</TableCell>
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
      </Card>

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
              <Label>Configuração (JSON)</Label>
              <Textarea
                value={formData.configuration}
                onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                className="font-mono text-sm h-32"
              />
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
