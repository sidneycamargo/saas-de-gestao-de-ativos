-- Create a security definer function to get company IDs safely
CREATE OR REPLACE FUNCTION public.get_user_company_ids()
RETURNS SETOF uuid AS $$
  SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Create function for company admins
CREATE OR REPLACE FUNCTION public.get_admin_company_ids()
RETURNS SETOF uuid AS $$
  SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid() AND role = 'Admin';
$$ LANGUAGE sql SECURITY DEFINER;

-- Super admin function
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
  SELECT COALESCE(
    (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Drop the old recursive policies
DROP POLICY IF EXISTS "Users can view memberships of their companies" ON public.company_memberships;
DROP POLICY IF EXISTS "Super admins can do all on memberships" ON public.company_memberships;

-- Create the new non-recursive policies for company_memberships
CREATE POLICY "Users can view memberships of their companies" ON public.company_memberships
FOR SELECT USING (
  company_id IN (SELECT public.get_user_company_ids())
);

DROP POLICY IF EXISTS "Company admins can manage memberships" ON public.company_memberships;
CREATE POLICY "Company admins can manage memberships" ON public.company_memberships
FOR ALL USING (
  company_id IN (SELECT public.get_admin_company_ids())
) WITH CHECK (
  company_id IN (SELECT public.get_admin_company_ids())
);

CREATE POLICY "Super admins can do all on memberships" ON public.company_memberships FOR ALL USING (public.is_super_admin());

-- Fix policies on companies
DROP POLICY IF EXISTS "Super admins can do all on companies" ON public.companies;
CREATE POLICY "Super admins can do all on companies" ON public.companies FOR ALL USING (public.is_super_admin());

-- Fix policies on subscriptions
DROP POLICY IF EXISTS "Super admins can do all on subscriptions" ON public.subscriptions;
CREATE POLICY "Super admins can do all on subscriptions" ON public.subscriptions FOR ALL USING (public.is_super_admin());

-- Fix policies on profiles
DROP POLICY IF EXISTS "Super admins can do all on profiles" ON public.profiles;
CREATE POLICY "Super admins can do all on profiles" ON public.profiles FOR ALL USING (public.is_super_admin());

-- Fix policies on categories
DROP POLICY IF EXISTS "Super admins can do all on categories" ON public.categories;
CREATE POLICY "Super admins can do all on categories" ON public.categories FOR ALL USING (public.is_super_admin());

-- Fix policies on assets
DROP POLICY IF EXISTS "Super admins can do all on assets" ON public.assets;
CREATE POLICY "Super admins can do all on assets" ON public.assets FOR ALL USING (public.is_super_admin());
