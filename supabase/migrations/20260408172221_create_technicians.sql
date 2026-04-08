DO $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.technicians (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      type TEXT DEFAULT 'Interno',
      specialty TEXT,
      status TEXT DEFAULT 'Ativo',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL;
END $$;

ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "technicians_policy" ON public.technicians;
CREATE POLICY "technicians_policy" ON public.technicians
    FOR ALL TO public
    USING (EXISTS ( SELECT 1 FROM public.company_memberships cm WHERE cm.company_id = technicians.company_id AND cm.user_id = auth.uid() ))
    WITH CHECK (EXISTS ( SELECT 1 FROM public.company_memberships cm WHERE cm.company_id = technicians.company_id AND cm.user_id = auth.uid() ));
