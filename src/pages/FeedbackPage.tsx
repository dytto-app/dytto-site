import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  X, 
  ChevronUp, 
  Bug, 
  Lightbulb, 
  Palette,
  Send,
  Loader,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Filter,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockFeedbackService } from '../utils/mockFeedbackService';

interface FeedbackItem {
  id: string;
  title: string;
  body?: string;
  category: 'bug' | 'idea' | 'ux';
  upvotes: number;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  created_at: string;
  user_has_voted: boolean;
}

interface FeedbackSubmission {
  title: string;
  body: string;
  category: 'bug' | 'idea' | 'ux';
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const categoryConfig = {
  bug: { 
    icon: Bug, 
    label: 'Bug Report', 
    color: '#EF4444', 
    bgColor: 'rgba(239, 68, 68, 0.1)',
    description: 'Report issues or problems you\'ve encountered'
  },
  idea: { 
    icon: Lightbulb, 
    label: 'Feature Idea', 
    color: '#F59E0B', 
    bgColor: 'rgba(245, 158, 11, 0.1)',
    description: 'Suggest new features or improvements'
  },
  ux: { 
    icon: Palette, 
    label: 'UX Feedback', 
    color: '#8B5CF6', 
    bgColor: 'rgba(139, 92, 246, 0.1)',
    description: 'Share thoughts on user experience and design'
  }
};

const statusConfig = {
  open: { label: 'Open', color: '#6B7280' },
  in_progress: { label: 'In Progress', color: '#F59E0B' },
  completed: { label: 'Completed', color: '#10B981' },
  closed: { label: 'Closed', color: '#6B7280' }
};

const FeedbackPage: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const [showForm, setShowForm] = useState(true); // Form shown by default
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState<FeedbackSubmission>({
    title: '',
    body: '',
    category: 'idea'
  });

