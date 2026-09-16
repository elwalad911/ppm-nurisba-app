/**
 * Detection of the financial income idempotency guard at the database level.
 *
 * The partial unique index
 *   financial_transactions_one_income_per_donation_idx
 *   ON public.financial_transactions (donation_id)
 *   WHERE type = 'income' AND donation_id IS NOT NULL
 * guarantees at most one income ledger row per donation, even when two
 * concurrent requests both pass the application-level pre-check
 * ("select existing ledger") before inserting.
 *
 * When the loser of such a race inserts, PostgreSQL raises 23505
 * (unique_violation). Callers must treat EXACTLY this violation as
 * "already processed": no second income, no second campaign increment.
 * Any other database error must keep flowing through the generic
 * error path.
 */

const INCOME_DEDUP_INDEX = "financial_transactions_one_income_per_donation_idx";

interface PostgrestLikeError {
  code?: string | null;
  message?: string | null;
}

export function isDuplicateIncomeError(
  error: PostgrestLikeError | null | undefined
): boolean {
  if (!error || error.code !== "23505") {
    return false;
  }
  // Pin detection to the specific partial unique index so that an
  // unexpected unique violation elsewhere can never be mistaken
  // for an idempotent duplicate.
  return (error.message ?? "").includes(INCOME_DEDUP_INDEX);
}
