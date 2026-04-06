CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    type text DEFAULT 'equipment',
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
    model text,
    sku text,
    price numeric DEFAULT 0,
    stock integer DEFAULT 0,
    min_stock integer DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_policy" ON public.products;
CREATE POLICY "products_policy" ON public.products
    FOR ALL TO public
    USING (EXISTS (SELECT 1 FROM company_memberships WHERE company_memberships.company_id = products.company_id AND company_memberships.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM company_memberships WHERE company_memberships.company_id = products.company_id AND company_memberships.user_id = auth.uid()));

ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products(id) ON DELETE CASCADE;

DO $$
DECLARE
    rec RECORD;
    new_product_id uuid;
BEGIN
    FOR rec IN SELECT * FROM public.assets WHERE product_id IS NULL
    LOOP
        INSERT INTO public.products (company_id, name, description, type, category_id, brand_id, model, sku, price, stock, min_stock)
        VALUES (rec.company_id, rec.name, rec.description, rec.type, rec.category_id, rec.brand_id, rec.model, rec.sku, rec.price, rec.stock, rec.min_stock)
        RETURNING id INTO new_product_id;
        
        UPDATE public.assets SET product_id = new_product_id WHERE id = rec.id;
    END LOOP;
END $$;

ALTER TABLE public.assets ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.assets ALTER COLUMN type DROP NOT NULL;
