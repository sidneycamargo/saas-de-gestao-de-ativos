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
  Activity,
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

function EventStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Concluído':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Concluído
        </Badge>
      )
    case 'Em Andamento':
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Em Andamento
        </Badge>
      )
    case 'Aguardando Peças':
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
          Aguardando Peças
        </Badge>
      )
    case 'Cancelado':
      return <Badge variant="destructive">Cancelado</Badge>
    case 'Aberto':
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          Aberto
        </Badge>
      )
    case 'Agendado':
      return (
        <Badge variant="secondary" className="bg-teal-100 text-teal-700">
          Agendado
        </Badge>
      )
    case 'Pendente':
    default:
      return <Badge variant="outline">{status || 'Pendente'}</Badge>
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
    technicians: [] as any[],
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [callMode, setCallMode] = useState<
    'quick' | 'internal' | 'external' | 'ticket' | 'preventive'
  >('ticket')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    assetId: '',
    supplierId: '',
    isWarranty: false,
    type: 'Abertura de Chamado',
    start_date: new Date().toISOString().split('T')[0],
    forecast_date: '',
    end_date: '',
    description: '',
    priority: 'Média',
    origin: 'Manual',
    channels: [] as string[],
    primaryChannel: '',
    status: 'Aberto',
    technician: '',
    technician_id: 'none',
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [mRes, aRes, sRes, wRes, tRes] = await Promise.all([
      supabase
        .from('maintenances')
        .select('*, assets(name), technicians(name)')
        .eq('company_id', activeCompanyId)
        .order('created_at', { ascending: false }),
      supabase.from('assets').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase.from('suppliers').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase
        .from('warranties')
        .select('*, warranty_suppliers(supplier_id)')
        .eq('company_id', activeCompanyId),
      supabase.from('technicians').select('*').eq('company_id', activeCompanyId).order('name'),
    ])
    setData({
      maintenances: mRes.data || [],
      assets: aRes.data || [],
      suppliers: sRes.data || [],
      warranties: wRes.data || [],
      technicians: tRes.data || [],
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

  const openDialog = (
    mode: 'quick' | 'internal' | 'external' | 'ticket' | 'preventive',
    m?: any,
  ) => {
    setCallMode(mode)
    if (m) {
      setEditingId(m.id)
      setFormData({
        assetId: m.asset_id || '',
        supplierId: m.supplier_id || '',
        isWarranty: m.is_warranty || false,
        type: m.type || 'Corretiva',
        start_date: m.start_date || m.date || new Date().toISOString().split('T')[0],
        forecast_date: m.forecast_date || '',
        end_date: m.end_date || '',
        description: m.description || '',
        priority: m.priority || 'Média',
        origin: m.origin || 'Manual',
        channels: [],
        primaryChannel: '',
        status: m.status || 'Aberto',
        technician: m.technician || '',
        technician_id: m.technician_id || 'none',
      })
    } else {
      setEditingId(null)
      setFormData({
        assetId: '',
        supplierId: '',
        isWarranty: false,
        type:
          mode === 'ticket'
            ? 'Abertura de Chamado'
            : mode === 'preventive'
              ? 'Manutenção Preventiva'
              : 'Corretiva',
        start_date: new Date().toISOString().split('T')[0],
        forecast_date: '',
        end_date: '',
        description: '',
        priority: 'Média',
        origin:
          mode === 'quick'
            ? 'Manual'
            : mode === 'internal'
              ? 'Planejamento'
              : mode === 'ticket'
                ? 'Chamado'
                : mode === 'preventive'
                  ? 'Contrato'
                  : 'Acionamento Externo',
        channels: [],
        primaryChannel: '',
        status: mode === 'preventive' ? 'Agendado' : 'Aberto',
        technician: '',
        technician_id: 'none',
      })
    }
    setDialogOpen(true)
  }

  const handleEdit = (m: any) => {
    if (m.type === 'Abertura de Chamado') openDialog('ticket', m)
    else if (m.type === 'Solicitação') openDialog('quick', m)
    else if (m.type === 'Suporte Técnico' || m.type === 'Chamado Externo') openDialog('external', m)
    else if (m.type === 'Manutenção Preventiva') openDialog('preventive', m)
    else openDialog('internal', m)
  }

  const handleCancel = async (id: string) => {
    if (confirm('Tem certeza que deseja cancelar este evento?')) {
      const { error } = await supabase
        .from('maintenances')
        .update({ status: 'Cancelado' })
        .eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Evento cancelado com sucesso!' })
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
      start_date: formData.start_date || null,
      forecast_date: formData.forecast_date || null,
      end_date: formData.end_date || null,
      status: formData.status,
      technician: formData.technician,
      technician_id: formData.technician_id !== 'none' ? formData.technician_id : null,
    }

    if (callMode === 'quick') {
      payload.type = 'Solicitação'
      if (!editingId && !formData.technician) payload.technician = 'A Definir'
    } else if (callMode === 'preventive') {
      payload.type = 'Manutenção Preventiva'
      if (!editingId && !formData.technician) payload.technician = 'A Definir'
    } else if (callMode === 'ticket') {
      payload.type = 'Abertura de Chamado'
      payload.supplier_id = formData.supplierId || null
      payload.is_warranty = formData.isWarranty
      if (!editingId && !formData.technician) payload.technician = 'Suporte Interno'
    } else if (callMode === 'internal') {
      payload.type = formData.type
      if (!editingId && !formData.technician) payload.technician = 'Interno'
    } else if (callMode === 'external') {
      if (!formData.supplierId && !editingId && !formData.isWarranty)
        return toast({
          title: 'Atenção',
          description: 'Selecione um fornecedor ou assinale que é garantia.',
          variant: 'destructive',
        })
      payload.type = 'Suporte Técnico'
      payload.supplier_id = formData.supplierId || null
      payload.is_warranty = formData.isWarranty
      if (!editingId && !formData.technician)
        payload.technician = selectedSupplier?.name || 'Fornecedor'

      if (formData.channels.length > 0 && !editingId) {
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
        toast({ title: 'Evento atualizado com sucesso!' })
        setDialogOpen(false)
        fetchData()
      }
    } else {
      const { error } = await supabase.from('maintenances').insert(payload)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Evento criado com sucesso!' })
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
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Eventos</h2>
          <p className="text-muted-foreground">
            Controle de eventos, chamados, manutenções e suportes técnicos.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Novo Evento
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem onClick={() => openDialog('ticket')}>
              <PhoneCall className="w-4 h-4 mr-2" /> Abertura de Chamado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog('quick')}>
              <AlertCircle className="w-4 h-4 mr-2" /> Relato de Problema Rápido
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog('internal')}>
              <Wrench className="w-4 h-4 mr-2" /> Manutenção / OS Interna
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog('external')}>
              <Activity className="w-4 h-4 mr-2" /> Suporte Técnico Externo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog('preventive')}>
              <CalendarIcon className="w-4 h-4 mr-2" /> Agendamento Preventivo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Ocorrências e Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Evento / Origem</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Previsão</TableHead>
                <TableHead>Fim</TableHead>
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
                          {m.origin || 'Manual'} {m.is_warranty ? '(Garantia)' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {m.start_date
                        ? new Date(m.start_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        : m.date
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
                      {m.forecast_date
                        ? new Date(m.forecast_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {m.end_date
                        ? new Date(m.end_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        : '-'}
                    </TableCell>
                    <TableCell>{m.technicians?.name || m.technician || '-'}</TableCell>
                    <TableCell>
                      <EventStatusBadge status={m.status || 'Aberto'} />
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
                            <XCircle className="w-4 h-4 mr-2" /> Cancelar Evento
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum evento registrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Evento' : callMode === 'quick' && 'Relato de Problema Rápido'}
              {!editingId && callMode === 'ticket' && 'Abertura de Chamado'}
              {!editingId && callMode === 'internal' && 'Nova OS / Manutenção Interna'}
              {!editingId && callMode === 'external' && 'Acionar Suporte Técnico'}
              {!editingId && callMode === 'preventive' && 'Agendamento de Manutenção Preventiva'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do evento para manter o histórico do ativo organizado.
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

            {warrantySupplierIds.length > 0 &&
              formData.assetId &&
              callMode !== 'external' &&
              callMode !== 'ticket' && (
                <div className="bg-primary/10 text-primary p-3 rounded-md flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <div className="text-sm">
                    <strong>Garantia Ativa!</strong> Este ativo possui fornecedores responsáveis
                    pela garantia. Considere utilizar o tipo "Suporte Técnico Externo" ou "Abertura
                    de Chamado".
                  </div>
                </div>
              )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{callMode === 'preventive' ? 'Data Agendada' : 'Data de Início'}</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-9"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Previsão de Entrega</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-9"
                    value={formData.forecast_date}
                    onChange={(e) => setFormData({ ...formData, forecast_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data de Conclusão</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-9"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status do Evento</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aberto">Aberto</SelectItem>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Aguardando Peças">Aguardando Peças</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Responsável / Técnico</Label>
                <Select
                  value={formData.technician_id}
                  onValueChange={(v) => {
                    const tech = data.technicians.find((t) => t.id === v)
                    setFormData({
                      ...formData,
                      technician_id: v,
                      technician: tech ? tech.name : '',
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um técnico..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não informado / Manual</SelectItem>
                    {data.technicians.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} ({t.specialty || t.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.technician_id === 'none' && (
                  <Input
                    className="mt-2"
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                    placeholder="Ou digite o nome manualmente..."
                  />
                )}
              </div>
            </div>

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
              <div className="space-y-2">
                <Label>Tipo de OS / Manutenção</Label>
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
            )}

            {callMode === 'preventive' && (
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input value="Manutenção Preventiva" disabled />
              </div>
            )}

            {(callMode === 'external' || callMode === 'ticket') && (
              <div className="space-y-2 border p-4 rounded-md bg-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fornecedor / Assistência (Suporte Externo)</Label>
                    <Select
                      value={formData.supplierId}
                      onValueChange={(v) => setFormData({ ...formData, supplierId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Nenhum (Suporte Interno)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum (Suporte Interno)</SelectItem>
                        {data.suppliers.map((s) => {
                          const isWarr = warrantySupplierIds.includes(s.id)
                          return (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} {isWarr ? '⭐ (Garantia)' : ''}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="is-warranty"
                      checked={formData.isWarranty}
                      onCheckedChange={(c) => setFormData({ ...formData, isWarranty: !!c })}
                    />
                    <Label htmlFor="is-warranty" className="font-medium">
                      Atendimento em Garantia
                    </Label>
                  </div>
                </div>

                {callMode === 'external' && selectedSupplier && !editingId && (
                  <div className="space-y-3 pt-4 mt-2 border-t">
                    <Label className="text-sm text-slate-700">
                      Canais de Contato Utilizados para Abertura
                    </Label>
                    <div className="flex gap-4">
                      {['email', 'phone', 'whatsapp'].map((ch) => (
                        <div key={ch} className="flex items-center space-x-2">
                          <Checkbox
                            id={`ch-${ch}`}
                            checked={formData.channels.includes(ch)}
                            onCheckedChange={(c) => handleToggleChannel(ch, !!c)}
                          />
                          <Label htmlFor={`ch-${ch}`} className="capitalize text-sm">
                            {ch === 'phone' ? 'Telefone' : ch}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.channels.length > 0 && (
                      <div className="pt-2">
                        <Label className="text-sm text-slate-700">Canal Principal</Label>
                        <RadioGroup
                          value={formData.primaryChannel}
                          onValueChange={(v) => setFormData({ ...formData, primaryChannel: v })}
                          className="flex gap-4 mt-2"
                        >
                          {formData.channels.map((ch) => (
                            <div key={`pri-${ch}`} className="flex items-center space-x-2">
                              <RadioGroupItem value={ch} id={`pri-${ch}`} />
                              <Label htmlFor={`pri-${ch}`} className="capitalize text-sm">
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
                placeholder="Descreva os detalhes do evento ou problema..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingId ? 'Salvar Alterações' : 'Registrar Evento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
