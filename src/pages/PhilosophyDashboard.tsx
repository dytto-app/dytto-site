import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  User, 
  MapPin, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Lotus,
  Cross,
  Filter,
  Search
} from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  location: string;
  weather: string;
  philosophicalInsight?: string;
  practiceNotes?: string;
  gratitude?: string[];
  struggles?: string[];
  characterId: string;
}

interface PhilosopherCharacter {
  id: string;
  name: string;
  displayName: string;
  tradition: 'buddhist' | 'christian' | 'stoic' | 'sufi';
  type: 'dynamic' | 'static';
  description: string;
  avatar: string;
  color: string;
  icon: React.ComponentType<any>;
}

const characters: PhilosopherCharacter[] = [
  {
    id: 'buddha-dynamic',
    name: 'Siddhartha Chen',
    displayName: 'Modern Buddha',
    tradition: 'buddhist',
    type: 'dynamic',
    description: '34-year-old former tech worker navigating unemployment while applying Buddhist principles to modern life',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: '#F59E0B',
    icon: Lotus
  },
  {
    id: 'jesus-dynamic',
    name: 'Emmanuel Santos',
    displayName: 'Modern Jesus',
    tradition: 'christian',
    type: 'dynamic',
    description: '33-year-old social worker learning to balance radical love with practical boundaries',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: '#3B82F6',
    icon: Cross
  }
];

// Mock journal entries for demo
const mockEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    title: 'The Attachment to Job Applications',
    content: `Woke up at 6 AM to the familiar knot in my stomach - that tight feeling that comes with checking my phone for job responses that haven't come. I noticed how my mind immediately went to the story: "I'm failing, I'm not good enough, I'll never find work."

But then I remembered the teaching about dukkha - this suffering isn't the situation itself, it's my attachment to outcomes I can't control. I spent 20 minutes in meditation, watching these anxious thoughts arise and pass away like clouds.

Applied to three more positions today. Each time I hit "submit," I practiced letting go. The application is sent - what happens next is not in my hands. This is harder than it sounds when rent is due in two weeks.

Had coffee with Maria, who's also job hunting. Instead of our usual complaint session, we talked about what we're learning about ourselves in this uncertainty. She said I seem calmer lately, which surprised me. Maybe the practice is working, even when I can't feel it.

Evening reflection: Suffering comes from wanting things to be different than they are. But I can still take skillful action while holding outcomes lightly. Tomorrow I'll apply to more jobs, not from desperation, but from a place of engaged non-attachment.`,
    mood: 'Contemplative',
    location: 'Home, San Francisco',
    weather: 'Foggy morning, clearing afternoon',
    philosophicalInsight: 'Practicing non-attachment to job search outcomes while maintaining skillful effort',
    practiceNotes: '20 minutes morning meditation, loving-kindness practice during coffee',
    gratitude: ['Maria\'s friendship', 'Roof over my head', 'The teaching of impermanence'],
    struggles: ['Financial anxiety', 'Attachment to career identity'],
    characterId: 'buddha-dynamic'
  },
  {
    id: '2',
    date: '2024-01-14',
    title: 'Anger at the Grocery Store',
    content: `The checkout line was moving slowly, and I felt that familiar heat rising in my chest when the person ahead of me was arguing about a coupon. My first thought was judgment - "Why can't they just accept it and move on?"

Then I caught myself. Here I am, getting angry about someone else's anger. The irony wasn't lost on me.

I took three deep breaths and tried to see the situation clearly. The customer was probably struggling financially - that coupon might matter more than I realize. The cashier was just doing their job, caught between policy and compassion. And me? I was creating suffering for myself over something that would add maybe two minutes to my day.

I used the extra time to practice metta - sending loving-kindness to everyone in the store. By the time I reached the cashier, I was genuinely smiling. I thanked her for her patience with difficult situations.

Walking home, I reflected on how quickly the mind creates stories about "other people" and "their problems" when really, we're all just trying to get by. The person with the coupon, the tired cashier, the impatient customer behind me - we're all in this together, all experiencing the same fundamental human struggles.

The Buddha taught that anger is like grasping a hot coal to throw at someone else - you're the one who gets burned. Today I managed to put the coal down before it burned me.`,
    mood: 'Peaceful',
    location: 'Grocery store, then home',
    weather: 'Sunny afternoon',
    philosophicalInsight: 'Anger arises from attachment to how we think things should be',
    practiceNotes: 'Metta meditation in checkout line, mindful walking home',
    gratitude: ['The teaching on anger', 'Patient cashier', 'Opportunity to practice'],
    struggles: ['Quick judgment of others', 'Impatience with delays'],
    characterId: 'buddha-dynamic'
  },
  {
    id: '3',
    date: '2024-01-13',
    title: 'The Rejection Email',
    content: `Got another rejection email today. This one stung because I really thought I had a chance - the interview went well, they seemed interested, I could picture myself in the role.

For about an hour, I let myself feel the disappointment fully. Not trying to spiritualize it away or immediately jump to "everything happens for a reason." Just sitting with the raw feeling of not being chosen, of doors closing, of uncertainty stretching ahead.

But then something interesting happened. As I sat with the disappointment without trying to fix it or escape it, it began to transform. I started seeing how much of my suffering was coming from the story I was telling myself: "I'm not good enough," "I'll never find work," "I'm a failure."

These are just thoughts. Painful ones, but still just mental formations arising and passing away.

I remembered the teaching about the second arrow - the first arrow is the rejection (unavoidable), the second arrow is all the stories I tell myself about what it means (optional). I can't control whether companies hire me, but I can choose not to shoot myself with the second arrow.

Spent the evening updating my resume and researching new opportunities. Not from a place of desperate grasping, but from engaged effort. There's a difference, though it's subtle.

The path continues. Each rejection is just another step, not a verdict on my worth.`,
    mood: 'Resilient',
    location: 'Home office',
    weather: 'Rainy day',
    philosophicalInsight: 'The second arrow of suffering is optional - we create additional pain through our stories',
    practiceNotes: 'Sitting with difficult emotions without trying to escape them',
    gratitude: ['The teaching on the second arrow', 'Resilience I didn\'t know I had'],
    struggles: ['Identity attachment to career success', 'Fear of financial insecurity'],
    characterId: 'buddha-dynamic'
  }
];

