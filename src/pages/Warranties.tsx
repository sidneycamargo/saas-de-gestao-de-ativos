import { useState, useEffect } from 'react'
import { Plus, ShieldCheck, AlertTriangle, Trash2, Pencil } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import useCompanyStore from '@/stores/useCompanyStore'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

export default function Warranties() {
  const { activeCompanyId } = useCompanyStore()
  const [warranties, setWarranties] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const [formData, setFormData] = useState({
    id: '',
    asset_id: '',
    type: 'Equipamento',
    provider: '',
    start_date: '',
    end_date: '',
  })

  const fetchData = async () => {
    if (!activeCompanyId) return
    const [wRes, aRes] = await Promise.all([
      supabase
        .from('warranties')
        .select('*, assets(name)')
        .eq('company_id', activeCompanyId)
        .order('end_date'),
      supabase.from('assets').select('*').eq('company_id', activeCompanyId).order('name'),
    ])
    if (wRes.data) setWarranties(wRes.data)
    if (aRes.data) setAssets(aRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeCompanyId])

  const handleSave = async () => {
    if (!formData.asset_id || !formData.start_date || !formData.end_date) return

    const payload = {
      asset_id: formData.asset_id,
      type: formData.type,
      provider: formData.provider,
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: new Date(formData.end_date) < new Date() ? 'Expirada' : 'Ativa',
    }

    if (formData.id) {
      const { error } = await supabase
        .from('warranties')
        .update(payload)
        .eq('id', formData.id)
        .eq('company_id', activeCompanyId)

      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Garantia atualizada' })
        setIsOpen(false)
        fetchData()
      }
    } else {
      const { error } = await supabase.from('warranties').insert({
        company_id: activeCompanyId,
        ...payload,
      })

      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Garantia registrada' })
        setIsOpen(false)
        fetchData()
      }
    }
  }

  const handleEdit = (w: any) => {
    setFormData({
      id: w.id,
      asset_id: w.asset_id || '',
      type: w.type || 'Equipamento',
      provider: w.provider || '',
      start_date: w.start_date ? w.start_date.split('T')[0] : '',
      end_date: w.end_date ? w.end_date.split('T')[0] : '',
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Remover esta garantia?')) {
      const { error } = await supabase.from('warranties').delete().eq('id', id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Removida' })
        fetchData()
      }
    }
  }

  const calcProgress = (start: string, end: string) => {
    if (!start || !end) return 0
    const s = new Date(start).getTime()
    const e = new Date(end).getTime()
    const now = new Date().getTime()
    if (now > e) return 100
    if (now < s) return 0
    return Math.round(((now - s) / (e - s)) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Garantias</h2>
          <p className="text-muted-foreground">
            Acompanhamento de prazos de garantia para equipamentos e peças.
          </p>
        </div>
        <Button
          onClick={() => {
            setFormData({
              id: '',
              asset_id: '',
              type: 'Equipamento',
              provider: '',
              start_date: '',
              end_date: '',
            })
            setIsOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Garantia
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {warranties.length > 0 ? (
          warranties.map((w) => {
            const isExpired = w.status === 'Expirada' || new Date(w.end_date) < new Date()
            const prog = calcProgress(w.start_date, w.end_date)
            return (
              <Card
                key={w.id}
                className={`relative group ${isExpired ? 'border-destructive/50 bg-destructive/5' : ''}`}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleEdit(w)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/20 hover:text-destructive"
                    onClick={() => handleDelete(w.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2 pr-20">
                  <div className="flex justify-between items-start">
                    <Badge variant={w.type === 'Equipamento' ? 'default' : 'secondary'}>
                      {w.type}
                    </Badge>
                    {isExpired ? (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : (
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{w.assets?.name}</CardTitle>
                  <CardDescription>{w.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Início:{' '}
                        {w.start_date
                          ? new Date(w.start_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                          : '-'}
                      </span>
                      <span
                        className={
                          isExpired ? 'text-destructive font-medium' : 'text-foreground font-medium'
                        }
                      >
                        Vence:{' '}
                        {w.end_date
                          ? new Date(w.end_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                          : '-'}
                      </span>
                    </div>
                    <Progress
                      value={prog}
                      className={`h-2 ${isExpired ? '[&>div]:bg-destructive' : '[&>div]:bg-green-500'}`}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-3 text-muted-foreground py-8">
            Nenhuma garantia registrada nesta unidade.
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Editar Garantia' : 'Nova Garantia'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Ativo Vinculado</Label>
              <Select
                value={formData.asset_id}
                onValueChange={(v) => setFormData({ ...formData, asset_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equipamento">Equipamento</SelectItem>
                  <SelectItem value="Peça">Peça</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fornecedor / Fabricante</Label>
              <Input
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Vencimento</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.asset_id || !formData.start_date || !formData.end_date}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
