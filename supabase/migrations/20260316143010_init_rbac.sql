CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  legal_identifier TEXT,
  contact_email TEXT,
  configuration JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Trial', 'Pending Payment')),
  plan_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id)
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE company_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, is_super_admin)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'), NEW.email, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can do all on companies" ON companies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_super_admin = true)
);

CREATE POLICY "Users can view companies they belong to" ON companies FOR SELECT USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_memberships.company_id = companies.id AND company_memberships.user_id = auth.uid())
);

CREATE POLICY "Super admins can do all on subscriptions" ON subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_super_admin = true)
);

CREATE POLICY "Users can view their company subscriptions" ON subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM company_memberships WHERE company_memberships.company_id = subscriptions.company_id AND company_memberships.user_id = auth.uid())
);

CREATE POLICY "Super admins can do all on profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_super_admin = true)
);

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (
  id = auth.uid()
);

CREATE POLICY "Users can view profiles in same company" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_memberships cm1
    JOIN company_memberships cm2 ON cm1.company_id = cm2.company_id
    WHERE cm1.user_id = auth.uid() AND cm2.user_id = profiles.id
  )
);

CREATE POLICY "Super admins can do all on memberships" ON company_memberships FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_super_admin = true)
);

CREATE POLICY "Users can view memberships of their companies" ON company_memberships FOR SELECT USING (
  EXISTS (SELECT 1 FROM company_memberships my_cm WHERE my_cm.company_id = company_memberships.company_id AND my_cm.user_id = auth.uid())
);

DO $$
DECLARE
  super_admin_id uuid := gen_random_uuid();
  company_admin_id uuid := gen_random_uuid();
  company_id_1 uuid := gen_random_uuid();
  company_id_2 uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current, phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    super_admin_id, '00000000-0000-0000-0000-000000000000', 'superadmin@example.com',
    crypt('Admin123!', gen_salt('bf')), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{"name": "Super Admin"}',
    false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
  );

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current, phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    company_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@techcorp.com',
    crypt('Admin123!', gen_salt('bf')), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{"name": "Admin TechCorp"}',
    false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
  );

  UPDATE profiles SET is_super_admin = true WHERE id = super_admin_id;

  INSERT INTO companies (id, name, legal_identifier, contact_email) VALUES 
  (company_id_1, 'Tech Corp SaaS', '11.222.333/0001-44', 'contact@techcorp.com'),
  (company_id_2, 'Global Logistics', '55.666.777/0001-88', 'hello@globallogistics.com');

  INSERT INTO subscriptions (company_id, status, plan_name) VALUES 
  (company_id_1, 'Active', 'Enterprise'),
  (company_id_2, 'Suspended', 'Basic');

  INSERT INTO company_memberships (user_id, company_id, role) VALUES 
  (company_admin_id, company_id_1, 'Admin'),
  (super_admin_id, company_id_1, 'Admin'),
  (super_admin_id, company_id_2, 'Admin');
END $$;
