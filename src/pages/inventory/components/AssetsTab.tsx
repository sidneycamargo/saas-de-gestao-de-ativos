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
import { Combobox } from '@/components/ui/combobox'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

const translateType = (type: string | null) => {
  const types: Record<string, string> = {
    asset: 'Ativo Geral',
    equipment: 'Equipamento',
    part: 'Peça/Insumo',
    vehicle: 'Veículo',
    furniture: 'Móvel',
  }
  return type ? types[type] || 'Ativo Geral' : 'Ativo Geral'
}

export function AssetsTab() {
  const { activeCompanyId } = useCompanyStore()
  const [assets, setAssets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [locators, setLocators] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    locator_id: '',
    type: 'asset',
    identifier: '',
    status: 'Ativo',
    brand_id: '',
    model: '',
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [assetsRes, catsRes, locsRes, brandsRes] = await Promise.all([
      supabase
        .from('assets')
        .select('*, categories(name), locators(name), brands(name)')
        .eq('company_id', activeCompanyId)
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase.from('locators').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase.from('brands').select('*').eq('company_id', activeCompanyId).order('name'),
    ])
    if (assetsRes.data) setAssets(assetsRes.data)
    if (catsRes.data) setCategories(catsRes.data)
    if (locsRes.data) setLocators(locsRes.data)
    if (brandsRes.data) setBrands(brandsRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.identifier?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      typeFilter === 'all' || a.type === typeFilter || (typeFilter === 'asset' && !a.type)
    return matchesSearch && matchesType
  })

  const handleEdit = (asset: any) => {
    setEditingId(asset.id)
    setFormData({
      name: asset.name,
      description: asset.description || '',
      category_id: asset.category_id || '',
      locator_id: asset.locator_id || '',
      type: asset.type || 'asset',
      identifier: asset.identifier || '',
      status: asset.status || 'Ativo',
      brand_id: asset.brand_id || '',
      model: asset.model || '',
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
        type: formData.type,
        identifier: formData.identifier,
        status: formData.status,
        brand_id: formData.brand_id || null,
        model: formData.model,
      })
      .eq('id', editingId)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Ativo atualizado' })
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
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Buscar ativos..."
          className="w-full sm:w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="asset">Ativo Geral</SelectItem>
            <SelectItem value="equipment">Equipamento</SelectItem>
            <SelectItem value="part">Peça/Insumo</SelectItem>
            <SelectItem value="vehicle">Veículo</SelectItem>
            <SelectItem value="furniture">Móvel</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificador</TableHead>
              <TableHead>Nome do Ativo</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{item.identifier || '-'}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.status || '-'}</TableCell>
                  <TableCell>{item.categories?.name || '-'}</TableCell>
                  <TableCell>{item.brands?.name || '-'}</TableCell>
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
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Nenhum ativo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Ativo</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Nome do Ativo</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Identificador</Label>
              <Input
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Situação</Label>
              <Combobox
                options={[
                  { label: 'Ativo', value: 'Ativo' },
                  { label: 'Inativo', value: 'Inativo' },
                  { label: 'Doado', value: 'Doado' },
                ]}
                value={formData.status}
                onChange={(v) => setFormData({ ...formData, status: v })}
                placeholder="Selecione a situação..."
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
                  <SelectItem value="asset">Ativo Geral</SelectItem>
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
              <Label>Localização</Label>
              <Combobox
                options={locators.map((l) => ({ label: l.name, value: l.id }))}
                value={formData.locator_id}
                onChange={(v) => setFormData({ ...formData, locator_id: v })}
                placeholder="Selecione o local..."
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
