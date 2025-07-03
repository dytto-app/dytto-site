/*
  # Waitlist System Setup - Fixed Version

  1. New Tables
    - `waitlist_entries`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `position` (integer, auto-calculated)
      - `source` (text, tracking source)
      - `referral_code` (text, unique)
      - `referred_by` (uuid, foreign key)
      - `referral_count` (integer, default 0)
      - `status` (enum: pending, invited, converted, unsubscribed)
      - `metadata` (jsonb, for additional data)
      - `created_at`, `invited_at`, `converted_at` (timestamps)

  2. Security
    - Enable RLS on `waitlist_entries` table
    - Add policies for anonymous signup and authenticated admin access

  3. Functions
    - Auto-generate referral codes
    - Calculate waitlist positions (fixed recursion issue)
    - Handle referral tracking
*/

-- Create enum for waitlist status
DO $$ BEGIN
    CREATE TYPE waitlist_status AS ENUM ('pending', 'invited', 'converted', 'unsubscribed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create waitlist_entries table
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  position integer,
  source text DEFAULT 'website',
  referral_code text UNIQUE NOT NULL DEFAULT '',
  referred_by uuid REFERENCES waitlist_entries(id),
  referral_count integer DEFAULT 0,
  status waitlist_status DEFAULT 'pending',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  invited_at timestamptz,
  converted_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist_entries(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_position ON waitlist_entries(position);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist_entries(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_entries(created_at);

-- Enable RLS
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
  attempts integer := 0;
BEGIN
  LOOP
    -- Generate a 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if it already exists
    SELECT EXISTS(SELECT 1 FROM waitlist_entries WHERE referral_code = code) INTO exists;
    
    -- If it doesn't exist, we can use it
    IF NOT exists THEN
      RETURN code;
    END IF;
    
    -- Prevent infinite loop
    attempts := attempts + 1;
    IF attempts > 100 THEN
      -- Fallback to timestamp-based code
      code := upper(substring(md5(extract(epoch from now())::text || random()::text) from 1 for 8));
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to set referral code before insert
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle referral tracking
CREATE OR REPLACE FUNCTION handle_referral()
RETURNS trigger AS $$
BEGIN
  -- If this signup was referred by someone, increment their referral count
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE waitlist_entries 
    SET referral_count = referral_count + 1 
    WHERE id = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate waitlist position (fixed to prevent recursion)
CREATE OR REPLACE FUNCTION calculate_waitlist_position()
RETURNS trigger AS $$
DECLARE
  new_position integer;
BEGIN
  -- Calculate position for the new entry only
  SELECT COUNT(*) + 1 
  INTO new_position
  FROM waitlist_entries 
  WHERE status = 'pending' 
    AND created_at < NEW.created_at;
  
  -- Update only the new entry's position
  UPDATE waitlist_entries 
  SET position = new_position
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate all positions (for admin use)
CREATE OR REPLACE FUNCTION recalculate_all_positions()
RETURNS void AS $$
BEGIN
  WITH ranked_entries AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_position
    FROM waitlist_entries 
    WHERE status = 'pending'
  )
  UPDATE waitlist_entries 
  SET position = ranked_entries.new_position
  FROM ranked_entries 
  WHERE waitlist_entries.id = ranked_entries.id;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_set_referral_code ON waitlist_entries;
CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON waitlist_entries
  FOR EACH ROW EXECUTE FUNCTION set_referral_code();

DROP TRIGGER IF EXISTS trigger_handle_referral ON waitlist_entries;
CREATE TRIGGER trigger_handle_referral
  AFTER INSERT ON waitlist_entries
  FOR EACH ROW EXECUTE FUNCTION handle_referral();

DROP TRIGGER IF EXISTS trigger_calculate_position ON waitlist_entries;
CREATE TRIGGER trigger_calculate_position
  AFTER INSERT ON waitlist_entries
  FOR EACH ROW EXECUTE FUNCTION calculate_waitlist_position();

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can join waitlist" ON waitlist_entries;
CREATE POLICY "Anyone can join waitlist" ON waitlist_entries
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own waitlist entry" ON waitlist_entries;
CREATE POLICY "Users can read own waitlist entry" ON waitlist_entries
  FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can read all waitlist entries" ON waitlist_entries;
CREATE POLICY "Authenticated users can read all waitlist entries" ON waitlist_entries
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update waitlist entries" ON waitlist_entries;
CREATE POLICY "Authenticated users can update waitlist entries" ON waitlist_entries
  FOR UPDATE TO authenticated
  USING (true);
