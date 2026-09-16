-- ============================================================
-- MIGRATION 011: HARDEN increment_campaign_amount RPC
-- ============================================================
-- Fixes CRITICAL vulnerability: function was EXECUTABLE BY PUBLIC
-- due to missing REVOKE/GRANT statements.
--
-- Security model:
--   Browser / anon           → MUST NOT invoke (REVOKE from PUBLIC)
--   Authenticated donor      → MUST NOT invoke (no GRANT)
--   Admin browser            → MUST NOT directly invoke (no GRANT)
--   Trusted server webhook   → MAY invoke (GRANT to service_role)
--   Trusted admin action     → MAY invoke after admin verify
--                              (uses createServiceRoleClient())
-- ============================================================

-- 1. Revoke default PUBLIC execution (PUBLIC has implicit EXECUTE
--    on SQL functions by default in PostgreSQL)
REVOKE EXECUTE ON FUNCTION public.increment_campaign_amount(UUID, BIGINT) FROM PUBLIC;

-- 2. Grant EXECUTE only to service_role (trusted server-side key).
--    service_role bypasses RLS and is ONLY usable server-side with
--    SUPABASE_SERVICE_ROLE_KEY. Browser clients never have access.
GRANT EXECUTE ON FUNCTION public.increment_campaign_amount(UUID, BIGINT) TO service_role;

-- 3. Replace function with hardened version:
--    - LANGUAGE plpgsql to allow validation logic
--    - Validate p_amount > 0
--    - Validate campaign exists
--    - SET search_path = public, pg_temp to prevent schema injection
--    - SECURITY DEFINER preserved (runs with owner privileges)
DROP FUNCTION IF EXISTS public.increment_campaign_amount(UUID, BIGINT);

CREATE OR REPLACE FUNCTION public.increment_campaign_amount(
  p_campaign_id UUID,
  p_amount BIGINT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_campaign_exists BOOLEAN;
BEGIN
  -- Validate campaign exists
  SELECT EXISTS (SELECT 1 FROM public.campaigns WHERE id = p_campaign_id)
  INTO v_campaign_exists;

  IF NOT v_campaign_exists THEN
    RAISE EXCEPTION 'Invalid campaign ID: %', p_campaign_id;
  END IF;

  -- Validate amount is positive
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Atomic increment (preserves existing semantics; does not check
  -- campaign status to allow late payment settlement after status change)
  UPDATE public.campaigns
  SET current_amount = current_amount + p_amount,
      updated_at = now()
  WHERE id = p_campaign_id;
END;
$$;

-- 4. Explicitly confirm owner and permissions
--    (Owner remains postgres/superuser; service_role has EXECUTE;
--     PUBLIC has no EXECUTE)
REVOKE EXECUTE ON FUNCTION public.increment_campaign_amount(UUID, BIGINT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_campaign_amount(UUID, BIGINT) TO service_role;
