import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import useCompanyStore from '@/stores/useCompanyStore'
import { getBrands, createBrand, updateBrand, deleteBrand } from '@/services/brands'
import type { Database } from '@/lib/supabase/types'

type Brand = Database['public']['Tables']['brands']['Row']

export default function Brands() {
  const { activeCompany } = useCompanyStore()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  // Form state
  const [formData, setFormData] = useState({ name: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadBrands = async () => {
    if (!activeCompany) return
    try {
      setLoading(true)
      const data = await getBrands(activeCompany.id, search)
      setBrands(data || [])
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar marcas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [activeCompany, search])

  const handleOpenForm = (brand?: Brand) => {
    if (brand) {
      setSelectedBrand(brand)
      setFormData({ name: brand.name })
    } else {
      setSelectedBrand(null)
      setFormData({ name: '' })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedBrand(null)
    setFormData({ name: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeCompany) return
    if (!formData.name.trim()) {
      toast.error('Nome da marca é obrigatório')
      return
    }

    try {
      setIsSubmitting(true)
      if (selectedBrand) {
        await updateBrand(selectedBrand.id, { name: formData.name })
        toast.success('Marca atualizada com sucesso')
      } else {
        await createBrand({
          company_id: activeCompany.id,
          name: formData.name,
        })
        toast.success('Marca criada com sucesso')
      }
      handleCloseForm()
      loadBrands()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar marca')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedBrand) return
    try {
      setIsSubmitting(true)
      await deleteBrand(selectedBrand.id)
      toast.success('Marca excluída com sucesso')
      setIsDeleteOpen(false)
      setSelectedBrand(null)
      loadBrands()
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao excluir marca. Ela pode estar em uso.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marcas</h1>
          <p className="text-muted-foreground">Gerencie as marcas dos seus ativos</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Marca
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar marcas..."
            className="pl-8 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-10">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-10 text-muted-foreground">
                  Nenhuma marca encontrada.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(brand)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setSelectedBrand(brand)
                          setIsDeleteOpen(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBrand ? 'Editar Marca' : 'Nova Marca'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Marca</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Dell, Apple, Samsung..."
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Marca</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a marca <strong>{selectedBrand?.name}</strong>? Esta
              ação não pode ser desfeita e pode falhar caso a marca esteja vinculada a algum ativo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
