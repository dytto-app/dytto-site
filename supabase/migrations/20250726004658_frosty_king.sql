/*
  # Dev Blog System

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique, for SEO-friendly URLs)
      - `excerpt` (text, short description)
      - `content` (text, full markdown content)
      - `author` (text, author name)
      - `tags` (text array, for categorization)
      - `featured_image` (text, optional image URL)
      - `status` (enum: draft, published, archived)
      - `published_at` (timestamp, when published)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on blog_posts table
    - Public read access for published posts
    - Authenticated write access for admins

  3. Functions
    - Auto-generate slugs from titles
    - Update timestamps
    - Search functionality
*/

-- Create enum for blog post status
CREATE TYPE blog_post_status AS ENUM ('draft', 'published', 'archived');

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(title) >= 3 AND length(title) <= 200),
  slug text UNIQUE NOT NULL,
  excerpt text CHECK (length(excerpt) <= 500),
  content text NOT NULL,
  author text NOT NULL DEFAULT 'Dytto Team',
  tags text[] DEFAULT '{}',
  featured_image text,
  status blog_post_status DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title_text text)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Convert title to slug format
  base_slug := lower(trim(regexp_replace(title_text, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'untitled';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append counter if needed
  WHILE EXISTS(SELECT 1 FROM blog_posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate slug if not provided
CREATE OR REPLACE FUNCTION set_blog_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Set published_at when status changes to published
  IF NEW.status = 'published' AND (OLD.status != 'published' OR OLD.published_at IS NULL) THEN
    NEW.published_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_set_blog_slug
  BEFORE INSERT ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_blog_slug();

CREATE TRIGGER trigger_update_blog_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read published blog posts
CREATE POLICY "Anyone can read published blog posts" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Authenticated users can read all blog posts (for admin)
CREATE POLICY "Authenticated users can read all blog posts" ON blog_posts
  FOR SELECT TO authenticated
  USING (true);

-- Authenticated users can create blog posts
CREATE POLICY "Authenticated users can create blog posts" ON blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Authenticated users can update blog posts
CREATE POLICY "Authenticated users can update blog posts" ON blog_posts
  FOR UPDATE TO authenticated
  USING (true);

-- Authenticated users can delete blog posts
CREATE POLICY "Authenticated users can delete blog posts" ON blog_posts
  FOR DELETE TO authenticated
  USING (true);

-- Function to search blog posts
CREATE OR REPLACE FUNCTION search_blog_posts(search_query text, limit_count integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  excerpt text,
  author text,
  tags text[],
  featured_image text,
  published_at timestamptz,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.author,
    bp.tags,
    bp.featured_image,
    bp.published_at,
    ts_rank(
      to_tsvector('english', bp.title || ' ' || COALESCE(bp.excerpt, '') || ' ' || array_to_string(bp.tags, ' ')),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM blog_posts bp
  WHERE 
    bp.status = 'published' AND
    (
      to_tsvector('english', bp.title || ' ' || COALESCE(bp.excerpt, '') || ' ' || array_to_string(bp.tags, ' ')) 
      @@ plainto_tsquery('english', search_query)
    )
  ORDER BY rank DESC, bp.published_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample blog posts
INSERT INTO blog_posts (title, excerpt, content, author, tags, status, published_at) VALUES
(
  'Welcome to the Dytto Developer Blog',
  'Introducing our new developer blog where we share updates, tutorials, and insights about building with Dytto.',
  '# Welcome to the Dytto Developer Blog

We''re excited to launch our developer blog! This is where we''ll share:

- **Product Updates**: Latest features and improvements
- **Technical Deep Dives**: How we build and scale Dytto
- **Developer Tutorials**: Guides for using our APIs
- **Community Highlights**: Showcasing what you''re building

## What''s Coming Next

Stay tuned for upcoming posts about:
- Building context-aware applications
- Best practices for persona interactions
- Performance optimization tips
- New API features and capabilities

We''re just getting started, and we can''t wait to share more with you!',
  'Dytto Team',
  ARRAY['announcement', 'welcome', 'developer-blog'],
  'published',
  now() - interval '1 day'
),
(
  'Building Your First Context-Aware Application',
  'A step-by-step guide to creating intelligent applications that understand user context using Dytto''s APIs.',
  '# Building Your First Context-Aware Application

Context-aware applications are the future of user experience. In this tutorial, we''ll walk through building a simple app that adapts to user preferences and behavior.

## Prerequisites

- Basic knowledge of JavaScript/TypeScript
- A Dytto API key (get one [here](/api))
- Node.js installed on your machine

## Step 1: Setting Up Your Project

```bash
npm init -y
npm install @dytto/sdk
```

## Step 2: Initialize the Dytto Client

```javascript
import { DyttoClient } from ''@dytto/sdk'';

const client = new DyttoClient({
  apiKey: process.env.DYTTO_API_KEY
});
```

## Step 3: Generate Simulation Agents

```javascript
const agents = await client.simulation.generateAgents({
  count: 10,
  criteria: {
    age_group: [''25-34''],
    interests: [''technology'', ''fitness'']
  }
});
```

## Next Steps

In our next post, we''ll dive deeper into persona interactions and advanced context queries.

Happy building! 🚀',
  'Alex Chen',
  ARRAY['tutorial', 'getting-started', 'api', 'context-aware'],
  'published',
  now() - interval '2 hours'
);