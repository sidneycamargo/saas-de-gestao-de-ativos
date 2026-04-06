CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can do all on brands" ON public.brands;
CREATE POLICY "Super admins can do all on brands" ON public.brands
  FOR ALL TO public USING (public.is_super_admin());

DROP POLICY IF EXISTS "Users can do all on brands in their companies" ON public.brands;
CREATE POLICY "Users can do all on brands in their companies" ON public.brands
  FOR ALL TO public 
  USING (EXISTS (SELECT 1 FROM public.company_memberships WHERE company_memberships.company_id = brands.company_id AND company_memberships.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.company_memberships WHERE company_memberships.company_id = brands.company_id AND company_memberships.user_id = auth.uid()));

ALTER TABLE public.assets 
  ADD COLUMN IF NOT EXISTS identifier TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL;
