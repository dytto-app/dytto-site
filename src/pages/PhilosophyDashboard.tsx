import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  MessageSquare,
  Sparkles,
  Loader
} from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface EnrichedData {
  metadata?: {
    summary?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  };
  statistics?: {
    totalSteps?: number;
    totalDistance?: number;
    activeMinutes?: number;
    uniqueLocations?: number;
    photosTaken?: number;
  };
}

interface Story {
  id: string;
  user_id: string;
  date: string;
  mood: string | null;
  created_at: string;
  enricheddata: string; // JSON string
  daycolor?: string;
  importance?: string;
}

// Your user ID
const USER_ID = '2d9a5829-032a-489d-ae7e-d8e2597b2de3';

const PhilosophyDashboard: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const styles = useThemeStyles();

  // Fetch user profile and their stories
  const fetchData = async () => {
    if (!SUPABASE_URL) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/demo`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stories');

      const result = await response.json();
      const stories = result.data || [];
      setStories(stories);

      // Auto-select first story
      if (stories.length > 0) {
        setSelectedStory(stories[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1
              style={{
                color: theme.colors.text,
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                fontWeight: theme.typography.fontWeight.bold,
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
              }}
            >
              Demo
            </h1>
            <p
              style={{
                color: theme.colors.textSecondary,
                fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                maxWidth: '48rem',
                margin: '0 auto',
              }}
            >
              Personal journal entries showcasing context-aware AI storytelling
            </p>
          </motion.div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Loader size={32} className="animate-spin" style={{ color: theme.colors.primary, margin: '0 auto' }} />
              <p style={{ 
                color: theme.colors.textSecondary, 
                marginTop: theme.semanticSpacing.md,
                fontSize: theme.typography.fontSize.base,
              }}>
                Loading journal entries...
              </p>
            </div>
          ) : error ? (
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
              <AlertTriangle size={20} />
              {error}
            </motion.div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Story Display */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedStory || 'default'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    ...styles.glass.medium,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '1.5rem',
                    padding: theme.semanticSpacing.xl,
                    minHeight: '600px',
                  }}
                >
                  {(() => {
                    const story = stories.find(s => s.id === selectedStory) || stories[0];
                    if (!story) {
                      return (
                        <div className="text-center py-16">
                          <MessageSquare
                            style={{
                              color: theme.colors.textSecondary,
                              margin: '0 auto',
                              marginBottom: theme.semanticSpacing.md
                            }}
                            size={48}
                          />
                          <h3
                            style={{
                              color: theme.colors.text,
                              fontSize: theme.typography.fontSize.xl,
                              fontWeight: theme.typography.fontWeight.semibold,
                              marginBottom: theme.semanticSpacing.sm,
                            }}
                          >
                            No stories available
                          </h3>
                          <p style={{ color: theme.colors.textSecondary }}>
                            Create your first story to see it here
                          </p>
                        </div>
                      );
                    }

                    // Parse enricheddata JSON
                    let enrichedData: EnrichedData = {};
                    try {
                      enrichedData = story.enricheddata ? JSON.parse(story.enricheddata) : {};
                    } catch (e) {
                      console.error('Error parsing enricheddata:', e);
                    }

                    const storyText = enrichedData.metadata?.summary || 'No story content available';
                    const storyDate = enrichedData.metadata?.date || story.date;

                    return (
                      <>
                        {/* Story Header */}
                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <img
                              src="/profile-pic.jpeg"
                              alt="Author"
                              style={{
                                width: '3.5rem',
                                height: '3.5rem',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                            <div>
                              <h2
                                style={{
                                  color: theme.colors.text,
                                  fontSize: theme.typography.fontSize['2xl'],
                                  fontWeight: theme.typography.fontWeight.bold,
                                  marginBottom: theme.semanticSpacing.xs,
                                }}
                              >
                                {/* Parse YYYY-MM-DD as local date, not UTC */}
                                {new Date(storyDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </h2>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Calendar style={{ color: theme.colors.textSecondary }} size={16} />
                                  <span
                                    style={{
                                      color: theme.colors.textSecondary,
                                      fontSize: theme.typography.fontSize.sm,
                                    }}
                                  >
                                    {new Date(storyDate + 'T12:00:00').toLocaleDateString()}
                                  </span>
                                </div>
                                {story.mood && (
                                  <span
                                    style={{
                                      fontSize: theme.typography.fontSize.sm,
                                      padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                                      borderRadius: '9999px',
                                      backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                                      color: theme.colors.primary,
                                    }}
                                  >
                                    {story.mood}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Story Content */}
                        <div
                          style={{
                            color: theme.colors.textSecondary,
                            lineHeight: '1.7',
                            marginBottom: theme.semanticSpacing.xl,
                            whiteSpace: 'pre-line',
                            fontSize: theme.typography.fontSize.lg,
                          }}
                        >
                          {storyText}
                        </div>

                        {/* Story Statistics */}
                        {enrichedData.statistics && (
                          <div>
                            <h4
                              style={{
                                color: theme.colors.text,
                                fontWeight: theme.typography.fontWeight.semibold,
                                marginBottom: theme.semanticSpacing.sm,
                                display: 'flex',
                                alignItems: 'center',
                                gap: theme.semanticSpacing.sm,
                              }}
                            >
                              <Sparkles style={{ color: theme.colors.primary }} size={16} />
                              Day Statistics
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {enrichedData.statistics.totalSteps && (
                                <span
                                  style={{
                                    backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                                    color: theme.colors.primary,
                                    padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                                    borderRadius: '9999px',
                                    fontSize: theme.typography.fontSize.xs,
                                    fontWeight: theme.typography.fontWeight.medium,
                                  }}
                                >
                                  {enrichedData.statistics.totalSteps.toLocaleString()} steps
                                </span>
                              )}
                              {enrichedData.statistics.totalDistance && (
                                <span
                                  style={{
                                    backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                                    color: theme.colors.primary,
                                    padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                                    borderRadius: '9999px',
                                    fontSize: theme.typography.fontSize.xs,
                                    fontWeight: theme.typography.fontWeight.medium,
                                  }}
                                >
                                  {(enrichedData.statistics.totalDistance / 1000).toFixed(2)} km
                                </span>
                              )}
                              {enrichedData.statistics.uniqueLocations && (
                                <span
                                  style={{
                                    backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                                    color: theme.colors.primary,
                                    padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                                    borderRadius: '9999px',
                                    fontSize: theme.typography.fontSize.xs,
                                    fontWeight: theme.typography.fontWeight.medium,
                                  }}
                                >
                                  {enrichedData.statistics.uniqueLocations} locations
                                </span>
                              )}
                              {enrichedData.statistics.photosTaken && (
                                <span
                                  style={{
                                    backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                                    color: theme.colors.primary,
                                    padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                                    borderRadius: '9999px',
                                    fontSize: theme.typography.fontSize.xs,
                                    fontWeight: theme.typography.fontWeight.medium,
                                  }}
                                >
                                  {enrichedData.statistics.photosTaken} photos
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              {/* Story List */}
              <div>
                <h3
                  style={{
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  Stories
                </h3>
                <div className="space-y-2">
                  {stories.map((story) => {
                    // Parse enricheddata for each story in the list
                    let enrichedData: EnrichedData = {};
                    try {
                      enrichedData = story.enricheddata ? JSON.parse(story.enricheddata) : {};
                    } catch (e) {
                      console.error('Error parsing enricheddata for story', story.id, e);
                    }

                    const preview = enrichedData.metadata?.summary?.substring(0, 60) || 'No content';
                    const storyDate = enrichedData.metadata?.date || story.date;

                    return (
                      <motion.button
                        key={story.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedStory(story.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          ...styles.glass.light,
                          border: selectedStory === story.id
                            ? `2px solid ${theme.colors.primary}`
                            : `1px solid ${theme.colors.border}`,
                          borderRadius: '0.75rem',
                          padding: theme.semanticSpacing.sm,
                          cursor: 'pointer',
                          transition: theme.animations.transition.normal,
                          backgroundColor: selectedStory === story.id
                            ? theme.utils.alpha(theme.colors.primary, 0.05)
                            : 'transparent',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar style={{ color: theme.colors.textSecondary }} size={12} />
                          <span
                            style={{
                              color: theme.colors.textSecondary,
                              fontSize: theme.typography.fontSize.xs,
                            }}
                          >
                            {new Date(storyDate + 'T12:00:00').toLocaleDateString()}
                          </span>
                        </div>
                        <div
                          style={{
                            color: theme.colors.text,
                            fontWeight: theme.typography.fontWeight.medium,
                            fontSize: theme.typography.fontSize.sm,
                            marginBottom: theme.semanticSpacing.xs,
                          }}
                        >
                          {preview}...
                        </div>
                        {story.mood && (
                          <span
                            style={{
                              fontSize: theme.typography.fontSize.xs,
                              padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                              borderRadius: '9999px',
                              backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                              color: theme.colors.primary,
                            }}
                          >
                            {story.mood}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PhilosophyDashboard;