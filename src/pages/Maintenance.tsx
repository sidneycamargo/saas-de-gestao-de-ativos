import { useState, useEffect } from 'react'
import {
  Plus,
  Calendar as CalendarIcon,
  PhoneCall,
  AlertCircle,
  Wrench,
  Edit2,
  XCircle,
  MoreVertical,
  MailCheck,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/StatusBadge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/hooks/use-toast'
import useCompanyStore from '@/stores/useCompanyStore'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case 'Baixa':
      return (
        <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300">
          Baixa
        </Badge>
      )
    case 'Média':
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
          Média
        </Badge>
      )
    case 'Alta':
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
          Alta
        </Badge>
      )
    case 'Urgente':
      return <Badge variant="destructive">Urgente</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

export default function Maintenance() {
  const { activeCompanyId } = useCompanyStore()
  const { session, profile } = useAuth()
  const [userRole, setUserRole] = useState<string>('Member')

  const [data, setData] = useState({
    maintenances: [] as any[],
    assets: [] as any[],
    suppliers: [] as any[],
    warranties: [] as any[],
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [callMode, setCallMode] = useState<'quick' | 'internal' | 'external'>('quick')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    assetId: '',
    supplierId: '',
    type: 'Corretiva',
    date: new Date().toISOString().split('T')[0],
    order_date: new Date().toISOString().split('T')[0],
    description: '',
    priority: 'Média',
    origin: 'Manual',
    channels: [] as string[],
    primaryChannel: '',
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [mRes, aRes, sRes, wRes] = await Promise.all([
      supabase
        .from('maintenances')
        .select('*, assets(name)')
        .eq('company_id', activeCompanyId)
        .order('created_at', { ascending: false }),
      supabase.from('assets').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase.from('suppliers').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase
        .from('warranties')
        .select('*, warranty_suppliers(supplier_id)')
        .eq('company_id', activeCompanyId),
    ])
    setData({
      maintenances: mRes.data || [],
      assets: aRes.data || [],
      suppliers: sRes.data || [],
      warranties: wRes.data || [],
    })
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  useEffect(() => {
    if (activeCompanyId && session?.user?.id) {
      supabase
        .from('company_memberships')
        .select('role')
        .eq('company_id', activeCompanyId)
        .eq('user_id', session.user.id)
        .single()
        .then(({ data }) => {
          if (data) setUserRole(data.role)
        })
    }
  }, [activeCompanyId, session])

  const canEditOrderDate = profile?.is_super_admin || userRole === 'Admin' || userRole === 'Manager'
  const selectedSupplier = data.suppliers.find((s) => s.id === formData.supplierId)

  const handleToggleChannel = (channel: string, checked: boolean) => {
    setFormData((prev) => {
      const channels = checked
        ? [...prev.channels, channel]
        : prev.channels.filter((c) => c !== channel)
      const primaryChannel = !checked && prev.primaryChannel === channel ? '' : prev.primaryChannel
      return { ...prev, channels, primaryChannel }
    })
  }

  const openDialog = (mode: 'quick' | 'internal' | 'external', m?: any) => {
    setCallMode(mode)
    if (m) {
      setEditingId(m.id)
      setFormData({
        assetId: m.asset_id || '',
        supplierId: '',
        type: m.type || 'Corretiva',
        date: m.date || new Date().toISOString().split('T')[0],
        order_date: m.order_date || new Date().toISOString().split('T')[0],
        description: m.description || '',
        priority: m.priority || 'Média',
        origin: m.origin || 'Manual',
        channels: [],
        primaryChannel: '',
      })
    } else {
      setEditingId(null)
      setFormData({
        assetId: '',
        supplierId: '',
        type: 'Corretiva',
        date: new Date().toISOString().split('T')[0],
        order_date: new Date().toISOString().split('T')[0],
        description: '',
        priority: 'Média',
        origin:
          mode === 'quick'
            ? 'Manual'
            : mode === 'internal'
              ? 'Planejamento'
              : 'Acionamento Externo',
        channels: [],
        primaryChannel: '',
      })
    }
    setDialogOpen(true)
  }

  const handleEdit = (m: any) => {
    if (m.type === 'Solicitação') openDialog('quick', m)
    else if (m.type === 'Chamado Externo') openDialog('external', m)
    else openDialog('internal', m)
  }

  const handleCancel = async (id: string) => {
    if (confirm('Tem certeza que deseja cancelar este chamado?')) {
      const { error } = await supabase
        .from('maintenances')
        .update({ status: 'Cancelado' })
        .eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Chamado cancelado com sucesso!' })
        fetchData()
      }
    }
  }

  const handleSave = async () => {
    if (!formData.assetId)
      return toast({
        title: 'Atenção',
        description: 'Selecione um ativo.',
        variant: 'destructive',
      })

    let payload: any = {
      company_id: activeCompanyId,
      asset_id: formData.assetId,
      description: formData.description,
      priority: formData.priority,
      origin: formData.origin,
      date: formData.date || new Date().toISOString().split('T')[0],
      order_date: formData.order_date || new Date().toISOString().split('T')[0],
    }

    if (!editingId) {
      payload.status = 'Pendente'
    }

    if (callMode === 'quick') {
      payload.type = 'Solicitação'
      if (!editingId) payload.technician = 'A Definir'
    } else if (callMode === 'internal') {
      payload.type = formData.type
      if (!editingId) payload.technician = 'Interno'
    } else if (callMode === 'external') {
      if (!formData.supplierId && !editingId)
        return toast({
          title: 'Atenção',
          description: 'Selecione um fornecedor.',
          variant: 'destructive',
        })
      payload.type = 'Chamado Externo'
      if (!editingId) payload.technician = selectedSupplier?.name || 'Externo'
      if (formData.channels.length > 0) {
        payload.description =
          `${formData.description}\n\n[Contato via: ${formData.channels.join(', ')} | Principal: ${formData.primaryChannel}]`.trim()
        if (formData.channels.includes('email')) {
          payload.email_sent = true
        }
      }
    }

    if (editingId) {
      const { error } = await supabase.from('maintenances').update(payload).eq('id', editingId)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Registro atualizado com sucesso!' })
        setDialogOpen(false)
        fetchData()
      }
    } else {
      const { error } = await supabase.from('maintenances').insert(payload)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Registro criado com sucesso!' })
        if (payload.email_sent) {
          toast({
            title: 'E-mail enviado',
            description: 'O fornecedor foi notificado por e-mail de forma sistêmica.',
          })
        }
        setDialogOpen(false)
        fetchData()
      }
    }
  }

  const isWarrantyActive = (w: any) => {
    if (!w.end_date) return true
    const end = new Date(w.end_date)
    end.setHours(23, 59, 59, 999)
    return end.getTime() >= new Date().getTime()
  }

  const warrantySupplierIds = data.warranties
    .filter((w) => w.asset_id === formData.assetId && isWarrantyActive(w))
    .flatMap((w) => w.warranty_suppliers?.map((ws: any) => ws.supplier_id) || [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manutenção</h2>
          <p className="text-muted-foreground">Gestão de chamados e ordens de serviço.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Novo Registro
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem onClick={() => openDialog('quick')}>
              <AlertCircle className="w-4 h-4 mr-2" /> Relato de Problema Rápido
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog('internal')}>
              <Wrench className="w-4 h-4 mr-2" /> Ordem de Serviço Interna
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog('external')}>
              <PhoneCall className="w-4 h-4 mr-2" /> Acionar Fornecedor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Chamados e OS</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Tipo / Origem</TableHead>
                <TableHead>Data Programada</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.maintenances.length > 0 ? (
                data.maintenances.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      <div>{m.assets?.name}</div>
                      {m.description && (
                        <div
                          className="text-xs text-muted-foreground truncate max-w-[200px]"
                          title={m.description}
                        >
                          {m.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{m.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {m.origin || 'Manual'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {m.date
                        ? new Date(m.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        : '-'}
                      {m.email_sent && (
                        <MailCheck
                          className="w-4 h-4 inline-block ml-2 text-success"
                          title="E-mail Enviado"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={m.priority || 'Média'} />
                    </TableCell>
                    <TableCell>{m.technician}</TableCell>
                    <TableCell>
                      <StatusBadge status={m.status || 'Pendente'} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(m)}>
                            <Edit2 className="w-4 h-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCancel(m.id)}
                            className="text-danger"
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Cancelar Chamado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma manutenção registrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Registro' : callMode === 'quick' && 'Relato de Problema Rápido'}
              {!editingId && callMode === 'internal' && 'Nova Ordem de Serviço Interna'}
              {!editingId && callMode === 'external' && 'Acionar Fornecedor'}
            </DialogTitle>
            <DialogDescription>
              {callMode === 'quick' &&
                'Abra um chamado simplificado informando o problema do ativo.'}
              {callMode === 'internal' &&
                'Crie uma OS preventiva ou corretiva para a equipe interna.'}
              {callMode === 'external' &&
                'Solicite manutenção terceirizada e defina os canais de contato.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Ativo *</Label>
              <Select
                value={formData.assetId}
                onValueChange={(v) => {
                  let nextSupplierId = formData.supplierId
                  const activeWs = data.warranties.filter(
                    (w) => w.asset_id === v && isWarrantyActive(w),
                  )
                  const sids = activeWs.flatMap(
                    (w) => w.warranty_suppliers?.map((ws: any) => ws.supplier_id) || [],
                  )
                  if (sids.length > 0 && (!nextSupplierId || !sids.includes(nextSupplierId))) {
                    nextSupplierId = sids[0]
                  }
                  setFormData({ ...formData, assetId: v, supplierId: nextSupplierId })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ativo..." />
                </SelectTrigger>
                <SelectContent>
                  {data.assets.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {warrantySupplierIds.length > 0 && formData.assetId && callMode !== 'external' && (
              <div className="bg-primary/10 text-primary p-3 rounded-md flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <div className="text-sm">
                  <strong>Garantia Ativa!</strong> Este ativo possui fornecedores responsáveis pela
                  garantia. Considere alterar o tipo para "Acionar Fornecedor".
                </div>
              </div>
            )}

            {callMode === 'quick' && (
              <div className="space-y-2">
                <Label>Origem da Solicitação</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(v) => setFormData({ ...formData, origin: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="QR Code">Leitura de QR Code</SelectItem>
                    <SelectItem value="Inspeção">Inspeção de Rotina</SelectItem>
                    <SelectItem value="Alerta Automático">Alerta Automático (IoT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {callMode === 'internal' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de OS</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preventiva">Preventiva</SelectItem>
                      <SelectItem value="Corretiva">Corretiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data Programada</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-9"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Data do Pedido</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-9"
                      value={formData.order_date}
                      onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                      disabled={!canEditOrderDate}
                      title={!canEditOrderDate ? 'Apenas gerentes ou admins podem alterar.' : ''}
                    />
                  </div>
                </div>
              </div>
            )}

            {callMode === 'external' && (
              <div className="space-y-2">
                {!editingId && (
                  <>
                    <Label>Fornecedor / Assistência *</Label>
                    <Select
                      value={formData.supplierId}
                      onValueChange={(v) => setFormData({ ...formData, supplierId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {data.suppliers.map((s) => {
                          const isWarranty = warrantySupplierIds.includes(s.id)
                          return (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} {isWarranty ? '⭐ (Garantia)' : ''}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {warrantySupplierIds.length > 0 && formData.assetId && (
                      <p className="text-xs text-primary mt-1 flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Este ativo possui garantia ativa.
                        Fornecedores sugeridos estão marcados.
                      </p>
                    )}
                  </>
                )}

                {selectedSupplier && !editingId && (
                  <div className="space-y-3 pt-2 mt-2 border-t">
                    <Label className="text-sm">Canais de Contato Utilizados</Label>
                    <div className="flex gap-4">
                      {['email', 'phone', 'whatsapp'].map((ch) => (
                        <div key={ch} className="flex items-center space-x-2">
                          <Checkbox
                            id={`ch-${ch}`}
                            checked={formData.channels.includes(ch)}
                            onCheckedChange={(c) => handleToggleChannel(ch, !!c)}
                          />
                          <Label htmlFor={`ch-${ch}`} className="capitalize">
                            {ch === 'phone' ? 'Telefone' : ch}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.channels.length > 0 && (
                      <div className="pt-2">
                        <Label className="text-sm">Canal Principal</Label>
                        <RadioGroup
                          value={formData.primaryChannel}
                          onValueChange={(v) => setFormData({ ...formData, primaryChannel: v })}
                          className="flex gap-4 mt-2"
                        >
                          {formData.channels.map((ch) => (
                            <div key={`pri-${ch}`} className="flex items-center space-x-2">
                              <RadioGroupItem value={ch} id={`pri-${ch}`} />
                              <Label htmlFor={`pri-${ch}`} className="capitalize">
                                {ch === 'phone' ? 'Telefone' : ch}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) => setFormData({ ...formData, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descrição / Sintomas</Label>
              <Textarea
                placeholder="Descreva o problema ou serviço necessário..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingId ? 'Salvar Alterações' : 'Salvar Registro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
