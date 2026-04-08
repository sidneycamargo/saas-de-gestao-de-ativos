import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Box } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import useCompanyStore from '@/stores/useCompanyStore'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'

export default function Contracts() {
  const { activeCompanyId } = useCompanyStore()
  const [contracts, setContracts] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [assetsList, setAssetsList] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    identifier: '',
    description: '',
    supplier_id: '',
    registration_date: '',
    start_date: '',
    end_date: '',
    renewal_within: false,
    renewal_after: false,
    selected_assets: [] as string[],
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [cRes, sRes, aRes] = await Promise.all([
      supabase
        .from('contracts')
        .select('*, suppliers(name), assets(id, name, patrimony)')
        .eq('company_id', activeCompanyId)
        .order('registration_date', { ascending: false }),
      supabase.from('suppliers').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase
        .from('assets')
        .select('id, name, patrimony, contract_id')
        .eq('company_id', activeCompanyId)
        .order('name'),
    ])
    if (cRes.data) setContracts(cRes.data)
    if (sRes.data) setSuppliers(sRes.data)
    if (aRes.data) setAssetsList(aRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const openDialog = (con?: any) => {
    if (con) {
      setEditingId(con.id)
      setFormData({
        identifier: con.identifier || '',
        description: con.description || '',
        supplier_id: con.supplier_id,
        registration_date: con.registration_date || '',
        start_date: con.start_date || '',
        end_date: con.end_date || '',
        renewal_within: con.renewal_within,
        renewal_after: con.renewal_after,
        selected_assets: con.assets?.map((a: any) => a.id) || [],
      })
    } else {
      setEditingId(null)
      setFormData({
        identifier: '',
        description: '',
        supplier_id: '',
        registration_date: new Date().toISOString().split('T')[0],
        start_date: '',
        end_date: '',
        renewal_within: false,
        renewal_after: false,
        selected_assets: [],
      })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!formData.supplier_id) return

    const contractData = {
      identifier: formData.identifier,
      description: formData.description,
      supplier_id: formData.supplier_id,
      registration_date: formData.registration_date || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      renewal_within: formData.renewal_within,
      renewal_after: formData.renewal_after,
    }

    if (editingId) {
      const { error } = await supabase.from('contracts').update(contractData).eq('id', editingId)
      if (error) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' })
        return
      }

      const previouslyLinked =
        contracts.find((c) => c.id === editingId)?.assets?.map((a: any) => a.id) || []
      const toUnlink = previouslyLinked.filter(
        (id: string) => !formData.selected_assets.includes(id),
      )
      const toLink = formData.selected_assets.filter((id: string) => !previouslyLinked.includes(id))

      if (toUnlink.length > 0) {
        await supabase.from('assets').update({ contract_id: null }).in('id', toUnlink)
      }
      if (toLink.length > 0) {
        await supabase.from('assets').update({ contract_id: editingId }).in('id', toLink)
      }

      toast({ title: 'Contrato atualizado' })
      setIsOpen(false)
      fetchData()
    } else {
      const { data, error } = await supabase
        .from('contracts')
        .insert({ ...contractData, company_id: activeCompanyId })
        .select()
        .single()

      if (error) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' })
        return
      }

      if (formData.selected_assets.length > 0 && data) {
        await supabase
          .from('assets')
          .update({ contract_id: data.id })
          .in('id', formData.selected_assets)
      }

      toast({ title: 'Contrato cadastrado' })
      setIsOpen(false)
      fetchData()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja remover este contrato? Os ativos vinculados perderão esta associação.')) {
      const { error } = await supabase.from('contracts').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Contrato removido' })
        fetchData()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contratos</h2>
          <p className="text-muted-foreground">Gestão de contratos com empresas terceirizadas.</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Contrato
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identificador / Fornecedor</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Ativos Vinculados</TableHead>
                <TableHead>Renovação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.identifier || 'Sem identificador'}</div>
                    <div className="text-sm text-muted-foreground">{c.suppliers?.name}</div>
                  </TableCell>
                  <TableCell>
                    {c.start_date
                      ? new Date(c.start_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                      : '-'}{' '}
                    até{' '}
                    {c.end_date
                      ? new Date(c.end_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        title={`${c.assets?.length || 0} ativo(s) vinculado(s)`}
                      >
                        <Box className="w-3 h-3 mr-1" />
                        {c.assets?.length || 0}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="space-y-1">
                    {c.renewal_within && (
                      <Badge variant="outline" className="text-xs mr-1">
                        Dentro do período
                      </Badge>
                    )}
                    {c.renewal_after && (
                      <Badge variant="outline" className="text-xs">
                        Após período
                      </Badge>
                    )}
                    {!c.renewal_within && !c.renewal_after && (
                      <span className="text-muted-foreground text-xs">Sem renovação</span>
                    )}
                  </TableCell>
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
              {contracts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum contrato cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Contrato' : 'Novo Contrato'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Identificador do Contrato</Label>
              <Input
                placeholder="Ex: CT-2023/001"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <Select
                value={formData.supplier_id}
                onValueChange={(v) => setFormData({ ...formData, supplier_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Descrição / Objeto do Contrato</Label>
              <Textarea
                placeholder="Detalhes sobre o que este contrato cobre..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Data de Registro</Label>
              <Input
                type="date"
                value={formData.registration_date}
                onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Data Início da Vigência</Label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data Final da Vigência</Label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Ativos Vinculados</Label>
              <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                <div className="space-y-4">
                  {assetsList.map((asset) => {
                    const isLinkedToOther = asset.contract_id && asset.contract_id !== editingId
                    return (
                      <div key={asset.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`asset-${asset.id}`}
                          checked={formData.selected_assets.includes(asset.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                selected_assets: [...formData.selected_assets, asset.id],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                selected_assets: formData.selected_assets.filter(
                                  (id) => id !== asset.id,
                                ),
                              })
                            }
                          }}
                        />
                        <Label
                          htmlFor={`asset-${asset.id}`}
                          className="flex items-center gap-2 cursor-pointer font-normal"
                        >
                          <span>
                            {asset.name} {asset.patrimony ? `(${asset.patrimony})` : ''}
                          </span>
                          {isLinkedToOther && !formData.selected_assets.includes(asset.id) && (
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              Em outro contrato
                            </span>
                          )}
                        </Label>
                      </div>
                    )
                  })}
                  {assetsList.length === 0 && (
                    <div className="text-sm text-muted-foreground">Nenhum ativo encontrado.</div>
                  )}
                </div>
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                Selecione os equipamentos que são cobertos por este contrato.
              </p>
            </div>

            <div className="space-y-3 mt-2 md:col-span-2 border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ren-in"
                  checked={formData.renewal_within}
                  onCheckedChange={(c) => setFormData({ ...formData, renewal_within: !!c })}
                />
                <Label htmlFor="ren-in">Renovação dentro do período</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ren-out"
                  checked={formData.renewal_after}
                  onCheckedChange={(c) => setFormData({ ...formData, renewal_after: !!c })}
                />
                <Label htmlFor="ren-out">Renovação após o período</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.supplier_id}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
