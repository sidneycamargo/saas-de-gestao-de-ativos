CREATE TABLE IF NOT EXISTS public.maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    maintenance_id UUID NOT NULL REFERENCES public.maintenances(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "maintenance_logs_policy" ON public.maintenance_logs;
CREATE POLICY "maintenance_logs_policy" ON public.maintenance_logs
    FOR ALL
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.company_memberships cm
            WHERE cm.company_id = maintenance_logs.company_id
            AND cm.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.company_memberships cm
            WHERE cm.company_id = maintenance_logs.company_id
            AND cm.user_id = auth.uid()
        )
    );

CREATE INDEX IF NOT EXISTS idx_maintenance_logs_maintenance_id ON public.maintenance_logs(maintenance_id);

DO $DO$
BEGIN
    INSERT INTO public.maintenance_logs (company_id, maintenance_id, note, created_at)
    SELECT company_id, id, execution_notes, updated_at
    FROM public.maintenances
    WHERE execution_notes IS NOT NULL AND execution_notes != '';
END $DO$;
