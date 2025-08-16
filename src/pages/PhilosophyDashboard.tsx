import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Calendar,
  BarChart3,
  Eye,
  MessageSquare,
  Sparkles,
  Filter,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface PhilosopherProfile {
  id: string;
  name: string;
  displayName: string;
  type: 'dynamic' | 'static';
  tradition: 'buddhist' | 'christian' | 'stoic' | 'sufi';
  modernContext: {
    age: number;
    location: string;
    occupation: string;
    currentStruggles: string[];
    financialState: 'struggling' | 'stable' | 'comfortable';
  };
  authenticityLevel: 'seeking' | 'realized';
  avatar: string;
  color: string;
}

interface StoryQualityMetrics {
  readability: number;
  characterConsistency: number;
  situationRealism: number;
  philosophicalFlavor: number;
  overallRating: number;
  lastUpdated: string;
}

interface CharacterDriftMetrics {
  voiceConsistency: number;
  responsePatterns: number;
  philosophicalGrounding: number;
  memoryIntegration: number;
  driftAlert: 'none' | 'low' | 'medium' | 'high';
  lastEvaluated: string;
}

const philosophers: PhilosopherProfile[] = [
  {
    id: 'buddha-dynamic',
    name: 'Buddha',
    displayName: 'Buddha (Dynamic)',
    type: 'dynamic',
    tradition: 'buddhist',
    modernContext: {
      age: 34,
      location: 'San Francisco, CA',
      occupation: 'Former Tech Worker',
      currentStruggles: ['Financial stress', 'Career uncertainty', 'Attachment to outcomes'],
      financialState: 'struggling'
    },
    authenticityLevel: 'seeking',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: '#F59E0B'
  },
  {
    id: 'buddha-static',
    name: 'The Teacher',
    displayName: 'Buddha (Static)',
    type: 'static',
    tradition: 'buddhist',
    modernContext: {
      age: 0,
      location: 'Everywhere',
      occupation: 'Teacher',
      currentStruggles: [],
      financialState: 'comfortable'
    },
    authenticityLevel: 'realized',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: '#10B981'
  },
  {
    id: 'jesus-dynamic',
    name: 'Jesus',
    displayName: 'Jesus (Dynamic)',
    type: 'dynamic',
    tradition: 'christian',
    modernContext: {
      age: 33,
      location: 'Los Angeles, CA',
      occupation: 'Social Worker',
      currentStruggles: ['Burnout from helping others', 'Balancing love with boundaries'],
      financialState: 'stable'
    },
    authenticityLevel: 'seeking',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: '#3B82F6'
  },
  {
    id: 'jesus-static',
    name: 'The Carpenter',
    displayName: 'Jesus (Static)',
    type: 'static',
    tradition: 'christian',
    modernContext: {
      age: 33,
      location: 'Wherever needed',
      occupation: 'Carpenter/Teacher',
      currentStruggles: [],
      financialState: 'comfortable'
    },
    authenticityLevel: 'realized',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: '#3B82F6'
  }
];

