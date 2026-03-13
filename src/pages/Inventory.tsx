import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EquipmentTab } from './inventory/components/EquipmentTab'
import { PartsTab } from './inventory/components/PartsTab'

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inventário</h2>
        <p className="text-muted-foreground">
          Gestão de equipamentos e controle de estoque de peças.
        </p>
      </div>

      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          <TabsTrigger value="parts">Peças & Consumíveis</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="equipment">
            <EquipmentTab />
          </TabsContent>
          <TabsContent value="parts">
            <TabsContent value="parts" className="m-0">
              <PartsTab />
            </TabsContent>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
