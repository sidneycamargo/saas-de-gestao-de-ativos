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
import { toast } from '@/hooks/use-toast'
import { equipment, parts } from '@/lib/mock-data'

export function LocatorsTab({ locators, setLocators }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  const openDialog = (locator?: any) => {
    if (locator) {
      setEditingId(locator.id)
      setFormData({ name: locator.name, description: locator.description })
    } else {
      setEditingId(null)
      setFormData({ name: '', description: '' })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Aviso', description: 'O nome é obrigatório.', variant: 'destructive' })
      return
    }

    if (editingId) {
      setLocators(locators.map((l: any) => (l.id === editingId ? { ...l, ...formData } : l)))
      toast({ title: 'Localizador atualizado', description: 'As alterações foram salvas.' })
    } else {
      setLocators([...locators, { ...formData, id: `loc-${Date.now()}` }])
      toast({ title: 'Localizador criado', description: 'O novo localizador foi adicionado.' })
    }
    setIsOpen(false)
  }

  const isLocatorInUse = (id: string) => {
    return equipment.some((e) => e.locatorId === id) || parts.some((p) => p.locatorId === id)
  }

  const handleDelete = () => {
    if (deleteId) {
      if (isLocatorInUse(deleteId)) {
        toast({
          title: 'Erro de Exclusão',
          description: 'Este localizador está em uso por um ou mais produtos no inventário.',
          variant: 'destructive',
        })
        setDeleteId(null)
        return
      }

      setLocators(locators.filter((l: any) => l.id !== deleteId))
      toast({ title: 'Localizador removido', variant: 'default' })
      setDeleteId(null)
    }
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Localizadores</CardTitle>
          <CardDescription>
            Gerencie as posições físicas (prateleiras, corredores, salas) para vincular aos ativos.
          </CardDescription>
        </div>
        <Button onClick={() => openDialog()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Novo Localizador
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locators.map((l: any) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell className="text-muted-foreground">{l.description || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(l)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(l.id)}
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
            <DialogTitle>{editingId ? 'Editar Localizador' : 'Novo Localizador'}</DialogTitle>
            <DialogDescription>
              Identifique uma localização física para rastreio de estoque e equipamentos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Localizador</Label>
              <Input
                placeholder="Ex: Prateleira A1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                placeholder="Ex: Corredor 1, Setor de Ferramentas"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Localizador?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Se houverem produtos vinculados a este local, a
              exclusão será bloqueada para garantir a integridade dos dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
