export const companies = [
  { id: 'c1', name: 'Matriz - São Paulo', logo: 'Hexagon' },
  { id: 'c2', name: 'Filial - Rio de Janeiro', logo: 'Box' },
]

export const suppliers = [
  {
    id: 'sup1',
    companyId: 'c1',
    name: 'Manutenção Tech SA',
    contactName: 'José Silva',
    email: 'contato@mantech.com',
    phone: '(11) 3333-4444',
    whatsapp: '(11) 99999-8888',
  },
  {
    id: 'sup2',
    companyId: 'c1',
    name: 'Peças & Cia',
    contactName: 'Ana Souza',
    email: 'vendas@pecasecia.com',
    phone: '(11) 5555-6666',
    whatsapp: '(11) 97777-6666',
  },
  {
    id: 'sup3',
    companyId: 'c2',
    name: 'Serviços Rio',
    contactName: 'Carlos Mendonça',
    email: 'atend@servrio.com',
    phone: '(21) 2222-3333',
    whatsapp: '(21) 98888-7777',
  },
]

export const contracts = [
  {
    id: 'con1',
    companyId: 'c1',
    supplierId: 'sup1',
    registrationDate: '2025-01-10',
    startDate: '2025-02-01',
    endDate: '2026-02-01',
    renewalWithin: true,
    renewalAfter: false,
  },
  {
    id: 'con2',
    companyId: 'c1',
    supplierId: 'sup2',
    registrationDate: '2025-03-01',
    startDate: '2025-03-15',
    endDate: '2025-09-15',
    renewalWithin: false,
    renewalAfter: true,
  },
]

export const kpis = {
  totalEquipment: 142,
  pendingMaintenance: 12,
  lowStockParts: 8,
  activeWarranties: 45,
}

export const recentActivity = [
  {
    id: 1,
    companyId: 'c1',
    user: 'João Silva',
    action: 'Atualizou estoque',
    target: 'Rolamento SKF 6204',
    time: '10 min atrás',
  },
  {
    id: 2,
    companyId: 'c1',
    user: 'Maria Souza',
    action: 'Criou ordem de manutenção',
    target: 'Torno CNC #001',
    time: '1 hora atrás',
  },
  {
    id: 3,
    companyId: 'c2',
    user: 'Sistema',
    action: 'Alerta de garantia',
    target: 'Motor Elétrico M2',
    time: '2 horas atrás',
  },
  {
    id: 4,
    companyId: 'c1',
    user: 'Carlos Santos',
    action: 'Adicionou equipamento',
    target: 'Empilhadeira E-10',
    time: '5 horas atrás',
  },
]

export const stockData = [
  { name: 'Filtros', atual: 45, minimo: 20, companyId: 'c1' },
  { name: 'Correias', atual: 12, minimo: 15, companyId: 'c1' },
  { name: 'Rolamentos', atual: 8, minimo: 30, companyId: 'c1' },
  { name: 'Sensores', atual: 25, minimo: 10, companyId: 'c2' },
  { name: 'Óleo (L)', atual: 100, minimo: 50, companyId: 'c2' },
]

export const systemLocators = [
  { id: 'l1', name: 'Prateleira A1', description: 'Corredor 1, Nível Baixo' },
  { id: 'l2', name: 'Armário B', description: 'Ferramentas e Peças Pequenas' },
  { id: 'l3', name: 'Pátio Externo', description: 'Área de maquinário pesado' },
  { id: 'l4', name: 'Almoxarifado Central', description: 'Estoque principal' },
]

