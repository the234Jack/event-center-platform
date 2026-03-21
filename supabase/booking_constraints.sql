-- ============================================================
-- EventHub: Double-Booking Prevention
-- Run this in Supabase SQL Editor to add a unique constraint
-- that prevents two active bookings for the same hall on the
-- same date (status = 'pending' or 'confirmed').
-- ============================================================

-- Partial unique index: one active booking per hall per date
CREATE UNIQUE INDEX IF NOT EXISTS bookings_hall_date_active_idx
  ON public.bookings (hall_id, event_date)
  WHERE status IN ('pending', 'confirmed');

-- Optional: allow the client-side "already booked" check to
-- benefit from an index on hall_id + status for fetchHallBookedDates
CREATE INDEX IF NOT EXISTS bookings_hall_status_idx
  ON public.bookings (hall_id, status);

-- ============================================================
-- How it works:
--   - The UNIQUE constraint only applies to rows where status
--     is 'pending' or 'confirmed' (active bookings).
--   - Cancelled bookings do NOT prevent future bookings on the
--     same date.
--   - The client-side check in createBooking (bookings.ts) is
--     a UX guard; this index is the authoritative DB-level guard.
-- ============================================================
