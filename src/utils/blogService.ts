// Blog service for direct Supabase database access

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

export interface CreateBlogPostData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  author?: string;
  tags?: string[];
  featured_image?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface BlogResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}

// Initialize Supabase client
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

class BlogService {
  // Get all blog posts
  async getPosts(options: {
    limit?: number;
    offset?: number;
    search?: string;
    tag?: string;
    status?: string;
  } = {}): Promise<BlogResponse<BlogPost[]>> {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase not configured',
      };
    }

    try {
      let query = supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, author, tags, featured_image, published_at, created_at, updated_at');

      // Filter by status (default to published for public access)
      const status = options.status || 'published';
      query = query.eq('status', status);

      // Filter by tag if provided
      if (options.tag) {
        query = query.contains('tags', [options.tag]);
      }

      // Search functionality
      if (options.search) {
        const searchTerm = `%${options.search}%`;
        query = query.or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`);
      }

      // Apply pagination
      const limit = Math.min(options.limit || 20, 100);
      const offset = Math.max(options.offset || 0, 0);
      
      query = query
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching blog posts:', error);
        return {
          success: false,
          error: 'Failed to fetch blog posts',
        };
      }

      return {
        success: true,
        data: data || [],
        total: count || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
      };
    }
  }

  // Get single blog post by ID or slug
  async getPost(idOrSlug: string): Promise<BlogResponse<BlogPost>> {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase not configured',
      };
    }

    try {
      let query = supabase
        .from('blog_posts')
        .select('*');

      // Use slug or id for lookup
      if (idOrSlug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      // Only show published posts for public access
      query = query.eq('status', 'published');

      const { data, error } = await query.single();

      if (error || !data) {
        return {
          success: false,
          error: 'Blog post not found',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch post',
      };
    }
  }

  // Create new blog post (requires service role key)
  async createPost(postData: CreateBlogPostData, serviceRoleKey?: string): Promise<BlogResponse<BlogPost>> {
    if (!SUPABASE_URL) {
      return {
        success: false,
        error: 'Supabase not configured',
      };
    }

    if (!serviceRoleKey) {
      return {
        success: false,
        error: 'Service role key required for creating posts',
      };
    }

    try {
      const adminClient = createClient(SUPABASE_URL, serviceRoleKey);

      const { data, error } = await adminClient
        .from('blog_posts')
        .insert({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          author: postData.author || 'Dytto Team',
          tags: postData.tags || [],
          featured_image: postData.featured_image,
          status: postData.status || 'draft'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating blog post:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create post',
      };
    }
  }

  // Update blog post (requires service role key)
  async updatePost(id: string, postData: Partial<CreateBlogPostData>, serviceRoleKey?: string): Promise<BlogResponse<BlogPost>> {
    if (!SUPABASE_URL) {
      return {
        success: false,
        error: 'Supabase not configured',
      };
    }

    if (!serviceRoleKey) {
      return {
        success: false,
        error: 'Service role key required for updating posts',
      };
    }

    try {
      const adminClient = createClient(SUPABASE_URL, serviceRoleKey);

      const { data, error } = await adminClient
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating blog post:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'Blog post not found',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update post',
      };
    }
  }

  // Delete blog post (requires service role key)
  async deletePost(id: string, serviceRoleKey?: string): Promise<BlogResponse<void>> {
    if (!SUPABASE_URL) {
      return {
        success: false,
        error: 'Supabase not configured',
      };
    }

    if (!serviceRoleKey) {
      return {
        success: false,
        error: 'Service role key required for deleting posts',
      };
    }

    try {
      const adminClient = createClient(SUPABASE_URL, serviceRoleKey);

      const { error } = await adminClient
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting blog post:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete post',
      };
    }
  }

  // Search blog posts
  async searchPosts(query: string, limit = 10): Promise<BlogResponse<BlogPost[]>> {
    return this.getPosts({ search: query, limit });
  }

  // Get posts by tag
  async getPostsByTag(tag: string, limit = 10): Promise<BlogResponse<BlogPost[]>> {
    return this.getPosts({ tag, limit });
  }
}

// Export singleton instance for public access
export const blogService = new BlogService();

// Export authenticated service factory for admin operations
export const createAuthenticatedBlogService = (serviceRoleKey: string) => {
  const service = new BlogService();
  // Store service role key for admin operations
  (service as any).serviceRoleKey = serviceRoleKey;
  return service;
};

// Utility functions
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
};