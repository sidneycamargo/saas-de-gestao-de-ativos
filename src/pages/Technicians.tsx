import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, UserCog, Mail, Phone, Wrench } from 'lucide-react'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import useCompanyStore from '@/stores/useCompanyStore'
import { supabase } from '@/lib/supabase/client'

export default function Technicians() {
  const { activeCompanyId } = useCompanyStore()
  const [technicians, setTechnicians] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Interno',
    specialty: '',
    status: 'Ativo',
  })

  const fetchTechnicians = async () => {
    if (!activeCompanyId) return
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('company_id', activeCompanyId)
      .order('name')
    if (!error && data) {
      setTechnicians(data)
    }
  }

  useEffect(() => {
    fetchTechnicians()
  }, [activeCompanyId])

  const handleOpenDialog = (tech?: any) => {
    if (tech) {
      setEditingId(tech.id)
      setFormData({
        name: tech.name,
        email: tech.email || '',
        phone: tech.phone || '',
        type: tech.type || 'Interno',
        specialty: tech.specialty || '',
        status: tech.status || 'Ativo',
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'Interno',
        specialty: '',
        status: 'Ativo',
      })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name) {
      return toast({
        title: 'Atenção',
        description: 'O nome é obrigatório',
        variant: 'destructive',
      })
    }

    const payload = {
      company_id: activeCompanyId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      specialty: formData.specialty,
      status: formData.status,
    }

    if (editingId) {
      const { error } = await supabase.from('technicians').update(payload).eq('id', editingId)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Técnico atualizado com sucesso!' })
        setDialogOpen(false)
        fetchTechnicians()
      }
    } else {
      const { error } = await supabase.from('technicians').insert([payload])
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Técnico cadastrado com sucesso!' })
        setDialogOpen(false)
        fetchTechnicians()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este técnico?')) {
      const { error } = await supabase.from('technicians').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Técnico removido!' })
        fetchTechnicians()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Equipe e Técnicos</h2>
          <p className="text-muted-foreground">
            Gerencie técnicos, analistas e prestadores de serviço.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Técnico
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Técnicos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.length > 0 ? (
                technicians.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserCog className="w-4 h-4 text-muted-foreground" />
                        {t.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-muted-foreground">
                        {t.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {t.email}
                          </span>
                        )}
                        {t.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {t.phone}
                          </span>
                        )}
                        {!t.email && !t.phone && '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {t.specialty ? (
                        <div className="flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-muted-foreground" />
                          {t.specialty}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          t.type === 'Interno'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }
                      >
                        {t.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.status === 'Ativo' ? 'default' : 'secondary'}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(t)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(t.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum técnico cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Técnico' : 'Novo Técnico'}</DialogTitle>
            <DialogDescription>
              Preencha as informações do profissional para associá-lo aos eventos.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome Completo *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joao@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone / WhatsApp</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Especialidade / Cargo</Label>
              <Input
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="Ex: Eletricista, Suporte TI, etc..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Profissional</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interno">Equipe Interna</SelectItem>
                    <SelectItem value="Externo">Prestador Externo</SelectItem>
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
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingId ? 'Salvar Alterações' : 'Cadastrar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
