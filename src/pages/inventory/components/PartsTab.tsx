import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export function PartsTab() {
  const { activeCompanyId } = useCompanyStore()
  const [parts, setParts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', sku: '', stock: 0, min_stock: 0 })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const { data } = await supabase
      .from('assets')
      .select('*, locators(name)')
      .eq('company_id', activeCompanyId)
      .eq('type', 'part')
      .order('created_at', { ascending: false })
    if (data) setParts(data)
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const filteredParts = parts.filter((item) => {
    const search = searchTerm.toLowerCase()
    return item.name.toLowerCase().includes(search) || item.sku?.toLowerCase().includes(search)
  })

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      sku: item.sku || '',
      stock: item.stock || 0,
      min_stock: item.min_stock || 0,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir esta peça?')) {
      const { error } = await supabase.from('assets').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Peça removida' })
        fetchData()
      }
    }
  }

  const handleSave = async () => {
    if (!formData.name) return
    const { error } = await supabase
      .from('assets')
      .update({
        name: formData.name,
        sku: formData.sku,
        stock: formData.stock,
        min_stock: formData.min_stock,
      })
      .eq('id', editingId)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Atualizado' })
      setIsOpen(false)
      fetchData()
    }
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Buscar por nome ou SKU..."
          className="w-full sm:max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>SKU / Ref</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead className="w-[200px]">Quantidade (Estoque)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParts.length > 0 ? (
              filteredParts.map((item) => {
                const min = item.min_stock || 1
                const stockPercentage = Math.min((item.stock / min) * 100, 100)
                const isLowStock = item.stock < item.min_stock
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku || '-'}</TableCell>
                    <TableCell>{item.locators?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={stockPercentage}
                          className={`h-2 ${isLowStock ? '[&>div]:bg-danger' : '[&>div]:bg-success'}`}
                        />
                        <span
                          className={`text-xs font-medium w-16 text-right ${isLowStock ? 'text-danger' : ''}`}
                        >
                          {item.stock} / {item.min_stock}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  Nenhuma peça encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Peça/Insumo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estoque Atual</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Estoque Mínimo</Label>
                <Input
                  type="number"
                  value={formData.min_stock}
                  onChange={(e) =>
                    setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
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
    </div>
  )
}
