import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LdapTab } from './settings/components/LdapTab'
import { UsersTab } from './settings/components/UsersTab'
import { GroupsTab } from './settings/components/GroupsTab'
import { LocatorsTab } from './settings/components/LocatorsTab'
import { CategoriesTab } from './settings/components/CategoriesTab'

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie acessos, categorias, integrações e preferências.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full lg:w-[1000px] grid-cols-1 sm:grid-cols-5 h-auto sm:h-10">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="groups">Grupos de Acesso</TabsTrigger>
          <TabsTrigger value="locators">Localizadores</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="ldap">SSO / LDAP</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          <TabsContent value="groups">
            <GroupsTab />
          </TabsContent>
          <TabsContent value="locators">
            <LocatorsTab />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
          <TabsContent value="ldap">
            <LdapTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
