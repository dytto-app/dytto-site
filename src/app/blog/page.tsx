import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { Calendar, User, Tag } from 'lucide-react';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Developer Blog',
  description:
    'Updates, tutorials, and insights from the Dytto team. Learn how to build context-aware AI applications.',
  openGraph: {
    title: 'Dytto Developer Blog',
    description: 'Updates, tutorials, and insights from the Dytto team.',
    url: 'https://dytto.app/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://dytto.app/blog',
  },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author: string;
  tags: string[];
  featured_image?: string;
  published_at: string;
  created_at: string;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Date unavailable';
  const date = new Date(dateString);
  if (isNaN(date.getTime()) || date.getTime() === 0) return 'Date unavailable';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, author, tags, featured_image, published_at, created_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch blog posts:', err);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Developer{' '}
            <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Updates, tutorials, and insights from the Dytto team
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                No posts yet — check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <User className="w-3.5 h-3.5" />
                        <span>{post.author}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-slate-900 dark:text-white font-semibold text-lg leading-tight mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      <Link href={`/blog/${post.slug}`} className="block">
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-medium px-2.5 py-1 rounded-full"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-slate-400 text-xs self-center">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Read more */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:text-teal-500 transition-colors inline-flex items-center gap-1"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
