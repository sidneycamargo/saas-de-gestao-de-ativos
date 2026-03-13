import { Link, useNavigate } from 'react-router-dom'
import { Hexagon, Lock, Mail, User, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

export default function Register() {
  const navigate = useNavigate()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Conta criada com sucesso',
      description: 'Você já pode fazer login no sistema.',
    })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden py-10">
      <div className="absolute inset-0 opacity-20 bg-[url('https://img.usecurling.com/p/1920/1080?q=factory%20machine&color=blue')] bg-cover bg-center mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

      <div className="relative z-10 w-full max-w-md p-4 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8 text-white">
          <Hexagon className="w-12 h-12 text-blue-500 mb-2" />
          <h1 className="text-3xl font-bold tracking-tight">AssetPro SaaS</h1>
          <p className="text-slate-400">Cadastro de Novo Usuário</p>
        </div>

        <Card className="border-slate-800 bg-slate-950/90 backdrop-blur-xl text-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription className="text-slate-400">
              Preencha os dados abaixo para se registrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    placeholder="João da Silva"
                    required
                    className="pl-9 bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>

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
                <Label htmlFor="role">Perfil de Acesso</Label>
                <Select required defaultValue="viewer">
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-slate-500" />
                      <SelectValue placeholder="Selecione um perfil" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="technician">Técnico</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    className="pl-9 bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-2">
                Registrar
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Já possui uma conta?{' '}
              <Link to="/" className="text-blue-400 hover:text-blue-300">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
