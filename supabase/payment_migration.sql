-- ============================================================
-- EventHub: Add payment fields to bookings table
-- Run this in Supabase SQL Editor
-- ============================================================

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';

-- Index for quick lookup by payment reference
CREATE INDEX IF NOT EXISTS bookings_payment_ref_idx
  ON public.bookings (payment_reference)
  WHERE payment_reference IS NOT NULL;

-- ============================================================
-- payment_status values:
--   'unpaid'  — booking request submitted, no payment yet (legacy)
--   'paid'    — Paystack payment verified successfully
-- booking status after paid = 'confirmed' automatically
-- ============================================================
