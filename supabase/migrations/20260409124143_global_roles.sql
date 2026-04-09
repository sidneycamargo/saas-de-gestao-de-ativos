DO $$
BEGIN
  -- 1. Drop dependent policies from groups
  DROP POLICY IF EXISTS "groups_policy" ON public.groups;
END $$;

-- 2. Add group_id to profiles to make roles global
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL;

-- 3. Migrate existing group_ids from company_memberships to profiles
DO $$
BEGIN
  UPDATE public.profiles p
  SET group_id = cm.group_id
  FROM public.company_memberships cm
  WHERE p.id = cm.user_id AND cm.group_id IS NOT NULL AND p.group_id IS NULL;
END $$;

-- 4. Drop group_id from company_memberships
ALTER TABLE public.company_memberships DROP CONSTRAINT IF EXISTS company_memberships_group_id_fkey;
ALTER TABLE public.company_memberships DROP COLUMN IF EXISTS group_id;

-- 5. Drop company_id from groups (roles are now global)
ALTER TABLE public.groups DROP CONSTRAINT IF EXISTS groups_company_id_fkey;
ALTER TABLE public.groups DROP COLUMN IF EXISTS company_id;

-- 6. Update RLS for groups
CREATE POLICY "Super admins can manage groups" ON public.groups FOR ALL USING (public.is_super_admin());
CREATE POLICY "Everyone can read groups" ON public.groups FOR SELECT USING (true);
