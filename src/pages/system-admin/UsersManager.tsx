import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

export default function UsersManager() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [memberships, setMemberships] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    user_id: '',
    company_id: '',
    role: 'Member',
  })

  const fetchAll = async () => {
    const [{ data: profs }, { data: comps }, { data: membs }] = await Promise.all([
      supabase.from('profiles').select('*').order('name'),
      supabase.from('companies').select('id, name').order('name'),
      supabase.from('company_memberships').select('*, profiles(name, email), companies(name)'),
    ])
    if (profs) setProfiles(profs)
    if (comps) setCompanies(comps)
    if (membs) setMemberships(membs)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const openDialog = (memb?: any) => {
    if (memb) {
      setEditingId(memb.id)
      setFormData({
        user_id: memb.user_id,
        company_id: memb.company_id,
        role: memb.role,
      })
    } else {
      setEditingId(null)
      setFormData({ user_id: '', company_id: '', role: 'Member' })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        await supabase
          .from('company_memberships')
          .update({
            role: formData.role,
          })
          .eq('id', editingId)
        toast({ title: 'Associação atualizada' })
      } else {
        await supabase.from('company_memberships').insert({
          user_id: formData.user_id,
          company_id: formData.company_id,
          role: formData.role,
        })
        toast({ title: 'Usuário associado à empresa' })
      }
      setIsOpen(false)
      fetchAll()
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover acesso deste usuário a esta empresa?')) return
    await supabase.from('company_memberships').delete().eq('id', id)
    fetchAll()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Associações de Usuários</CardTitle>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Associar Usuário
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Papel na Empresa</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.profiles?.name}</TableCell>
                <TableCell className="text-muted-foreground">{m.profiles?.email}</TableCell>
                <TableCell>{m.companies?.name}</TableCell>
                <TableCell>
                  <Badge variant={m.role === 'Admin' ? 'default' : 'secondary'}>{m.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(m)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(m.id)}
                    className="text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {memberships.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhuma associação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Associação' : 'Associar Usuário'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!editingId && (
              <>
                <div className="space-y-2">
                  <Label>Usuário</Label>
                  <Select
                    value={formData.user_id}
                    onValueChange={(v) => setFormData({ ...formData, user_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} ({p.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Select
                    value={formData.company_id}
                    onValueChange={(v) => setFormData({ ...formData, company_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Papel na Empresa</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.user_id || !formData.company_id}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
