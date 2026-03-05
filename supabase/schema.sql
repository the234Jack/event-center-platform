-- ============================================================
-- EventHub Database Schema
-- Run this in your Supabase project: SQL Editor → New Query
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES
-- Extends Supabase auth.users with role + personal details
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('client', 'staff', 'owner')),
  full_name       TEXT,
  phone           TEXT,
  nin             TEXT,
  date_of_birth   DATE,
  gender          TEXT,
  state           TEXT,
  lga             TEXT,
  address         TEXT,
  business_name   TEXT,       -- owners only
  business_address TEXT,      -- owners only
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 2. VENUES (Event Centers)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS venues (
  id              TEXT PRIMARY KEY,   -- slug, e.g. 'grand-palace-ikeja'
  owner_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  address         TEXT,
  landmark        TEXT,
  category        TEXT NOT NULL CHECK (category IN ('wedding','conference','party','outdoor','corporate','banquet')),
  phone           TEXT,
  email           TEXT,
  rating          NUMERIC(3,2) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  price_from      INTEGER DEFAULT 0,
  price_to        INTEGER DEFAULT 0,
  max_capacity    INTEGER DEFAULT 0,
  cover_image     TEXT,
  gallery_images  TEXT[] DEFAULT '{}',
  facilities      TEXT[] DEFAULT '{}',
  services        TEXT[] DEFAULT '{}',
  featured        BOOLEAN DEFAULT FALSE,
  verified        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 3. HALLS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS halls (
  id                  TEXT PRIMARY KEY,  -- slug, e.g. 'grand-palace-ballroom'
  venue_id            TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  type                TEXT CHECK (type IN ('indoor','outdoor','mixed')),
  seating_capacity    INTEGER DEFAULT 0,
  standing_capacity   INTEGER DEFAULT 0,
  size_sqm            INTEGER,
  air_conditioned     BOOLEAN DEFAULT FALSE,
  price_per_hour      INTEGER DEFAULT 0,
  price_per_day       INTEGER DEFAULT 0,
  facilities          TEXT[] DEFAULT '{}',
  images              TEXT[] DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 4. BOOKINGS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  venue_id              TEXT NOT NULL REFERENCES venues(id),
  hall_id               TEXT NOT NULL REFERENCES halls(id),
  event_date            DATE NOT NULL,
  start_time            TIME,
  end_time              TIME,
  event_type            TEXT NOT NULL,
  guest_count           INTEGER NOT NULL,
  special_requirements  TEXT,
  total_cost            INTEGER,
  status                TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 5. STAFF MEMBERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staff_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  venue_id        TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('coordinator','supervisor','cleaner','security','catering','technician')),
  staff_code      TEXT UNIQUE NOT NULL,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  join_date       DATE DEFAULT CURRENT_DATE,
  events_handled  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 6. TASKS (Staff)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  priority    TEXT DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  due_date    DATE,
  category    TEXT,
  notes       TEXT,
  completed   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 7. SAVED VENUES (Client favourites)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_venues (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  venue_id    TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  saved_date  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (client_id, venue_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Ensures users can only access data they are allowed to see
-- ============================================================

ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues        ENABLE ROW LEVEL SECURITY;
ALTER TABLE halls         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_venues  ENABLE ROW LEVEL SECURITY;

-- ── Profiles ──────────────────────────────────────────────
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── Venues ────────────────────────────────────────────────
-- Public: anyone can browse venues (marketing website)
CREATE POLICY "Venues are publicly readable"
  ON venues FOR SELECT USING (true);

CREATE POLICY "Owners can insert their venues"
  ON venues FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their venues"
  ON venues FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their venues"
  ON venues FOR DELETE USING (auth.uid() = owner_id);

-- ── Halls ─────────────────────────────────────────────────
CREATE POLICY "Halls are publicly readable"
  ON halls FOR SELECT USING (true);

CREATE POLICY "Owners can manage halls of their venues"
  ON halls FOR ALL USING (
    EXISTS (
      SELECT 1 FROM venues
      WHERE venues.id = halls.venue_id
        AND venues.owner_id = auth.uid()
    )
  );

-- ── Bookings ──────────────────────────────────────────────
-- Clients see their own bookings
CREATE POLICY "Clients can read own bookings"
  ON bookings FOR SELECT USING (auth.uid() = client_id);

-- Owners see bookings for their venues
CREATE POLICY "Owners can read bookings for their venues"
  ON bookings FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM venues
      WHERE venues.id = bookings.venue_id
        AND venues.owner_id = auth.uid()
    )
  );

-- Staff see bookings at their venues
CREATE POLICY "Staff can read bookings at their venues"
  ON bookings FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_members
      WHERE staff_members.venue_id = bookings.venue_id
        AND staff_members.user_id = auth.uid()
        AND staff_members.status = 'active'
    )
  );

CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can cancel own bookings"
  ON bookings FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Owners can update booking status"
  ON bookings FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM venues
      WHERE venues.id = bookings.venue_id
        AND venues.owner_id = auth.uid()
    )
  );

-- ── Staff Members ─────────────────────────────────────────
CREATE POLICY "Staff can read own record"
  ON staff_members FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Owners can manage staff at their venues"
  ON staff_members FOR ALL USING (
    EXISTS (
      SELECT 1 FROM venues
      WHERE venues.id = staff_members.venue_id
        AND venues.owner_id = auth.uid()
    )
  );

-- ── Tasks ─────────────────────────────────────────────────
CREATE POLICY "Staff can manage own tasks"
  ON tasks FOR ALL USING (auth.uid() = staff_id);

-- ── Saved Venues ──────────────────────────────────────────
CREATE POLICY "Clients can manage own saved venues"
  ON saved_venues FOR ALL USING (auth.uid() = client_id);

-- ============================================================
-- HELPER VIEWS
-- ============================================================

-- Bookings with venue/hall/client details (used by dashboards)
CREATE OR REPLACE VIEW bookings_detailed AS
SELECT
  b.*,
  v.name        AS venue_name,
  v.city        AS venue_city,
  h.name        AS hall_name,
  p.full_name   AS client_name,
  p.phone       AS client_phone
FROM bookings b
JOIN venues   v ON v.id = b.venue_id
JOIN halls    h ON h.id = b.hall_id
JOIN profiles p ON p.id = b.client_id;
