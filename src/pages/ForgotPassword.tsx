import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Hexagon, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden py-10">
      <div className="absolute inset-0 opacity-20 bg-[url('https://img.usecurling.com/p/1920/1080?q=factory%20machine&color=blue')] bg-cover bg-center mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

      <div className="relative z-10 w-full max-w-md p-4 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8 text-white">
          <Hexagon className="w-12 h-12 text-blue-500 mb-2" />
          <h1 className="text-3xl font-bold tracking-tight">AssetPro SaaS</h1>
        </div>

        <Card className="border-slate-800 bg-slate-950/90 backdrop-blur-xl text-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle>Recuperar Senha</CardTitle>
            <CardDescription className="text-slate-400">
              {isSubmitted
                ? 'Verifique sua caixa de entrada'
                : 'Informe seu email para receber um link de recuperação'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-center text-slate-300 text-sm px-4">
                  Enviamos as instruções de recuperação de senha para o seu email corporativo.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 w-full border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-white"
                >
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para o Login
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-2">
                  Enviar Link de Recuperação
                </Button>

                <div className="mt-6 text-center text-sm">
                  <Link
                    to="/"
                    className="text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para o Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
