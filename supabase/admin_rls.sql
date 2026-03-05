-- ============================================================
-- EventHub Admin RLS Policies
-- Run this AFTER admin_setup.sql
-- Grants admin users read/write access to all platform data
-- ============================================================

-- Helper function: check if current user is admin (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── Profiles: admin can read all ──────────────────────────
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT USING (is_admin());

-- ── Venues: admin can approve/reject ──────────────────────
-- (venues are already publicly readable, but admin needs write)
CREATE POLICY "Admin can update any venue"
  ON venues FOR UPDATE USING (is_admin());

CREATE POLICY "Admin can delete any venue"
  ON venues FOR DELETE USING (is_admin());

-- ── Bookings: admin can read all ──────────────────────────
CREATE POLICY "Admin can read all bookings"
  ON bookings FOR SELECT USING (is_admin());

-- ── Staff Members: admin can read and manage all ──────────
CREATE POLICY "Admin can read all staff"
  ON staff_members FOR SELECT USING (is_admin());

CREATE POLICY "Admin can update any staff member"
  ON staff_members FOR UPDATE USING (is_admin());

CREATE POLICY "Admin can delete any staff member"
  ON staff_members FOR DELETE USING (is_admin());

-- ── Tasks: admin can read all ─────────────────────────────
CREATE POLICY "Admin can read all tasks"
  ON tasks FOR SELECT USING (is_admin());

-- ============================================================
-- DONE. Admin can now:
--   - View all user profiles
--   - Approve/reject venues
--   - View all bookings
--   - View, deactivate, remove any staff member
-- ============================================================
