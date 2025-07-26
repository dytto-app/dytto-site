# Dytto Site

This repository contains the frontend application for Dytto.

## Blog Service

The blog functionality of this application is powered by Supabase, a backend-as-a-service platform. The `src/utils/blogService.ts` file handles all interactions with the Supabase database for managing blog posts.

### Configuration

To enable the blog service, you need to configure the following environment variables:

-   `VITE_SUPABASE_URL`: Your Supabase project URL.
-   `VITE_SUPABASE_ANON_KEY`: Your Supabase project's public `anon` key.

These variables should be set in a `.env` file in the project root (e.g., `.env.local`) or directly in your deployment environment.

### Features

The `blogService` provides the following capabilities:

-   **Fetching Posts:**
    -   `getPosts()`: Retrieves a list of published blog posts. Supports filtering by search query, tags, and pagination.
    -   `getPost(idOrSlug)`: Fetches a single blog post by its ID or slug.
-   **Administrative Operations (Requires Service Role Key):**
    -   `createPost(postData, serviceRoleKey)`: Creates a new blog post.
    -   `updatePost(id, postData, serviceRoleKey)`: Updates an existing blog post.
    -   `deletePost(id, serviceRoleKey)`: Deletes a blog post.

    For these operations, you must provide your Supabase project's `service_role` key. **Never expose your `service_role` key in client-side code.** These operations are intended for secure backend environments or administrative tools.

### Database Schema

The blog service expects a `blog_posts` table in your Supabase database with the following (or similar) schema:

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Dytto Team',
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published posts
CREATE POLICY "Public posts are viewable by everyone."
ON blog_posts FOR SELECT
USING (status = 'published');

-- Policy for admin write access (example - adjust as needed for your auth)
-- This policy assumes you have a way to identify admin users, e.g., via RLS policies
-- that check user roles or specific user IDs.
-- For simplicity, this example shows a policy that allows inserts/updates/deletes
-- if the request is made with the service_role key (which bypasses RLS).
-- In a real application, you'd likely have more granular RLS for authenticated users.
CREATE POLICY "Admins can manage blog posts."
ON blog_posts FOR ALL
TO authenticated -- Or a specific role like 'admin'
USING (true) WITH CHECK (true);
```

**Note:** The `createAuthenticatedBlogService` function in `src/utils/blogService.ts` is provided for backend/admin usage where the `service_role` key can be securely used.
