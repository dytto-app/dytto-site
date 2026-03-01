import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Play, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useAuth } from './AuthProvider';

const codeExamples: Record<string, string> = {
  observe: `// Push observations to learn about your user (low effort!)
// Auth: API Key with scope "observe"
const response = await fetch('https://api.dytto.app/api/v1/observe', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer dyt_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: "User mentioned their sister Ananya lives in the UK",
    source: "my-agent"  // identify your agent
  })
});

const { facts_extracted, stored } = await response.json();
// facts_extracted: [
//   { "text": "User has a sister named Ananya", "categories": ["family"] },
//   { "text": "Ananya lives in the UK", "categories": ["family", "places"] }
// ]`,

  scope: `// Get only the context relevant to your task
// Auth: API Key with domain scopes (location, preferences, etc.)
const response = await fetch('https://api.dytto.app/api/context/scope', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer dyt_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    task: "Drive user home from work, optimize route and climate",
    agent_type: "robotaxi",
    max_tokens: 2000
  })
});

const { context, categories_used, token_count } = await response.json();
// context.relevant_facts: [{ category: "places", fact: "Lives in Cambridge, MA" }]
// context.preferences: ["Prefers quiet rides", "Temperature at 68°F"]`,

  context: `// Fetch full user context for your AI agent
// Auth: API Key with scope "context:read"
const response = await fetch('https://api.dytto.app/api/agent/context?user_id=USER_UUID', {
  headers: {
    'Authorization': 'Bearer dyt_your_api_key'
  }
});

const { content, user_id } = await response.json();
// content: "Ayaan is a software engineer in Cambridge, MA..."

// Use in your AI's system prompt:
const aiResponse = await yourLLM.chat({
  messages: [
    { role: 'system', content: \`User context: \${content}\` },
    { role: 'user', content: 'Recommend a coffee shop nearby' }
  ]
});`
};

type TabId = 'observe' | 'scope' | 'context';

const APIShowcase = () => {
  const [activeTab, setActiveTab] = useState<TabId>('observe');
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetApiKey = () => {
    navigate(user ? '/settings/api-keys' : '/login');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: TabId; label: string; description: string }[] = [
    { id: 'observe', label: 'Observe API', description: 'Push any data, Dytto extracts facts automatically' },
    { id: 'scope', label: 'Scoped Context', description: 'Task-based retrieval — only relevant context' },
    { id: 'context', label: 'Agent Context', description: 'Full context for AI-powered personalization' }
  ];

  return (
    <section id="api" style={styles.bg.tertiary} className="py-16 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 
            style={{
              ...styles.typography.h1,
              color: theme.colors.text,
              marginBottom: theme.semanticSpacing.lg,
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            Developer-first{' '}
            <motion.span 
              key={`api-gradient-${theme.mode}`}
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
              API design
            </motion.span>
          </h2>
          <p 
            style={{
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            RESTful APIs with comprehensive OAuth 2.0 security, detailed documentation, 
            and SDKs for popular languages. Start building in minutes.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                    borderRadius: '0.75rem',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: theme.animations.transition.normal,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    ...(activeTab === tab.id
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
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = theme.colors.surfaceSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = theme.colors.surface;
                    }
                  }}
                >
                  <div 
                    className="font-medium"
                    style={{
                      color: 'inherit',
                    }}
                  >
                    {tab.label}
                  </div>
                  <div 
                    className="text-xs mt-1 opacity-80 hidden sm:block"
                    style={{ 
                      color: 'inherit',
                      opacity: 0.7,
                    }}
                  >
                    {tab.description}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Code Example - Mobile Optimized */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              ...styles.glass.medium,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1rem',
              overflow: 'hidden',
            }}
          >
            <div 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 space-y-3 sm:space-y-0"
              style={{ 
                borderBottom: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.surface,
              }}
            >
              <div className="flex items-center space-x-3">
                <Code style={{ color: theme.colors.primary }} size={20} />
                <div>
                  <h3 style={{ ...styles.typography.h6, color: theme.colors.text }}>
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h3>
                  <p 
                    className="block sm:hidden"
                    style={{ 
                      ...styles.typography.caption, 
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.xs,
                    }}
                  >
                    {tabs.find(t => t.id === activeTab)?.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyToClipboard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.semanticSpacing.sm,
                    backgroundColor: theme.colors.surfaceSecondary,
                    color: theme.colors.textSecondary,
                    padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                    borderRadius: '0.5rem',
                    fontSize: theme.typography.fontSize.sm,
                    transition: theme.animations.transition.normal,
                    border: 'none',
                    cursor: 'pointer',
                    flex: '1',
                    justifyContent: 'center',
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.semanticSpacing.sm,
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                    padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                    borderRadius: '0.5rem',
                    fontSize: theme.typography.fontSize.sm,
                    transition: theme.animations.transition.normal,
                    border: 'none',
                    cursor: 'pointer',
                    flex: '1',
                    justifyContent: 'center',
                  }}
                >
                  <Play size={16} />
                  <span>Try it</span>
                </button>
              </div>
            </div>
            
            <div 
              style={{ 
                padding: theme.semanticSpacing.md,
                backgroundColor: '#000000', // Pure black background for code
                borderRadius: '0 0 1rem 1rem',
              }}
            >
              <div className="overflow-x-auto">
                <pre 
                  style={{
                    color: '#E5E7EB', // Light gray text for good contrast on black
                    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                    fontFamily: theme.typography.fontFamily.mono,
                    margin: 0,
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    minWidth: '100%',
                  }}
                >
                  <code>{codeExamples[activeTab]}</code>
                </pre>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8 sm:mt-12"
          >
            <div 
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.semanticSpacing.md,
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1rem',
                padding: theme.semanticSpacing.lg,
                width: '100%',
                maxWidth: '24rem',
              }}
            >
              <div style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm }}>
                Ready to start building?
              </div>
              <button 
                onClick={handleGetApiKey}
                style={{
                  ...styles.button.primary,
                  width: '100%',
                  maxWidth: '200px',
                }}
              >
                Get API Key
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default APIShowcase;