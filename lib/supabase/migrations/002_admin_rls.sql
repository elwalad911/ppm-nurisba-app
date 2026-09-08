-- ============================================================
-- MIGRATION 002: ADMIN RLS POLICIES & SECURITY DEFINER HELPER
-- ============================================================

-- 1. Helper function to check if current user is admin (SECURITY DEFINER prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

-- 2. POLICIES FOR CAMPAIGNS
-- Admins have full CRUD access, public can view active campaigns
DROP POLICY IF EXISTS "Public can view active campaigns" ON public.campaigns;
CREATE POLICY "Public can view active campaigns" ON public.campaigns
  FOR SELECT USING (status = 'active' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
CREATE POLICY "Admins can manage campaigns" ON public.campaigns
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. POLICIES FOR DONATIONS
-- Admins can view all donations, public can insert (intent)
DROP POLICY IF EXISTS "Public can insert donations" ON public.donations;
CREATE POLICY "Public can insert donations" ON public.donations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
CREATE POLICY "Admins can view all donations" ON public.donations
  FOR SELECT USING (public.is_admin());

-- NOTE: No admin update policy for donations.status to preserve financial invariant (webhook authoritative).

-- 4. POLICIES FOR POSTS
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
CREATE POLICY "Admins can manage posts" ON public.posts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. POLICIES FOR EVENTS
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. POLICIES FOR GALLERY
DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery;
CREATE POLICY "Public can view gallery" ON public.gallery
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery;
CREATE POLICY "Admins can manage gallery" ON public.gallery
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 7. POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());
