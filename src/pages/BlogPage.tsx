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

  // Mock data for when Supabase is not configured
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Welcome to the Dytto Developer Blog',
      slug: 'welcome-to-dytto-blog',
      excerpt: 'Introducing our new developer blog where we share updates, tutorials, and insights about building with Dytto.',
      content: '# Welcome to the Dytto Developer Blog\n\nWe\'re excited to launch our developer blog! This is where we\'ll share:\n\n- **Product Updates**: Latest features and improvements\n- **Technical Deep Dives**: How we build and scale Dytto\n- **Developer Tutorials**: Guides for using our APIs\n- **Community Highlights**: Showcasing what you\'re building\n\n## What\'s Coming Next\n\nStay tuned for upcoming posts about:\n- Building context-aware applications\n- Best practices for persona interactions\n- Performance optimization tips\n- New API features and capabilities\n\nWe\'re just getting started, and we can\'t wait to share more with you!',
      author: 'Dytto Team',
      tags: ['announcement', 'welcome', 'developer-blog'],
      published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Building Your First Context-Aware Application',
      slug: 'building-context-aware-app',
      excerpt: 'A step-by-step guide to creating intelligent applications that understand user context using Dytto\'s APIs.',
      content: '# Building Your First Context-Aware Application\n\nContext-aware applications are the future of user experience. In this tutorial, we\'ll walk through building a simple app that adapts to user preferences and behavior.\n\n## Prerequisites\n\n- Basic knowledge of JavaScript/TypeScript\n- A Dytto API key (get one [here](/api))\n- Node.js installed on your machine\n\n## Step 1: Setting Up Your Project\n\n```bash\nnpm init -y\nnpm install @dytto/sdk\n```\n\n## Step 2: Initialize the Dytto Client\n\n```javascript\nimport { DyttoClient } from \'@dytto/sdk\';\n\nconst client = new DyttoClient({\n  apiKey: process.env.DYTTO_API_KEY\n});\n```\n\n## Step 3: Generate Simulation Agents\n\n```javascript\nconst agents = await client.simulation.generateAgents({\n  count: 10,\n  criteria: {\n    age_group: [\'25-34\'],\n    interests: [\'technology\', \'fitness\']\n  }\n});\n```\n\n## Next Steps\n\nIn our next post, we\'ll dive deeper into persona interactions and advanced context queries.\n\nHappy building! 🚀',
      author: 'Alex Chen',
      tags: ['tutorial', 'getting-started', 'api', 'context-aware'],
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Fetch blog posts
  const fetchPosts = async (search?: string, tag?: string) => {
    if (!SUPABASE_URL) {
      // Use mock data when Supabase is not configured
      let filteredPosts = mockPosts;
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (tag) {
        filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
      }

      setPosts(filteredPosts);
      
      // Extract all unique tags
      const tags = new Set<string>();
      mockPosts.forEach((post) => {
        post.tags.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
      
      setLoading(false);
      return;
    }

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
    if (!SUPABASE_URL) {
      const post = mockPosts.find(p => p.slug === postSlug);
      if (post) {
        setSelectedPost(post);
      } else {
        setError('Blog post not found');
      }
      return;
    }

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
            >
              <ArrowLeft size={20} />
              Back to Blog
            </motion.button>

            <motion.header
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 
                style={{
                  color: theme.colors.text,
                  fontSize: 'clamp(1.75rem, 6vw, 3rem)',
                  fontWeight: theme.typography.fontWeight.bold,
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
            </motion.header>

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
              <span 
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
              </span>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
            
            {!SUPABASE_URL && (
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

          {loading ? (
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
          ) : posts.length === 0 ? (
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