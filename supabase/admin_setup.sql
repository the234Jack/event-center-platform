-- ============================================================
-- EventHub Admin Setup
-- Run this in Supabase SQL Editor AFTER running schema.sql
-- ============================================================

-- Step 1: Allow 'admin' as a valid role in profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('client', 'staff', 'owner', 'admin'));

-- Step 2: New venues default to unverified (require admin approval)
ALTER TABLE venues ALTER COLUMN verified SET DEFAULT false;

-- Step 3: Create admin user
-- This inserts directly into Supabase auth + profiles.
-- Admin credentials: admin@eventhub.ng / EventHub@2024
DO $$
DECLARE
  admin_uid UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    admin_uid,
    'authenticated',
    'authenticated',
    'admin@eventhub.ng',
    crypt('EventHub@2024', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (id, role, full_name, created_at, updated_at)
  VALUES (admin_uid, 'admin', 'System Administrator', NOW(), NOW());
END $$;

-- ============================================================
-- DONE. Admin login:
--   Email:    admin@eventhub.ng
--   Password: EventHub@2024
-- Change the password after first login.
-- ============================================================
