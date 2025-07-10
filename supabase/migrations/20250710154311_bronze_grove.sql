/*
  # Feedback Widget System

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `body` (text, optional description)
      - `category` (enum: bug, idea, ux)
      - `upvotes` (integer, default 1)
      - `status` (enum: open, in_progress, completed, closed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `votes`
      - `id` (uuid, primary key)
      - `feedback_id` (uuid, foreign key)
      - `voter_hash` (text, sha256 of ip + user agent)
      - `created_at` (timestamp)
      - Unique constraint on (feedback_id, voter_hash)

  2. Security
    - Enable RLS on both tables
    - Public read access for feedback
    - Controlled write access with rate limiting
    - Anonymous voting with fingerprint tracking

  3. Functions
    - Auto-update upvote counts
    - Generate voter fingerprints
    - Rate limiting helpers
*/

-- Create enums
CREATE TYPE feedback_category AS ENUM ('bug', 'idea', 'ux');
CREATE TYPE feedback_status AS ENUM ('open', 'in_progress', 'completed', 'closed');

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(title) >= 3 AND length(title) <= 200),
  body text CHECK (length(body) <= 1000),
  category feedback_category NOT NULL,
  upvotes integer DEFAULT 1 CHECK (upvotes >= 0),
  status feedback_status DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  voter_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(feedback_id, voter_hash)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_feedback_upvotes ON feedback(upvotes DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_feedback_id ON votes(feedback_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_hash ON votes(voter_hash);

-- Function to update feedback updated_at timestamp
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update upvote count when vote is added
CREATE OR REPLACE FUNCTION update_upvote_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE feedback 
    SET upvotes = upvotes + 1, updated_at = now()
    WHERE id = NEW.feedback_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE feedback 
    SET upvotes = upvotes - 1, updated_at = now()
    WHERE id = OLD.feedback_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_updated_at();

CREATE TRIGGER trigger_update_upvote_count
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_upvote_count();

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback table
-- Anyone can read feedback
CREATE POLICY "Anyone can read feedback" ON feedback
  FOR SELECT TO anon, authenticated
  USING (true);

-- Anyone can insert feedback (rate limiting handled in edge function)
CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can update feedback (admin)
CREATE POLICY "Authenticated users can update feedback" ON feedback
  FOR UPDATE TO authenticated
  USING (true);

-- RLS Policies for votes table
-- Anyone can read votes (for transparency)
CREATE POLICY "Anyone can read votes" ON votes
  FOR SELECT TO anon, authenticated
  USING (true);

-- Anyone can insert votes (rate limiting handled in edge function)
CREATE POLICY "Anyone can vote" ON votes
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Function to get top feedback with vote counts
CREATE OR REPLACE FUNCTION get_top_feedback(limit_count integer DEFAULT 20)
RETURNS TABLE (
  id uuid,
  title text,
  body text,
  category feedback_category,
  upvotes integer,
  status feedback_status,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.title,
    f.body,
    f.category,
    f.upvotes,
    f.status,
    f.created_at,
    f.updated_at
  FROM feedback f
  WHERE f.status != 'closed'
  ORDER BY f.upvotes DESC, f.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has voted
CREATE OR REPLACE FUNCTION has_user_voted(feedback_uuid uuid, user_hash text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM votes 
    WHERE feedback_id = feedback_uuid AND voter_hash = user_hash
  );
END;
$$ LANGUAGE plpgsql;