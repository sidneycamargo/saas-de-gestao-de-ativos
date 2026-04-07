import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Box, ArrowUpDown, ArrowUp, ArrowDown, History } from 'lucide-react'
import { AssetEvents } from '@/components/assets/AssetEvents'
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
  const [contracts, setContracts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null,
  )

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedAssetForEvents, setSelectedAssetForEvents] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    product_id: '',
    identifier: '',
    status: 'Ativo',
    locator_id: '',
    contract_id: '',
    patrimony: '',
    serial: '',
    description: '',
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [assetsRes, prodsRes, locsRes, contractsRes] = await Promise.all([
      supabase
        .from('assets')
        .select(`
          *,
          products(name, type, brands(name), categories(name)),
          locators(name),
          contracts(identifier, suppliers(name))
        `)
        .eq('company_id', activeCompanyId)
        .order('created_at', { ascending: false }),
      supabase.from('products').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase.from('locators').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase
        .from('contracts')
        .select('*, suppliers(name)')
        .eq('company_id', activeCompanyId)
        .order('identifier'),
    ])
    if (assetsRes.data) setAssets(assetsRes.data)
    if (prodsRes.data) setProducts(prodsRes.data)
    if (locsRes.data) setLocators(locsRes.data)
    if (contractsRes.data) setContracts(contractsRes.data)
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

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (!sortConfig) return 0

    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    let aValue = getNestedValue(a, sortConfig.key)
    let bValue = getNestedValue(b, sortConfig.key)

    if (sortConfig.key === 'patrimony') {
      aValue = a.patrimony || a.identifier || ''
      bValue = b.patrimony || b.identifier || ''
    }

    if (sortConfig.key === 'products.name') {
      aValue = a.products?.name || a.name || ''
      bValue = b.products?.name || b.name || ''
    }

    if (aValue === null || aValue === undefined) aValue = ''
    if (bValue === null || bValue === undefined) bValue = ''

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const cmp = aValue.localeCompare(bValue)
      return sortConfig.direction === 'asc' ? cmp : -cmp
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4" />
    if (sortConfig.direction === 'asc') return <ArrowUp className="ml-2 h-4 w-4" />
    return <ArrowDown className="ml-2 h-4 w-4" />
  }

  const handleEdit = (asset: any) => {
    setEditingId(asset.id)
    setFormData({
      name: asset.name || '',
      product_id: asset.product_id || '',
      identifier: asset.identifier || '',
      status: asset.status || 'Ativo',
      locator_id: asset.locator_id || '',
      contract_id: asset.contract_id || '',
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
        contract_id: formData.contract_id || null,
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
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">Ativo / Descrição {getSortIcon('name')}</div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('patrimony')}
                >
                  <div className="flex items-center">Patrimônio {getSortIcon('patrimony')}</div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('products.name')}
                >
                  <div className="flex items-center">
                    Produto Base {getSortIcon('products.name')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('serial')}
                >
                  <div className="flex items-center">Nº Série {getSortIcon('serial')}</div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">Situação {getSortIcon('status')}</div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('locators.name')}
                >
                  <div className="flex items-center">
                    Localização {getSortIcon('locators.name')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssets.length > 0 ? (
                sortedAssets.map((item) => {
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
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{item.locators?.name || '-'}</span>
                          {item.contracts && (
                            <span
                              className="text-[10px] text-muted-foreground border border-border px-1 py-0.5 rounded-sm inline-block w-fit truncate max-w-[120px]"
                              title={item.contracts.identifier || 'Contrato'}
                            >
                              {item.contracts.identifier || 'Contrato Vinculado'}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedAssetForEvents(item)}
                          title="Histórico e Eventos"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-danger"
                          title="Excluir"
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

            <div className="space-y-2 md:col-span-2 border-t pt-4">
              <Label>Contrato Vinculado</Label>
              <Combobox
                options={contracts.map((c) => ({
                  label: c.identifier
                    ? `${c.identifier} - ${c.suppliers?.name || ''}`
                    : `Contrato (Fornecedor: ${c.suppliers?.name || 'N/A'})`,
                  value: c.id,
                }))}
                value={formData.contract_id}
                onChange={(v) => setFormData({ ...formData, contract_id: v })}
                placeholder="Selecione o contrato de locação/manutenção..."
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

      <AssetEvents
        asset={selectedAssetForEvents}
        isOpen={!!selectedAssetForEvents}
        onClose={() => setSelectedAssetForEvents(null)}
        onEventAdded={fetchData}
        locators={locators}
      />
    </div>
  )
}
