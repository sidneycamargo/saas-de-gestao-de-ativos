import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Hexagon, Lock, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

export default function Index() {
  const navigate = useNavigate()
  const { signIn, session } = useAuth()
  const [email, setEmail] = useState('superadmin@example.com')
  const [password, setPassword] = useState('Admin123!')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      navigate('/dashboard')
    }
  }, [session, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      toast({
        title: 'Erro de Autenticação',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      })
    } else {
      navigate('/dashboard')
    }
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
          <div className="animate-fade-in">
            <CardHeader>
              <CardTitle>Acesso ao Sistema</CardTitle>
              <CardDescription className="text-slate-400">
                Entre com seu email corporativo para continuar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Corporativo</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-9 bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Entrar
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400 border-t border-slate-800 pt-6">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300">
                  Registre-se
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}