const PhilosophyDashboard: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const [selectedCharacter, setSelectedCharacter] = useState<string>('buddha-dynamic');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);
  const [loading, setLoading] = useState(false);

  const currentCharacter = characters.find(c => c.id === selectedCharacter);
  const characterEntries = entries.filter(e => e.characterId === selectedCharacter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTraditionIcon = (tradition: string) => {
    switch (tradition) {
      case 'buddhist': return Lotus;
      case 'christian': return Cross;
      default: return Sparkles;
    }
  };

  const getTraditionColor = (tradition: string) => {
    switch (tradition) {
      case 'buddhist': return '#F59E0B';
      case 'christian': return '#3B82F6';
      default: return '#8B5CF6';
    }
  };

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          
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
              Philosophy{' '}
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
                Journal
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
              Experience how Dytto captures the inner life of philosophers navigating modern challenges
            </p>
          </motion.div>

          {/* Character Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {characters.map((character) => {
                const TraditionIcon = getTraditionIcon(character.tradition);
                const isSelected = selectedCharacter === character.id;
                
                return (
                  <motion.button
                    key={character.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCharacter(character.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.semanticSpacing.sm,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '1rem',
                      border: `2px solid ${isSelected ? character.color : theme.colors.border}`,
                      backgroundColor: isSelected 
                        ? theme.utils.alpha(character.color, 0.1) 
                        : theme.colors.surface,
                      color: theme.colors.text,
                      cursor: 'pointer',
                      transition: theme.animations.transition.normal,
                      minWidth: '200px',
                      textAlign: 'left',
                    }}
                  >
                    <img 
                      src={character.avatar}
                      alt={character.name}
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                    <div className="flex-1">
                      <div style={{ 
                        fontWeight: theme.typography.fontWeight.semibold,
                        fontSize: theme.typography.fontSize.sm,
                        marginBottom: '2px',
                      }}>
                        {character.name}
                      </div>
                      <div style={{ 
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.textSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <TraditionIcon size={12} style={{ color: character.color }} />
                        {character.tradition} • {character.type}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Character Info Card */}
          {currentCharacter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.25rem',
                padding: theme.semanticSpacing.lg,
                marginBottom: theme.semanticSpacing.lg,
              }}
            >
              <div className="flex items-start gap-4">
                <img 
                  src={currentCharacter.avatar}
                  alt={currentCharacter.name}
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '1rem',
                    objectFit: 'cover',
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 style={{ 
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.xl,
                      fontWeight: theme.typography.fontWeight.semibold,
                    }}>
                      {currentCharacter.name}
                    </h2>
                    <span style={{
                      backgroundColor: theme.utils.alpha(currentCharacter.color, 0.1),
                      color: currentCharacter.color,
                      padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                      borderRadius: '9999px',
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                    }}>
                      {currentCharacter.type}
                    </span>
                  </div>
                  <p style={{ 
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    lineHeight: '1.5',
                    marginBottom: theme.semanticSpacing.sm,
                  }}>
                    {currentCharacter.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} style={{ color: theme.colors.textSecondary }} />
                      <span style={{ color: theme.colors.textSecondary }}>
                        {currentCharacter.id === 'buddha-dynamic' ? 'San Francisco, CA' : 'Los Angeles, CA'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} style={{ color: theme.colors.textSecondary }} />
                      <span style={{ color: theme.colors.textSecondary }}>
                        {currentCharacter.id === 'buddha-dynamic' ? 'Former Tech Worker' : 'Social Worker'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Journal Entries List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 style={{ 
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                marginBottom: theme.semanticSpacing.md,
              }}>
                Recent Entries
              </h3>
              
              {characterEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedEntry(entry)}
                  style={{
                    ...styles.glass.light,
                    border: `1px solid ${selectedEntry?.id === entry.id ? currentCharacter?.color : theme.colors.border}`,
                    borderRadius: '1rem',
                    padding: theme.semanticSpacing.md,
                    cursor: 'pointer',
                    transition: theme.animations.transition.normal,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div style={{ 
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.textSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <Calendar size={12} />
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <div style={{
                      backgroundColor: theme.utils.alpha(currentCharacter?.color || theme.colors.primary, 0.1),
                      color: currentCharacter?.color || theme.colors.primary,
                      padding: `2px ${theme.semanticSpacing.xs}`,
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: theme.typography.fontWeight.medium,
                    }}>
                      {entry.mood}
                    </div>
                  </div>
                  
                  <h4 style={{ 
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    marginBottom: theme.semanticSpacing.xs,
                    lineHeight: '1.3',
                  }}>
                    {entry.title}
                  </h4>
                  
                  <p style={{ 
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.xs,
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {entry.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Selected Entry Detail */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {selectedEntry ? (
                  <motion.div
                    key={selectedEntry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      ...styles.glass.light,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '1.25rem',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Entry Header */}
                    <div 
                      style={{
                        background: `linear-gradient(135deg, ${theme.utils.alpha(currentCharacter?.color || theme.colors.primary, 0.1)}, ${theme.utils.alpha(currentCharacter?.color || theme.colors.primary, 0.05)})`,
                        padding: theme.semanticSpacing.lg,
                        borderBottom: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 style={{ 
                            color: theme.colors.text,
                            fontSize: theme.typography.fontSize.xl,
                            fontWeight: theme.typography.fontWeight.bold,
                            marginBottom: theme.semanticSpacing.xs,
                            lineHeight: '1.3',
                          }}>
                            {selectedEntry.title}
                          </h2>
                          <div style={{ 
                            color: theme.colors.textSecondary,
                            fontSize: theme.typography.fontSize.sm,
                          }}>
                            {formatDate(selectedEntry.date)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {currentCharacter && (
                            <div style={{
                              backgroundColor: theme.utils.alpha(currentCharacter.color, 0.1),
                              color: currentCharacter.color,
                              padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                              borderRadius: '9999px',
                              fontSize: theme.typography.fontSize.xs,
                              fontWeight: theme.typography.fontWeight.medium,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}>
                              <currentCharacter.icon size={12} />
                              {selectedEntry.mood}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} style={{ color: theme.colors.textSecondary }} />
                          <span style={{ color: theme.colors.textSecondary }}>
                            {selectedEntry.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={12} style={{ color: theme.colors.textSecondary }} />
                          <span style={{ color: theme.colors.textSecondary }}>
                            {selectedEntry.weather}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Entry Content */}
                    <div style={{ padding: theme.semanticSpacing.lg }}>
                      <div 
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.fontSize.base,
                          lineHeight: '1.7',
                          marginBottom: theme.semanticSpacing.lg,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {selectedEntry.content}
                      </div>

                      {/* Philosophical Insight */}
                      {selectedEntry.philosophicalInsight && (
                        <div 
                          style={{
                            backgroundColor: theme.utils.alpha(currentCharacter?.color || theme.colors.primary, 0.05),
                            border: `1px solid ${theme.utils.alpha(currentCharacter?.color || theme.colors.primary, 0.2)}`,
                            borderRadius: '0.75rem',
                            padding: theme.semanticSpacing.md,
                            marginBottom: theme.semanticSpacing.md,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} style={{ color: currentCharacter?.color }} />
                            <span style={{ 
                              color: theme.colors.text,
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.semibold,
                            }}>
                              Philosophical Insight
                            </span>
                          </div>
                          <p style={{ 
                            color: theme.colors.textSecondary,
                            fontSize: theme.typography.fontSize.sm,
                            lineHeight: '1.5',
                            fontStyle: 'italic',
                          }}>
                            {selectedEntry.philosophicalInsight}
                          </p>
                        </div>
                      )}

                      {/* Practice Notes */}
                      {selectedEntry.practiceNotes && (
                        <div 
                          style={{
                            backgroundColor: theme.colors.surface,
                            borderRadius: '0.75rem',
                            padding: theme.semanticSpacing.md,
                            marginBottom: theme.semanticSpacing.md,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={16} style={{ color: theme.colors.textSecondary }} />
                            <span style={{ 
                              color: theme.colors.text,
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.semibold,
                            }}>
                              Practice Notes
                            </span>
                          </div>
                          <p style={{ 
                            color: theme.colors.textSecondary,
                            fontSize: theme.typography.fontSize.sm,
                            lineHeight: '1.5',
                          }}>
                            {selectedEntry.practiceNotes}
                          </p>
                        </div>
                      )}

                      {/* Gratitude & Struggles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedEntry.gratitude && selectedEntry.gratitude.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Heart size={16} style={{ color: theme.colors.success }} />
                              <span style={{ 
                                color: theme.colors.text,
                                fontSize: theme.typography.fontSize.sm,
                                fontWeight: theme.typography.fontWeight.semibold,
                              }}>
                                Gratitude
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {selectedEntry.gratitude.map((item, index) => (
                                <li 
                                  key={index}
                                  style={{ 
                                    color: theme.colors.textSecondary,
                                    fontSize: theme.typography.fontSize.sm,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <div style={{
                                    width: '4px',
                                    height: '4px',
                                    backgroundColor: theme.colors.success,
                                    borderRadius: '50%',
                                  }} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {selectedEntry.struggles && selectedEntry.struggles.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle size={16} style={{ color: theme.colors.warning }} />
                              <span style={{ 
                                color: theme.colors.text,
                                fontSize: theme.typography.fontSize.sm,
                                fontWeight: theme.typography.fontWeight.semibold,
                              }}>
                                Current Struggles
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {selectedEntry.struggles.map((item, index) => (
                                <li 
                                  key={index}
                                  style={{ 
                                    color: theme.colors.textSecondary,
                                    fontSize: theme.typography.fontSize.sm,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <div style={{
                                    width: '4px',
                                    height: '4px',
                                    backgroundColor: theme.colors.warning,
                                    borderRadius: '50%',
                                  }} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      ...styles.glass.light,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '1.25rem',
                      padding: theme.semanticSpacing.xl,
                      textAlign: 'center',
                    }}
                  >
                    <BookOpen size={48} style={{ 
                      color: theme.colors.textSecondary, 
                      margin: '0 auto', 
                      marginBottom: theme.semanticSpacing.md 
                    }} />
                    <h3 style={{ 
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      marginBottom: theme.semanticSpacing.sm,
                    }}>
                      Select a journal entry
                    </h3>
                    <p style={{ 
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.sm,
                    }}>
                      Choose an entry from the list to read the full philosophical reflection
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Demo Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              ...styles.glass.light,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1rem',
              padding: theme.semanticSpacing.lg,
              marginTop: theme.semanticSpacing.lg,
              textAlign: 'center',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles size={20} style={{ color: theme.colors.primary }} />
              <span style={{ 
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
              }}>
                Powered by Dytto's Context Platform
              </span>
            </div>
            <p style={{ 
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.sm,
              lineHeight: '1.5',
              maxWidth: '48rem',
              margin: '0 auto',
            }}>
              This demonstrates how Dytto captures and transforms daily experiences into meaningful narratives. 
              Each journal entry is generated from real context data, showing how AI can understand and reflect 
              the deeper patterns in human experience.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PhilosophyDashboard;