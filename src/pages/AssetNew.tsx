import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export default function AssetNew() {
  const navigate = useNavigate()
  const { activeCompanyId } = useCompanyStore()
  const [categories, setCategories] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
  })

  useEffect(() => {
    if (activeCompanyId) {
      supabase
        .from('categories')
        .select('*')
        .eq('company_id', activeCompanyId)
        .order('name')
        .then(({ data }) => {
          if (data) setCategories(data)
        })
    }
  }, [activeCompanyId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category_id) {
      toast({ title: 'Aviso', description: 'Selecione uma categoria.', variant: 'destructive' })
      return
    }

    const { error } = await supabase.from('assets').insert({
      name: formData.name,
      description: formData.description,
      category_id: formData.category_id,
      company_id: activeCompanyId,
    })

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Ativo Cadastrado', description: 'O ativo foi salvo com sucesso.' })
      navigate('/inventory')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/inventory')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Novo Ativo</h2>
          <p className="text-muted-foreground">Cadastre um novo ativo no sistema.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Informações do Ativo</CardTitle>
            <CardDescription>
              Preencha os detalhes essenciais para controle e gerenciamento do ativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nome do Ativo</Label>
                <Input
                  id="name"
                  required
                  placeholder="Ex: Mesa de Escritório"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  required
                  value={formData.category_id}
                  onValueChange={(v) => setFormData({ ...formData, category_id: v })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Detalhes adicionais, especificações técnicas, etc..."
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline" type="button" onClick={() => navigate('/inventory')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.category_id}>
              <Save className="w-4 h-4 mr-2" /> Salvar Ativo
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