  // Fetch feedback
  const fetchFeedback = async () => {
    if (!SUPABASE_URL) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/feedback?limit=50`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch feedback');
      
      const result = await response.json();
      setFeedback(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  // Submit new feedback
  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!SUPABASE_URL || !formData.title.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      const result = await response.json();
      setFeedback(prev => [result.data, ...prev]);
      setFormData({ title: '', body: '', category: 'idea' });
      setShowForm(false);
      setSuccess('Thank you for your feedback!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  // Vote on feedback
  const voteFeedback = async (feedbackId: string) => {
    if (!SUPABASE_URL) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/feedback/${feedbackId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to vote');
      }

      const result = await response.json();
      setFeedback(prev => prev.map(item => 
        item.id === feedbackId 
          ? { ...item, upvotes: result.data.upvotes, user_has_voted: true }
          : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Filter feedback by category
  const filteredFeedback = selectedCategory === 'all' 
    ? feedback 
    : feedback.filter(item => item.category === selectedCategory);

  // Don't render if Supabase is not configured
  if (!SUPABASE_URL) {
    return (
      <div style={styles.bg.primary} className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 style={{ ...styles.typography.h1, color: theme.colors.text }}>
              Feedback System
            </h1>
            <p style={{ ...styles.typography.body, color: theme.colors.textSecondary }}>
              Feedback system is not configured yet.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      
      {/* Main Content */}
      <section className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8"
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
              Community{' '}
              <motion.span 
                key={`feedback-gradient-${theme.mode}`}
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
                Feedback
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
              Help us improve Dytto by sharing your ideas, reporting bugs, and providing feedback.
            </p>
          </motion.div>

          {/* Feedback Form - Mobile Optimized */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  ...styles.glass.medium,
                  border: `2px solid ${theme.colors.primary}`,
                  borderRadius: '1.25rem',
                  marginBottom: theme.semanticSpacing.lg,
                  overflow: 'hidden',
                }}
              >
                {/* Form Header - Mobile Optimized */}
                <div 
                  style={{
                    background: `linear-gradient(135deg, ${theme.utils.alpha(theme.colors.primary, 0.1)}, ${theme.utils.alpha(theme.colors.accent, 0.05)})`,
                    padding: 'clamp(1rem, 4vw, 1.5rem)',
                    borderBottom: `1px solid ${theme.colors.border}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: theme.semanticSpacing.md,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <h2 
                      style={{
                        color: theme.colors.text,
                        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                        fontWeight: theme.typography.fontWeight.semibold,
                        marginBottom: theme.semanticSpacing.xs,
                        lineHeight: '1.3',
                      }}
                    >
                      Share Your Feedback
                    </h2>
                    <p 
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                        lineHeight: '1.4',
                      }}
                    >
                      Tell us what you think - every suggestion helps us improve
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.colors.textSecondary,
                      cursor: 'pointer',
                      padding: theme.semanticSpacing.sm,
                      borderRadius: '0.5rem',
                      transition: theme.animations.transition.normal,
                      flexShrink: 0,
                      minHeight: '44px',
                      minWidth: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.surface;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form Content - Mobile Optimized */}
                <form onSubmit={submitFeedback} style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
                  {/* Category Selection - Mobile Optimized */}
                  <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                    <label 
                      style={{
                        color: theme.colors.text,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.semanticSpacing.sm,
                        display: 'block',
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      }}
                    >
                      What type of feedback is this?
                    </label>
                    <div className="space-y-3">
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <motion.button
                          key={key}
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setFormData(prev => ({ ...prev, category: key as any }))}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: theme.semanticSpacing.sm,
                            padding: 'clamp(0.75rem, 3vw, 1rem)',
                            borderRadius: '0.75rem',
                            border: `2px solid ${formData.category === key ? config.color : theme.colors.border}`,
                            backgroundColor: formData.category === key ? config.bgColor : theme.colors.surface,
                            color: theme.colors.text,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: theme.animations.transition.normal,
                            width: '100%',
                            minHeight: '60px',
                          }}
                        >
                          <config.icon 
                            style={{ 
                              color: formData.category === key ? config.color : theme.colors.textSecondary, 
                              flexShrink: 0,
                              marginTop: '2px'
                            }} 
                            size={20} 
                          />
                          <div className="flex-1 min-w-0">
                            <div style={{ 
                              fontWeight: theme.typography.fontWeight.medium, 
                              marginBottom: theme.semanticSpacing.xs,
                              fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                            }}>
                              {config.label}
                            </div>
                            <div style={{ 
                              fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', 
                              color: theme.colors.textSecondary,
                              lineHeight: '1.4',
                            }}>
                              {config.description}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Title Input - Mobile Optimized */}
                  <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                    <label 
                      style={{
                        color: theme.colors.text,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.semanticSpacing.sm,
                        display: 'block',
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      }}
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief description of your feedback"
                      required
                      maxLength={200}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.75rem, 3vw, 1rem)',
                        borderRadius: '0.75rem',
                        border: `2px solid ${formData.title ? theme.colors.primary : theme.colors.border}`,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        outline: 'none',
                        transition: theme.animations.transition.normal,
                        minHeight: '48px',
                      }}
                    />
                  </div>

                  {/* Details Textarea - Mobile Optimized */}
                  <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                    <label 
                      style={{
                        color: theme.colors.text,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.semanticSpacing.sm,
                        display: 'block',
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      }}
                    >
                      Details (optional)
                    </label>
                    <textarea
                      value={formData.body}
                      onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                      placeholder="Additional details about your feedback"
                      maxLength={1000}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.75rem, 3vw, 1rem)',
                        borderRadius: '0.75rem',
                        border: `2px solid ${formData.body ? theme.colors.primary : theme.colors.border}`,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: theme.animations.transition.normal,
                        minHeight: '100px',
                      }}
                    />
                  </div>

                  {/* Submit Button - Mobile Optimized */}
                  <motion.button
                    type="submit"
                    disabled={submitting || !formData.title.trim()}
                    whileHover={{ scale: submitting || !formData.title.trim() ? 1 : 1.02 }}
                    whileTap={{ scale: submitting || !formData.title.trim() ? 1 : 0.98 }}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.875rem, 3vw, 1rem)',
                      borderRadius: '0.75rem',
                      border: 'none',
                      backgroundColor: submitting || !formData.title.trim() ? theme.colors.border : theme.colors.primary,
                      color: theme.colors.background,
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: theme.typography.fontWeight.semibold,
                      cursor: submitting || !formData.title.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: theme.semanticSpacing.sm,
                      boxShadow: submitting || !formData.title.trim() ? 'none' : theme.shadows.brand,
                      transition: theme.animations.transition.normal,
                      minHeight: '48px',
                    }}
                  >
                    {submitting ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show Form Button (when form is hidden) - Mobile Optimized */}
          {!showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background,
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: 'clamp(0.875rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)',
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  fontWeight: theme.typography.fontWeight.semibold,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                  boxShadow: theme.shadows.brand,
                  margin: '0 auto',
                  transition: theme.animations.transition.normal,
                  minHeight: '48px',
                }}
              >
                <Plus size={20} />
                Share Your Feedback
              </motion.button>
            </motion.div>
          )}

          {/* Success/Error Messages - Mobile Optimized */}
          <AnimatePresence>
            {(success || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  padding: 'clamp(0.75rem, 3vw, 1rem)',
                  marginBottom: theme.semanticSpacing.lg,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                  backgroundColor: success 
                    ? theme.utils.alpha(theme.colors.success, 0.1)
                    : theme.utils.alpha(theme.colors.error, 0.1),
                  border: `1px solid ${success ? theme.colors.success : theme.colors.error}`,
                  color: success ? theme.colors.success : theme.colors.error,
                }}
              >
                {success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span style={{ fontSize: 'clamp(0.75rem, 3vw, 0.875rem)' }}>
                  {success || error}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8"
          >
            {[
              { icon: MessageSquare, label: 'Comments', value: feedback.length },
              { icon: TrendingUp, label: 'Total Votes', value: feedback.reduce((sum, item) => sum + item.upvotes, 0) },
              { icon: CheckCircle, label: 'Completed', value: feedback.filter(item => item.status === 'completed').length }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                style={{
                  ...styles.glass.light,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '0.75rem',
                  padding: 'clamp(0.75rem, 3vw, 1rem)',
                  textAlign: 'center',
                }}
              >
                <stat.icon 
                  style={{ 
                    color: theme.colors.primary, 
                    margin: '0 auto', 
                    marginBottom: 'clamp(0.25rem, 2vw, 0.5rem)' 
                  }} 
                  size={20} 
                />
                <div style={{ 
                  fontSize: 'clamp(1rem, 4vw, 1.5rem)', 
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text, 
                  marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)' 
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)', 
                  color: theme.colors.textSecondary 
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filter Bar - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter style={{ color: theme.colors.textSecondary }} size={18} />
              <span style={{ 
                color: theme.colors.textSecondary,
                fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                fontWeight: theme.typography.fontWeight.medium,
              }}>
                Filter by category:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                  borderRadius: '0.75rem',
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                  fontWeight: theme.typography.fontWeight.medium,
                  transition: theme.animations.transition.normal,
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '40px',
                  ...(selectedCategory === 'all'
                    ? {
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background,
                      }
                    : {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.textSecondary,
                      }
                  ),
                }}
              >
                All
              </button>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                    borderRadius: '0.75rem',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: theme.animations.transition.normal,
                    border: 'none',
                    cursor: 'pointer',
                    minHeight: '40px',
                    ...(selectedCategory === key
                      ? {
                          backgroundColor: config.bgColor,
                          color: config.color,
                          border: `1px solid ${config.color}`,
                        }
                      : {
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.textSecondary,
                        }
                    ),
                  }}
                >
                  <config.icon size={14} />
                  <span className="hidden sm:inline">{config.label}</span>
                  <span className="sm:hidden">{config.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Feedback List - Mobile Optimized */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'clamp(2rem, 6vw, 3rem)' }}>
              <Loader size={32} className="animate-spin" style={{ color: theme.colors.primary, margin: '0 auto' }} />
              <p style={{ 
                color: theme.colors.textSecondary, 
                marginTop: theme.semanticSpacing.md,
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
              }}>
                Loading feedback...
              </p>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: 'clamp(2rem, 6vw, 3rem)',
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.25rem',
              }}
            >
              <MessageSquare style={{ 
                color: theme.colors.textSecondary, 
                margin: '0 auto', 
                marginBottom: theme.semanticSpacing.md 
              }} size={48} />
              <h3 style={{ 
                fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text, 
                marginBottom: theme.semanticSpacing.sm 
              }}>
                No feedback yet
              </h3>
              <p style={{ 
                color: theme.colors.textSecondary, 
                marginBottom: theme.semanticSpacing.lg,
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                lineHeight: '1.5',
              }}>
                Be the first to share your thoughts and help us improve Dytto!
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  ...styles.button.primary,
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)',
                  minHeight: '48px',
                }}
              >
                Add First Feedback
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item, index) => {
                const config = categoryConfig[item.category];
                const statusInfo = statusConfig[item.status];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    style={{
                      ...styles.glass.light,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '1rem',
                      padding: 'clamp(1rem, 4vw, 1.5rem)',
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Vote Button - Mobile Optimized */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !item.user_has_voted && voteFeedback(item.id)}
                        disabled={item.user_has_voted}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                          padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                          borderRadius: '0.75rem',
                          border: 'none',
                          backgroundColor: item.user_has_voted 
                            ? theme.utils.alpha(theme.colors.primary, 0.1)
                            : theme.colors.surface,
                          color: item.user_has_voted ? theme.colors.primary : theme.colors.textSecondary,
                          cursor: item.user_has_voted ? 'default' : 'pointer',
                          minWidth: 'clamp(3rem, 8vw, 4rem)',
                          transition: theme.animations.transition.normal,
                          flexShrink: 0,
                        }}
                      >
                        <ChevronUp size={18} />
                        <span style={{ 
                          fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', 
                          fontWeight: theme.typography.fontWeight.semibold 
                        }}>
                          {item.upvotes}
                        </span>
                      </motion.button>

                      {/* Content - Mobile Optimized */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div 
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                                padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)',
                                borderRadius: '9999px',
                                backgroundColor: config.bgColor,
                                color: config.color,
                                fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                                fontWeight: theme.typography.fontWeight.medium,
                              }}
                            >
                              <config.icon size={12} />
                              <span className="hidden sm:inline">{config.label}</span>
                              <span className="sm:hidden">{config.label.split(' ')[0]}</span>
                            </div>
                            <div 
                              style={{
                                padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)',
                                borderRadius: '9999px',
                                backgroundColor: theme.utils.alpha(statusInfo.color, 0.1),
                                color: statusInfo.color,
                                fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                                fontWeight: theme.typography.fontWeight.medium,
                              }}
                            >
                              {statusInfo.label}
                            </div>
                          </div>
                          <span 
                            style={{
                              color: theme.colors.textTertiary,
                              fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 
                          style={{
                            color: theme.colors.text,
                            fontSize: 'clamp(0.875rem, 3vw, 1.125rem)',
                            fontWeight: theme.typography.fontWeight.semibold,
                            marginBottom: theme.semanticSpacing.sm,
                            lineHeight: '1.4',
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.title}
                        </h3>
                        
                        {item.body && (
                          <p 
                            style={{
                              color: theme.colors.textSecondary,
                              fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                              lineHeight: '1.5',
                              wordBreak: 'break-word',
                            }}
                          >
                            {item.body}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeedbackPage;