-- ============================================================
-- EventHub Registration Fix
-- Run this in Supabase SQL Editor to fix:
--   "new row violates row-level security policy for table profiles"
--
-- Root cause: Supabase email confirmation is enabled by default.
-- After signUp(), the user is NOT yet authenticated (no session),
-- so auth.uid() = NULL and the INSERT policy (auth.uid() = id) fails.
--
-- Solution: A trigger auto-creates the profile on auth.users INSERT
-- using data stored in user metadata. SECURITY DEFINER bypasses RLS.
-- The frontend no longer needs a separate profiles.insert() call.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  meta jsonb := NEW.raw_user_meta_data;
BEGIN
  INSERT INTO public.profiles (
    id, role, full_name, phone, nin,
    business_name, business_address, state, lga
  )
  VALUES (
    NEW.id,
    COALESCE(meta->>'role', 'client'),
    meta->>'full_name',
    meta->>'phone',
    meta->>'nin',
    meta->>'business_name',
    meta->>'business_address',
    meta->>'state',
    meta->>'lga'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- After running this SQL:
-- 1. The trigger creates the profile automatically on signUp
-- 2. No separate supabase.from('profiles').insert() is needed
-- 3. Works with email confirmation ON or OFF
-- ============================================================
