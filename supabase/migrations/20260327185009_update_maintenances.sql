ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS order_date DATE;
ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;

ALTER TABLE public.company_memberships DROP CONSTRAINT IF EXISTS company_memberships_role_check;
ALTER TABLE public.company_memberships ADD CONSTRAINT company_memberships_role_check CHECK (role IN ('Admin', 'Manager', 'Member'));
