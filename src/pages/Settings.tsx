import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LdapTab } from './settings/components/LdapTab'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const users = [
  { name: 'Admin Geral', email: 'admin@assetpro.com', role: 'Administrador', status: 'Ativo' },
  { name: 'João Técnico', email: 'joao@assetpro.com', role: 'Técnico', status: 'Ativo' },
  { name: 'Maria Gestora', email: 'maria@assetpro.com', role: 'Gerente', status: 'Inativo' },
]

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie acessos, integrações e preferências do sistema.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="ldap">SSO / LDAP</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="users">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Controle de acesso e papéis.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.email}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{u.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              u.status === 'Ativo'
                                ? 'bg-success hover:bg-success/80'
                                : 'bg-danger hover:bg-danger/80'
                            }
                          >
                            {u.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ldap">
            <LdapTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
