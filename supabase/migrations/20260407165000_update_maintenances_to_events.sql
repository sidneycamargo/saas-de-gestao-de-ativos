DO $$
BEGIN
  ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS start_date DATE;
  ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS end_date DATE;
  ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS forecast_date DATE;
  ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL;
  ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS is_warranty BOOLEAN DEFAULT false;
END $$;
