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
  AlertCircle
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

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
  bug: { icon: Bug, label: 'Bug Report', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  idea: { icon: Lightbulb, label: 'Feature Idea', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  ux: { icon: Palette, label: 'UX Feedback', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' }
};

const FeedbackWidget: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FeedbackSubmission>({
    title: '',
    body: '',
    category: 'idea'
  });

  // Fetch feedback
  const fetchFeedback = async () => {
    if (!SUPABASE_URL) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/feedback?limit=20`, {
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
    if (isOpen && feedback.length === 0) {
      fetchFeedback();
    }
  }, [isOpen]);

  // Don't render if Supabase is not configured
  if (!SUPABASE_URL) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '3.5rem',
          height: '3.5rem',
          backgroundColor: theme.colors.primary,
          color: theme.colors.background,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          boxShadow: theme.shadows.lg,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MessageSquare size={20} />
      </motion.button>

      {/* Widget Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: theme.utils.alpha(theme.colors.background, 0.8),
              backdropFilter: 'blur(8px)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                ...styles.glass.medium,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                width: '100%',
                maxWidth: '48rem',
                maxHeight: '80vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div 
                style={{
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
                    Community Feedback
                  </h2>
                  <p 
                    style={{
                      ...styles.typography.caption,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    Help us improve Dytto by sharing your ideas and reporting issues
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: theme.colors.textSecondary,
                    cursor: 'pointer',
                    padding: theme.semanticSpacing.sm,
                    borderRadius: '0.5rem',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Success/Error Messages */}
              <AnimatePresence>
                {(success || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      padding: theme.semanticSpacing.md,
                      margin: theme.semanticSpacing.md,
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

              {/* Content */}
              <div style={{ flex: 1, overflow: 'auto', padding: theme.semanticSpacing.lg }}>
                {showForm ? (
                  /* Feedback Form */
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={submitFeedback}
                    style={{ display: 'flex', flexDirection: 'column', gap: theme.semanticSpacing.lg }}
                  >
                    <div>
                      <label 
                        style={{
                          ...styles.typography.body,
                          color: theme.colors.text,
                          fontWeight: theme.typography.fontWeight.medium,
                          marginBottom: theme.semanticSpacing.sm,
                          display: 'block',
                        }}
                      >
                        Category
                      </label>
                      <div style={{ display: 'flex', gap: theme.semanticSpacing.sm, flexWrap: 'wrap' }}>
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: key as any }))}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: theme.semanticSpacing.sm,
                              padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                              borderRadius: '0.75rem',
                              border: `1px solid ${formData.category === key ? config.color : theme.colors.border}`,
                              backgroundColor: formData.category === key ? config.bgColor : 'transparent',
                              color: formData.category === key ? config.color : theme.colors.textSecondary,
                              cursor: 'pointer',
                              fontSize: theme.typography.fontSize.sm,
                            }}
                          >
                            <config.icon size={16} />
                            {config.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
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
                          border: `1px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text,
                          fontSize: theme.typography.fontSize.base,
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
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
                          border: `1px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text,
                          fontSize: theme.typography.fontSize.base,
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: theme.semanticSpacing.md, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        style={{
                          ...styles.button.secondary,
                          padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.lg}`,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || !formData.title.trim()}
                        style={{
                          ...styles.button.primary,
                          padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.lg}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: theme.semanticSpacing.sm,
                          opacity: submitting || !formData.title.trim() ? 0.6 : 1,
                          cursor: submitting || !formData.title.trim() ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {submitting ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  /* Feedback List */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: theme.semanticSpacing.lg }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 
                        style={{
                          ...styles.typography.h5,
                          color: theme.colors.text,
                        }}
                      >
                        Recent Feedback
                      </h3>
                      <button
                        onClick={() => setShowForm(true)}
                        style={{
                          ...styles.button.primary,
                          padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: theme.semanticSpacing.sm,
                          fontSize: theme.typography.fontSize.sm,
                        }}
                      >
                        <Plus size={16} />
                        Add Feedback
                      </button>
                    </div>

                    {loading ? (
                      <div style={{ textAlign: 'center', padding: theme.semanticSpacing.xl }}>
                        <Loader size={24} className="animate-spin" style={{ color: theme.colors.primary }} />
                      </div>
                    ) : feedback.length === 0 ? (
                      <div 
                        style={{
                          textAlign: 'center',
                          padding: theme.semanticSpacing.xl,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        No feedback yet. Be the first to share your thoughts!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.semanticSpacing.md }}>
                        {feedback.map((item) => {
                          const config = categoryConfig[item.category];
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              style={{
                                padding: theme.semanticSpacing.lg,
                                borderRadius: '1rem',
                                border: `1px solid ${theme.colors.border}`,
                                backgroundColor: theme.colors.surface,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: theme.semanticSpacing.md }}>
                                <button
                                  onClick={() => !item.user_has_voted && voteFeedback(item.id)}
                                  disabled={item.user_has_voted}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: theme.semanticSpacing.xs,
                                    padding: theme.semanticSpacing.sm,
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    backgroundColor: item.user_has_voted 
                                      ? theme.utils.alpha(theme.colors.primary, 0.1)
                                      : 'transparent',
                                    color: item.user_has_voted ? theme.colors.primary : theme.colors.textSecondary,
                                    cursor: item.user_has_voted ? 'default' : 'pointer',
                                    minWidth: '3rem',
                                  }}
                                >
                                  <ChevronUp size={16} />
                                  <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium }}>
                                    {item.upvotes}
                                  </span>
                                </button>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.semanticSpacing.sm, marginBottom: theme.semanticSpacing.sm }}>
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
                                    <span 
                                      style={{
                                        color: theme.colors.textTertiary,
                                        fontSize: theme.typography.fontSize.xs,
                                      }}
                                    >
                                      {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  
                                  <h4 
                                    style={{
                                      ...styles.typography.h6,
                                      color: theme.colors.text,
                                      marginBottom: theme.semanticSpacing.sm,
                                    }}
                                  >
                                    {item.title}
                                  </h4>
                                  
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
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;