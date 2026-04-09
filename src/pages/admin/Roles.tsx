import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldAlert, Plus, Pencil, Trash2 } from 'lucide-react'
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

const DEFAULT_PERMISSIONS = {
  assets: { read: false, write: false, delete: false },
  maintenance: { read: false, write: false, delete: false },
  inventory: { read: false, write: false, delete: false },
  settings: { read: false, write: false, delete: false },
}

type PermModule = keyof typeof DEFAULT_PERMISSIONS
type PermAction = 'read' | 'write' | 'delete'

export default function AdminRoles() {
  const { profile } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [managedCompanies, setManagedCompanies] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    company_id: '',
    permissions: JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)),
  })

  useEffect(() => {
    if (profile) checkAccessAndFetch()
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
    let mComps: any[] = []
    if (comps) {
      mComps = isSuperAdmin ? comps : comps.filter((c) => adminCompanyIds.includes(c.id))
      setManagedCompanies(mComps)
    }

    if (mComps.length > 0) {
      const { data: rls } = await supabase
        .from('groups')
        .select('*, companies(name)')
        .in(
          'company_id',
          mComps.map((c) => c.id),
        )
        .order('name')
      if (rls) setRoles(rls)
    }
  }

  if (hasAccess === false) return <Navigate to="/" />
  if (hasAccess === null)
    return <div className="p-8 text-center text-muted-foreground">Carregando...</div>

  const openCreate = () => {
    setSelectedRole(null)
    setIsCreating(true)
    setFormData({
      name: '',
      description: '',
      company_id: managedCompanies[0]?.id || '',
      permissions: JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)),
    })
    setIsModalOpen(true)
  }

  const openEdit = (r: any) => {
    setSelectedRole(r)
    setIsCreating(false)
    setFormData({
      name: r.name,
      description: r.description || '',
      company_id: r.company_id,
      permissions: r.permissions
        ? { ...DEFAULT_PERMISSIONS, ...r.permissions }
        : JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)),
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.company_id) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
      return
    }

    try {
      if (isCreating) {
        const { error } = await supabase.from('groups').insert({
          name: formData.name,
          description: formData.description,
          company_id: formData.company_id,
          permissions: formData.permissions,
        })
        if (error) throw error
        toast({ title: 'Papel criado com sucesso' })
      } else {
        const { error } = await supabase
          .from('groups')
          .update({
            name: formData.name,
            description: formData.description,
            company_id: formData.company_id,
            permissions: formData.permissions,
          })
          .eq('id', selectedRole.id)
        if (error) throw error
        toast({ title: 'Papel atualizado com sucesso' })
      }
      setIsModalOpen(false)
      checkAccessAndFetch()
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este papel?')) return
    try {
      const { error } = await supabase.from('groups').delete().eq('id', id)
      if (error) throw error
      toast({ title: 'Papel excluído com sucesso' })
      checkAccessAndFetch()
    } catch (e: any) {
      toast({ title: 'Erro ao excluir', description: e.message, variant: 'destructive' })
    }
  }

  const handlePermissionChange = (module: PermModule, action: PermAction, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: checked,
        },
      },
    }))
  }

  const moduleNames = {
    assets: 'Ativos',
    maintenance: 'Manutenções',
    inventory: 'Estoque',
    settings: 'Configurações',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-500">
              Papéis e Permissões
            </h2>
            <p className="text-muted-foreground">
              Crie perfis de acesso customizados para os usuários do sistema.
            </p>
          </div>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Papel
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.companies?.name}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.description || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(r)}
                          className="h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(r.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {roles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum papel encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Novo Papel' : 'Editar Papel'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Técnico Sênior"
                />
              </div>
              <div className="space-y-2">
                <Label>Empresa *</Label>
                <Select
                  value={formData.company_id}
                  onValueChange={(v) => setFormData({ ...formData, company_id: v })}
                  disabled={!isCreating && !profile?.is_super_admin}
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
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="O que este papel pode fazer?"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base">Permissões de Acesso</Label>
              <div className="border rounded-md divide-y">
                {(Object.keys(DEFAULT_PERMISSIONS) as PermModule[]).map((module) => (
                  <div
                    key={module}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card"
                  >
                    <div className="font-medium text-sm w-32">{moduleNames[module]}</div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module}-read`}
                          checked={formData.permissions[module]?.read}
                          onCheckedChange={(c: boolean) =>
                            handlePermissionChange(module, 'read', c)
                          }
                        />
                        <Label
                          htmlFor={`${module}-read`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          Ver
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module}-write`}
                          checked={formData.permissions[module]?.write}
                          onCheckedChange={(c: boolean) =>
                            handlePermissionChange(module, 'write', c)
                          }
                        />
                        <Label
                          htmlFor={`${module}-write`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          Criar/Editar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module}-delete`}
                          checked={formData.permissions[module]?.delete}
                          onCheckedChange={(c: boolean) =>
                            handlePermissionChange(module, 'delete', c)
                          }
                        />
                        <Label
                          htmlFor={`${module}-delete`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          Excluir
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Papel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
