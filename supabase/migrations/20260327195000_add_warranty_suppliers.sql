CREATE TABLE IF NOT EXISTS public.warranty_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warranty_id UUID NOT NULL REFERENCES public.warranties(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(warranty_id, supplier_id)
);

ALTER TABLE public.warranty_suppliers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "warranty_suppliers_policy" ON public.warranty_suppliers;
CREATE POLICY "warranty_suppliers_policy" ON public.warranty_suppliers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM warranties w
    JOIN company_memberships cm ON cm.company_id = w.company_id
    WHERE w.id = warranty_suppliers.warranty_id AND cm.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM warranties w
    JOIN company_memberships cm ON cm.company_id = w.company_id
    WHERE w.id = warranty_suppliers.warranty_id AND cm.user_id = auth.uid()
  )
);
