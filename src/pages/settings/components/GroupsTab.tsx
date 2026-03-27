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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

const systemModules = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventário e Produtos' },
  { id: 'maintenance', label: 'Manutenção' },
  { id: 'warranties', label: 'Garantias' },
  { id: 'users', label: 'Usuários e Configurações' },
]

const emptyPerms = systemModules.reduce(
  (acc, mod) => ({ ...acc, [mod.id]: { view: false, create: false, delete: false } }),
  {} as any,
)

export function GroupsTab() {
  const { activeCompanyId } = useCompanyStore()
  const [groups, setGroups] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', permissions: emptyPerms })

  const fetchGroups = async () => {
    if (!activeCompanyId) return
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('company_id', activeCompanyId)
      .order('name')

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os grupos.',
        variant: 'destructive',
      })
      return
    }

    if (data) setGroups(data)
  }

  useEffect(() => {
    fetchGroups()
  }, [activeCompanyId])

  const openDialog = (group?: any) => {
    if (group) {
      setEditingId(group.id)
      setFormData({
        name: group.name,
        description: group.description || '',
        permissions: { ...emptyPerms, ...group.permissions },
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', description: '', permissions: emptyPerms })
    }
    setIsOpen(true)
  }

  const handleToggle = (modId: string, perm: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [modId]: { ...prev.permissions[modId], [perm]: checked },
      },
    }))
  }

  const handleSave = async () => {
    if (!formData.name) return

    if (editingId) {
      const { error } = await supabase
        .from('groups')
        .update({
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
        })
        .eq('id', editingId)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Grupo atualizado', description: 'As permissões foram salvas.' })
        setIsOpen(false)
        fetchGroups()
      }
    } else {
      const { error } = await supabase.from('groups').insert({
        company_id: activeCompanyId,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
      })
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Grupo criado', description: 'O novo grupo de acesso foi configurado.' })
        setIsOpen(false)
        fetchGroups()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza? Usuários vinculados ficarão sem grupo.')) {
      const { error } = await supabase.from('groups').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Grupo removido', variant: 'destructive' })
        fetchGroups()
      }
    }
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Grupos de Acesso</CardTitle>
          <CardDescription>Defina as permissões granulares por módulo.</CardDescription>
        </div>
        <Button onClick={() => openDialog()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Novo Grupo
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Grupo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((g: any) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.name}</TableCell>
                <TableCell>{g.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(g)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(g.id)}
                    className="text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  Nenhum grupo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Grupo' : 'Novo Grupo'}</DialogTitle>
            <DialogDescription>
              Configure os dados do grupo e a matriz de permissões.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Grupo</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 border rounded-md">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Módulo</TableHead>
                    <TableHead className="text-center">Consulta</TableHead>
                    <TableHead className="text-center">Cadastro</TableHead>
                    <TableHead className="text-center">Exclusão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemModules.map((mod) => (
                    <TableRow key={mod.id}>
                      <TableCell className="font-medium">{mod.label}</TableCell>
                      {['view', 'create', 'delete'].map((perm) => (
                        <TableCell key={perm} className="text-center">
                          <Checkbox
                            checked={!!formData.permissions[mod.id]?.[perm]}
                            onCheckedChange={(c) => handleToggle(mod.id, perm, !!c)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
