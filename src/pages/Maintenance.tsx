import { useState, useEffect } from 'react'
import { Plus, Calendar as CalendarIcon, PhoneCall } from 'lucide-react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export default function Maintenance() {
  const { activeCompanyId } = useCompanyStore()
  const [maintenances, setMaintenances] = useState<any[]>([])
  const [equipments, setEquipments] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])

  const [callOpen, setCallOpen] = useState(false)
  const [osOpen, setOsOpen] = useState(false)

  const [callData, setCallData] = useState({
    equipmentId: '',
    supplierId: '',
    channels: [] as string[],
    primaryChannel: '',
  })

  const [osData, setOsData] = useState({
    equipmentId: '',
    type: '',
    date: '',
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [mRes, eRes, sRes] = await Promise.all([
      supabase
        .from('maintenances')
        .select('*, assets(name)')
        .eq('company_id', activeCompanyId)
        .order('date', { ascending: false }),
      supabase
        .from('assets')
        .select('*')
        .eq('company_id', activeCompanyId)
        .eq('type', 'equipment')
        .order('name'),
      supabase.from('suppliers').select('*').eq('company_id', activeCompanyId).order('name'),
    ])
    if (mRes.data) setMaintenances(mRes.data)
    if (eRes.data) setEquipments(eRes.data)
    if (sRes.data) setSuppliers(sRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const selectedSupplier = suppliers.find((s) => s.id === callData.supplierId)

  const handleToggleChannel = (channel: string, checked: boolean) => {
    setCallData((prev) => {
      const newChannels = checked
        ? [...prev.channels, channel]
        : prev.channels.filter((c) => c !== channel)
      const newPrimary = !checked && prev.primaryChannel === channel ? '' : prev.primaryChannel
      return { ...prev, channels: newChannels, primaryChannel: newPrimary }
    })
  }

  const handleSaveOS = async () => {
    if (!osData.equipmentId || !osData.type || !osData.date) return
    const { error } = await supabase.from('maintenances').insert({
      company_id: activeCompanyId,
      asset_id: osData.equipmentId,
      type: osData.type === 'prev' ? 'Preventiva' : 'Corretiva',
      date: osData.date,
      status: 'Pendente',
      technician: 'Interno',
    })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Ordem criada' })
      setOsOpen(false)
      fetchData()
    }
  }

  const handleSaveCall = async () => {
    if (!callData.equipmentId || !callData.supplierId) return
    const { error } = await supabase.from('maintenances').insert({
      company_id: activeCompanyId,
      asset_id: callData.equipmentId,
      type: 'Chamado Externo',
      date: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      technician: selectedSupplier?.name || 'Externo',
    })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({
        title: 'Chamado Aberto',
        description: 'Solicitação de serviço registrada com sucesso.',
      })
      setCallOpen(false)
      fetchData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manutenção</h2>
          <p className="text-muted-foreground">Agendamento e histórico de ordens de serviço.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Dialog open={callOpen} onOpenChange={setCallOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <PhoneCall className="w-4 h-4 mr-2" /> Abrir Chamado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Abrir Chamado Externo</DialogTitle>
                <DialogDescription>
                  Solicite manutenção terceirizada para um equipamento.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Equipamento</Label>
                  <Select onValueChange={(v) => setCallData({ ...callData, equipmentId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {equipments.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fornecedor / Assistência</Label>
                  <Select onValueChange={(v) => setCallData({ ...callData, supplierId: v })}>
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

                {selectedSupplier && (
                  <>
                    <div className="space-y-3 pt-2 border-t">
                      <Label className="text-base">Meios de Comunicação Desejados</Label>
                      <div className="flex gap-4">
                        {['email', 'phone', 'whatsapp'].map((ch) => (
                          <div key={ch} className="flex items-center space-x-2">
                            <Checkbox
                              id={`ch-${ch}`}
                              checked={callData.channels.includes(ch)}
                              onCheckedChange={(c) => handleToggleChannel(ch, !!c)}
                            />
                            <Label htmlFor={`ch-${ch}`} className="capitalize">
                              {ch === 'phone' ? 'Telefone' : ch}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {callData.channels.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <Label>Meio Principal para Abertura e Comunicação Oficial</Label>
                        <RadioGroup
                          value={callData.primaryChannel}
                          onValueChange={(v) => setCallData({ ...callData, primaryChannel: v })}
                        >
                          <div className="flex gap-4">
                            {callData.channels.map((ch) => (
                              <div key={`pri-${ch}`} className="flex items-center space-x-2">
                                <RadioGroupItem value={ch} id={`pri-${ch}`} />
                                <Label htmlFor={`pri-${ch}`} className="capitalize">
                                  {ch === 'phone' ? 'Telefone' : ch}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    {callData.channels.length > 0 && (
                      <div className="mt-4 p-4 rounded-md bg-muted text-sm space-y-1">
                        <p className="font-semibold mb-2">Detalhes de Contato do Fornecedor:</p>
                        {callData.channels.includes('email') && (
                          <p>
                            <span className="text-muted-foreground">Email:</span>{' '}
                            {selectedSupplier.email}
                          </p>
                        )}
                        {callData.channels.includes('phone') && (
                          <p>
                            <span className="text-muted-foreground">Telefone:</span>{' '}
                            {selectedSupplier.phone}
                          </p>
                        )}
                        {callData.channels.includes('whatsapp') && (
                          <p>
                            <span className="text-muted-foreground">WhatsApp:</span>{' '}
                            {selectedSupplier.whatsapp}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSaveCall}
                  disabled={
                    !callData.equipmentId || !callData.supplierId || !callData.primaryChannel
                  }
                >
                  Confirmar Chamado
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={osOpen} onOpenChange={setOsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Nova OS
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Ordem de Serviço</DialogTitle>
                <DialogDescription>
                  Crie uma nova ordem preventiva ou corretiva interna.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Equipamento</Label>
                  <Select onValueChange={(v) => setOsData({ ...osData, equipmentId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {equipments.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select onValueChange={(v) => setOsData({ ...osData, type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prev">Preventiva</SelectItem>
                      <SelectItem value="corr">Corretiva</SelectItem>
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
                      value={osData.date}
                      onChange={(e) => setOsData({ ...osData, date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSaveOS}
                  disabled={!osData.equipmentId || !osData.type || !osData.date}
                >
                  Salvar Ordem
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico e Próximas Manutenções</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenances.length > 0 ? (
                maintenances.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.assets?.name}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>
                      {m.date
                        ? new Date(m.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        : '-'}
                    </TableCell>
                    <TableCell>{m.technician}</TableCell>
                    <TableCell>
                      <StatusBadge status={m.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma manutenção registrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
