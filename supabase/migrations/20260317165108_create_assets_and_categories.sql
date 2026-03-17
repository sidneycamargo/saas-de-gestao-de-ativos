CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Super admins can do all on categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_super_admin = true)
);

CREATE POLICY "Users can do all on categories in their companies" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_memberships.company_id = categories.company_id AND company_memberships.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_memberships.company_id = categories.company_id AND company_memberships.user_id = auth.uid())
);

-- Assets Policies
CREATE POLICY "Super admins can do all on assets" ON assets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_super_admin = true)
);

CREATE POLICY "Users can do all on assets in their companies" ON assets FOR ALL USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_memberships.company_id = assets.company_id AND company_memberships.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_memberships.company_id = assets.company_id AND company_memberships.user_id = auth.uid())
);

-- Seed Categories for existing companies
DO $$
DECLARE
  comp RECORD;
BEGIN
  FOR comp IN SELECT id FROM companies LOOP
    INSERT INTO categories (name, company_id) VALUES
      ('Móveis', comp.id),
      ('Automóveis', comp.id),
      ('Equipamentos', comp.id),
      ('Ferramentas', comp.id);
  END LOOP;
END $$;
