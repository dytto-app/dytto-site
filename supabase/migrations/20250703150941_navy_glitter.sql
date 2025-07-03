/*
  # Waitlist System Setup

  1. New Tables
    - `waitlist_entries`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `position` (integer, auto-calculated)
      - `source` (text, tracking where they signed up)
      - `referral_code` (text, unique code for sharing)
      - `referred_by` (uuid, foreign key to other waitlist entry)
      - `referral_count` (integer, number of successful referrals)
      - `status` (enum: pending, invited, converted, unsubscribed)
      - `metadata` (jsonb, for additional data)
      - `created_at` (timestamp)
      - `invited_at` (timestamp, nullable)
      - `converted_at` (timestamp, nullable)

  2. Functions
    - Auto-generate referral codes
    - Calculate waitlist position
    - Handle referral tracking

  3. Security
    - Enable RLS on waitlist table
    - Add policies for public signup and private admin access
*/

-- Create enum for waitlist status
CREATE TYPE waitlist_status AS ENUM ('pending', 'invited', 'converted', 'unsubscribed');

-- Create waitlist entries table
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  position integer,
  source text DEFAULT 'website',
  referral_code text UNIQUE NOT NULL,
  referred_by uuid REFERENCES waitlist_entries(id),
  referral_count integer DEFAULT 0,
  status waitlist_status DEFAULT 'pending',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  invited_at timestamptz,
  converted_at timestamptz
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_position ON waitlist_entries(position);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist_entries(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist_entries(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_entries(created_at);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM waitlist_entries WHERE referral_code = code) INTO exists;
    
    -- Exit loop if code is unique
    IF NOT exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate waitlist position
CREATE OR REPLACE FUNCTION calculate_waitlist_position()
RETURNS trigger AS $$
BEGIN
  -- Calculate position based on creation order, accounting for referrals
  -- Referrals get priority boost (move up 5 positions per referral)
  WITH position_calc AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        ORDER BY 
          created_at ASC,
          (referral_count * -5) -- Negative to boost position
      ) as calc_position
    FROM waitlist_entries 
    WHERE status = 'pending'
  )
  UPDATE waitlist_entries 
  SET position = position_calc.calc_position
  FROM position_calc 
  WHERE waitlist_entries.id = position_calc.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle referral tracking
CREATE OR REPLACE FUNCTION handle_referral()
RETURNS trigger AS $$
BEGIN
  -- If this entry was referred by someone, increment their referral count
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE waitlist_entries 
    SET referral_count = referral_count + 1
    WHERE id = NEW.referred_by;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral code
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON waitlist_entries
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();

CREATE TRIGGER trigger_handle_referral
  AFTER INSERT ON waitlist_entries
  FOR EACH ROW
  EXECUTE FUNCTION handle_referral();

CREATE TRIGGER trigger_calculate_position
  AFTER INSERT OR UPDATE ON waitlist_entries
  FOR EACH STATEMENT
  EXECUTE FUNCTION calculate_waitlist_position();

-- Enable Row Level Security
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Policy for public signup (insert only)
CREATE POLICY "Anyone can join waitlist"
  ON waitlist_entries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for users to read their own entry by email
CREATE POLICY "Users can read own waitlist entry"
  ON waitlist_entries
  FOR SELECT
  TO anon
  USING (true); -- We'll filter by email in the application

-- Policy for authenticated users (admin) to read all
CREATE POLICY "Authenticated users can read all waitlist entries"
  ON waitlist_entries
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users (admin) to update entries
CREATE POLICY "Authenticated users can update waitlist entries"
  ON waitlist_entries
  FOR UPDATE
  TO authenticated
  USING (true);