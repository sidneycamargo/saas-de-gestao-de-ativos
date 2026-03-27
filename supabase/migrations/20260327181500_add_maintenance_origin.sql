-- Add new fields for multiple forms of maintenance calls
ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Média';
ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'Manual';
