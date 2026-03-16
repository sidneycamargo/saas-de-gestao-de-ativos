import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Shield, Trash2, Users } from 'lucide-react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { useAuth } from '@/hooks/use-auth'

export default function AdminUsers() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])

  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [memberships, setMemberships] = useState<any[]>([])

  const [formCompany, setFormCompany] = useState('')
  const [formRole, setFormRole] = useState('Member')

  const fetchAll = async () => {
    const { data: profs } = await supabase.from('profiles').select('*').order('name')
    if (profs) setUsers(profs)
    const { data: comps } = await supabase.from('companies').select('id, name').order('name')
    if (comps) setCompanies(comps)
  }

  useEffect(() => {
    if (profile?.is_super_admin) fetchAll()
  }, [profile])

  if (!profile?.is_super_admin) return <Navigate to="/" />

  const fetchMemberships = async (userId: string) => {
    const { data } = await supabase
      .from('company_memberships')
      .select('*, companies(name)')
      .eq('user_id', userId)
    if (data) setMemberships(data)
  }

  const openManage = (u: any) => {
    setSelectedUser(u)
    fetchMemberships(u.id)
    setFormCompany('')
    setFormRole('Member')
  }

  const handleAddAccess = async () => {
    if (!formCompany) return
    try {
      const { error } = await supabase.from('company_memberships').insert({
        user_id: selectedUser.id,
        company_id: formCompany,
        role: formRole,
      })
      if (error) throw error
      toast({ title: 'Acesso concedido' })
      fetchMemberships(selectedUser.id)
      setFormCompany('')
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleRemoveAccess = async (id: string) => {
    try {
      await supabase.from('company_memberships').delete().eq('id', id)
      toast({ title: 'Acesso removido' })
      fetchMemberships(selectedUser.id)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <Users className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
            Usuários Globais
          </h2>
          <p className="text-muted-foreground">
            Controle de acessos e permissões em todas as empresas.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Super Admin</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {u.is_super_admin ? (
                      <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                        Sim
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Não</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openManage(u)}>
                      <Shield className="w-4 h-4 mr-2" /> Acessos
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Acessos: {selectedUser?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="p-4 bg-muted rounded-lg flex flex-col sm:flex-row items-end gap-4">
              <div className="space-y-2 flex-1 w-full">
                <Label>Adicionar Empresa</Label>
                <Select value={formCompany} onValueChange={setFormCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
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
              <div className="space-y-2 w-full sm:w-[150px]">
                <Label>Papel</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddAccess}
                disabled={!formCompany}
                className="w-full sm:w-auto"
              >
                Adicionar
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa Associada</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberships.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.companies?.name}</TableCell>
                      <TableCell>
                        <Badge variant={m.role === 'Admin' ? 'default' : 'secondary'}>
                          {m.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAccess(m.id)}
                          className="text-danger h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {memberships.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        Nenhuma empresa vinculada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