export const equipment = [
  {
    id: 'EQ-001',
    companyId: 'c1',
    name: 'Torno CNC Romi',
    sku: 'EQ-CNC-001',
    patrimony: 'PAT-10020',
    locatorId: 'l3',
    serial: 'SN-998273',
    category: 'Usinagem',
    status: 'Operacional',
    warranty: '2027-05-10',
  },
  {
    id: 'EQ-002',
    companyId: 'c1',
    name: 'Esteira Transportadora A',
    sku: 'EQ-EST-002',
    patrimony: 'PAT-10021',
    locatorId: 'l4',
    serial: 'SN-112344',
    category: 'Logística',
    status: 'Em Manutenção',
    warranty: '2024-11-20',
  },
  {
    id: 'EQ-003',
    companyId: 'c2',
    name: 'Empilhadeira Yale',
    sku: 'EQ-EMP-003',
    patrimony: 'PAT-10022',
    locatorId: 'l3',
    serial: 'SN-554433',
    category: 'Veículos',
    status: 'Inativo',
    warranty: 'Expirada',
  },
  {
    id: 'EQ-004',
    companyId: 'c1',
    name: 'Compressor de Ar Schulz',
    sku: 'EQ-CMP-004',
    patrimony: 'PAT-10023',
    locatorId: 'l4',
    serial: 'SN-999888',
    category: 'Pneumática',
    status: 'Operacional',
    warranty: '2026-01-15',
  },
]

export const parts = [
  {
    id: 'PT-100',
    companyId: 'c1',
    name: 'Rolamento SKF 6204',
    sku: 'SKF-6204-2Z',
    patrimony: 'PAT-P-001',
    locatorId: 'l2',
    stock: 8,
    minStock: 20,
    price: 45.9,
  },
  {
    id: 'PT-101',
    companyId: 'c1',
    name: 'Correia em V A-35',
    sku: 'V-A35-GTS',
    patrimony: 'PAT-P-002',
    locatorId: 'l1',
    stock: 15,
    minStock: 10,
    price: 22.5,
  },
  {
    id: 'PT-102',
    companyId: 'c2',
    name: 'Filtro de Óleo Hidráulico',
    sku: 'FH-900',
    patrimony: 'PAT-P-003',
    locatorId: 'l2',
    stock: 4,
    minStock: 15,
    price: 120.0,
  },
  {
    id: 'PT-103',
    companyId: 'c1',
    name: 'Sensor Indutivo M12',
    sku: 'SI-M12-PNP',
    patrimony: 'PAT-P-004',
    locatorId: 'l2',
    stock: 25,
    minStock: 5,
    price: 85.0,
  },
]

export const maintenances = [
  {
    id: 'OS-2023',
    companyId: 'c1',
    equip: 'Esteira Transportadora A',
    type: 'Preventiva',
    date: '2026-03-20',
    status: 'Pendente',
    technician: 'João Silva',
  },
  {
    id: 'OS-2024',
    companyId: 'c2',
    equip: 'Empilhadeira Yale',
    type: 'Corretiva',
    date: '2026-03-15',
    status: 'Em Andamento',
    technician: 'Carlos Santos',
  },
  {
    id: 'OS-2021',
    companyId: 'c1',
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
    companyId: 'c1',
    timestamp: '2026-03-13 14:30',
    user: 'admin@empresa.com',
    action: 'LOGIN',
    entity: 'Sistema',
  },
  {
    id: 2,
    companyId: 'c1',
    timestamp: '2026-03-13 15:45',
    user: 'joao@empresa.com',
    action: 'UPDATE',
    entity: 'Peça PT-100',
  },
  {
    id: 3,
    companyId: 'c2',
    timestamp: '2026-03-13 16:10',
    user: 'carlos@empresa.com',
    action: 'CREATE',
    entity: 'Ordem OS-2025',
  },
  {
    id: 4,
    companyId: 'c1',
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
  {
    id: 'u1',
    name: 'Admin Geral',
    email: 'admin@assetpro.com',
    phone: '+55 11 99999-9999',
    twoFactorEnabled: true,
    groupId: 'g1',
    status: 'Ativo',
  },
  {
    id: 'u2',
    name: 'João Técnico',
    email: 'joao@assetpro.com',
    phone: '+55 11 98888-8888',
    twoFactorEnabled: false,
    groupId: 'g2',
    status: 'Ativo',
  },
  {
    id: 'u3',
    name: 'Maria Gestora',
    email: 'maria@assetpro.com',
    phone: '',
    twoFactorEnabled: false,
    groupId: 'g3',
    status: 'Inativo',
  },
]
