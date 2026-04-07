import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Plus, History } from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Combobox } from '@/components/ui/combobox'
import { toast } from '@/hooks/use-toast'
import useCompanyStore from '@/stores/useCompanyStore'

const EVENT_TYPES = [
  { label: 'Entrada (Aquisição / Transferência)', value: 'Entrada' },
  { label: 'Saída / Baixa', value: 'Baixa' },
  { label: 'Assistência Técnica Externa', value: 'Assistência Externa' },
  { label: 'Retirada Temporária Interna', value: 'Retirada Temporária' },
  { label: 'Manutenção Preventiva', value: 'Manutenção Preventiva' },
  { label: 'Manutenção Corretiva', value: 'Manutenção Corretiva' },
  { label: 'Alteração de Localizador', value: 'Alteração de Localizador' },
]

interface AssetEventsProps {
  asset: any
  isOpen: boolean
  onClose: () => void
  onEventAdded: () => void
  locators: any[]
}

export function AssetEvents({ asset, isOpen, onClose, onEventAdded, locators }: AssetEventsProps) {
  const { activeCompanyId } = useCompanyStore()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [formData, setFormData] = useState({
    type: '',
    description: '',
    parts_replaced: '',
    new_locator_id: '',
  })

  useEffect(() => {
    if (asset && isOpen) fetchEvents()
  }, [asset, isOpen])

  const fetchEvents = async () => {
    const [{ data: evts }, { data: maints }] = await Promise.all([
      supabase
        .from('asset_events')
        .select('*, new_locator:locators!new_locator_id(name), profiles:user_id(name)')
        .eq('asset_id', asset.id)
        .order('date', { ascending: false }),
      supabase
        .from('maintenances')
        .select('*')
        .eq('asset_id', asset.id)
        .order('created_at', { ascending: false }),
    ])

    const combined = [
      ...(evts || []).map((e) => ({
        ...e,
        _type: 'event',
        displayDate: e.date,
      })),
      ...(maints || []).map((m) => ({
        ...m,
        _type: 'maintenance',
        displayDate: m.start_date || m.date || m.created_at,
        profiles: { name: m.technician || 'Sistema' },
      })),
    ].sort((a, b) => new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime())

    setEvents(combined)
  }

  const handleSave = async () => {
    if (!formData.type)
      return toast({ title: 'Selecione o tipo de evento', variant: 'destructive' })

    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()

    const eventPayload = {
      company_id: activeCompanyId,
      asset_id: asset.id,
      user_id: userData?.user?.id,
      type: formData.type,
      description: formData.description,
      parts_replaced: formData.parts_replaced,
      old_locator_id: asset.locator_id,
      new_locator_id: formData.type === 'Alteração de Localizador' ? formData.new_locator_id : null,
    }

    const { error } = await supabase.from('asset_events').insert(eventPayload)

    if (!error) {
      if (formData.type === 'Alteração de Localizador' && formData.new_locator_id) {
        await supabase
          .from('assets')
          .update({ locator_id: formData.new_locator_id })
          .eq('id', asset.id)
      } else if (formData.type === 'Baixa') {
        await supabase.from('assets').update({ status: 'Descartado' }).eq('id', asset.id)
      }

      toast({ title: 'Evento registrado com sucesso' })
      setIsFormOpen(false)
      setFormData({ type: '', description: '', parts_replaced: '', new_locator_id: '' })
      fetchEvents()
      onEventAdded()
    } else {
      toast({
        title: 'Erro ao registrar evento',
        description: error.message,
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  const isMaintenance = formData.type.includes('Manutenção')
  const isLocationChange = formData.type === 'Alteração de Localizador'

  return (
    <Sheet open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6 mt-4">
          <SheetTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Histórico do Ativo
          </SheetTitle>
          <div className="text-sm text-muted-foreground mt-1">
            {asset?.name || asset?.products?.name} {asset?.patrimony ? `- ${asset.patrimony}` : ''}
          </div>
        </SheetHeader>

        <Button className="w-full mb-6" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Registrar Novo Evento
        </Button>

        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-border pb-8">
          {events.length > 0 ? (
            events.map((evt) => (
              <div key={evt.id} className="relative flex items-start gap-4">
                <div className="w-4 h-4 rounded-full bg-primary shrink-0 mt-1 z-10 ring-4 ring-background" />
                <div className="flex-1 p-3 rounded-lg border bg-card shadow-sm text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <strong className="font-semibold text-primary">
                      {evt._type === 'maintenance' ? `Evento: ${evt.type}` : evt.type}
                    </strong>
                    <span className="text-xs text-muted-foreground ml-2">
                      {format(new Date(evt.displayDate), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="text-muted-foreground mb-2 text-xs font-medium">
                    {evt.profiles?.name || 'Usuário'}
                  </div>
                  {evt.status && <p className="text-xs font-semibold mb-1">Status: {evt.status}</p>}
                  {evt.description && <p className="mb-2 whitespace-pre-wrap">{evt.description}</p>}
                  {evt.parts_replaced && (
                    <p className="text-xs bg-muted p-2 rounded mt-2">
                      <span className="font-semibold text-foreground">Peças:</span>{' '}
                      {evt.parts_replaced}
                    </p>
                  )}
                  {evt.new_locator && (
                    <p className="text-xs bg-muted p-2 rounded mt-2">
                      <span className="font-semibold text-foreground">Novo Local:</span>{' '}
                      {evt.new_locator.name}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4 ml-6">
              Nenhum evento registrado.
            </div>
          )}
        </div>
      </SheetContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Evento de Movimentação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Evento *</Label>
              <Combobox
                options={EVENT_TYPES}
                value={formData.type}
                onChange={(v) => setFormData((p) => ({ ...p, type: v }))}
                placeholder="Selecione..."
              />
            </div>

            {isLocationChange && (
              <div className="space-y-2">
                <Label>Novo Localizador *</Label>
                <Combobox
                  options={locators.map((l: any) => ({ label: l.name, value: l.id }))}
                  value={formData.new_locator_id}
                  onChange={(v) => setFormData((p) => ({ ...p, new_locator_id: v }))}
                  placeholder="Selecione o novo local..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Observações / Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Detalhes do evento..."
              />
            </div>

            {isMaintenance && (
              <div className="space-y-2">
                <Label>Peças Trocadas (Opcional)</Label>
                <Textarea
                  value={formData.parts_replaced}
                  onChange={(e) => setFormData((p) => ({ ...p, parts_replaced: e.target.value }))}
                  placeholder="Liste as peças substituídas..."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Evento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}
