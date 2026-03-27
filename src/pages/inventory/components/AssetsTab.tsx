import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Textarea } from '@/components/ui/textarea'
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

export function AssetsTab() {
  const { activeCompanyId } = useCompanyStore()
  const [assets, setAssets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [locators, setLocators] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    locator_id: '',
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [assetsRes, catsRes, locsRes] = await Promise.all([
      supabase
        .from('assets')
        .select('*, categories(name), locators(name)')
        .eq('company_id', activeCompanyId)
        .in('type', ['asset', null])
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase.from('locators').select('*').eq('company_id', activeCompanyId).order('name'),
    ])
    if (assetsRes.data) setAssets(assetsRes.data)
    if (catsRes.data) setCategories(catsRes.data)
    if (locsRes.data) setLocators(locsRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (asset: any) => {
    setEditingId(asset.id)
    setFormData({
      name: asset.name,
      description: asset.description || '',
      category_id: asset.category_id || '',
      locator_id: asset.locator_id || '',
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este ativo?')) {
      const { error } = await supabase.from('assets').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Ativo removido' })
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
        description: formData.description,
        category_id: formData.category_id || null,
        locator_id: formData.locator_id || null,
      })
      .eq('id', editingId)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Ativo atualizado' })
      setIsOpen(false)
      fetchData()
    }
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Buscar ativos..."
          className="w-full sm:max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Ativo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Local</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.categories?.name || '-'}</TableCell>
                  <TableCell>{item.locators?.name || '-'}</TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  Nenhum ativo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ativo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Ativo</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(v) => setFormData({ ...formData, category_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem Categoria</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Localização</Label>
              <Select
                value={formData.locator_id}
                onValueChange={(v) => setFormData({ ...formData, locator_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem Local</SelectItem>
                  {locators.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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
