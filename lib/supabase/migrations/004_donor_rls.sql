-- ============================================================
-- MIGRATION 004: DONOR PORTAL RLS POLICIES
-- ============================================================

-- 1. DONATIONS POLICY FOR DONORS
DROP POLICY IF EXISTS "Donors can view own donations" ON public.donations;
CREATE POLICY "Donors can view own donations" ON public.donations
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Donors can update own donations" ON public.donations;
CREATE POLICY "Donors can update own donations" ON public.donations
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- 2. PAYMENTS POLICY FOR DONORS (via donation ownership)
DROP POLICY IF EXISTS "Donors can view own payments" ON public.payments;
CREATE POLICY "Donors can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.donations
      WHERE donations.id = payments.donation_id
        AND (donations.user_id = auth.uid() OR public.is_admin())
    )
  );
