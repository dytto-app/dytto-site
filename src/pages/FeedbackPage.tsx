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
      <section className="pt-32 pb-16 px-4 sm:px-6">
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
                ...styles.typography.h1,
                color: theme.colors.text,
                marginBottom: theme.semanticSpacing.md,
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
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
                ...styles.typography.bodyLarge,
                color: theme.colors.textSecondary,
                maxWidth: '48rem',
                margin: '0 auto',
              }}
            >
              Help us improve Dytto by sharing your ideas, reporting bugs, and providing feedback. 
              Your voice shapes the future of our platform.
            </p>
          </motion.div>

          {/* Feedback Form - Now prominently displayed */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  ...styles.glass.medium,
                  border: `2px solid ${theme.colors.primary}`,
                  borderRadius: '1.5rem',
                  marginBottom: theme.semanticSpacing.xl,
                  overflow: 'hidden',
                }}
              >
                {/* Form Header */}
                <div 
                  style={{
                    background: `linear-gradient(135deg, ${theme.utils.alpha(theme.colors.primary, 0.1)}, ${theme.utils.alpha(theme.colors.accent, 0.05)})`,
                    padding: theme.semanticSpacing.lg,
                    borderBottom: `1px solid ${theme.colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h2 
                      style={{
                        ...styles.typography.h3,
                        color: theme.colors.text,
                        marginBottom: theme.semanticSpacing.xs,
                      }}
                    >
                      Share Your Feedback
                    </h2>
                    <p 
                      style={{
                        ...styles.typography.body,
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.sm,
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

                {/* Form Content */}
                <form onSubmit={submitFeedback} style={{ padding: theme.semanticSpacing.lg }}>
                  {/* Category Selection */}
                  <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                    <label 
                      style={{
                        ...styles.typography.body,
                        color: theme.colors.text,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.semanticSpacing.sm,
                        display: 'block',
                      }}
                    >
                      What type of feedback is this?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: theme.semanticSpacing.sm }}>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <motion.button
                          key={key}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData(prev => ({ ...prev, category: key as any }))}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: theme.semanticSpacing.md,
                            padding: theme.semanticSpacing.md,
                            borderRadius: '0.75rem',
                            border: `2px solid ${formData.category === key ? config.color : theme.colors.border}`,
                            backgroundColor: formData.category === key ? config.bgColor : theme.colors.surface,
                            color: theme.colors.text,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: theme.animations.transition.normal,
                          }}
                        >
                          <config.icon 
                            style={{ color: formData.category === key ? config.color : theme.colors.textSecondary, flexShrink: 0 }} 
                            size={20} 
                          />
                          <div>
                            <div style={{ fontWeight: theme.typography.fontWeight.medium, marginBottom: theme.semanticSpacing.xs }}>
                              {config.label}
                            </div>
                            <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary }}>
                              {config.description}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Title Input */}
                  <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                    <label 
                      style={{
                        ...styles.typography.body,
                        color: theme.colors.text,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.semanticSpacing.sm,
                        display: 'block',
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
                        padding: theme.semanticSpacing.md,
                        borderRadius: '0.75rem',
                        border: `2px solid ${formData.title ? theme.colors.primary : theme.colors.border}`,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.base,
                        outline: 'none',
                        transition: theme.animations.transition.normal,
                      }}
                    />
                  </div>

                  {/* Details Textarea */}
                  <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                    <label 
                      style={{
                        ...styles.typography.body,
                        color: theme.colors.text,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.semanticSpacing.sm,
                        display: 'block',
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
                        padding: theme.semanticSpacing.md,
                        borderRadius: '0.75rem',
                        border: `2px solid ${formData.body ? theme.colors.primary : theme.colors.border}`,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.base,
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: theme.animations.transition.normal,
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div style={{ display: 'flex', gap: theme.semanticSpacing.md, justifyContent: 'flex-end' }}>
                    <motion.button
                      type="submit"
                      disabled={submitting || !formData.title.trim()}
                      whileHover={{ scale: submitting || !formData.title.trim() ? 1 : 1.02 }}
                      whileTap={{ scale: submitting || !formData.title.trim() ? 1 : 0.98 }}
                      style={{
                        ...styles.button.primary,
                        padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.xl}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.semanticSpacing.sm,
                        opacity: submitting || !formData.title.trim() ? 0.6 : 1,
                        cursor: submitting || !formData.title.trim() ? 'not-allowed' : 'pointer',
                        boxShadow: theme.shadows.brand,
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      {submitting ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                      {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show Form Button (when form is hidden) */}
          {!showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                style={{
                  ...styles.button.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                  boxShadow: theme.shadows.brand,
                  margin: '0 auto',
                  fontSize: theme.typography.fontSize.lg,
                  padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.xl}`,
                }}
              >
                <Plus size={20} />
                Share Your Feedback
              </motion.button>
            </motion.div>
          )}

          {/* Success/Error Messages */}
          <AnimatePresence>
            {(success || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  padding: theme.semanticSpacing.md,
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
                <span style={{ fontSize: theme.typography.fontSize.sm }}>
                  {success || error}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
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
                  borderRadius: '1rem',
                  padding: theme.semanticSpacing.lg,
                  textAlign: 'center',
                }}
              >
                <stat.icon style={{ color: theme.colors.primary, margin: '0 auto', marginBottom: theme.semanticSpacing.sm }} size={24} />
                <div style={{ ...styles.typography.h3, color: theme.colors.text, marginBottom: theme.semanticSpacing.xs }}>
                  {stat.value}
                </div>
                <div style={{ ...styles.typography.caption, color: theme.colors.textSecondary }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2 flex-wrap mb-8"
          >
            <Filter style={{ color: theme.colors.textSecondary }} size={20} />
            <span style={{ ...styles.typography.body, color: theme.colors.textSecondary, marginRight: theme.semanticSpacing.sm }}>
              Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                borderRadius: '0.75rem',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                transition: theme.animations.transition.normal,
                border: 'none',
                cursor: 'pointer',
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
                  gap: theme.semanticSpacing.sm,
                  padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                  borderRadius: '0.75rem',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  transition: theme.animations.transition.normal,
                  border: 'none',
                  cursor: 'pointer',
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
                <config.icon size={16} />
                {config.label}
              </button>
            ))}
          </motion.div>

          {/* Feedback List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: theme.semanticSpacing.xl }}>
              <Loader size={32} className="animate-spin" style={{ color: theme.colors.primary, margin: '0 auto' }} />
              <p style={{ ...styles.typography.body, color: theme.colors.textSecondary, marginTop: theme.semanticSpacing.md }}>
                Loading feedback...
              </p>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: theme.semanticSpacing.xl,
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
              }}
            >
              <MessageSquare style={{ color: theme.colors.textSecondary, margin: '0 auto', marginBottom: theme.semanticSpacing.md }} size={48} />
              <h3 style={{ ...styles.typography.h4, color: theme.colors.text, marginBottom: theme.semanticSpacing.sm }}>
                No feedback yet
              </h3>
              <p style={{ ...styles.typography.body, color: theme.colors.textSecondary, marginBottom: theme.semanticSpacing.lg }}>
                Be the first to share your thoughts and help us improve Dytto!
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={styles.button.primary}
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
                      borderRadius: '1.25rem',
                      padding: theme.semanticSpacing.lg,
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Vote Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !item.user_has_voted && voteFeedback(item.id)}
                        disabled={item.user_has_voted}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: theme.semanticSpacing.xs,
                          padding: theme.semanticSpacing.sm,
                          borderRadius: '0.75rem',
                          border: 'none',
                          backgroundColor: item.user_has_voted 
                            ? theme.utils.alpha(theme.colors.primary, 0.1)
                            : theme.colors.surface,
                          color: item.user_has_voted ? theme.colors.primary : theme.colors.textSecondary,
                          cursor: item.user_has_voted ? 'default' : 'pointer',
                          minWidth: '4rem',
                          transition: theme.animations.transition.normal,
                        }}
                      >
                        <ChevronUp size={20} />
                        <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold }}>
                          {item.upvotes}
                        </span>
                      </motion.button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div 
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: theme.semanticSpacing.xs,
                                padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                                borderRadius: '9999px',
                                backgroundColor: config.bgColor,
                                color: config.color,
                                fontSize: theme.typography.fontSize.xs,
                                fontWeight: theme.typography.fontWeight.medium,
                              }}
                            >
                              <config.icon size={12} />
                              {config.label}
                            </div>
                            <div 
                              style={{
                                padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                                borderRadius: '9999px',
                                backgroundColor: theme.utils.alpha(statusInfo.color, 0.1),
                                color: statusInfo.color,
                                fontSize: theme.typography.fontSize.xs,
                                fontWeight: theme.typography.fontWeight.medium,
                              }}
                            >
                              {statusInfo.label}
                            </div>
                          </div>
                          <span 
                            style={{
                              color: theme.colors.textTertiary,
                              fontSize: theme.typography.fontSize.xs,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 
                          style={{
                            ...styles.typography.h5,
                            color: theme.colors.text,
                            marginBottom: theme.semanticSpacing.sm,
                            lineHeight: '1.4',
                          }}
                        >
                          {item.title}
                        </h3>
                        
                        {item.body && (
                          <p 
                            style={{
                              ...styles.typography.body,
                              color: theme.colors.textSecondary,
                              fontSize: theme.typography.fontSize.sm,
                              lineHeight: '1.5',
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