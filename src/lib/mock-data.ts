export const kpis = {
  totalEquipment: 142,
  pendingMaintenance: 12,
  lowStockParts: 8,
  activeWarranties: 45,
}

export const recentActivity = [
  {
    id: 1,
    user: 'João Silva',
    action: 'Atualizou estoque',
    target: 'Rolamento SKF 6204',
    time: '10 min atrás',
  },
  {
    id: 2,
    user: 'Maria Souza',
    action: 'Criou ordem de manutenção',
    target: 'Torno CNC #001',
    time: '1 hora atrás',
  },
  {
    id: 3,
    user: 'Sistema',
    action: 'Alerta de garantia',
    target: 'Motor Elétrico M2',
    time: '2 horas atrás',
  },
  {
    id: 4,
    user: 'Carlos Santos',
    action: 'Adicionou equipamento',
    target: 'Empilhadeira E-10',
    time: '5 horas atrás',
  },
]

export const stockData = [
  { name: 'Filtros', atual: 45, minimo: 20 },
  { name: 'Correias', atual: 12, minimo: 15 },
  { name: 'Rolamentos', atual: 8, minimo: 30 },
  { name: 'Sensores', atual: 25, minimo: 10 },
  { name: 'Óleo (L)', atual: 100, minimo: 50 },
]

export const equipment = [
  {
    id: 'EQ-001',
    name: 'Torno CNC Romi',
    serial: 'SN-998273',
    category: 'Usinagem',
    status: 'Operacional',
    warranty: '2027-05-10',
  },
  {
    id: 'EQ-002',
    name: 'Esteira Transportadora A',
    serial: 'SN-112344',
    category: 'Logística',
    status: 'Em Manutenção',
    warranty: '2024-11-20',
  },
  {
    id: 'EQ-003',
    name: 'Empilhadeira Yale',
    serial: 'SN-554433',
    category: 'Veículos',
    status: 'Inativo',
    warranty: 'Expirada',
  },
  {
    id: 'EQ-004',
    name: 'Compressor de Ar Schulz',
    serial: 'SN-999888',
    category: 'Pneumática',
    status: 'Operacional',
    warranty: '2026-01-15',
  },
]

export const parts = [
  {
    id: 'PT-100',
    name: 'Rolamento SKF 6204',
    sku: 'SKF-6204-2Z',
    stock: 8,
    minStock: 20,
    price: 45.9,
  },
  {
    id: 'PT-101',
    name: 'Correia em V A-35',
    sku: 'V-A35-GTS',
    stock: 15,
    minStock: 10,
    price: 22.5,
  },
  {
    id: 'PT-102',
    name: 'Filtro de Óleo Hidráulico',
    sku: 'FH-900',
    stock: 4,
    minStock: 15,
    price: 120.0,
  },
  {
    id: 'PT-103',
    name: 'Sensor Indutivo M12',
    sku: 'SI-M12-PNP',
    stock: 25,
    minStock: 5,
    price: 85.0,
  },
]

export const maintenances = [
  {
    id: 'OS-2023',
    equip: 'Esteira Transportadora A',
    type: 'Preventiva',
    date: '2026-03-20',
    status: 'Pendente',
    technician: 'João Silva',
  },
  {
    id: 'OS-2024',
    equip: 'Empilhadeira Yale',
    type: 'Corretiva',
    date: '2026-03-15',
    status: 'Em Andamento',
    technician: 'Carlos Santos',
  },
  {
    id: 'OS-2021',
    equip: 'Torno CNC Romi',
    type: 'Preventiva',
    date: '2026-03-10',
    status: 'Concluído',
    technician: 'Maria Souza',
  },
]

export const auditLogs = [
  {
    id: 1,
    timestamp: '2026-03-13 14:30',
    user: 'admin@empresa.com',
    action: 'LOGIN',
    entity: 'Sistema',
  },
  {
    id: 2,
    timestamp: '2026-03-13 15:45',
    user: 'joao@empresa.com',
    action: 'UPDATE',
    entity: 'Peça PT-100',
  },
  {
    id: 3,
    timestamp: '2026-03-13 16:10',
    user: 'carlos@empresa.com',
    action: 'CREATE',
    entity: 'Ordem OS-2025',
  },
  {
    id: 4,
    timestamp: '2026-03-13 17:05',
    user: 'maria@empresa.com',
    action: 'DELETE',
    entity: 'Equipamento EQ-999',
  },
]

export const systemGroups = [
  {
    id: 'g1',
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: {
      dashboard: { view: true, create: true, delete: true },
      inventory: { view: true, create: true, delete: true },
      maintenance: { view: true, create: true, delete: true },
      warranties: { view: true, create: true, delete: true },
      users: { view: true, create: true, delete: true },
    },
  },
  {
    id: 'g2',
    name: 'Técnico',
    description: 'Acesso a manutenções e inventário',
    permissions: {
      dashboard: { view: true, create: false, delete: false },
      inventory: { view: true, create: true, delete: false },
      maintenance: { view: true, create: true, delete: false },
      warranties: { view: true, create: false, delete: false },
      users: { view: false, create: false, delete: false },
    },
  },
  {
    id: 'g3',
    name: 'Visualizador',
    description: 'Apenas leitura de dados',
    permissions: {
      dashboard: { view: true, create: false, delete: false },
      inventory: { view: true, create: false, delete: false },
      maintenance: { view: true, create: false, delete: false },
      warranties: { view: true, create: false, delete: false },
      users: { view: false, create: false, delete: false },
    },
  },
]

export const systemUsers = [
  { id: 'u1', name: 'Admin Geral', email: 'admin@assetpro.com', groupId: 'g1', status: 'Ativo' },
  { id: 'u2', name: 'João Técnico', email: 'joao@assetpro.com', groupId: 'g2', status: 'Ativo' },
  {
    id: 'u3',
    name: 'Maria Gestora',
    email: 'maria@assetpro.com',
    groupId: 'g3',
    status: 'Inativo',
  },
]
