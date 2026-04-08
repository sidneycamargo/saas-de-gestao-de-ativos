ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS execution_notes TEXT;

CREATE TABLE IF NOT EXISTS public.maintenance_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_id UUID REFERENCES public.maintenances(id) ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  problem_description TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS maintenance_assets_maintenance_id_asset_id_idx ON public.maintenance_assets (maintenance_id, asset_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'maintenance_assets_maintenance_id_asset_id_key'
  ) THEN
    ALTER TABLE public.maintenance_assets ADD CONSTRAINT maintenance_assets_maintenance_id_asset_id_key UNIQUE USING INDEX maintenance_assets_maintenance_id_asset_id_idx;
  END IF;
END $$;

ALTER TABLE public.maintenance_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "maintenance_assets_policy" ON public.maintenance_assets;
CREATE POLICY "maintenance_assets_policy" ON public.maintenance_assets
  FOR ALL TO public
  USING (EXISTS (
    SELECT 1 FROM public.maintenances m
    JOIN public.company_memberships cm ON cm.company_id = m.company_id
    WHERE m.id = maintenance_assets.maintenance_id AND cm.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.maintenances m
    JOIN public.company_memberships cm ON cm.company_id = m.company_id
    WHERE m.id = maintenance_assets.maintenance_id AND cm.user_id = auth.uid()
  ));
