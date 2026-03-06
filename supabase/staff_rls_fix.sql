-- Fix: Allow authenticated users to read staff_members for invite code validation.
-- Without this, a newly-signed-up staff cannot verify their invite code because
-- the default RLS policy has no SELECT grant for non-owners.

-- Allow any authenticated user to read staff_members rows.
-- The write policies (INSERT/UPDATE) remain restricted to owners/admins.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'staff_members'
      AND policyname = 'authenticated_read_staff_members'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "authenticated_read_staff_members"
      ON public.staff_members
      FOR SELECT
      TO authenticated
      USING (true);
    $policy$;
  END IF;
END $$;
