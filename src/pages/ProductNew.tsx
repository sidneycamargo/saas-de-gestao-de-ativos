import { useNavigate, useSearchParams } from 'react-router-dom'
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
import { systemLocators } from '@/lib/mock-data'

export default function ProductNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const defaultCategory = searchParams.get('category') === 'equipamento' ? 'equipamento' : 'peca'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Produto Cadastrado',
      description: 'O produto foi salvo com sucesso no inventário.',
    })
    navigate('/inventory')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/inventory')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Novo Produto</h2>
          <p className="text-muted-foreground">Cadastre uma nova peça ou equipamento no sistema.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
            <CardDescription>
              Preencha os detalhes essenciais para controle e gerenciamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" required placeholder="Ex: Motor Elétrico Trifásico" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Código</Label>
                <Input id="sku" placeholder="Ex: PT-100-XYZ" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patrimony">Patrimônio (Asset Tag)</Label>
                <Input id="patrimony" placeholder="Ex: PAT-99123" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select required defaultValue={defaultCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peca">Peça</SelectItem>
                    <SelectItem value="equipamento">Equipamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locator">Localizador Físico</Label>
                <Select defaultValue="unassigned">
                  <SelectTrigger id="locator">
                    <SelectValue placeholder="Selecione um local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Não atribuído</SelectItem>
                    {systemLocators.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade de Medida</Label>
                <Select required defaultValue="un">
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">Unidade (UN)</SelectItem>
                    <SelectItem value="kg">Quilograma (KG)</SelectItem>
                    <SelectItem value="l">Litro (L)</SelectItem>
                    <SelectItem value="m">Metro (M)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Estoque Mínimo</Label>
                <Input id="minStock" type="number" min="0" required placeholder="Ex: 10" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço Unitário (R$)</Label>
                <Input id="price" type="number" step="0.01" min="0" required placeholder="0,00" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Detalhes adicionais, especificações técnicas, etc..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline" type="button" onClick={() => navigate('/inventory')}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" /> Salvar Produto
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
