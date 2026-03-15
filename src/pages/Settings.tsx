import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LdapTab } from './settings/components/LdapTab'
import { UsersTab } from './settings/components/UsersTab'
import { GroupsTab } from './settings/components/GroupsTab'
import { LocatorsTab } from './settings/components/LocatorsTab'
import { systemUsers, systemGroups, systemLocators } from '@/lib/mock-data'

export default function Settings() {
  const [users, setUsers] = useState(systemUsers)
  const [groups, setGroups] = useState(systemGroups)
  const [locators, setLocators] = useState(systemLocators)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie acessos, integrações e preferências do sistema.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full lg:w-[800px] grid-cols-1 sm:grid-cols-4 h-auto sm:h-10">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="groups">Grupos de Acesso</TabsTrigger>
          <TabsTrigger value="locators">Localizadores</TabsTrigger>
          <TabsTrigger value="ldap">SSO / LDAP</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="users">
            <UsersTab users={users} setUsers={setUsers} groups={groups} />
          </TabsContent>
          <TabsContent value="groups">
            <GroupsTab groups={groups} setGroups={setGroups} />
          </TabsContent>
          <TabsContent value="locators">
            <LocatorsTab locators={locators} setLocators={setLocators} />
          </TabsContent>
          <TabsContent value="ldap">
            <LdapTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
