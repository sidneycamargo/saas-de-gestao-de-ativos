import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export function UsersTab() {
  const { activeCompanyId } = useCompanyStore()
  const [memberships, setMemberships] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    groupId: '',
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const { data: grps } = await supabase
      .from('groups')
      .select('*')
      .eq('company_id', activeCompanyId)
    if (grps) setGroups(grps)

    const { data: mems } = await supabase
      .from('company_memberships')
      .select('*, groups(name)')
      .eq('company_id', activeCompanyId)
    if (mems && mems.length > 0) {
      const userIds = mems.map((m) => m.user_id)
      const { data: profs } = await supabase.from('profiles').select('*').in('id', userIds)

      const merged = mems.map((m) => ({
        ...m,
        profile: profs?.find((p) => p.id === m.user_id),
      }))
      setMemberships(merged)
    } else {
      setMemberships([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const openDialog = (mem?: any) => {
    if (mem) {
      setEditingId(mem.id)
      setFormData({
        email: mem.profile?.email || '',
        groupId: mem.group_id || '',
      })
    } else {
      setEditingId(null)
      setFormData({ email: '', groupId: groups[0]?.id || '' })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!formData.email) return

    if (editingId) {
      const { error } = await supabase
        .from('company_memberships')
        .update({ group_id: formData.groupId || null })
        .eq('id', editingId)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Acesso atualizado' })
        setIsOpen(false)
        fetchData()
      }
    } else {
      // Find user by email
      const { data: prof, error: errProf } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', formData.email)
        .single()
      if (!prof) {
        toast({
          title: 'Usuário não encontrado',
          description:
            'O usuário precisa ter um cadastro no sistema antes de ser vinculado à empresa.',
          variant: 'destructive',
        })
        return
      }

      const { error } = await supabase.from('company_memberships').insert({
        company_id: activeCompanyId,
        user_id: prof.id,
        role: 'Member',
        group_id: formData.groupId || null,
      })
      if (error)
        toast({ title: 'Erro ao vincular', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Usuário vinculado', description: 'O acesso foi concedido com sucesso.' })
        setIsOpen(false)
        fetchData()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja remover o acesso deste usuário à sua empresa?')) {
      const { error } = await supabase.from('company_memberships').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Acesso removido' })
        fetchData()
      }
    }
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Controle de acesso e papéis vinculados aos usuários da sua empresa.
          </CardDescription>
        </div>
        <Button onClick={() => openDialog()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Vincular Usuário
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>2FA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((m: any) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.profile?.name}</TableCell>
                <TableCell>{m.profile?.email}</TableCell>
                <TableCell>{m.profile?.phone || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{m.groups?.name || 'Padrão'}</Badge>
                </TableCell>
                <TableCell>
                  {m.profile?.two_factor_enabled ? (
                    <ShieldCheck className="w-4 h-4 text-success" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      m.profile?.status === 'Ativo'
                        ? 'bg-success hover:bg-success/80'
                        : 'bg-secondary'
                    }
                  >
                    {m.profile?.status || 'Ativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(m)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(m.id)}
                    className="text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {memberships.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Nenhum usuário vinculado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Alterar Acesso' : 'Vincular Usuário'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Altere o grupo de acesso do usuário selecionado.'
                : 'Informe o e-mail de um usuário já cadastrado no sistema para dar acesso à sua empresa.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                disabled={!!editingId}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Grupo de Acesso</Label>
              <Select
                value={formData.groupId}
                onValueChange={(v) => setFormData({ ...formData, groupId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sem Grupo Específico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem Grupo Específico</SelectItem>
                  {groups.map((g: any) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.email}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