const PhilosophyDashboard: React.FC = () => {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<PhilosopherProfile>(philosophers[0]);
  const [selectedEntry, setSelectedEntry] = useState<string | null>('1'); // Start with first entry
  const { theme } = useTheme();
  const styles = useThemeStyles();

  // Mock journal entries for demonstration
  const journalEntries = {
    'buddha-dynamic': [
      {
        id: '1',
        date: '2024-01-15',
        title: 'Morning Meditation and Job Search',
        content: `Woke up at 5:30 AM for meditation. The mind was particularly restless today - thoughts about rent, about the interview rejection last week, about whether I'm fooling myself thinking I can find peace while unemployed.

During sitting, I noticed how the anxiety manifests physically. Tight chest, shallow breathing. Instead of pushing it away, I tried to observe it with curiosity. "Ah, dukkha. Here you are again, old friend."

The Buddha taught that suffering comes from attachment to outcomes. Easy to understand intellectually. Much harder when your bank account is dwindling and society measures your worth by your productivity.

Applied to three more positions today. Each application feels like casting a message in a bottle into an ocean of algorithms. But I'm trying to hold it lightly - do the work, release the results.

Evening reflection: Maybe the real practice isn't finding a job. Maybe it's learning to be okay with uncertainty.`,
        mood: 'contemplative',
        practices: ['20 min morning meditation', 'Mindful job searching', 'Evening reflection'],
        insights: ['Anxiety as teacher', 'Non-attachment to outcomes', 'Uncertainty as practice ground'],
        gratitude: ['Roof over head', 'Meditation cushion', 'Friend who checked in'],
        struggles: ['Financial anxiety', 'Self-worth tied to employment', 'Restless mind']
      },
      {
        id: '2',
        date: '2024-01-16',
        title: 'Compassion Practice at the Food Bank',
        content: `Volunteered at the food bank today. Initially went because I have time and wanted to feel useful. Left with a deeper understanding of interconnectedness.

Met Maria, a single mother working two jobs who still needs food assistance. Her dignity, her gratitude, her strength - it shattered my assumptions about poverty and worthiness.

I realized I've been practicing a subtle form of spiritual materialism. "Look at me, the unemployed guy who volunteers." But true compassion isn't about feeling good about yourself. It's about recognizing that there's no real separation between giver and receiver.

The Buddha spoke of metta - loving-kindness. Today I felt it not as a practice I do, but as recognition of what already is. We're all just trying to get by, all deserving of care.

Came home and sat for 30 minutes. The meditation felt different - less about fixing myself, more about opening to what's here.`,
        mood: 'grateful',
        practices: ['Volunteer service', '30 min evening meditation', 'Metta practice'],
        insights: ['Interconnectedness in action', 'Spiritual materialism trap', 'Compassion as recognition'],
        gratitude: ['Opportunity to serve', 'Maria\'s teaching', 'Expanded heart'],
        struggles: ['Ego in service', 'Assumptions about others']
      }
    ],
    'buddha-static': [
      {
        id: '1',
        date: '2024-01-15',
        title: 'Teaching in the Park',
        content: `A young man approached me today while I sat beneath the oak tree. His eyes carried the weight of modern suffering - the endless scroll, the comparison trap, the hunger for more that never satisfies.

"Teacher," he said, "how do I find peace in this chaotic world?"

I smiled and pointed to the tree above us. "Does this oak struggle against the wind, or does it bend and remain rooted?"

We sat together in silence. After some time, he began to see. Peace is not the absence of chaos - it is the deep knowing that you are not separate from the dance of existence.

The dharma teaches itself through every moment, every encounter. I am simply here to point toward what is already present.`,
        mood: 'serene',
        practices: ['Silent presence', 'Dharma teaching', 'Mindful observation'],
        insights: ['Peace within chaos', 'Teaching through being', 'Natural wisdom'],
        gratitude: ['Student\'s openness', 'Oak tree teacher', 'Present moment'],
        struggles: []
      }
    ],
    'jesus-dynamic': [
      {
        id: '1',
        date: '2024-01-15',
        title: 'Burnout and Boundaries',
        content: `Another 12-hour day at the shelter. Mrs. Rodriguez came in again - third time this week. Her son is using again, and she's caught between enabling and abandoning him.

I wanted to take her pain away, to fix everything. But I'm learning that love sometimes means sitting with someone in their suffering rather than trying to rescue them from it.

Jesus withdrew to pray. I used to think that was selfish - how could he step away when people needed him? Now I understand. You can't pour from an empty cup. Even infinite love needs to flow through finite vessels.

Prayed the rosary on the bus home. "Hail Mary, full of grace..." The repetition quieted my racing thoughts about all the people I couldn't help today.

Tomorrow I'll show up again. Not because I can save everyone, but because love calls us to be present, even when - especially when - we feel inadequate.`,
        mood: 'weary but hopeful',
        practices: ['Rosary prayer', 'Contemplative service', 'Setting boundaries'],
        insights: ['Love includes limits', 'Presence over fixing', 'Self-care as service'],
        gratitude: ['Mrs. Rodriguez\'s trust', 'Coworkers\' support', 'Safe bus ride home'],
        struggles: ['Savior complex', 'Emotional exhaustion', 'Guilt over boundaries']
      }
    ],
    'jesus-static': [
      {
        id: '1',
        date: '2024-01-15',
        title: 'Building and Blessing',
        content: `Today I worked on the Martinez family's kitchen renovation. Their old cabinets were falling apart, and they couldn't afford a contractor.

As I measured and cut, I thought about how building with your hands is a form of prayer. Each nail driven with intention, each joint fitted with care. The work itself becomes worship.

Little Sofia watched me work, asking endless questions. "Why do you help us for free?" she asked.

"Because love isn't something you keep," I told her. "It's something you give away."

Her mother wept when she saw the finished kitchen. Not just because of the cabinets, but because someone saw their need and responded. In that moment, the kingdom of heaven was present in a small apartment in East LA.

This is the gospel: God's love made tangible through human hands, human presence, human care.`,
        mood: 'peaceful',
        practices: ['Manual labor as prayer', 'Presence with family', 'Incarnational love'],
        insights: ['Work as worship', 'Love multiplies when shared', 'Kingdom in ordinary moments'],
        gratitude: ['Skilled hands', 'Martinez family\'s welcome', 'Sofia\'s curiosity'],
        struggles: []
      }
    ]
  };

  // Auto-select first entry when philosopher changes
  useEffect(() => {
    const entries = journalEntries[selectedPhilosopher.id] || [];
    if (entries.length > 0) {
      setSelectedEntry(entries[0].id);
    } else {
      setSelectedEntry(null);
    }
  }, [selectedPhilosopher.id]);

  const currentEntries = journalEntries[selectedPhilosopher.id] || [];

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
              Explore the inner lives of philosophers navigating modern challenges while staying true to ancient wisdom
            </p>
          </motion.div>

          {/* Main Content - Entry First Design */}
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
                    const entry = currentEntries.find(e => e.id === selectedEntry) || currentEntries[0];
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
                            Select a different philosopher to see their journal entries
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
                              src={selectedPhilosopher.avatar}
                              alt={selectedPhilosopher.name}
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
                                    {new Date(entry.date).toLocaleDateString()}
                                  </span>
                                </div>
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

                        {/* Entry Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <CheckCircle style={{ color: theme.colors.success }} size={16} />
                              Practices
                            </h4>
                            <div className="space-y-2">
                              {entry.practices.map((practice, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div 
                                    style={{
                                      width: '0.5rem',
                                      height: '0.5rem',
                                      backgroundColor: theme.colors.success,
                                      borderRadius: '50%',
                                    }}
                                  />
                                  <span 
                                    style={{
                                      color: theme.colors.textSecondary,
                                      fontSize: theme.typography.fontSize.sm,
                                    }}
                                  >
                                    {practice}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

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
                              <Brain style={{ color: theme.colors.primary }} size={16} />
                              Insights
                            </h4>
                            <div className="space-y-2">
                              {entry.insights.map((insight, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div 
                                    style={{
                                      width: '0.5rem',
                                      height: '0.5rem',
                                      backgroundColor: theme.colors.primary,
                                      borderRadius: '50%',
                                    }}
                                  />
                                  <span 
                                    style={{
                                      color: theme.colors.textSecondary,
                                      fontSize: theme.typography.fontSize.sm,
                                    }}
                                  >
                                    {insight}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

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
                              <Sparkles style={{ color: '#F59E0B' }} size={16} />
                              Gratitude
                            </h4>
                            <div className="space-y-2">
                              {entry.gratitude.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div 
                                    style={{
                                      width: '0.5rem',
                                      height: '0.5rem',
                                      backgroundColor: '#F59E0B',
                                      borderRadius: '50%',
                                    }}
                                  />
                                  <span 
                                    style={{
                                      color: theme.colors.textSecondary,
                                      fontSize: theme.typography.fontSize.sm,
                                    }}
                                  >
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {entry.struggles.length > 0 && (
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
                                <AlertTriangle style={{ color: theme.colors.error }} size={16} />
                                Struggles
                              </h4>
                              <div className="space-y-2">
                                {entry.struggles.map((struggle, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div 
                                      style={{
                                        width: '0.5rem',
                                        height: '0.5rem',
                                        backgroundColor: theme.colors.error,
                                        borderRadius: '50%',
                                      }}
                                    />
                                    <span 
                                      style={{
                                        color: theme.colors.textSecondary,
                                        fontSize: theme.typography.fontSize.sm,
                                      }}
                                    >
                                      {struggle}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              {/* Character Selector */}
              <div className="mb-6">
                <h3 
                  style={{
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  Philosophers
                </h3>
                <div className="space-y-3">
                  {philosophers.map((philosopher) => (
                    <motion.button
                      key={philosopher.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedPhilosopher(philosopher);
                        setSelectedEntry(null); // Reset entry selection
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        ...styles.glass.light,
                        border: selectedPhilosopher.id === philosopher.id 
                          ? `2px solid ${theme.colors.primary}` 
                          : `1px solid ${theme.colors.border}`,
                        borderRadius: '0.75rem',
                        padding: theme.semanticSpacing.md,
                        cursor: 'pointer',
                        transition: theme.animations.transition.normal,
                        backgroundColor: selectedPhilosopher.id === philosopher.id 
                          ? theme.utils.alpha(theme.colors.primary, 0.05)
                          : 'transparent',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={philosopher.avatar}
                          alt={philosopher.name}
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
                            {philosopher.name}
                          </div>
                          <div 
                            style={{
                              color: theme.colors.textSecondary,
                              fontSize: theme.typography.fontSize.xs,
                            }}
                          >
                            {philosopher.type === 'dynamic' ? 'Modern Context' : 'Timeless Wisdom'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles 
                            style={{ 
                              color: philosopher.type === 'dynamic' ? '#F59E0B' : theme.colors.success 
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
                  {currentEntries.map((entry) => (
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
                          {new Date(entry.date).toLocaleDateString()}
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
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PhilosophyDashboard;