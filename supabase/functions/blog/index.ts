import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

interface BlogPostData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  author?: string;
  tags?: string[];
  featured_image?: string;
  status?: 'draft' | 'published' | 'archived';
}

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

function validateBlogPost(data: any): BlogPostData | null {
  if (!data.title || typeof data.title !== 'string') return null;
  if (data.title.length < 3 || data.title.length > 200) return null;
  if (!data.content || typeof data.content !== 'string') return null;
  if (data.excerpt && (typeof data.excerpt !== 'string' || data.excerpt.length > 500)) return null;
  if (data.author && typeof data.author !== 'string') return null;
  if (data.tags && !Array.isArray(data.tags)) return null;
  if (data.status && !['draft', 'published', 'archived'].includes(data.status)) return null;
  
  return {
    title: data.title.trim(),
    slug: data.slug?.trim() || undefined,
    excerpt: data.excerpt?.trim() || undefined,
    content: data.content.trim(),
    author: data.author?.trim() || 'Dytto Team',
    tags: data.tags || [],
    featured_image: data.featured_image?.trim() || undefined,
    status: data.status || 'draft'
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200, 
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const authHeader = req.headers.get('authorization');
    
    // Extract path segments
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const blogId = pathSegments[1]; // /blog/:id

    // GET /blog - Get published blog posts
    if (req.method === 'GET' && url.pathname === '/blog') {
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
      const offset = Math.max(parseInt(url.searchParams.get('offset') || '0'), 0);
      const tag = url.searchParams.get('tag');
      const search = url.searchParams.get('search');
      const status = url.searchParams.get('status'); // For admin access

      let query = supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, author, tags, featured_image, published_at, created_at');

      // Filter by status (default to published for public access)
      if (authHeader && status) {
        query = query.eq('status', status);
      } else {
        query = query.eq('status', 'published');
      }

      // Filter by tag if provided
      if (tag) {
        query = query.contains('tags', [tag]);
      }

      // Search functionality
      if (search) {
        const { data: searchResults, error: searchError } = await supabase
          .rpc('search_blog_posts', { search_query: search, limit_count: limit });

        if (searchError) {
          console.error('Search error:', searchError);
          return new Response(
            JSON.stringify({ error: 'Search failed' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ data: searchResults, total: searchResults.length }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Regular query with pagination
      query = query
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching blog posts:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch blog posts' }),
          { 
            status: 500, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      return new Response(
        JSON.stringify({ data, total: count }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // GET /blog/:id - Get specific blog post
    if (req.method === 'GET' && blogId) {
      let query = supabase
        .from('blog_posts')
        .select('*');

      // Use slug or id for lookup
      if (blogId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        query = query.eq('id', blogId);
      } else {
        query = query.eq('slug', blogId);
      }

      // Only show published posts for public access
      if (!authHeader) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query.single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'Blog post not found' }),
          { 
            status: 404, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      return new Response(
        JSON.stringify({ data }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // POST /blog - Create new blog post (requires authentication)
    if (req.method === 'POST' && url.pathname === '/blog') {
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { 
            status: 401, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // Rate limiting
      if (!checkRateLimit(`create_${clientIP}`, 5, 300000)) { // 5 posts per 5 minutes
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait before creating another post.' }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      const body = await req.json();
      const validatedData = validateBlogPost(body);
      
      if (!validatedData) {
        return new Response(
          JSON.stringify({ error: 'Invalid blog post data' }),
          { 
            status: 400, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert(validatedData)
        .select()
        .single();

      if (error) {
        console.error('Error creating blog post:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create blog post' }),
          { 
            status: 500, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      return new Response(
        JSON.stringify({ data, message: 'Blog post created successfully' }),
        { 
          status: 201, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // PUT /blog/:id - Update blog post (requires authentication)
    if (req.method === 'PUT' && blogId) {
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { 
            status: 401, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      const body = await req.json();
      const validatedData = validateBlogPost(body);
      
      if (!validatedData) {
        return new Response(
          JSON.stringify({ error: 'Invalid blog post data' }),
          { 
            status: 400, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(validatedData)
        .eq('id', blogId)
        .select()
        .single();

      if (error) {
        console.error('Error updating blog post:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to update blog post' }),
          { 
            status: 500, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      if (!data) {
        return new Response(
          JSON.stringify({ error: 'Blog post not found' }),
          { 
            status: 404, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      return new Response(
        JSON.stringify({ data, message: 'Blog post updated successfully' }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // DELETE /blog/:id - Delete blog post (requires authentication)
    if (req.method === 'DELETE' && blogId) {
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { 
            status: 401, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', blogId);

      if (error) {
        console.error('Error deleting blog post:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to delete blog post' }),
          { 
            status: 500, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Blog post deleted successfully' }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { 
        status: 404, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});