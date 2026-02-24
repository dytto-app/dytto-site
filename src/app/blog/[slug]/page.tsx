import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

// ISR: revalidate every hour
export const revalidate = 3600;

// Allow new posts (not in generateStaticParams) to be rendered on-demand and cached
export const dynamicParams = true;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: string;
  tags: string[];
  featured_image?: string;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

// Generate static paths for all published posts at build time
export async function generateStaticParams() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error || !data) return [];
    return data.map((post: { slug: string }) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

// Per-post metadata with OG + Twitter cards
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This blog post could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://dytto.app/blog/${post.slug}`,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      tags: post.tags,
      images: post.featured_image
        ? [{ url: post.featured_image, alt: post.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(post.featured_image ? { images: [post.featured_image] } : {}),
    },
    alternates: {
      canonical: `https://dytto.app/blog/${post.slug}`,
    },
  };
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Date unavailable';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // JSON-LD Article structured data for rich search results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dytto',
      url: 'https://dytto.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dytto.app/adaptive-icon.png',
      },
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://dytto.app/blog/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
    url: `https://dytto.app/blog/${post.slug}`,
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white dark:bg-slate-900">
        <article className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 mb-8 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Featured image */}
            {post.featured_image && (
              <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-5">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.published_at}>
                    {formatDate(post.published_at || post.created_at)}
                  </time>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article content */}
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-10 text-slate-700 dark:text-slate-300">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Footer navigation */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                All posts
              </Link>

              <div className="text-sm text-slate-500 dark:text-slate-400">
                Published on{' '}
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
