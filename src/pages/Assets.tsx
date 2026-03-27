import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Box } from 'lucide-react'
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

export default function Assets() {
  const { activeCompanyId } = useCompanyStore()
  const [assets, setAssets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [locators, setLocators] = useState<any[]>([])
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
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [assetsRes, catsRes, locsRes] = await Promise.all([
      supabase
        .from('assets')
        .select('*, categories(name), locators(name)')
        .eq('company_id', activeCompanyId)
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

  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Box className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Ativos</h2>
            <p className="text-muted-foreground">Gestão principal do seu patrimônio e ativos.</p>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/assets/new">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Ativo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Listagem de Ativos</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
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
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Ativo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Local</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{translateType(item.type)}</TableCell>
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
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum ativo encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
              <Select
                value={formData.category_id}
                onValueChange={(v) =>
                  setFormData({ ...formData, category_id: v === 'none' ? '' : v })
                }
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
                onValueChange={(v) =>
                  setFormData({ ...formData, locator_id: v === 'none' ? '' : v })
                }
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
