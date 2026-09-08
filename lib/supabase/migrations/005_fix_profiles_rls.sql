-- ============================================================
-- MIGRATION 005: FIX PROFILES RLS POLICY FOR DIRECT SELF-READ
-- ============================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Direct self-read and admin-all policy to prevent recursion during login role checks
CREATE POLICY "Profiles self-read and admin all" ON public.profiles
  FOR ALL
  USING (user_id = auth.uid() || public.is_admin())
  WITH CHECK (user_id = auth.uid() || public.is_admin());
