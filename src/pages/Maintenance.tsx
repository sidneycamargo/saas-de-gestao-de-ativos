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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
  const { session } = useAuth()
  const [userRole, setUserRole] = useState<string>('Member')

  const [data, setData] = useState({
    maintenances: [] as any[],
    assets: [] as any[],
    suppliers: [] as any[],
    warranties: [] as any[],
    technicians: [] as any[],
    contracts: [] as any[],
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [callMode, setCallMode] = useState<
    'quick' | 'internal' | 'external' | 'ticket' | 'preventive'
  >('ticket')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    assetId: '',
    contractId: '',
    supplierId: '',
    isWarranty: false,
    type: 'Abertura de Chamado',
    start_date: new Date().toISOString().split('T')[0],
    forecast_date: '',
    end_date: '',
    description: '',
    execution_logs: [] as any[],
    new_execution_note: '',
    priority: 'Média',
    origin: 'Manual',
    channels: [] as string[],
    primaryChannel: '',
    status: 'Aberto',
    technician: '',
    technician_id: 'none',
    maintenanceAssets: [] as {
      id?: string
      asset_id: string
      name: string
      problem_description: string
      notes: string
    }[],
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [mRes, aRes, sRes, wRes, tRes, cRes] = await Promise.all([
      supabase
        .from('maintenances')
        .select(
          '*, assets(name), technicians(name), contracts:contract_id(identifier, suppliers(name)), maintenance_assets(*, assets(name, patrimony)), maintenance_logs(*, profiles(name))',
        )
        .eq('company_id', activeCompanyId)
        .order('created_at', { ascending: false }) as Promise<any>,
      supabase.from('assets').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase.from('suppliers').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase
        .from('warranties')
        .select('*, warranty_suppliers(supplier_id)')
        .eq('company_id', activeCompanyId),
      supabase.from('technicians').select('*').eq('company_id', activeCompanyId).order('name'),
      supabase
        .from('contracts')
        .select('*, suppliers(name)')
        .eq('company_id', activeCompanyId)
        .order('identifier'),
    ])
    setData({
      maintenances: mRes.data || [],
      assets: aRes.data || [],
      suppliers: sRes.data || [],
      warranties: wRes.data || [],
      technicians: tRes.data || [],
      contracts: cRes.data || [],
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
        contractId: m.contract_id || '',
        supplierId: m.supplier_id || '',
        isWarranty: m.is_warranty || false,
        type: m.type || 'Manutenção Corretiva',
        start_date: m.start_date || m.date || new Date().toISOString().split('T')[0],
        forecast_date: m.forecast_date || '',
        end_date: m.end_date || '',
        description: m.description || '',
        execution_logs:
          m.maintenance_logs?.sort(
            (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
          ) || [],
        new_execution_note: '',
        priority: m.priority || 'Média',
        origin: m.origin || 'Manual',
        channels: [],
        primaryChannel: '',
        status: m.status || 'Aberto',
        technician: m.technician || '',
        technician_id: m.technician_id || 'none',
        maintenanceAssets:
          m.maintenance_assets?.map((ma: any) => ({
            id: ma.id,
            asset_id: ma.asset_id,
            name: ma.assets?.name || 'Ativo',
            problem_description: ma.problem_description || '',
            notes: ma.notes || '',
          })) || [],
      })
    } else {
      setEditingId(null)
      setFormData({
        assetId: '',
        contractId: '',
        supplierId: '',
        isWarranty: false,
        type:
          mode === 'ticket'
            ? 'Abertura de Chamado'
            : mode === 'preventive'
              ? 'Manutenção Preventiva'
              : 'Manutenção Corretiva',
        start_date: new Date().toISOString().split('T')[0],
        forecast_date: '',
        end_date: '',
        description: '',
        execution_logs: [],
        new_execution_note: '',
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
        maintenanceAssets: [],
      })
    }
    setDialogOpen(true)
  }

  const handleEdit = (m: any) => {
    if (m.type === 'Abertura de Chamado') openDialog('ticket', m)
    else if (m.type === 'Solicitação') openDialog('quick', m)
    else if (m.type === 'Suporte Técnico' || m.type === 'Chamado Externo') openDialog('external', m)
    else if (m.type === 'Manutenção Preventiva' || m.contract_id) openDialog('preventive', m)
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
    if (callMode === 'preventive' && !formData.contractId)
      return toast({
        title: 'Atenção',
        description: 'Selecione um contrato para a manutenção preventiva.',
        variant: 'destructive',
      })
    if (callMode !== 'preventive' && !formData.assetId)
      return toast({
        title: 'Atenção',
        description: 'Selecione um ativo.',
        variant: 'destructive',
      })

    let payload: any = {
      company_id: activeCompanyId,
      asset_id: callMode !== 'preventive' ? formData.assetId : null,
      contract_id: callMode === 'preventive' ? formData.contractId : null,
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
      payload.type = 'Manutenção Corretiva'
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

    let savedMaintenanceId = editingId

    if (editingId) {
      const { error } = await supabase.from('maintenances').update(payload).eq('id', editingId)
      if (error) return toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      const { data, error } = await supabase.from('maintenances').insert(payload).select().single()
      if (error) return toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      savedMaintenanceId = data.id
    }

    if (savedMaintenanceId && formData.new_execution_note.trim()) {
      const { error: logError } = await supabase.from('maintenance_logs' as any).insert({
        company_id: activeCompanyId,
        maintenance_id: savedMaintenanceId,
        user_id: session?.user?.id,
        note: formData.new_execution_note.trim(),
      })
      if (logError) {
        console.error(logError)
        toast({
          title: 'Erro ao salvar anotação',
          description: logError.message,
          variant: 'destructive',
        })
      }
    }

    if (savedMaintenanceId && formData.maintenanceAssets.length > 0) {
      const assetsPayload = formData.maintenanceAssets.map((ma) => ({
        id: ma.id || undefined,
        maintenance_id: savedMaintenanceId,
        asset_id: ma.asset_id,
        problem_description: ma.problem_description,
        notes: ma.notes,
      }))
      const { error: maError } = await supabase
        .from('maintenance_assets' as any)
        .upsert(assetsPayload, { onConflict: 'maintenance_id,asset_id' })
      if (maError) {
        console.error(maError)
        toast({
          title: 'Erro ao vincular ativos',
          description: maError.message,
          variant: 'destructive',
        })
      }
    }

    toast({ title: 'Evento salvo com sucesso!' })
    if (payload.email_sent) {
      toast({
        title: 'E-mail enviado',
        description: 'O fornecedor foi notificado por e-mail de forma sistêmica.',
      })
    }
    setDialogOpen(false)
    fetchData()
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
              <Wrench className="w-4 h-4 mr-2" /> Manutenção Corretiva (Por Ativo)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog('external')}>
              <Activity className="w-4 h-4 mr-2" /> Suporte Técnico Externo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog('preventive')}>
              <CalendarIcon className="w-4 h-4 mr-2" /> Manutenção Preventiva (Por Contrato)
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
                <TableHead>Ativo / Contrato</TableHead>
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
                      {m.contract_id && m.contracts ? (
                        <div className="text-primary font-semibold">
                          Contrato: {m.contracts.identifier || 'Sem identificador'}
                          {m.maintenance_assets?.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-normal">
                              {m.maintenance_assets.length} ativos vinculados
                              {m.maintenance_assets.filter((ma: any) => ma.problem_description)
                                .length > 0 && (
                                <Popover>
                                  <PopoverTrigger className="text-danger hover:underline cursor-pointer flex items-center ml-1">
                                    (
                                    {
                                      m.maintenance_assets.filter(
                                        (ma: any) => ma.problem_description,
                                      ).length
                                    }{' '}
                                    com problemas)
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-sm">Problemas Relatados</h4>
                                      {m.maintenance_assets
                                        .filter((ma: any) => ma.problem_description)
                                        .map((ma: any) => (
                                          <div
                                            key={ma.id || ma.asset_id}
                                            className="text-sm border-b pb-2 last:border-0"
                                          >
                                            <span className="font-medium block">
                                              {ma.assets?.name || 'Ativo'}:
                                            </span>
                                            <span className="text-muted-foreground">
                                              {ma.problem_description}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div>{m.assets?.name || 'Ativo Removido'}</div>
                          {m.maintenance_assets?.length > 0 &&
                            (m.maintenance_assets[0]?.problem_description ||
                              m.maintenance_assets[0]?.notes) && (
                              <div className="text-xs text-muted-foreground mt-1 font-normal">
                                Possui anotações detalhadas
                              </div>
                            )}
                        </div>
                      )}
                      {m.description && (
                        <div
                          className="text-xs text-muted-foreground truncate max-w-[200px] mt-1"
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
                            <Edit2 className="w-4 h-4 mr-2" /> Editar / Ver Detalhes
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
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? 'Detalhes do Evento'
                : callMode === 'quick' && 'Relato de Problema Rápido'}
              {!editingId && callMode === 'ticket' && 'Abertura de Chamado'}
              {!editingId && callMode === 'internal' && 'Nova Manutenção Corretiva (Por Ativo)'}
              {!editingId && callMode === 'external' && 'Acionar Suporte Técnico'}
              {!editingId &&
                callMode === 'preventive' &&
                'Agendamento de Manutenção Preventiva (Por Contrato)'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do evento para manter o histórico de manutenção organizado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {callMode === 'preventive' ? (
              <div className="space-y-2">
                <Label>Contrato *</Label>
                <Select
                  value={formData.contractId}
                  onValueChange={(v) => {
                    const contractAssets = data.assets.filter((a) => a.contract_id === v)
                    setFormData({
                      ...formData,
                      contractId: v,
                      maintenanceAssets: contractAssets.map((a) => ({
                        asset_id: a.id,
                        name: a.name,
                        problem_description: '',
                        notes: '',
                      })),
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o contrato..." />
                  </SelectTrigger>
                  <SelectContent>
                    {data.contracts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.identifier || 'Sem Identificador'} (
                        {c.suppliers?.name || 'Fornecedor N/A'}) -{' '}
                        {c.preventive_maintenance_period || 'Sem periodicidade'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
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
                    const asset = data.assets.find((a) => a.id === v)
                    setFormData({
                      ...formData,
                      assetId: v,
                      supplierId: nextSupplierId,
                      maintenanceAssets: asset
                        ? [
                            {
                              asset_id: asset.id,
                              name: asset.name,
                              problem_description: '',
                              notes: '',
                            },
                          ]
                        : [],
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ativo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {data.assets.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} {a.patrimony ? `(${a.patrimony})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {warrantySupplierIds.length > 0 &&
              formData.assetId &&
              callMode !== 'external' &&
              callMode !== 'ticket' &&
              callMode !== 'preventive' && (
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

            <div className="space-y-4 pt-4 border-t mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Detalhes do Evento</h3>
                <div className="w-1/3">
                  <Label className="sr-only">Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) => setFormData({ ...formData, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Prioridade: Baixa</SelectItem>
                      <SelectItem value="Média">Prioridade: Média</SelectItem>
                      <SelectItem value="Alta">Prioridade: Alta</SelectItem>
                      <SelectItem value="Urgente">Prioridade: Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Motivo / Descrição Geral</Label>
                <Textarea
                  placeholder="Descreva o motivo ou sintomas que geraram este evento..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <Label>Histórico de Execução (Pós-Evento)</Label>

                {formData.execution_logs && formData.execution_logs.length > 0 && (
                  <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-2">
                    {formData.execution_logs.map((log: any) => (
                      <div key={log.id} className="bg-slate-50 p-3 rounded-md border text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-slate-700">
                            {log.profiles?.name || 'Usuário'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-slate-600 whitespace-pre-wrap">{log.note}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm">
                    {formData.execution_logs?.length
                      ? 'Adicionar nova anotação'
                      : 'Anotação inicial da execução'}
                  </Label>
                  <Textarea
                    placeholder="Descreva procedimentos realizados, peças trocadas ou pendências..."
                    value={formData.new_execution_note}
                    onChange={(e) =>
                      setFormData({ ...formData, new_execution_note: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {formData.maintenanceAssets.length > 0 && (
              <div className="space-y-4 pt-4 border-t mt-2">
                <h3 className="text-lg font-semibold">
                  Ativos Vinculados ({formData.maintenanceAssets.length})
                </h3>
                <p className="text-sm text-muted-foreground">
                  Registre problemas a serem verificados e anotações específicas para cada ativo
                  durante a execução deste evento.
                </p>
                <Accordion type="multiple" className="w-full">
                  {formData.maintenanceAssets.map((ma, index) => (
                    <AccordionItem key={ma.asset_id} value={ma.asset_id}>
                      <AccordionTrigger className="hover:no-underline bg-slate-50 px-4 rounded-md border mb-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Wrench className="w-4 h-4 text-muted-foreground" />
                          <span>{ma.name}</span>
                          {ma.problem_description && (
                            <Badge variant="destructive" className="ml-2 text-[10px]">
                              Com Problema
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 bg-white rounded-b-md border-x border-b -mt-3 mb-2 space-y-4 shadow-sm">
                        <div className="space-y-2">
                          <Label>Problema Relatado / Observação Pré-Manutenção</Label>
                          <Textarea
                            placeholder="Ex: Barulho excessivo na ventoinha, verificar lubrificação..."
                            value={ma.problem_description}
                            onChange={(e) => {
                              const newAssets = [...formData.maintenanceAssets]
                              newAssets[index].problem_description = e.target.value
                              setFormData({ ...formData, maintenanceAssets: newAssets })
                            }}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Anotações da Execução (Exclusivo deste ativo)</Label>
                          <Textarea
                            placeholder="Ex: Foi realizada a troca da peça X, equipamento testado e operacional."
                            value={ma.notes}
                            onChange={(e) => {
                              const newAssets = [...formData.maintenanceAssets]
                              newAssets[index].notes = e.target.value
                              setFormData({ ...formData, maintenanceAssets: newAssets })
                            }}
                            rows={2}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
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
