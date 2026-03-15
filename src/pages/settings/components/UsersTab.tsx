import { useState } from 'react'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    groupId: '',
    status: 'Ativo',
    twoFactorEnabled: false,
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
        phone: '',
        password: '',
        groupId: groups[0]?.id || '',
        status: 'Ativo',
        twoFactorEnabled: false,
      })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (formData.twoFactorEnabled && !formData.phone) {
      toast({
        title: 'Aviso de Segurança',
        description: 'É obrigatório informar um celular para habilitar o 2FA.',
        variant: 'destructive',
      })
      return
    }

    if (editingId) {
      setUsers(users.map((u: any) => (u.id === editingId ? { ...u, ...formData } : u)))
      toast({ title: 'Usuário atualizado', description: 'Os dados foram salvos com sucesso.' })
    } else {
      setUsers([...users, { ...formData, id: `u${Date.now()}` }])
      toast({ title: 'Usuário criado', description: 'O novo usuário foi adicionado.' })
    }
    setIsOpen(false)
  }

  const confirmDelete = (id: string) => {
    setUserToDelete(id)
  }

  const handleDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u: any) => u.id !== userToDelete))
      toast({ title: 'Usuário removido', variant: 'destructive' })
      setUserToDelete(null)
    }
  }

  const getGroup = (id: string) => groups.find((g: any) => g.id === id)?.name || 'Desconhecido'

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>Controle de acesso e papéis do sistema.</CardDescription>
        </div>
        <Button onClick={() => openDialog()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Novo Usuário
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
            {users.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getGroup(u.groupId)}</Badge>
                </TableCell>
                <TableCell>
                  {u.twoFactorEnabled ? (
                    <ShieldCheck className="w-4 h-4 text-success" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                  )}
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
                    onClick={() => confirmDelete(u.id)}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>Preencha os dados de acesso do usuário abaixo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Celular {formData.twoFactorEnabled && <span className="text-danger ml-1">*</span>}
                </Label>
                <Input
                  placeholder="+55 11 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Senha {editingId && '(em branco p/ manter)'}</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="flex items-center space-x-2 pt-2 border-t mt-2">
              <Switch
                id="2fa"
                checked={formData.twoFactorEnabled}
                onCheckedChange={(c) => setFormData({ ...formData, twoFactorEnabled: c })}
              />
              <Label htmlFor="2fa" className="flex flex-col">
                <span>Exigir Autenticação de Dois Fatores (2FA)</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Será enviado um código SMS para o celular cadastrado durante o login.
                </span>
              </Label>
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

      <AlertDialog open={!!userToDelete} onOpenChange={(o) => !o && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não poderá ser desfeita. O usuário selecionado perderá o acesso
              imediatamente. O histórico de auditoria será mantido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={handleDelete}
            >
              Remover Usuário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
