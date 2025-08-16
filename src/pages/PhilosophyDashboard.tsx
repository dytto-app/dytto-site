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
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
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

  const currentEntries = journalEntries[selectedPhilosopher.id] || [];

  const getDriftAlertColor = (alert: string) => {
    switch (alert) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-green-500';
    }
  };

  const getFinancialStateColor = (state: string) => {
    switch (state) {
      case 'struggling': return 'text-red-500';
      case 'stable': return 'text-yellow-500';
      case 'comfortable': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Brain className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Philosophy Journal
            </h1>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore the inner lives of philosophers navigating modern challenges while staying true to ancient wisdom
          </p>
        </div>

        {/* Character Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {philosophers.map((philosopher) => (
            <motion.div
              key={philosopher.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPhilosopher(philosopher)}
              className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
                selectedPhilosopher.id === philosopher.id
                  ? 'bg-white dark:bg-gray-800 shadow-lg ring-2 ring-indigo-500'
                  : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={philosopher.avatar}
                  alt={philosopher.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {philosopher.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {philosopher.displayName}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {philosopher.modernContext.occupation}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${philosopher.type === 'dynamic' ? 'text-yellow-500' : 'text-green-500'}`} />
                  <span className="text-gray-600 dark:text-gray-300 capitalize">
                    {philosopher.authenticityLevel}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Character Details */}
        <motion.div
          key={selectedPhilosopher.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-start gap-6 mb-6">
            <img
              src={selectedPhilosopher.avatar}
              alt={selectedPhilosopher.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedPhilosopher.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedPhilosopher.displayName} • {selectedPhilosopher.tradition.charAt(0).toUpperCase() + selectedPhilosopher.tradition.slice(1)} Tradition
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Context</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Age {selectedPhilosopher.modernContext.age} • {selectedPhilosopher.modernContext.location}
                  </p>
                  <p className={`text-sm font-medium ${getFinancialStateColor(selectedPhilosopher.modernContext.financialState)}`}>
                    {selectedPhilosopher.modernContext.financialState.charAt(0).toUpperCase() + selectedPhilosopher.modernContext.financialState.slice(1)}
                  </p>
                </div>
                
                {selectedPhilosopher.modernContext.currentStruggles.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Current Struggles</h4>
                    <div className="space-y-1">
                      {selectedPhilosopher.modernContext.currentStruggles.map((struggle, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{struggle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Journey Stage</h4>
                  <div className="flex items-center gap-2">
                    <Sparkles className={`w-4 h-4 ${selectedPhilosopher.authenticityLevel === 'seeking' ? 'text-yellow-500' : 'text-green-500'}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {selectedPhilosopher.authenticityLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Journal Entries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Entry List */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Entries
            </h3>
            <div className="space-y-3">
              {currentEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedEntry(entry.id)}
                  className={`cursor-pointer rounded-lg p-4 transition-all duration-200 ${
                    selectedEntry === entry.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-700'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {entry.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {entry.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      entry.mood === 'contemplative' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      entry.mood === 'grateful' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      entry.mood === 'weary but hopeful' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {entry.mood}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Entry Detail */}
          <div className="lg:col-span-2">
            {selectedEntry ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
              >
                {(() => {
                  const entry = currentEntries.find(e => e.id === selectedEntry);
                  if (!entry) return null;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {entry.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                            <span className={`px-2 py-1 rounded-full ${
                              entry.mood === 'contemplative' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                              entry.mood === 'grateful' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                              entry.mood === 'weary but hopeful' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            }`}>
                              {entry.mood}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="prose dark:prose-invert max-w-none mb-8">
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {entry.content}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Practices
                          </h4>
                          <div className="space-y-2">
                            {entry.practices.map((practice, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{practice}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-500" />
                            Insights
                          </h4>
                          <div className="space-y-2">
                            {entry.insights.map((insight, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{insight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            Gratitude
                          </h4>
                          <div className="space-y-2">
                            {entry.gratitude.map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {entry.struggles.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              Struggles
                            </h4>
                            <div className="space-y-2">
                              {entry.struggles.map((struggle, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                                  <span className="text-sm text-gray-600 dark:text-gray-300">{struggle}</span>
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
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Journal Entry
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose an entry from the list to read {selectedPhilosopher.name}'s reflections
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PhilosophyDashboard;