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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useCompanyStore from '@/stores/useCompanyStore'

export default function AssetNew() {
  const navigate = useNavigate()
  const { activeCompanyId } = useCompanyStore()
  const [categories, setCategories] = useState<any[]>([])
  const [locators, setLocators] = useState<any[]>([])

  const [formData, setFormData] = useState({
    type: 'asset',
    name: '',
    description: '',
    category_id: '',
    sku: '',
    patrimony: '',
    locator_id: '',
    serial: '',
    stock: 0,
    min_stock: 0,
    price: 0,
  })

  useEffect(() => {
    if (activeCompanyId) {
      supabase
        .from('categories')
        .select('*')
        .eq('company_id', activeCompanyId)
        .order('name')
        .then(({ data }) => setCategories(data || []))
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
    if (!formData.name) return

    const { error } = await supabase.from('assets').insert({
      company_id: activeCompanyId,
      type: formData.type,
      name: formData.name,
      description: formData.description,
      category_id: formData.category_id || null,
      sku: formData.sku,
      patrimony: formData.patrimony,
      locator_id: formData.locator_id || null,
      serial: formData.serial,
      stock: formData.stock,
      min_stock: formData.min_stock,
      price: formData.price,
    })

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Ativo Cadastrado', description: 'O registro foi salvo com sucesso.' })
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
          <h2 className="text-3xl font-bold tracking-tight">Novo Registro</h2>
          <p className="text-muted-foreground">
            Cadastre um novo ativo, equipamento ou peça no sistema.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Informações Principais</CardTitle>
            <CardDescription>
              Preencha os detalhes essenciais para controle e gerenciamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 pb-4 border-b">
              <Label className="text-base">Tipo de Registro</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asset" id="t-asset" />
                  <Label htmlFor="t-asset">Ativo Geral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="equipment" id="t-eq" />
                  <Label htmlFor="t-eq">Equipamento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="part" id="t-part" />
                  <Label htmlFor="t-part">Peça / Insumo</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nome / Título</Label>
                <Input
                  id="name"
                  required
                  placeholder="Ex: Mesa de Escritório"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
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

              <div className="space-y-2">
                <Label htmlFor="locator">Localização Física</Label>
                <Select
                  value={formData.locator_id}
                  onValueChange={(v) => setFormData({ ...formData, locator_id: v })}
                >
                  <SelectTrigger id="locator">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {locators.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(formData.type === 'equipment' || formData.type === 'part') && (
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU / Referência</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              )}

              {formData.type === 'equipment' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="patrimony">Tombamento / Patrimônio</Label>
                    <Input
                      id="patrimony"
                      value={formData.patrimony}
                      onChange={(e) => setFormData({ ...formData, patrimony: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial">Nº de Série</Label>
                    <Input
                      id="serial"
                      value={formData.serial}
                      onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                    />
                  </div>
                </>
              )}

              {formData.type === 'part' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Estoque Atual</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min_stock">Estoque Mínimo</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={formData.min_stock}
                      onChange={(e) =>
                        setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Valor Unitário</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                </>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Detalhes adicionais, especificações técnicas..."
                  className="min-h-[80px]"
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
            <Button type="submit" disabled={!formData.name}>
              <Save className="w-4 h-4 mr-2" /> Salvar Registro
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
