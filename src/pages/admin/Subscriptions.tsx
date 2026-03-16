import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Edit2, CreditCard } from 'lucide-react'
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

export default function AdminSubscriptions() {
  const { profile } = useAuth()
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    status: 'Active',
    plan_name: '',
  })

  const fetchAll = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*, companies(name)')
      .order('updated_at', { ascending: false })
    if (data) setSubscriptions(data)
  }

  useEffect(() => {
    if (profile?.is_super_admin) fetchAll()
  }, [profile])

  if (!profile?.is_super_admin) return <Navigate to="/" />

  const openDialog = (sub: any) => {
    setEditingId(sub.id)
    setFormData({
      status: sub.status,
      plan_name: sub.plan_name || '',
    })
    setIsOpen(true)
  }

  const handleSave = async () => {
    try {
      await supabase
        .from('subscriptions')
        .update({
          status: formData.status,
          plan_name: formData.plan_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId)
      toast({ title: 'Assinatura atualizada' })
      setIsOpen(false)
      fetchAll()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <CreditCard className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
            Assinaturas
          </h2>
          <p className="text-muted-foreground">
            Controle de planos e status de pagamento das empresas.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.companies?.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.status === 'Active'
                          ? 'default'
                          : s.status === 'Suspended' || s.status === 'Inactive'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.plan_name || '-'}</TableCell>
                  <TableCell>{new Date(s.updated_at).toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(s)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {subscriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhuma assinatura encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Assinatura</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                  <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nome do Plano</Label>
              <Input
                value={formData.plan_name}
                onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                placeholder="Ex: Enterprise"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
