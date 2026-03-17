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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export function CategoriesTab() {
  const { activeCompanyId } = useCompanyStore()
  const [categories, setCategories] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '' })

  const fetchCategories = async () => {
    if (!activeCompanyId) return
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('company_id', activeCompanyId)
      .order('name')
    if (data) setCategories(data)
  }

  useEffect(() => {
    fetchCategories()
  }, [activeCompanyId])

  const openDialog = (cat?: any) => {
    if (cat) {
      setEditingId(cat.id)
      setFormData({ name: cat.name })
    } else {
      setEditingId(null)
      setFormData({ name: '' })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name) return

    if (editingId) {
      const { error } = await supabase
        .from('categories')
        .update({ name: formData.name })
        .eq('id', editingId)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Categoria atualizada' })
        setIsOpen(false)
        fetchCategories()
      }
    } else {
      const { error } = await supabase
        .from('categories')
        .insert({ name: formData.name, company_id: activeCompanyId })
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Categoria criada' })
        setIsOpen(false)
        fetchCategories()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza? Ativos vinculados ficarão sem categoria.')) {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Categoria removida' })
        fetchCategories()
      }
    }
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Categorias de Ativos</CardTitle>
          <CardDescription>Gerencie as categorias para organizar seus ativos.</CardDescription>
        </div>
        <Button onClick={() => openDialog()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Nova Categoria
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
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
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Nome</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Ex: Veículos"
              className="mt-2"
            />
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
