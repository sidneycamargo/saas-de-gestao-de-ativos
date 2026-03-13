import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export function LdapTab() {
  const handleTest = () => {
    toast({
      title: 'Sucesso',
      description: 'Conexão LDAP estabelecida com sucesso.',
      variant: 'default',
    })
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Configuração Enterprise (LDAP / Active Directory)</CardTitle>
        <CardDescription>Configure a integração para Single Sign-On corporativo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>URL do Servidor</Label>
            <Input placeholder="ldaps://ad.empresa.com" defaultValue="ldaps://ad.assetpro.local" />
          </div>
          <div className="space-y-2">
            <Label>Porta</Label>
            <Input placeholder="636" defaultValue="636" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Base DN</Label>
          <Input placeholder="dc=empresa,dc=com" defaultValue="dc=assetpro,dc=local" />
        </div>
        <div className="space-y-2">
          <Label>Bind DN (Usuário de Serviço)</Label>
          <Input
            placeholder="cn=admin,dc=empresa,dc=com"
            defaultValue="cn=read_only,dc=assetpro,dc=local"
          />
        </div>
        <div className="space-y-2">
          <Label>Bind Password</Label>
          <Input type="password" value="********" readOnly />
        </div>
        <div className="flex gap-2 pt-4">
          <Button onClick={handleTest}>Testar Conexão</Button>
          <Button variant="outline">Salvar Configurações</Button>
        </div>
      </CardContent>
    </Card>
  )
}
