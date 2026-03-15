import { useState } from 'react'
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
import { maintenances as initialMaintenances, suppliers, equipment } from '@/lib/mock-data'

export default function Maintenance() {
  const { activeCompanyId } = useCompanyStore()
  const activeEquipments = equipment.filter((e) => e.companyId === activeCompanyId)
  const activeSuppliers = suppliers.filter((s) => s.companyId === activeCompanyId)
  const filteredMaintenances = initialMaintenances.filter((m) => m.companyId === activeCompanyId)

  const [callOpen, setCallOpen] = useState(false)
  const [callData, setCallData] = useState({
    equipmentId: '',
    supplierId: '',
    channels: [] as string[],
    primaryChannel: '',
  })

  const selectedSupplier = activeSuppliers.find((s) => s.id === callData.supplierId)

  const handleToggleChannel = (channel: string, checked: boolean) => {
    setCallData((prev) => {
      const newChannels = checked
        ? [...prev.channels, channel]
        : prev.channels.filter((c) => c !== channel)

      const newPrimary = !checked && prev.primaryChannel === channel ? '' : prev.primaryChannel
      return { ...prev, channels: newChannels, primaryChannel: newPrimary }
    })
  }

  const handleSaveOS = () => {
    toast({ title: 'Ordem criada', description: 'A ordem de serviço foi agendada com sucesso.' })
  }

  const handleSaveCall = () => {
    toast({ title: 'Chamado Aberto', description: 'Solicitação de serviço enviada com sucesso.' })
    setCallOpen(false)
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
                      <SelectValue placeholder="Selecione o equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeEquipments.map((e) => (
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
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeSuppliers.map((s) => (
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

          <Dialog>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activeEquipments.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select>
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
                    <Input type="date" className="pl-9" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveOS}>
                  Salvar Ordem
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximas Manutenções</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OS</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenances.length > 0 ? (
                filteredMaintenances.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.id}</TableCell>
                    <TableCell>{m.equip}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>{new Date(m.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{m.technician}</TableCell>
                    <TableCell>
                      <StatusBadge status={m.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma manutenção agendada.
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
