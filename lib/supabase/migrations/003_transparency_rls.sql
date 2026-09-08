-- ============================================================
-- MIGRATION 003: TRANSPARENCY & EXPENSE LEDGER RLS POLICIES
-- ============================================================

-- 1. POLICIES FOR TRANSPARENCY_REPORTS
DROP POLICY IF EXISTS "Public can view published transparency reports" ON public.transparency_reports;
CREATE POLICY "Public can view published transparency reports" ON public.transparency_reports
  FOR SELECT USING (published_at IS NOT NULL OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage transparency reports" ON public.transparency_reports;
CREATE POLICY "Admins can manage transparency reports" ON public.transparency_reports
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2. POLICIES FOR FINANCIAL_TRANSACTIONS
DROP POLICY IF EXISTS "Public can view financial transactions" ON public.financial_transactions;
CREATE POLICY "Public can view financial transactions" ON public.financial_transactions
  FOR SELECT USING (true);

-- Admins can ONLY insert/manage expense or refund. INCOMING is strictly webhook/service-role.
DROP POLICY IF EXISTS "Admins can manage expense transactions" ON public.financial_transactions;
CREATE POLICY "Admins can manage expense transactions" ON public.financial_transactions
  FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin() AND type IN ('expense', 'refund'));
