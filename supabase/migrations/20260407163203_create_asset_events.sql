CREATE TABLE IF NOT EXISTS public.asset_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT,
  old_locator_id UUID REFERENCES public.locators(id) ON DELETE SET NULL,
  new_locator_id UUID REFERENCES public.locators(id) ON DELETE SET NULL,
  parts_replaced TEXT,
  cost NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.asset_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "asset_events_policy" ON public.asset_events;
CREATE POLICY "asset_events_policy" ON public.asset_events
  FOR ALL TO public
  USING (EXISTS (
    SELECT 1 FROM public.company_memberships cm
    WHERE cm.company_id = asset_events.company_id
      AND cm.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.company_memberships cm
    WHERE cm.company_id = asset_events.company_id
      AND cm.user_id = auth.uid()
  ));
