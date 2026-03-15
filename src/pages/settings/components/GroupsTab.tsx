import { useState } from 'react'
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

export function GroupsTab({ groups, setGroups }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', permissions: emptyPerms })

  const openDialog = (group?: any) => {
    if (group) {
      setEditingId(group.id)
      setFormData({
        name: group.name,
        description: group.description,
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

  const handleSave = () => {
    if (editingId) {
      setGroups(groups.map((g: any) => (g.id === editingId ? { ...g, ...formData } : g)))
      toast({ title: 'Grupo atualizado', description: 'As permissões foram salvas.' })
    } else {
      setGroups([...groups, { ...formData, id: `g${Date.now()}` }])
      toast({ title: 'Grupo criado', description: 'O novo grupo de acesso foi configurado.' })
    }
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    setGroups(groups.filter((g: any) => g.id !== id))
    toast({ title: 'Grupo removido', variant: 'destructive' })
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
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
