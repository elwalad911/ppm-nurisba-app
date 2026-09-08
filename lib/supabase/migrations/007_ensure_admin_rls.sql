-- ============================================================
-- MIGRATION 007: ENSURE ADMIN RLS POLICIES & FUNCTIONS EXIST
-- ============================================================
-- This migration is idempotent (safe to run multiple times).
-- It ensures the is_admin() function and all admin RLS policies
-- exist, even if earlier migrations (002-005) were not applied.
-- ============================================================

-- 1. Ensure is_admin() function exists
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

-- 2. GALLERY — Admins can manage (INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery;
CREATE POLICY "Public can view gallery" ON public.gallery
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery;
CREATE POLICY "Admins can manage gallery" ON public.gallery
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. CAMPAIGNS — Admins can manage
DROP POLICY IF EXISTS "Public can view active campaigns" ON public.campaigns;
CREATE POLICY "Public can view active campaigns" ON public.campaigns
  FOR SELECT USING (status = 'active' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
CREATE POLICY "Admins can manage campaigns" ON public.campaigns
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. DONATIONS — Admin can view all, public can insert
DROP POLICY IF EXISTS "Public can insert donations" ON public.donations;
CREATE POLICY "Public can insert donations" ON public.donations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
CREATE POLICY "Admins can view all donations" ON public.donations
  FOR SELECT USING (public.is_admin());

-- 5. POSTS — Admins can manage
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
CREATE POLICY "Admins can manage posts" ON public.posts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. EVENTS — Admins can manage
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 7. TRANSPARENCY_REPORTS — Admins can manage
DROP POLICY IF EXISTS "Public can view published transparency reports" ON public.transparency_reports;
CREATE POLICY "Public can view published transparency reports" ON public.transparency_reports
  FOR SELECT USING (published_at IS NOT NULL OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage transparency reports" ON public.transparency_reports;
CREATE POLICY "Admins can manage transparency reports" ON public.transparency_reports
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 8. FINANCIAL_TRANSACTIONS — Admin can manage expense/refund only
DROP POLICY IF EXISTS "Public can view financial transactions" ON public.financial_transactions;
CREATE POLICY "Public can view financial transactions" ON public.financial_transactions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage expense transactions" ON public.financial_transactions;
CREATE POLICY "Admins can manage expense transactions" ON public.financial_transactions
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin() AND type IN ('expense', 'refund'));

-- 9. PROFILES — Self-read/update + admin all
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles self-read and admin all" ON public.profiles;

CREATE POLICY "Profiles self-read and admin all" ON public.profiles
  FOR ALL
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- 10. DONATIONS — Donor can view/update own
DROP POLICY IF EXISTS "Donors can view own donations" ON public.donations;
CREATE POLICY "Donors can view own donations" ON public.donations
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Donors can update own donations" ON public.donations;
CREATE POLICY "Donors can update own donations" ON public.donations
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- 11. PAYMENTS — Donor can view own (via donation ownership)
DROP POLICY IF EXISTS "Donors can view own payments" ON public.payments;
CREATE POLICY "Donors can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.donations
      WHERE donations.id = payments.donation_id
        AND (donations.user_id = auth.uid() OR public.is_admin())
    )
  );
