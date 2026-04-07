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
import { Combobox } from '@/components/ui/combobox'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export default function Assets() {
  const { activeCompanyId } = useCompanyStore()
  const [assets, setAssets] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [locators, setLocators] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    product_id: '',
    identifier: '',
    status: 'Ativo',
    locator_id: '',
    patrimony: '',
    serial: '',
    description: '',
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [assetsRes, prodsRes, locsRes] = await Promise.all([
      supabase
        .from('assets')
        .select(`
          *,
          products(name, type, brands(name), categories(name)),
          locators(name)
        `)
        .eq('company_id', activeCompanyId)
        .order('created_at', { ascending: false }),
      supabase.from('products').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase.from('locators').select('*').eq('company_id', activeCompanyId).order('name'),
    ])
    if (assetsRes.data) setAssets(assetsRes.data)
    if (prodsRes.data) setProducts(prodsRes.data)
    if (locsRes.data) setLocators(locsRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const filteredAssets = assets.filter((a) => {
    const terms = searchTerm.toLowerCase().split(' ').filter(Boolean)
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter

    if (terms.length === 0) return matchesStatus

    const pName = a.products?.name || a.name || ''

    const searchableFields = [
      a.name,
      a.description,
      a.patrimony,
      a.identifier,
      pName,
      a.serial,
      a.status,
      a.locators?.name,
    ].map((f) => (f || '').toLowerCase())

    const matchesSearch = terms.some((term) =>
      searchableFields.some((field) => field.includes(term)),
    )

    return matchesSearch && matchesStatus
  })

  const handleEdit = (asset: any) => {
    setEditingId(asset.id)
    setFormData({
      name: asset.name || '',
      product_id: asset.product_id || '',
      identifier: asset.identifier || '',
      status: asset.status || 'Ativo',
      locator_id: asset.locator_id || '',
      patrimony: asset.patrimony || '',
      serial: asset.serial || '',
      description: asset.description || '',
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este ativo físico?')) {
      const { error } = await supabase.from('assets').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Ativo removido' })
        fetchData()
      }
    }
  }

  const handleSave = async () => {
    if (!formData.product_id) return
    const selectedProduct = products.find((p) => p.id === formData.product_id)

    const { error } = await supabase
      .from('assets')
      .update({
        product_id: formData.product_id,
        identifier: formData.identifier,
        status: formData.status,
        locator_id: formData.locator_id || null,
        patrimony: formData.patrimony,
        serial: formData.serial,
        description: formData.description,
        name: formData.name || selectedProduct?.name || 'Ativo',
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
            <h2 className="text-3xl font-bold tracking-tight">Ativos (Patrimônio)</h2>
            <p className="text-muted-foreground">Gestão de instâncias físicas dos seus produtos.</p>
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
            <CardTitle>Listagem de Ativos Físicos</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="Buscar patrimônio, série..."
                className="w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Situações</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                  <SelectItem value="Doado">Doado</SelectItem>
                  <SelectItem value="Descartado">Descartado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo / Descrição</TableHead>
                <TableHead>Patrimônio</TableHead>
                <TableHead>Produto Base</TableHead>
                <TableHead>Nº Série</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((item) => {
                  const pName = item.products?.name || item.name || '-'
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div
                          className="font-medium max-w-[200px] truncate"
                          title={item.name || '-'}
                        >
                          {item.name || '-'}
                        </div>
                        {item.description && (
                          <div
                            className="text-xs text-muted-foreground max-w-[200px] truncate mt-0.5"
                            title={item.description}
                          >
                            {item.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{item.patrimony || item.identifier || '-'}</TableCell>
                      <TableCell>{pName}</TableCell>
                      <TableCell>{item.serial || '-'}</TableCell>
                      <TableCell>{item.status || '-'}</TableCell>
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
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum ativo encontrado.
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
            <DialogTitle>Editar Ativo Físico</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Descrição do Ativo</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Notebook Dell X1"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Descritivo do Ativo</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes técnicos, observações de estado, cor..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Produto Base *</Label>
              <Combobox
                options={products.map((p) => ({
                  label: `${p.name} ${p.model ? `(${p.model})` : ''}`,
                  value: p.id,
                }))}
                value={formData.product_id}
                onChange={(v) => setFormData({ ...formData, product_id: v })}
                placeholder="Selecione o produto base..."
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
              <Label>Número de Patrimônio</Label>
              <Input
                value={formData.patrimony}
                onChange={(e) => setFormData({ ...formData, patrimony: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Nº de Série</Label>
              <Input
                value={formData.serial}
                onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Situação</Label>
              <Combobox
                options={[
                  { label: 'Ativo', value: 'Ativo' },
                  { label: 'Inativo', value: 'Inativo' },
                  { label: 'Em Manutenção', value: 'Em Manutenção' },
                  { label: 'Doado', value: 'Doado' },
                  { label: 'Descartado', value: 'Descartado' },
                ]}
                value={formData.status}
                onChange={(v) => setFormData({ ...formData, status: v })}
                placeholder="Selecione a situação..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Localização Física</Label>
              <Combobox
                options={locators.map((l) => ({ label: l.name, value: l.id }))}
                value={formData.locator_id}
                onChange={(v) => setFormData({ ...formData, locator_id: v })}
                placeholder="Selecione o local..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.product_id}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
