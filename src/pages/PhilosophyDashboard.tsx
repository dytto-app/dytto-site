import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Calendar,
  MessageSquare,
  Sparkles,
  Loader
} from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar: string;
  is_demo: boolean;
  demo_persona?: string;
  created_at: string;
}

interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}


// Mock data for when Supabase is not configured
const mockUsers: UserProfile[] = [
  {
    id: 'demo-buddha',
    email: 'buddha@demo.dytto.app',
    full_name: 'Siddhartha (Demo)',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    is_demo: true,
    demo_persona: 'Modern seeker exploring Buddhist wisdom',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo-jesus',
    email: 'jesus@demo.dytto.app',
    full_name: 'Joshua (Demo)',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    is_demo: true,
    demo_persona: 'Social worker living Christian values',
    created_at: '2024-01-01T00:00:00Z'
  }
];

const mockEntries: Record<string, JournalEntry[]> = {
  'demo-buddha': [
    {
      id: '1',
      user_id: 'demo-buddha',
      title: 'Morning Meditation and Job Search',
      content: `Woke up at 5:30 AM for meditation. The mind was particularly restless today - thoughts about rent, about the interview rejection last week, about whether I'm fooling myself thinking I can find peace while unemployed.

During sitting, I noticed how the anxiety manifests physically. Tight chest, shallow breathing. Instead of pushing it away, I tried to observe it with curiosity. "Ah, dukkha. Here you are again, old friend."

The Buddha taught that suffering comes from attachment to outcomes. Easy to understand intellectually. Much harder when your bank account is dwindling and society measures your worth by your productivity.

Applied to three more positions today. Each application feels like casting a message in a bottle into an ocean of algorithms. But I'm trying to hold it lightly - do the work, release the results.

Evening reflection: Maybe the real practice isn't finding a job. Maybe it's learning to be okay with uncertainty.`,
      mood: 'contemplative',
      tags: ['meditation', 'job-search', 'anxiety', 'non-attachment'],
      created_at: '2024-01-15T08:30:00Z',
      updated_at: '2024-01-15T20:15:00Z'
    },
    {
      id: '2',
      user_id: 'demo-buddha',
      title: 'Compassion Practice at the Food Bank',
      content: `Volunteered at the food bank today. Initially went because I have time and wanted to feel useful. Left with a deeper understanding of interconnectedness.

Met Maria, a single mother working two jobs who still needs food assistance. Her dignity, her gratitude, her strength - it shattered my assumptions about poverty and worthiness.

I realized I've been practicing a subtle form of spiritual materialism. "Look at me, the unemployed guy who volunteers." But true compassion isn't about feeling good about yourself. It's about recognizing that there's no real separation between giver and receiver.

The Buddha spoke of metta - loving-kindness. Today I felt it not as a practice I do, but as recognition of what already is. We're all just trying to get by, all deserving of care.

Came home and sat for 30 minutes. The meditation felt different - less about fixing myself, more about opening to what's here.`,
      mood: 'grateful',
      tags: ['compassion', 'service', 'metta', 'interconnectedness'],
      created_at: '2024-01-16T19:45:00Z',
      updated_at: '2024-01-16T21:30:00Z'
    }
  ],
  'demo-jesus': [
    {
      id: '1',
      user_id: 'demo-jesus',
      title: 'Burnout and Boundaries',
      content: `Another 12-hour day at the shelter. Mrs. Rodriguez came in again - third time this week. Her son is using again, and she's caught between enabling and abandoning him.

I wanted to take her pain away, to fix everything. But I'm learning that love sometimes means sitting with someone in their suffering rather than trying to rescue them from it.

Jesus withdrew to pray. I used to think that was selfish - how could he step away when people needed him? Now I understand. You can't pour from an empty cup. Even infinite love needs to flow through finite vessels.

Prayed the rosary on the bus home. "Hail Mary, full of grace..." The repetition quieted my racing thoughts about all the people I couldn't help today.

Tomorrow I'll show up again. Not because I can save everyone, but because love calls us to be present, even when - especially when - we feel inadequate.`,
      mood: 'weary but hopeful',
      tags: ['service', 'boundaries', 'prayer', 'love'],
      created_at: '2024-01-15T22:30:00Z',
      updated_at: '2024-01-15T23:15:00Z'
    }
  ]
};

const PhilosophyDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<string | null>('1'); // Start with first entry
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const styles = useThemeStyles();

  // Fetch demo users and their journal entries
  const fetchData = async () => {
    if (!supabase) {
      // Use mock data when Supabase is not configured
      setUsers(mockUsers);
      setSelectedUser(mockUsers[0]);
      setEntries(mockEntries[mockUsers[0].id] || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch demo users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_demo', true)
        .order('created_at', { ascending: true });

      if (usersError) {
        throw new Error(`Failed to fetch users: ${usersError.message}`);
      }

      const demoUsers = usersData || [];
      setUsers(demoUsers);

      if (demoUsers.length > 0) {
        const firstUser = demoUsers[0];
        setSelectedUser(firstUser);

        // Fetch entries for the first user
        const { data: entriesData, error: entriesError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', firstUser.id)
          .order('created_at', { ascending: false });

        if (entriesError) {
          throw new Error(`Failed to fetch entries: ${entriesError.message}`);
        }

        setEntries(entriesData || []);
        
        // Auto-select first entry
        if (entriesData && entriesData.length > 0) {
          setSelectedEntry(entriesData[0].id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      // Fallback to mock data on error
      setUsers(mockUsers);
      setSelectedUser(mockUsers[0]);
      setEntries(mockEntries[mockUsers[0].id] || []);
    } finally {
      setLoading(false);
    }
  };

  // Fetch entries when user changes
  const fetchUserEntries = async (userId: string) => {
    if (!supabase) {
      setEntries(mockEntries[userId] || []);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch entries: ${error.message}`);
      }

      setEntries(data || []);
      
      // Auto-select first entry
      if (data && data.length > 0) {
        setSelectedEntry(data[0].id);
      } else {
        setSelectedEntry(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
      setEntries(mockEntries[userId] || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle user selection
  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedEntry(null);
    fetchUserEntries(user.id);
  };

  // Auto-select first entry when user changes
  useEffect(() => {
    if (entries.length > 0) {
      setSelectedEntry(entries[0].id);
    } else {
      setSelectedEntry(null);
    }
  }, [entries]);


  const getDriftAlertColor = (alert: string) => {
    switch (alert) {
      case 'high': return theme.colors.error;
      case 'medium': return '#F59E0B';
      case 'low': return theme.colors.primary;
      default: return theme.colors.success;
    }
  };

  const getFinancialStateColor = (state: string) => {
    switch (state) {
      case 'struggling': return theme.colors.error;
      case 'stable': return '#F59E0B';
      case 'comfortable': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

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
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain style={{ color: theme.colors.primary }} size={32} />
              <h1 
                style={{
                  color: theme.colors.text,
                  fontSize: 'clamp(2rem, 6vw, 4rem)',
                  fontWeight: theme.typography.fontWeight.bold,
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Journal
              </h1>
            </div>
            <p 
              style={{
                color: theme.colors.textSecondary,
                fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                maxWidth: '48rem',
                margin: '0 auto',
              }}
            >
              Explore real user journal entries from our demo accounts showcasing context-aware AI storytelling
            </p>
            
            {!supabase && (
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
                  marginTop: theme.semanticSpacing.lg,
                  fontSize: theme.typography.fontSize.sm,
                  maxWidth: '48rem',
                  margin: `${theme.semanticSpacing.lg} auto 0`,
                }}
              >
                <AlertTriangle size={16} />
                <span>
                  Demo mode: Connect Supabase to see real user journal entries with demo accounts.
                </span>
              </motion.div>
            )}
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
          /* Main Content - Entry First Design */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Entry Display */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEntry || 'default'}
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
                    const entry = entries.find(e => e.id === selectedEntry) || entries[0];
                    if (!entry) {
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
                            No entries available
                          </h3>
                          <p style={{ color: theme.colors.textSecondary }}>
                            Select a different user to see their journal entries
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <>
                        {/* Entry Header */}
                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <img
                              src={selectedUser?.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                              alt={selectedUser?.full_name || 'User'}
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
                                {entry.title}
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
                                    {new Date(entry.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                {entry.mood && (
                                  <span 
                                    style={{
                                      fontSize: theme.typography.fontSize.sm,
                                      padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                                      borderRadius: '9999px',
                                      backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                                      color: theme.colors.primary,
                                    }}
                                  >
                                    {entry.mood}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Entry Content */}
                        <div 
                          style={{
                            color: theme.colors.textSecondary,
                            lineHeight: '1.7',
                            marginBottom: theme.semanticSpacing.xl,
                            whiteSpace: 'pre-line',
                            fontSize: theme.typography.fontSize.lg,
                          }}
                        >
                          {entry.content}
                        </div>

                        {/* Entry Tags */}
                        {entry.tags && entry.tags.length > 0 && (
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
                              Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {entry.tags.map((tag, index) => (
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
              {/* User Selector */}
              <div className="mb-6">
                <h3 
                  style={{
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  Demo Users
                </h3>
                <div className="space-y-3">
                  {users.map((user) => (
                    <motion.button
                      key={user.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleUserSelect(user);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        ...styles.glass.light,
                        border: selectedUser?.id === user.id 
                          ? `2px solid ${theme.colors.primary}` 
                          : `1px solid ${theme.colors.border}`,
                        borderRadius: '0.75rem',
                        padding: theme.semanticSpacing.md,
                        cursor: 'pointer',
                        transition: theme.animations.transition.normal,
                        backgroundColor: selectedUser?.id === user.id 
                          ? theme.utils.alpha(theme.colors.primary, 0.05)
                          : 'transparent',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.full_name || user.email}
                          style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div 
                            style={{
                              color: theme.colors.text,
                              fontWeight: theme.typography.fontWeight.semibold,
                              marginBottom: theme.semanticSpacing.xs,
                              fontSize: theme.typography.fontSize.sm,
                            }}
                          >
                            {user.full_name || user.email.split('@')[0]}
                          </div>
                          <div 
                            style={{
                              color: theme.colors.textSecondary,
                              fontSize: theme.typography.fontSize.xs,
                            }}
                          >
                            {user.demo_persona || 'Demo Account'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles 
                            style={{ 
                              color: theme.colors.primary
                            }} 
                            size={14} 
                          />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Entry Navigation */}
              <div>
                <h3 
                  style={{
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  Entries
                </h3>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <motion.button
                      key={entry.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedEntry(entry.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        ...styles.glass.light,
                        border: selectedEntry === entry.id 
                          ? `2px solid ${theme.colors.primary}` 
                          : `1px solid ${theme.colors.border}`,
                        borderRadius: '0.75rem',
                        padding: theme.semanticSpacing.sm,
                        cursor: 'pointer',
                        transition: theme.animations.transition.normal,
                        backgroundColor: selectedEntry === entry.id 
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
                          {new Date(entry.created_at).toLocaleDateString()}
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
                        {entry.title}
                      </div>
                      {entry.mood && (
                        <span 
                          style={{
                            fontSize: theme.typography.fontSize.xs,
                            padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                            borderRadius: '9999px',
                            backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                            color: theme.colors.primary,
                          }}
                        >
                          {entry.mood}
                        </span>
                      )}
                    </motion.button>
                  ))}
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