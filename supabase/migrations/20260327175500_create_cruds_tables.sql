-- Profiles add columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Ativo';

-- Locators
CREATE TABLE IF NOT EXISTS public.locators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.locators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "locators_policy" ON public.locators;
CREATE POLICY "locators_policy" ON public.locators FOR ALL USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = locators.company_id AND user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = locators.company_id AND user_id = auth.uid())
);

-- Assets extra columns
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS patrimony TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS locator_id UUID REFERENCES public.locators(id) ON DELETE SET NULL;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS serial TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Operacional';
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 0;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'asset';

-- Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "suppliers_policy" ON public.suppliers;
CREATE POLICY "suppliers_policy" ON public.suppliers FOR ALL USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = suppliers.company_id AND user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = suppliers.company_id AND user_id = auth.uid())
);

-- Contracts
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  registration_date DATE,
  start_date DATE,
  end_date DATE,
  renewal_within BOOLEAN DEFAULT false,
  renewal_after BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contracts_policy" ON public.contracts;
CREATE POLICY "contracts_policy" ON public.contracts FOR ALL USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = contracts.company_id AND user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = contracts.company_id AND user_id = auth.uid())
);

-- Maintenances
CREATE TABLE IF NOT EXISTS public.maintenances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  type TEXT,
  date DATE,
  status TEXT DEFAULT 'Pendente',
  technician TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.maintenances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "maintenances_policy" ON public.maintenances;
CREATE POLICY "maintenances_policy" ON public.maintenances FOR ALL USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = maintenances.company_id AND user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = maintenances.company_id AND user_id = auth.uid())
);

-- Warranties
CREATE TABLE IF NOT EXISTS public.warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  type TEXT,
  provider TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'Ativa',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "warranties_policy" ON public.warranties;
CREATE POLICY "warranties_policy" ON public.warranties FOR ALL USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = warranties.company_id AND user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = warranties.company_id AND user_id = auth.uid())
);

-- Groups
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "groups_policy" ON public.groups;
CREATE POLICY "groups_policy" ON public.groups FOR ALL USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = groups.company_id AND user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_id = groups.company_id AND user_id = auth.uid())
);

ALTER TABLE public.company_memberships ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL;
