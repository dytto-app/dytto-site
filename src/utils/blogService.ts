'use client';
// Blog service for direct Supabase database access (client-side)
// For server-side SSG, use createServerClient from @/lib/supabase/server directly

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: string;
  tags: string[];
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

class BlogService {
  async getPosts(
    options: { limit?: number; offset?: number; search?: string; tag?: string; status?: string } = {}
  ): Promise<BlogResponse<BlogPost[]>> {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
      let query = supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, author, tags, featured_image, published_at, created_at, updated_at')
        .eq('status', options.status || 'published');

      if (options.tag) query = query.contains('tags', [options.tag]);
      if (options.search) {
        const s = `%${options.search}%`;
        query = query.or(`title.ilike.${s},excerpt.ilike.${s}`);
      }

      const limit = Math.min(options.limit || 20, 100);
      const offset = Math.max(options.offset || 0, 0);
      query = query.order('published_at', { ascending: false }).range(offset, offset + limit - 1);

      const { data, error, count } = await query;
      if (error) return { success: false, error: 'Failed to fetch posts' };
      return { success: true, data: data || [], total: count || 0 };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Failed' };
    }
  }

  async getPost(idOrSlug: string): Promise<BlogResponse<BlogPost>> {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq(isUuid ? 'id' : 'slug', idOrSlug)
        .eq('status', 'published')
        .single();

      if (error || !data) return { success: false, error: 'Post not found' };
      return { success: true, data };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Failed' };
    }
  }

  async searchPosts(query: string, limit = 10) {
    return this.getPosts({ search: query, limit });
  }

  async getPostsByTag(tag: string, limit = 10) {
    return this.getPosts({ tag, limit });
  }
}

export const blogService = new BlogService();

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

export const generateSlug = (title: string) =>
  title.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');

export const truncateText = (text: string, maxLength: number) =>
  text.length <= maxLength ? text : text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
