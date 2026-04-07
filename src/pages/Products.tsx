import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Combobox } from '@/components/ui/combobox'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

const translateType = (type: string | null) => {
  const types: Record<string, string> = {
    equipment: 'Equipamento',
    part: 'Peça/Insumo',
    vehicle: 'Veículo',
    furniture: 'Móvel',
  }
  return type ? types[type] || type : 'Equipamento'
}

export default function Products() {
  const { activeCompanyId } = useCompanyStore()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const defaultForm = {
    name: '',
    specification: '',
    description: '',
    type: 'equipment',
    category_id: '',
    brand_id: '',
    model: '',
    sku: '',
    price: 0,
    stock: 0,
    min_stock: 0,
  }
  const [formData, setFormData] = useState(defaultForm)

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [prodRes, catsRes, brandsRes] = await Promise.all([
      supabase
        .from('products')
        .select('*, categories(name), brands(name)')
        .eq('company_id', activeCompanyId)
        .order('name'),
      supabase.from('categories').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase.from('brands').select('*').eq('company_id', activeCompanyId).order('name'),
    ])
    if (prodRes.data) setProducts(prodRes.data)
    if (catsRes.data) setCategories(catsRes.data)
    if (brandsRes.data) setBrands(brandsRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      p.name?.toLowerCase().includes(term) ||
      p.specification?.toLowerCase().includes(term) ||
      translateType(p.type).toLowerCase().includes(term) ||
      p.categories?.name?.toLowerCase().includes(term) ||
      p.brands?.name?.toLowerCase().includes(term) ||
      p.model?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term) ||
      String(p.stock || 0).includes(term)

    const matchesType = typeFilter === 'all' || p.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleEdit = (prod: any) => {
    setEditingId(prod.id)
    setFormData({
      name: prod.name,
      specification: prod.specification || '',
      description: prod.description || '',
      type: prod.type || 'equipment',
      category_id: prod.category_id || '',
      brand_id: prod.brand_id || '',
      model: prod.model || '',
      sku: prod.sku || '',
      price: prod.price || 0,
      stock: prod.stock || 0,
      min_stock: prod.min_stock || 0,
    })
    setIsOpen(true)
  }

  const handleCreateNew = () => {
    setEditingId(null)
    setFormData(defaultForm)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (
      confirm(
        'Tem certeza que deseja excluir este produto? Ativos associados também poderão ser afetados.',
      )
    ) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Produto removido' })
        fetchData()
      }
    }
  }

  const handleSave = async () => {
    if (!formData.name) return
    const payload = {
      company_id: activeCompanyId,
      name: formData.name,
      specification: formData.specification,
      description: formData.description,
      type: formData.type,
      category_id: formData.category_id || null,
      brand_id: formData.brand_id || null,
      model: formData.model,
      sku: formData.sku,
      price: formData.price,
      stock: formData.stock,
      min_stock: formData.min_stock,
    }

    let error
    if (editingId) {
      const res = await supabase.from('products').update(payload).eq('id', editingId)
      error = res.error
    } else {
      const res = await supabase.from('products').insert([payload])
      error = res.error
    }

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: editingId ? 'Produto atualizado' : 'Produto criado' })
      setIsOpen(false)
      fetchData()
    }
  }

  const handleCreateBrand = async (name: string) => {
    if (!activeCompanyId) return
    const { data, error } = await supabase
      .from('brands')
      .insert({ company_id: activeCompanyId, name })
      .select()
      .single()
    if (data) {
      setBrands((prev) => [...prev, data])
      setFormData({ ...formData, brand_id: data.id })
      toast({ title: 'Marca criada', description: `A marca ${name} foi adicionada.` })
    } else if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <PackageSearch className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Catálogo de Produtos</h2>
            <p className="text-muted-foreground">Gerencie equipamentos, peças e insumos base.</p>
          </div>
        </div>
        <Button onClick={handleCreateNew} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Listagem de Produtos</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="Buscar produtos..."
                className="w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="equipment">Equipamento</SelectItem>
                  <SelectItem value="part">Peça/Insumo</SelectItem>
                  <SelectItem value="vehicle">Veículo</SelectItem>
                  <SelectItem value="furniture">Móvel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Especificação</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={item.specification}>
                      {item.specification || '-'}
                    </TableCell>
                    <TableCell>{translateType(item.type)}</TableCell>
                    <TableCell>{item.categories?.name || '-'}</TableCell>
                    <TableCell>{item.brands?.name || '-'}</TableCell>
                    <TableCell>{item.model || '-'}</TableCell>
                    <TableCell>{item.stock || 0}</TableCell>
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
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Nome do Produto *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Especificação</Label>
              <Input
                value={formData.specification}
                onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">Equipamento</SelectItem>
                  <SelectItem value="part">Peça/Insumo</SelectItem>
                  <SelectItem value="vehicle">Veículo</SelectItem>
                  <SelectItem value="furniture">Móvel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Combobox
                options={categories.map((c) => ({ label: c.name, value: c.id }))}
                value={formData.category_id}
                onChange={(v) => setFormData({ ...formData, category_id: v })}
                placeholder="Selecione a categoria..."
              />
            </div>

            <div className="space-y-2">
              <Label>Marca</Label>
              <Combobox
                options={brands.map((b) => ({ label: b.name, value: b.id }))}
                value={formData.brand_id}
                onChange={(v) => setFormData({ ...formData, brand_id: v })}
                placeholder="Selecione a marca..."
                onCreate={handleCreateBrand}
                emptyText="Nenhuma marca encontrada."
              />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>SKU / Referência</Label>
              <Input
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Valor Unitário</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Estoque Atual</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
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

            <div className="space-y-2 md:col-span-2">
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
