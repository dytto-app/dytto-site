/*
  # Journal System for Philosophy Dashboard

  1. New Tables
    - `profiles` (extends auth.users)
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar` (text, URL to avatar image)
      - `is_demo` (boolean, flag for demo accounts)
      - `demo_persona` (text, description of demo persona)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `title` (text, required)
      - `content` (text, full journal content)
      - `mood` (text, optional mood descriptor)
      - `tags` (text array, for categorization)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public read access for demo accounts only
    - Authenticated write access for users

  3. Sample Data
    - Create demo philosopher accounts
    - Add sample journal entries
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar text,
  is_demo boolean DEFAULT false,
  demo_persona text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (length(title) >= 3 AND length(title) <= 200),
  content text NOT NULL,
  mood text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_demo ON profiles(is_demo);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_tags ON journal_entries USING GIN(tags);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_journal_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

CREATE TRIGGER trigger_update_journal_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_journal_updated_at();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Anyone can read demo profiles
CREATE POLICY "Anyone can read demo profiles" ON profiles
  FOR SELECT TO anon, authenticated
  USING (is_demo = true);

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for journal_entries
-- Anyone can read journal entries from demo accounts
CREATE POLICY "Anyone can read demo journal entries" ON journal_entries
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = journal_entries.user_id 
      AND profiles.is_demo = true
    )
  );

-- Users can read their own journal entries
CREATE POLICY "Users can read own journal entries" ON journal_entries
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can create their own journal entries
CREATE POLICY "Users can create own journal entries" ON journal_entries
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own journal entries
CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Users can delete their own journal entries
CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Insert demo philosopher profiles
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'buddha@demo.dytto.app', now(), now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'jesus@demo.dytto.app', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, avatar, is_demo, demo_persona) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'buddha@demo.dytto.app',
    'Siddhartha (Demo)',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    true,
    'Modern seeker exploring Buddhist wisdom'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'jesus@demo.dytto.app',
    'Joshua (Demo)',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    true,
    'Social worker living Christian values'
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar = EXCLUDED.avatar,
  is_demo = EXCLUDED.is_demo,
  demo_persona = EXCLUDED.demo_persona;

-- Insert sample journal entries
INSERT INTO journal_entries (id, user_id, title, content, mood, tags, created_at) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Morning Meditation and Job Search',
    'Woke up at 5:30 AM for meditation. The mind was particularly restless today - thoughts about rent, about the interview rejection last week, about whether I''m fooling myself thinking I can find peace while unemployed.

During sitting, I noticed how the anxiety manifests physically. Tight chest, shallow breathing. Instead of pushing it away, I tried to observe it with curiosity. "Ah, dukkha. Here you are again, old friend."

The Buddha taught that suffering comes from attachment to outcomes. Easy to understand intellectually. Much harder when your bank account is dwindling and society measures your worth by your productivity.

Applied to three more positions today. Each application feels like casting a message in a bottle into an ocean of algorithms. But I''m trying to hold it lightly - do the work, release the results.

Evening reflection: Maybe the real practice isn''t finding a job. Maybe it''s learning to be okay with uncertainty.',
    'contemplative',
    ARRAY['meditation', 'job-search', 'anxiety', 'non-attachment'],
    '2024-01-15T08:30:00Z'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Compassion Practice at the Food Bank',
    'Volunteered at the food bank today. Initially went because I have time and wanted to feel useful. Left with a deeper understanding of interconnectedness.

Met Maria, a single mother working two jobs who still needs food assistance. Her dignity, her gratitude, her strength - it shattered my assumptions about poverty and worthiness.

I realized I''ve been practicing a subtle form of spiritual materialism. "Look at me, the unemployed guy who volunteers." But true compassion isn''t about feeling good about yourself. It''s about recognizing that there''s no real separation between giver and receiver.

The Buddha spoke of metta - loving-kindness. Today I felt it not as a practice I do, but as recognition of what already is. We''re all just trying to get by, all deserving of care.

Came home and sat for 30 minutes. The meditation felt different - less about fixing myself, more about opening to what''s here.',
    'grateful',
    ARRAY['compassion', 'service', 'metta', 'interconnectedness'],
    '2024-01-16T19:45:00Z'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Burnout and Boundaries',
    'Another 12-hour day at the shelter. Mrs. Rodriguez came in again - third time this week. Her son is using again, and she''s caught between enabling and abandoning him.

I wanted to take her pain away, to fix everything. But I''m learning that love sometimes means sitting with someone in their suffering rather than trying to rescue them from it.

Jesus withdrew to pray. I used to think that was selfish - how could he step away when people needed him? Now I understand. You can''t pour from an empty cup. Even infinite love needs to flow through finite vessels.

Prayed the rosary on the bus home. "Hail Mary, full of grace..." The repetition quieted my racing thoughts about all the people I couldn''t help today.

Tomorrow I''ll show up again. Not because I can save everyone, but because love calls us to be present, even when - especially when - we feel inadequate.',
    'weary but hopeful',
    ARRAY['service', 'boundaries', 'prayer', 'love'],
    '2024-01-15T22:30:00Z'
  )
ON CONFLICT (id) DO NOTHING;