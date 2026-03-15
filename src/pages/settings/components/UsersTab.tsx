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

export function UsersTab({ users, setUsers, groups }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    groupId: '',
    status: 'Ativo',
  })

  const openDialog = (user?: any) => {
    if (user) {
      setEditingId(user.id)
      setFormData({ ...user, password: '' })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        groupId: groups[0]?.id || '',
        status: 'Ativo',
      })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (editingId) {
      setUsers(users.map((u: any) => (u.id === editingId ? { ...u, ...formData } : u)))
      toast({ title: 'Usuário atualizado', description: 'Os dados foram salvos com sucesso.' })
    } else {
      setUsers([...users, { ...formData, id: `u${Date.now()}` }])
      toast({ title: 'Usuário criado', description: 'O novo usuário foi adicionado.' })
    }
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter((u: any) => u.id !== id))
    toast({ title: 'Usuário removido', variant: 'destructive' })
  }

  const getGroup = (id: string) => groups.find((g: any) => g.id === id)?.name || 'Desconhecido'

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>Controle de acesso e papéis do sistema.</CardDescription>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Usuário
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getGroup(u.groupId)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      u.status === 'Ativo'
                        ? 'bg-success hover:bg-success/80'
                        : 'bg-danger hover:bg-danger/80'
                    }
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(u)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(u.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>Preencha os dados de acesso do usuário abaixo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <div className="space-y-2">
              <Label>Senha {editingId && '(deixe em branco para manter)'}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Grupo de Acesso</Label>
                <Select
                  value={formData.groupId}
                  onValueChange={(v) => setFormData({ ...formData, groupId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((g: any) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
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
