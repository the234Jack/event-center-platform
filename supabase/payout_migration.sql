-- ============================================================
-- EventHub: Venue Owner Payout Details
-- Run this in Supabase SQL Editor
-- Adds bank account details and Paystack subaccount code
-- to the venues table so owners can receive payments.
-- ============================================================

ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS bank_name          TEXT,
  ADD COLUMN IF NOT EXISTS bank_code          TEXT,
  ADD COLUMN IF NOT EXISTS account_number     TEXT,
  ADD COLUMN IF NOT EXISTS account_name       TEXT,
  ADD COLUMN IF NOT EXISTS paystack_subaccount_code TEXT;

-- ============================================================
-- Column descriptions:
--   bank_name      — e.g., "Guaranty Trust Bank (GTBank)"
--   bank_code      — Paystack bank code e.g., "058"
--   account_number — 10-digit NUBAN account number
--   account_name   — Account name as registered with the bank
--   paystack_subaccount_code — e.g., "ACCT_xxxxxxxxxx"
--                   Populated automatically by the Edge Function
--                   after venue registration.
-- ============================================================
