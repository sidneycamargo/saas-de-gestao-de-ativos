import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Hexagon, Lock, Mail, User, ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { toast } from '@/hooks/use-toast'

export default function Index() {
  const navigate = useNavigate()
  const [loginStep, setLoginStep] = useState<'method' | '2fa'>('method')
  const [otpValue, setOtpValue] = useState('')

  const handleInitialLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock check for 2FA requirement
    setLoginStep('2fa')
    toast({
      title: 'Código enviado',
      description: 'Enviamos um código de segurança de 6 dígitos para o seu celular cadastrado.',
    })
  }

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length !== 6) {
      toast({
        title: 'Código inválido',
        description: 'Por favor, insira o código de 6 dígitos.',
        variant: 'destructive',
      })
      return
    }
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

        <Card className="border-slate-800 bg-slate-950/90 backdrop-blur-xl text-slate-100 shadow-2xl overflow-hidden relative">
          {loginStep === 'method' && (
            <div className="animate-fade-in">
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
                    <form onSubmit={handleInitialLogin} className="space-y-4">
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
                      onClick={handleInitialLogin}
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
                    <form onSubmit={handleInitialLogin} className="space-y-4">
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
            </div>
          )}

          {loginStep === '2fa' && (
            <div className="animate-fade-in">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <ShieldAlert className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <CardTitle>Verificação em Duas Etapas</CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  Por segurança, digite o código de 6 dígitos enviado para o final do seu celular{' '}
                  <span className="text-slate-200 font-medium">***-9999</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleVerify2FA} className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={setOtpValue}
                      className="gap-2"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="bg-slate-900 border-slate-700 text-white h-12 w-12 text-lg"
                        />
                        <InputOTPSlot
                          index={1}
                          className="bg-slate-900 border-slate-700 text-white h-12 w-12 text-lg"
                        />
                        <InputOTPSlot
                          index={2}
                          className="bg-slate-900 border-slate-700 text-white h-12 w-12 text-lg"
                        />
                        <InputOTPSlot
                          index={3}
                          className="bg-slate-900 border-slate-700 text-white h-12 w-12 text-lg"
                        />
                        <InputOTPSlot
                          index={4}
                          className="bg-slate-900 border-slate-700 text-white h-12 w-12 text-lg"
                        />
                        <InputOTPSlot
                          index={5}
                          className="bg-slate-900 border-slate-700 text-white h-12 w-12 text-lg"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Verificar e Entrar
                  </Button>

                  <div className="flex justify-between items-center text-sm">
                    <button
                      type="button"
                      onClick={() => setLoginStep('method')}
                      className="text-slate-400 hover:text-white flex items-center transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => toast({ title: 'Novo código enviado por SMS.' })}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Reenviar código
                    </button>
                  </div>
                </form>
              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
