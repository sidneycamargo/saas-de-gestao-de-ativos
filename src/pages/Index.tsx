import { Link, useNavigate } from 'react-router-dom'
import { Hexagon, Lock, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Index() {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden py-10">
      <div className="absolute inset-0 opacity-20 bg-[url('https://img.usecurling.com/p/1920/1080?q=factory%20machine&color=blue')] bg-cover bg-center mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

      <div className="relative z-10 w-full max-w-md p-4 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8 text-white">
          <Hexagon className="w-12 h-12 text-blue-500 mb-2" />
          <h1 className="text-3xl font-bold tracking-tight">AssetPro SaaS</h1>
          <p className="text-slate-400">Gestão Inteligente de Ativos</p>
        </div>

        <Card className="border-slate-800 bg-slate-950/90 backdrop-blur-xl text-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle>Acesso ao Sistema</CardTitle>
            <CardDescription className="text-slate-400">
              Escolha seu método de autenticação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="standard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900">
                <TabsTrigger
                  value="standard"
                  className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
                >
                  Padrão
                </TabsTrigger>
                <TabsTrigger
                  value="ldap"
                  className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
                >
                  SSO / LDAP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="standard" className="mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Corporativo</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nome@empresa.com"
                        required
                        className="pl-9 bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        id="password"
                        type="password"
                        required
                        className="pl-9 bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Entrar
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-950 px-2 text-slate-400">Ou continue com</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  onClick={handleLogin}
                  className="w-full border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-white"
                >
                  <img
                    src="https://img.usecurling.com/i?q=google&color=multicolor"
                    alt="Google"
                    className="w-4 h-4 mr-2"
                  />
                  Google Workspace
                </Button>

                <div className="mt-6 text-center text-sm text-slate-400">
                  Não tem uma conta?{' '}
                  <Link to="/register" className="text-blue-400 hover:text-blue-300">
                    Registre-se
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="ldap" className="mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário de Rede</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        id="username"
                        placeholder="DOMAIN\username"
                        required
                        className="pl-9 bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ldappass">Senha de Rede</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        id="ldappass"
                        type="password"
                        required
                        className="pl-9 bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">
                    Acessar com LDAP
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
