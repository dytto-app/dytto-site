import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Tag, 
  User, 
  Search, 
  Filter,
  ArrowLeft,
  ExternalLink,
  Loader,
  AlertCircle
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackWidget from '../components/FeedbackWidget';
import { blogService } from '../utils/blogService';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: string;
  tags: string[];
  featured_image?: string;
  published_at: string;
  created_at: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const BlogPage: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch blog posts
  const fetchPosts = async (search?: string, tag?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await blogService.getPosts({
        limit: 20,
        search,
        tag
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch blog posts');
      }

      setPosts(result.data || []);

      // Extract all unique tags
      const tags = new Set<string>();
      result.data?.forEach((post) => {
        post.tags.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific post by slug
  const fetchPost = async (postSlug: string) => {
    try {
      const result = await blogService.getPost(postSlug);
      
      if (!result.success) {
        setError(result.error || 'Blog post not found');
        return;
      }

      setSelectedPost(result.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog post');
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    } else {
      fetchPosts();
    }
  }, [slug]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchPosts(query, selectedTag);
  };

  // Handle tag filter
  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    fetchPosts(searchQuery, tag);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Render markdown content (basic implementation)
  const renderMarkdown = (content: string) => {
    // Basic markdown parsing - in production, use a proper markdown library
    let html = content
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 2rem; font-weight: bold; margin: 2rem 0 1rem 0; color: ' + theme.colors.text + ';">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.5rem; font-weight: bold; margin: 1.5rem 0 1rem 0; color: ' + theme.colors.text + ';">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.25rem 0 0.75rem 0; color: ' + theme.colors.text + ';">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong style="font-weight: bold; color: ' + theme.colors.text + ';">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em style="font-style: italic;">$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre style="background: ' + theme.colors.surface + '; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; border: 1px solid ' + theme.colors.border + ';"><code style="font-family: monospace; color: ' + theme.colors.text + ';">$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code style="background: ' + theme.colors.surface + '; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace; color: ' + theme.colors.text + ';">$1</code>')
      .replace(/^\- (.*$)/gim, '<li style="margin: 0.5rem 0; color: ' + theme.colors.textSecondary + ';">$1</li>')
      .replace(/\n\n/gim, '</p><p style="margin: 1rem 0; line-height: 1.6; color: ' + theme.colors.textSecondary + ';">')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" style="color: ' + theme.colors.primary + '; text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>');

    return '<p style="margin: 1rem 0; line-height: 1.6; color: ' + theme.colors.textSecondary + ';">' + html + '</p>';
  };

  // Single post view
  if (slug && selectedPost) {
    return (
      <div style={styles.bg.primary} className="min-h-screen">
        <Navbar />
        
        <article className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/blog')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
                color: theme.colors.textSecondary,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                marginBottom: theme.semanticSpacing.lg,
                padding: theme.semanticSpacing.sm,
                borderRadius: '0.5rem',
                transition: theme.animations.transition.normal,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.textSecondary;
              }}
            >
              <ArrowLeft size={20} />
              Back to Blog
            </motion.button>

            {/* Post header */}
            <motion.header
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              {selectedPost.featured_image && (
                <img 
                  src={selectedPost.featured_image}
                  alt={selectedPost.title}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '1rem',
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                />
              )}

              <h1 
                style={{
                  ...styles.typography.h1,
                  color: theme.colors.text,
                  fontSize: 'clamp(1.75rem, 6vw, 3rem)',
                  marginBottom: theme.semanticSpacing.md,
                }}
              >
                {selectedPost.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <User style={{ color: theme.colors.textSecondary }} size={16} />
                  <span style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm }}>
                    {selectedPost.author}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar style={{ color: theme.colors.textSecondary }} size={16} />
                  <span style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm }}>
                    {formatDate(selectedPost.published_at)}
                  </span>
                </div>
              </div>

              {selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                        color: theme.colors.primary,
                        padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                        borderRadius: '9999px',
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.header>

            {/* Post content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1rem',
                padding: theme.semanticSpacing.xl,
              }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedPost.content) }}
            />
          </div>
        </article>

        <Footer />
        <FeedbackWidget />
      </div>
    );
  }

  // Blog list view
  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 
              style={{
                color: theme.colors.text,
                fontSize: 'clamp(1.75rem, 6vw, 3.5rem)',
                fontWeight: theme.typography.fontWeight.bold,
                lineHeight: '1.2',
                marginBottom: theme.semanticSpacing.sm,
              }}
            >
              Developer{' '}
              <motion.span 
                key={`blog-gradient-${theme.mode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: theme.typography.fontWeight.semibold,
                  display: 'inline-block',
                }}
              >
                Blog
              </motion.span>
            </h1>
            <p 
              style={{
                color: theme.colors.textSecondary,
                fontSize: 'clamp(0.875rem, 3vw, 1.125rem)',
                lineHeight: '1.6',
                maxWidth: '42rem',
                margin: '0 auto',
              }}
            >
              Updates, tutorials, and insights from the Dytto team
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search 
                  style={{ 
                    position: 'absolute', 
                    left: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: theme.colors.textSecondary 
                  }} 
                  size={20} 
                />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.base,
                    outline: 'none',
                    transition: theme.animations.transition.normal,
                  }}
                />
              </div>

              {/* Tag filter */}
              <select
                value={selectedTag}
                onChange={(e) => handleTagFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.base,
                  outline: 'none',
                  minWidth: '150px',
                }}
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            
            {/* Configuration notice */}
            {!SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                  padding: theme.semanticSpacing.md,
                  backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                  border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                  borderRadius: '0.75rem',
                  color: theme.colors.primary,
                  marginBottom: theme.semanticSpacing.lg,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                <AlertCircle size={16} />
                <span>
                  Demo mode: Connect Supabase to enable full blog functionality and API updates.
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
                padding: theme.semanticSpacing.lg,
                backgroundColor: theme.utils.alpha(theme.colors.error, 0.1),
                border: `1px solid ${theme.colors.error}`,
                borderRadius: '0.75rem',
                color: theme.colors.error,
                marginBottom: theme.semanticSpacing.lg,
              }}
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Loader size={32} className="animate-spin" style={{ color: theme.colors.primary, margin: '0 auto' }} />
              <p style={{ 
                color: theme.colors.textSecondary, 
                marginTop: theme.semanticSpacing.md,
                fontSize: theme.typography.fontSize.base,
              }}>
                Loading blog posts...
              </p>
            </div>
          )}

          {/* Blog posts grid */}
          {!loading && posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '3rem',
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.25rem',
              }}
            >
              <h3 style={{ 
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text, 
                marginBottom: theme.semanticSpacing.sm 
              }}>
                No blog posts found
              </h3>
              <p style={{ 
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.base,
              }}>
                {searchQuery || selectedTag ? 'Try adjusting your search or filter.' : 'Check back soon for new content!'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  style={{
                    ...styles.glass.light,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '1.25rem',
                    overflow: 'hidden',
                    transition: theme.animations.transition.normal,
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {post.featured_image && (
                    <img 
                      src={post.featured_image}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                  )}

                  <div style={{ padding: theme.semanticSpacing.lg }}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar style={{ color: theme.colors.textSecondary }} size={14} />
                        <span style={{ 
                          color: theme.colors.textSecondary, 
                          fontSize: theme.typography.fontSize.xs 
                        }}>
                          {formatDate(post.published_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User style={{ color: theme.colors.textSecondary }} size={14} />
                        <span style={{ 
                          color: theme.colors.textSecondary, 
                          fontSize: theme.typography.fontSize.xs 
                        }}>
                          {post.author}
                        </span>
                      </div>
                    </div>

                    <h2 
                      style={{
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.semibold,
                        lineHeight: '1.3',
                        marginBottom: theme.semanticSpacing.sm,
                      }}
                    >
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p 
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.fontSize.sm,
                          lineHeight: '1.5',
                          marginBottom: theme.semanticSpacing.md,
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            style={{
                              backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                              color: theme.colors.primary,
                              padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                              borderRadius: '9999px',
                              fontSize: theme.typography.fontSize.xs,
                              fontWeight: theme.typography.fontWeight.medium,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span style={{ 
                            color: theme.colors.textSecondary, 
                            fontSize: theme.typography.fontSize.xs 
                          }}>
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <FeedbackWidget />
    </div>
  );
};

export default BlogPage;