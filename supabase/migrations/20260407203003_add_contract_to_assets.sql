-- Add identifier and description to contracts table
ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS identifier TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add contract_id to assets table to allow linking multiple assets to one contract
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL;

-- Create an index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_assets_contract_id ON public.assets(contract_id);
