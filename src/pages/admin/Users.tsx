import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Shield, Trash2, Users, Plus, Pencil } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useAuth } from '@/hooks/use-auth'

export default function AdminUsers() {
  const { profile } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  const [users, setUsers] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [managedCompanies, setManagedCompanies] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])

  const [accessUser, setAccessUser] = useState<any>(null)
  const [memberships, setMemberships] = useState<any[]>([])

  const [formCompany, setFormCompany] = useState('')
  const [formRole, setFormRole] = useState('Member')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    is_super_admin: false,
    group_id: 'none',
    company_id: '',
    role: 'Member',
  })

  useEffect(() => {
    if (profile) {
      checkAccessAndFetch()
    }
  }, [profile])

  const checkAccessAndFetch = async () => {
    if (profile?.is_super_admin) {
      setHasAccess(true)
      await fetchAll(true, [])
      return
    }
    const { data } = await supabase
      .from('company_memberships')
      .select('company_id')
      .eq('user_id', profile!.id)
      .eq('role', 'Admin')

    if (data && data.length > 0) {
      setHasAccess(true)
      await fetchAll(
        false,
        data.map((d) => d.company_id),
      )
    } else {
      setHasAccess(false)
    }
  }

  const fetchAll = async (isSuperAdmin: boolean, adminCompanyIds: string[]) => {
    const { data: comps } = await supabase.from('companies').select('id, name').order('name')
    if (comps) {
      setCompanies(comps)
      const mComps = isSuperAdmin ? comps : comps.filter((c) => adminCompanyIds.includes(c.id))
      setManagedCompanies(mComps)
    }

    if (isSuperAdmin) {
      const { data: grps } = await supabase.from('groups').select('id, name').order('name')
      if (grps) setGroups(grps)
    }

    const { data: profs } = await supabase
      .from('profiles')
      .select('*, groups(name), company_memberships(id, company_id, role, companies(name))')
      .order('name')

    if (profs) {
      setUsers(profs)
    }
  }

  if (hasAccess === false) return <Navigate to="/" />
  if (hasAccess === null)
    return <div className="p-8 text-center text-muted-foreground">Carregando...</div>

  const fetchMemberships = async (userId: string) => {
    const { data } = await supabase
      .from('company_memberships')
      .select('*, companies(name)')
      .eq('user_id', userId)
    if (data) setMemberships(data)
  }

  const openManage = (u: any) => {
    setAccessUser(u)
    fetchMemberships(u.id)
    setFormCompany('')
    setFormRole('Member')
  }

  const handleAddAccess = async () => {
    if (!formCompany) return
    try {
      const { error } = await supabase.from('company_memberships').insert({
        user_id: accessUser.id,
        company_id: formCompany,
        role: formRole,
      })
      if (error) throw error
      toast({ title: 'Acesso concedido' })
      fetchMemberships(accessUser.id)
      checkAccessAndFetch()
      setFormCompany('')
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleRemoveAccess = async (m: any) => {
    if (!profile?.is_super_admin && !managedCompanies.find((mc) => mc.id === m.company_id)) {
      toast({
        title: 'Acesso negado',
        description: 'Você não administra esta empresa.',
        variant: 'destructive',
      })
      return
    }
    try {
      await supabase.from('company_memberships').delete().eq('id', m.id)
      toast({ title: 'Acesso removido' })
      fetchMemberships(accessUser.id)
      checkAccessAndFetch()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const canManageUser = (u: any) => {
    if (profile?.is_super_admin) return true
    return u.company_memberships?.some((m: any) =>
      managedCompanies.some((mc) => mc.id === m.company_id),
    )
  }

  const openCreate = () => {
    setSelectedUser(null)
    setIsCreating(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      is_super_admin: false,
      group_id: 'none',
      company_id: managedCompanies[0]?.id || '',
      role: 'Member',
    })
    setIsModalOpen(true)
  }

  const openEdit = (u: any) => {
    setSelectedUser(u)
    setIsCreating(false)
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      password: '',
      is_super_admin: u.is_super_admin,
      group_id: u.group_id || 'none',
      company_id: '',
      role: 'Member',
    })
    setIsModalOpen(true)
  }

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email || (isCreating && !formData.password)) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const payloadData = {
        ...formData,
        group_id: formData.group_id === 'none' ? null : formData.group_id,
      }

      const payload = isCreating
        ? {
            action: 'CREATE',
            payload: payloadData,
          }
        : {
            action: 'UPDATE',
            payload: { id: selectedUser.id, ...payloadData },
          }

      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: payload,
      })

      if (error) throw error
      if (data.error) throw new Error(data.error)

      toast({ title: isCreating ? 'Usuário criado' : 'Usuário atualizado' })
      setIsModalOpen(false)
      checkAccessAndFetch()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário definitivamente?')) return
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'DELETE', payload: { id } },
      })
      if (error) throw error
      if (data.error) throw new Error(data.error)

      toast({ title: 'Usuário excluído' })
      checkAccessAndFetch()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <Users className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
              Gestão de Usuários
            </h2>
            <p className="text-muted-foreground">
              {profile?.is_super_admin
                ? 'Acesso global a todos os usuários do sistema.'
                : 'Gerencie os usuários das empresas que você administra.'}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {profile?.is_super_admin && (
            <Button variant="outline" asChild>
              <Link to="/admin/roles">
                <Shield className="w-4 h-4 mr-2" /> Gerenciar Papéis Globais
              </Link>
            </Button>
          )}
          <Button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Empresas</TableHead>
                  {profile?.is_super_admin && <TableHead>Papel Global</TableHead>}
                  <TableHead>Admin</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const canManage = canManageUser(u)
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {u.company_memberships?.map((m: any) => (
                            <Badge key={m.id} variant="outline" className="text-xs flex gap-1">
                              {m.companies?.name} ({m.role})
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      {profile?.is_super_admin && (
                        <TableCell>
                          {u.groups?.name ? (
                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                              {u.groups.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        {u.is_super_admin ? (
                          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                            Sim
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Não</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {canManage && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(u)}
                              title="Editar"
                              className="h-8 w-8"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openManage(u)}
                              title="Acessos"
                              className="h-8 w-8"
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(u.id)}
                              title="Excluir"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={profile?.is_super_admin ? 6 : 5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Novo Usuário' : 'Editar Usuário'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{isCreating ? 'Senha *' : 'Nova Senha (deixe em branco para manter)'}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {isCreating && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Empresa Inicial *</Label>
                  <Select
                    value={formData.company_id}
                    onValueChange={(v) => setFormData({ ...formData, company_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {managedCompanies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nível de Acesso</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => setFormData({ ...formData, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {profile?.is_super_admin && (
              <div className="space-y-4 pt-4 border-t mt-4">
                <h4 className="font-medium text-sm">Privilégios Globais</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Papel / Regra Global</Label>
                    <Select
                      value={formData.group_id}
                      onValueChange={(v) => setFormData({ ...formData, group_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {groups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center space-x-2 pt-4">
                      <Checkbox
                        id="super"
                        checked={formData.is_super_admin}
                        onCheckedChange={(c: boolean) =>
                          setFormData({ ...formData, is_super_admin: c })
                        }
                      />
                      <Label htmlFor="super" className="cursor-pointer">
                        Acesso Super Admin
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!accessUser} onOpenChange={(open) => !open && setAccessUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Acessos: {accessUser?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="p-4 bg-muted rounded-lg flex flex-col sm:flex-row items-end gap-4">
              <div className="space-y-2 flex-1 w-full">
                <Label>Adicionar Empresa</Label>
                <Select value={formCompany} onValueChange={setFormCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {managedCompanies.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-full sm:w-[150px]">
                <Label>Nível</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddAccess}
                disabled={!formCompany}
                className="w-full sm:w-auto"
              >
                Adicionar
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa Associada</TableHead>
                    <TableHead>Acesso</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberships.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.companies?.name}</TableCell>
                      <TableCell>
                        <Badge variant={m.role === 'Admin' ? 'default' : 'secondary'}>
                          {m.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAccess(m)}
                          className="text-destructive h-8 w-8"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {memberships.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        Nenhuma empresa vinculada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
