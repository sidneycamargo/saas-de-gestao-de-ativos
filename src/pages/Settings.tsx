import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LdapTab } from './settings/components/LdapTab'
import { UsersTab } from './settings/components/UsersTab'
import { GroupsTab } from './settings/components/GroupsTab'
import { systemUsers, systemGroups } from '@/lib/mock-data'

export default function Settings() {
  const [users, setUsers] = useState(systemUsers)
  const [groups, setGroups] = useState(systemGroups)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie acessos, integrações e preferências do sistema.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="groups">Grupos de Acesso</TabsTrigger>
          <TabsTrigger value="ldap">SSO / LDAP</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="users">
            <UsersTab users={users} setUsers={setUsers} groups={groups} />
          </TabsContent>
          <TabsContent value="groups">
            <GroupsTab groups={groups} setGroups={setGroups} />
          </TabsContent>
          <TabsContent value="ldap">
            <LdapTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
