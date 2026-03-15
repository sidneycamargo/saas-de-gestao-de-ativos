import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EquipmentTab } from './inventory/components/EquipmentTab'
import { PartsTab } from './inventory/components/PartsTab'

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventário</h2>
          <p className="text-muted-foreground">
            Gestão de equipamentos e controle de estoque de peças.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/products/new">
            <Plus className="w-4 h-4 mr-2" /> Novo Item
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
          <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          <TabsTrigger value="parts">Peças</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="equipment">
            <EquipmentTab />
          </TabsContent>
          <TabsContent value="parts">
            <PartsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
