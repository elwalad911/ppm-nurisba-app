-- ============================================================
-- MIGRATION 008: ATOMIC CAMPAIGN AMOUNT INCREMENT VIA RPC
-- ============================================================
-- Fixes race condition in webhook handler where concurrent donations
-- to the same campaign could result in lost amounts due to
-- read-modify-write pattern.
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_campaign_amount(
  p_campaign_id UUID,
  p_amount BIGINT
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.campaigns
  SET current_amount = current_amount + p_amount,
      updated_at = now()
  WHERE id = p_campaign_id;
$$;
