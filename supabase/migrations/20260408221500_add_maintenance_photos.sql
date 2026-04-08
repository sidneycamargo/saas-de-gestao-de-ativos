ALTER TABLE public.maintenance_assets ADD COLUMN IF NOT EXISTS photo_before TEXT;
ALTER TABLE public.maintenance_assets ADD COLUMN IF NOT EXISTS photo_after TEXT;
