// Blog service for API interactions

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

class BlogService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(apiKey?: string) {
    if (!SUPABASE_URL) {
      throw new Error('Supabase URL not configured');
    }

    this.baseUrl = `${SUPABASE_URL}/functions/v1/blog`;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey || SUPABASE_ANON_KEY}`,
    };
  }

  // Get all blog posts
  async getPosts(options: {
    limit?: number;
    offset?: number;
    search?: string;
    tag?: string;
    status?: string;
  } = {}): Promise<BlogResponse<BlogPost[]>> {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());
      if (options.search) params.append('search', options.search);
      if (options.tag) params.append('tag', options.tag);
      if (options.status) params.append('status', options.status);

      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        total: result.total,
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
    try {
      const response = await fetch(`${this.baseUrl}/${idOrSlug}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog post not found');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch post',
      };
    }
  }

  // Create new blog post (requires authentication)
  async createPost(postData: CreateBlogPostData): Promise<BlogResponse<BlogPost>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create post',
      };
    }
  }

  // Update blog post (requires authentication)
  async updatePost(id: string, postData: Partial<CreateBlogPostData>): Promise<BlogResponse<BlogPost>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update post',
      };
    }
  }

  // Delete blog post (requires authentication)
  async deletePost(id: string): Promise<BlogResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
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
export const createAuthenticatedBlogService = (apiKey: string) => {
  return new BlogService(apiKey);
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