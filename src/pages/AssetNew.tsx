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
import { Combobox } from '@/components/ui/combobox'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export default function AssetNew() {
  const navigate = useNavigate()
  const { activeCompanyId } = useCompanyStore()
  const [products, setProducts] = useState<any[]>([])
  const [locators, setLocators] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    product_id: '',
    identifier: '',
    status: 'Ativo',
    locator_id: '',
    patrimony: '',
    serial: '',
    description: '',
  })

  useEffect(() => {
    if (activeCompanyId) {
      supabase
        .from('products')
        .select('*')
        .eq('company_id', activeCompanyId)
        .order('name')
        .then(({ data }) => setProducts(data || []))

      supabase
        .from('locators')
        .select('*')
        .eq('company_id', activeCompanyId)
        .order('name')
        .then(({ data }) => setLocators(data || []))
    }
  }, [activeCompanyId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.product_id) {
      toast({ title: 'Atenção', description: 'Selecione um produto base.', variant: 'destructive' })
      return
    }

    const selectedProduct = products.find((p) => p.id === formData.product_id)

    const { error } = await supabase.from('assets').insert({
      company_id: activeCompanyId,
      product_id: formData.product_id,
      identifier: formData.identifier,
      status: formData.status,
      locator_id: formData.locator_id || null,
      patrimony: formData.patrimony,
      serial: formData.serial,
      description: formData.description,
      name: formData.name || selectedProduct?.name || 'Ativo',
    })

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({
        title: 'Ativo Cadastrado',
        description: 'O registro patrimonial foi salvo com sucesso.',
      })
      navigate('/assets')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/assets')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Novo Ativo / Patrimônio</h2>
          <p className="text-muted-foreground">
            Cadastre uma instância física (equipamento, veículo, móvel) associada a um Produto do
            catálogo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Informações do Ativo</CardTitle>
            <CardDescription>
              Preencha os detalhes específicos desta unidade física.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Descrição do Ativo</Label>
                <Input
                  id="name"
                  placeholder="Ex: Notebook Dell X1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descritivo do Ativo</Label>
                <Textarea
                  id="description"
                  placeholder="Detalhes técnicos, observações de estado, cor..."
                  className="min-h-[80px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product">Produto Base (Catálogo) *</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Combobox
                      options={products.map((p) => ({
                        label: `${p.name} ${p.model ? `(${p.model})` : ''}`,
                        value: p.id,
                      }))}
                      value={formData.product_id}
                      onChange={(v) => setFormData({ ...formData, product_id: v })}
                      placeholder="Selecione o produto base..."
                      emptyText="Nenhum produto encontrado. Cadastre em Produtos."
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={() => navigate('/products')}>
                    Catálogo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identifier">Identificador (Tag / Etiqueta)</Label>
                <Input
                  id="identifier"
                  placeholder="Ex: Código de Barras"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patrimony">Número de Patrimônio</Label>
                <Input
                  id="patrimony"
                  placeholder="Ex: PAT-2024-001"
                  value={formData.patrimony}
                  onChange={(e) => setFormData({ ...formData, patrimony: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serial">Nº de Série</Label>
                <Input
                  id="serial"
                  placeholder="Ex: SN123456789"
                  value={formData.serial}
                  onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Situação</Label>
                <Combobox
                  options={[
                    { label: 'Ativo', value: 'Ativo' },
                    { label: 'Inativo', value: 'Inativo' },
                    { label: 'Em Manutenção', value: 'Em Manutenção' },
                    { label: 'Doado', value: 'Doado' },
                    { label: 'Descartado', value: 'Descartado' },
                  ]}
                  value={formData.status}
                  onChange={(v) => setFormData({ ...formData, status: v })}
                  placeholder="Selecione a situação..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="locator">Localização Física</Label>
                <Combobox
                  options={locators.map((l) => ({ label: l.name, value: l.id }))}
                  value={formData.locator_id}
                  onChange={(v) => setFormData({ ...formData, locator_id: v })}
                  placeholder="Selecione o local..."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline" type="button" onClick={() => navigate('/assets')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.product_id}>
              <Save className="w-4 h-4 mr-2" /> Salvar Ativo
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
