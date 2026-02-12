import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Book, Key, Shield, Zap, Server, AlertTriangle, Gauge, 
  ChevronDown, ChevronRight, Copy, Check, ExternalLink,
  Code, Terminal, Menu, X, FileText, Cpu, ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

// ============================================================
// Endpoint Data (from APIDocumentation.tsx)
// ============================================================
const endpoints = {
  simulation: {
    id: 'simulation',
    title: "Simulation Agents",
    description: "Generate anonymized user personas for research and testing",
    method: "POST",
    path: "/v1/simulation-contexts/request",
    auth: "OAuth 2.0 Client Credentials",
    scope: "simulation:generate_profiles",
    rateLimit: "10 requests / 60 seconds",
    category: "platform",
    example: `const response = await fetch('https://api.dytto.app/v1/simulation-contexts/request', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_OAUTH_ACCESS_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    experiment_id: "user_research_2026",
    num_agents_requested: 50,
    anonymization_level: "high",
    profile_criteria: [{
      count: 50,
      demographics_desired: {
        age_group: ["25-34", "35-44"],
        location_type: ["urban"]
      }
    }],
    requested_profile_fields: {
      dytto_standard_demographics: { age: true, education_level_derived: true },
      dytto_standard_narrative_summary: { include: true, length: "medium" },
      custom_fields: [{
        field_name: "tech_adoption_score",
        description_for_llm: "Rate user's technology adoption tendency 1-10",
        desired_format: "integer"
      }]
    }
  })
});

const { generated_agent_profiles } = await response.json();`,
    response: `{
  "request_id": "uuid",
  "status": "COMPLETED",
  "generated_agent_profiles": [{
    "dytto_agent_persona_id": "uuid",
    "matched_criteria_set_index": 0,
    "profile_data": {
      "dytto_standard_demographics": { "age": 32, "education_level_derived": "university" },
      "dytto_standard_narrative_summary": "A tech-forward urban professional...",
      "custom_fields": { "tech_adoption_score": 8 }
    }
  }]
}`
  },
  
  interact: {
    id: 'interact',
    title: "Persona Interaction",
    description: "Make Dytto respond AS a user persona, grounded in their real context",
    method: "POST",
    path: "/v1/personas/{persona_id}/interact",
    auth: "User JWT",
    rateLimit: "30 requests / 60 seconds",
    category: "platform",
    example: `const response = await fetch('https://api.dytto.app/v1/personas/USER_ID/interact', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer USER_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: {
      type: "freeform_chat",
      instruction: "What kind of restaurants do you like?",
      scenario: "An AI assistant is helping find dinner options"
    },
    output_directives: {
      format: "text",
      include_rationale: false
    },
    session_id: "optional-session-for-multi-turn",
    save_history: true
  })
});

const { parsed_response, session_id } = await response.json();`,
    response: `{
  "persona_id": "user-uuid",
  "parsed_response": "I love Indian food, especially from places in Cambridge...",
  "raw_response_text": "...",
  "session_id": "session-uuid",
  "dytto_metadata": {
    "context_version_used": "2026-02-05T20:00:00Z"
  }
}`
  },

  interactSimple: {
    id: 'interact-simple',
    title: "Simple Interaction",
    description: "Quick interaction endpoint for testing - just send a message",
    method: "POST",
    path: "/v1/personas/{persona_id}/interact/simple",
    auth: "User JWT",
    rateLimit: "30 requests / 60 seconds",
    category: "platform",
    example: `const response = await fetch('https://api.dytto.app/v1/personas/USER_ID/interact/simple', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer USER_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: "Where do you work and what do you do?",
    session_id: "optional"
  })
});

const { response: answer, session_id } = await response.json();`,
    response: `{
  "response": "I work at AmFam in Boston as a software engineer...",
  "session_id": "session-uuid"
}`
  },
  
  queryContext: {
    id: 'query-context',
    title: "Query Context",
    description: "Access specific aspects of user context with consent",
    method: "POST",
    path: "/v1/personas/{user_id}/query-context",
    auth: "User JWT",
    category: "platform",
    rateLimit: "20 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/v1/personas/USER_ID/query-context', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer USER_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    context_query: {
      requested_elements: [
        {
          element_type: "answer_specific_question",
          question_for_llm: "What are the user's main life goals?",
          desired_format: "string"
        },
        {
          element_type: "derived_mood_over_time",
          period: "last_30_days"
        }
      ],
      purpose_of_query: "Personalized coaching recommendations"
    }
  })
});`,
    response: `{
  "user_persona_id": "uuid",
  "retrieved_context_elements": {
    "answer_specific_question_result": ["Building a successful startup..."],
    "derived_mood_over_time": {
      "period_covered": "last_30_days",
      "data_points": [{ "timestamp": "...", "mood_value": "focused" }]
    }
  }
}`
  },

  agentContext: {
    id: 'agent-context',
    title: "Agent Context",
    description: "Fetch full user context for an AI agent",
    method: "GET",
    path: "/api/agent/context",
    auth: "Agent Service Key",
    category: "agent",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/agent/context?user_id=USER_UUID', {
  headers: {
    'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY'
  }
});

const { content, user_id } = await response.json();`,
    response: `{
  "content": "Ayaan is a software engineer in Cambridge, MA. He works at AmFam...",
  "user_id": "uuid"
}`
  },

  agentEvents: {
    id: 'agent-events',
    title: "Report Events",
    description: "Agents report events that feed into the user's daily story",
    method: "POST",
    path: "/api/agent/events",
    auth: "Agent Service Key",
    category: "agent",
    rateLimit: "100 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/agent/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: "USER_UUID",
    source: "maya",
    events: [{
      type: "conversation",
      timestamp: "2026-02-05T15:30:00-05:00",
      summary: "Discussed Dytto API documentation",
      details: {
        topics: ["API docs", "developer experience"],
        sentiment: "productive"
      },
      importance: "medium"
    }]
  })
});`,
    response: `{
  "success": true,
  "stored": 1,
  "total": 1
}`
  },

  agentNotify: {
    id: 'agent-notify',
    title: "Push Notification",
    description: "Send a proactive notification to the user",
    method: "POST",
    path: "/api/agent/notify",
    auth: "Agent Service Key",
    category: "agent",
    rateLimit: "10 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/agent/notify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: "USER_UUID",
    title: "Weather Alert",
    body: "Rain expected at 3pm — grab an umbrella!",
    data: { action: "weather_alert" }
  })
});`,
    response: `{ "success": true }`
  },

  agentStories: {
    id: 'agent-stories',
    title: "Fetch Stories",
    description: "Get a user's daily story by date",
    method: "GET",
    path: "/api/agent/stories",
    auth: "Agent Service Key",
    category: "agent",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch(
  'https://api.dytto.app/api/agent/stories?user_id=USER_UUID&date=2026-02-05',
  { headers: { 'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY' } }
);

const { story } = await response.json();`,
    response: `{
  "success": true,
  "story": {
    "id": "story-uuid",
    "date": "2026-02-05",
    "narrative": "Today was a productive day focused on API documentation...",
    "highlights": ["Shipped v1.0.2 to TestFlight", "Fixed OAuth"],
    "mood": "focused"
  }
}`
  },

  agentSearch: {
    id: 'agent-search',
    title: "Search Stories",
    description: "Semantic search across user's story history",
    method: "GET",
    path: "/api/agent/stories/search",
    auth: "Agent Service Key",
    category: "agent",
    rateLimit: "30 requests / 60 seconds",
    example: `const response = await fetch(
  'https://api.dytto.app/api/agent/stories/search?user_id=USER_UUID&q=coffee&limit=5',
  { headers: { 'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY' } }
);

const { results } = await response.json();`,
    response: `{
  "success": true,
  "results": [{
    "date": "2026-02-03",
    "snippet": "...grabbed coffee at Tatte on Mass Ave...",
    "relevance": 0.89
  }]
}`
  }
};

// ============================================================
// Sidebar Configuration
// ============================================================
const sidebarSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Book,
    items: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'quickstart', title: 'Quick Start' },
      { id: 'base-url', title: 'Base URL' },
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication',
    icon: Key,
    items: [
      { id: 'auth-overview', title: 'Overview' },
      { id: 'oauth', title: 'OAuth 2.0' },
      { id: 'jwt', title: 'User JWT' },
      { id: 'service-keys', title: 'Service Keys' },
      { id: 'skill-md', title: 'Personalized API Docs' },
    ]
  },
  {
    id: 'platform-api',
    title: 'Platform API',
    icon: Server,
    items: [
      { id: 'simulation', title: 'Simulation Agents' },
      { id: 'interact', title: 'Persona Interaction' },
      { id: 'interact-simple', title: 'Simple Interaction' },
      { id: 'query-context', title: 'Query Context' },
    ]
  },
  {
    id: 'agent-api',
    title: 'Agent API',
    icon: Zap,
    items: [
      { id: 'agent-context', title: 'Agent Context' },
      { id: 'agent-events', title: 'Report Events' },
      { id: 'agent-notify', title: 'Push Notification' },
      { id: 'agent-stories', title: 'Fetch Stories' },
      { id: 'agent-search', title: 'Search Stories' },
    ]
  },
  {
    id: 'sdks',
    title: 'SDKs & Tools',
    icon: Terminal,
    items: [
      { id: 'sdk-overview', title: 'Overview' },
    ]
  },
  {
    id: 'rate-limits',
    title: 'Rate Limits',
    icon: Gauge,
    items: [
      { id: 'limits-overview', title: 'Overview' },
    ]
  },
  {
    id: 'errors',
    title: 'Errors',
    icon: AlertTriangle,
    items: [
      { id: 'error-codes', title: 'Error Codes' },
    ]
  },
];

// ============================================================
// Code Block Component
// ============================================================
interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, title }) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ borderRadius: '0.75rem', overflow: 'hidden', marginBottom: 'clamp(0.75rem, 3vw, 1rem)' }}>
      <div 
        className="flex items-center justify-between px-3 sm:px-4 py-2"
        style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #21262d' }}
      >
        <span style={{ color: '#8b949e', fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)' }}>{title || 'javascript'}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className="flex items-center gap-1"
          style={{ 
            color: copied ? '#7ee787' : '#8b949e', 
            fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            padding: '0.375rem 0.5rem',
            borderRadius: '0.25rem',
            transition: 'all 0.2s',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
        </motion.button>
      </div>
      <pre style={{
        padding: 'clamp(0.75rem, 3vw, 1rem)',
        margin: 0,
        overflow: 'auto',
        fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
        lineHeight: 1.6,
        color: '#c9d1d9',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
        backgroundColor: '#0d1117'
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ============================================================
// Response Block Component
// ============================================================
const ResponseBlock: React.FC<{ response: string }> = ({ response }) => {
  return (
    <div style={{ borderRadius: '0.75rem', overflow: 'hidden', marginBottom: 'clamp(0.75rem, 3vw, 1rem)' }}>
      <div 
        className="px-3 sm:px-4 py-2"
        style={{ backgroundColor: '#161b22', borderBottom: '1px solid #21262d' }}
      >
        <span style={{ color: '#8b949e', fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)' }}>Response</span>
      </div>
      <pre style={{
        padding: 'clamp(0.75rem, 3vw, 1rem)',
        margin: 0,
        overflow: 'auto',
        fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
        lineHeight: 1.6,
        color: '#7ee787',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
        backgroundColor: '#161b22'
      }}>
        <code>{response}</code>
      </pre>
    </div>
  );
};

// ============================================================
// Endpoint Card Component
// ============================================================
interface EndpointCardProps {
  endpoint: typeof endpoints[keyof typeof endpoints];
}

const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint }) => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const methodColors: Record<string, string> = {
    GET: '#7ee787',
    POST: '#58a6ff',
    PUT: '#d29922',
    DELETE: '#f85149',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      id={endpoint.id}
      style={{
        ...styles.glass.light,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
        overflow: 'hidden',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
      }}
    >
      {/* Header */}
      <div style={{ 
        padding: 'clamp(1rem, 4vw, 1.5rem)', 
        borderBottom: `1px solid ${theme.colors.border}` 
      }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h3 style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.25rem)',
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text, 
              marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
              lineHeight: 1.3,
            }}>
              {endpoint.title}
            </h3>
            <p style={{ 
              fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
              color: theme.colors.textSecondary,
              lineHeight: 1.5,
            }}>
              {endpoint.description}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: methodColors[endpoint.method] || theme.colors.primary,
              color: '#0d1117',
              borderRadius: '0.25rem',
              fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
              fontWeight: 600,
              fontFamily: 'monospace'
            }}>
              {endpoint.method}
            </span>
          </div>
        </div>
        
        <div style={{ 
          marginTop: 'clamp(0.75rem, 3vw, 1rem)',
          padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
          backgroundColor: theme.colors.surface,
          borderRadius: '0.5rem',
          fontFamily: 'monospace',
          fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
          color: theme.colors.primary,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}>
          {endpoint.path}
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-4">
          <span style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', color: theme.colors.textSecondary }}>
            Auth: <strong style={{ color: theme.colors.text }}>{endpoint.auth}</strong>
          </span>
          {endpoint.rateLimit && (
            <span style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', color: theme.colors.textSecondary }}>
              Rate limit: <strong style={{ color: theme.colors.text }}>{endpoint.rateLimit}</strong>
            </span>
          )}
          {endpoint.scope && (
            <span style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', color: theme.colors.textSecondary }}>
              Scope: <strong style={{ color: theme.colors.text }}>{endpoint.scope}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Code Examples */}
      <div style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
        <CodeBlock code={endpoint.example} title="Request" />
        {endpoint.response && <ResponseBlock response={endpoint.response} />}
      </div>
    </motion.div>
  );
};

// ============================================================
// Sidebar Component
// ============================================================
interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, isMobileOpen, onMobileClose }) => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sidebarSections.map(s => s.id)
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sidebarContent = (
    <div style={{ padding: 'clamp(0.75rem, 3vw, 1rem)' }}>
      {sidebarSections.map((section) => (
        <div key={section.id} style={{ marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)' }}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between"
            style={{
              padding: 'clamp(0.5rem, 2vw, 0.75rem)',
              borderRadius: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: theme.colors.text,
              fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
              fontWeight: theme.typography.fontWeight.medium,
              transition: 'all 0.2s',
              minHeight: '44px',
            }}
          >
            <div className="flex items-center gap-2">
              <section.icon size={16} style={{ color: theme.colors.primary, flexShrink: 0 }} />
              <span>{section.title}</span>
            </div>
            {expandedSections.includes(section.id) ? (
              <ChevronDown size={14} style={{ color: theme.colors.textSecondary, flexShrink: 0 }} />
            ) : (
              <ChevronRight size={14} style={{ color: theme.colors.textSecondary, flexShrink: 0 }} />
            )}
          </motion.button>
          
          <AnimatePresence>
            {expandedSections.includes(section.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', paddingLeft: 'clamp(1rem, 4vw, 1.5rem)' }}
              >
                {section.items.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      onNavigate(item.id);
                      onMobileClose();
                    }}
                    className="w-full text-left"
                    style={{
                      display: 'block',
                      padding: 'clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)',
                      borderRadius: '0.375rem',
                      background: activeSection === item.id ? theme.colors.surface : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: activeSection === item.id ? theme.colors.primary : theme.colors.textSecondary,
                      fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                      transition: 'all 0.2s',
                      borderLeft: activeSection === item.id 
                        ? `2px solid ${theme.colors.primary}` 
                        : '2px solid transparent',
                      minHeight: '36px',
                      lineHeight: '1.4',
                    }}
                  >
                    {item.title}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className="hidden lg:block"
        style={{
          position: 'sticky',
          top: '6rem',
          width: '260px',
          height: 'calc(100vh - 8rem)',
          overflowY: 'auto',
          flexShrink: 0,
          ...styles.glass.light,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '1rem',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            />
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50"
              style={{
                width: '280px',
                backgroundColor: theme.colors.background,
                borderRight: `1px solid ${theme.colors.border}`,
                overflowY: 'auto',
                paddingTop: 'clamp(0.75rem, 3vw, 1rem)',
              }}
            >
              <div className="flex items-center justify-between px-4 mb-4">
                <span style={{ 
                  color: theme.colors.text, 
                  fontWeight: theme.typography.fontWeight.semibold,
                  fontSize: 'clamp(1rem, 4vw, 1.125rem)'
                }}>
                  Documentation
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onMobileClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme.colors.textSecondary,
                    padding: '0.5rem',
                    minHeight: '44px',
                    minWidth: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================
// Content Sections
// ============================================================
const GettingStartedSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <div>
      {/* Introduction */}
      <motion.section
        id="introduction"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{
          ...styles.glass.light,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
          padding: 'clamp(1.25rem, 5vw, 2rem)',
          marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        }}
      >
        <h2 style={{ 
          fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text, 
          marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
          lineHeight: 1.3,
        }}>
          What is Dytto?
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
          color: theme.colors.textSecondary, 
          lineHeight: 1.8 
        }}>
          Dytto is a personal context API that gives AI agents memory of the humans they serve. 
          Instead of every app asking the same onboarding questions, Dytto maintains a living, 
          evolving understanding of each user — their preferences, history, goals, and context — 
          and makes it available to authorized applications through a simple API. This enables 
          truly personalized AI experiences without the privacy-invading data collection of traditional approaches.
        </p>
      </motion.section>

      {/* Quick Start */}
      <motion.section
        id="quickstart"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{
          ...styles.glass.light,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
          padding: 'clamp(1.25rem, 5vw, 2rem)',
          marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        }}
      >
        <h2 style={{ 
          fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text, 
          marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
          lineHeight: 1.3,
        }}>
          Quick Start
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary, 
          marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
          lineHeight: 1.6,
        }}>
          Get started with Dytto in under 5 minutes. Here's a simple example using the Agent API:
        </p>
        
        <CodeBlock 
          code={`// 1. Fetch user context for your AI agent
const response = await fetch('https://api.dytto.app/api/agent/context?user_id=USER_UUID', {
  headers: {
    'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY'
  }
});

const { content } = await response.json();
// content: "Sarah is a product designer in Brooklyn who loves coffee..."

// 2. Use the context in your AI prompt
const aiResponse = await yourLLM.chat({
  messages: [
    { role: 'system', content: \`User context: \${content}\` },
    { role: 'user', content: 'Recommend a good coffee shop nearby' }
  ]
});

// Your AI now knows the user's preferences without asking!`}
          title="Quick Start Example"
        />

        <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#auth-overview"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('auth-overview')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'clamp(0.375rem, 1.5vw, 0.5rem)',
              padding: 'clamp(0.625rem, 2.5vw, 0.75rem) clamp(1rem, 4vw, 1.5rem)',
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
              fontWeight: theme.typography.fontWeight.medium,
              minHeight: '44px',
              boxShadow: theme.shadows.brand,
            }}
          >
            <Key size={16} />
            Get API Keys
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#simulation"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'clamp(0.375rem, 1.5vw, 0.5rem)',
              padding: 'clamp(0.625rem, 2.5vw, 0.75rem) clamp(1rem, 4vw, 1.5rem)',
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
              fontWeight: theme.typography.fontWeight.medium,
              minHeight: '44px',
            }}
          >
            <Code size={16} />
            View API Reference
          </motion.a>
        </div>
      </motion.section>

      {/* Base URL */}
      <motion.section
        id="base-url"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{
          ...styles.glass.light,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
          padding: 'clamp(1.25rem, 5vw, 2rem)',
          marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        }}
      >
        <h2 style={{ 
          fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text, 
          marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
          lineHeight: 1.3,
        }}>
          Base URL
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary, 
          marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
          lineHeight: 1.6,
        }}>
          All API requests should be made to:
        </p>
        <div style={{
          padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 1.5rem)',
          backgroundColor: theme.colors.surface,
          borderRadius: '0.5rem',
          fontFamily: 'monospace',
          fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
          color: theme.colors.primary,
          border: `1px solid ${theme.colors.border}`,
          overflowX: 'auto',
        }}>
          https://api.dytto.app
        </div>
      </motion.section>
    </div>
  );
};

const AuthenticationSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const authMethods = [
    {
      id: 'oauth',
      name: 'OAuth 2.0 Client Credentials',
      icon: Shield,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      description: 'For third-party platform integrations that need to access simulation APIs',
      usedFor: ['Simulation API', 'Research platforms', 'Enterprise integrations'],
      credentials: 'Client ID and Client Secret',
      howToGet: 'Register your application in the Dytto Developer Portal',
      example: `// Exchange credentials for access token
const tokenResponse = await fetch('https://api.dytto.app/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    scope: 'simulation:generate_profiles'
  })
});

const { access_token, expires_in } = await tokenResponse.json();

// Use the token in API requests
const response = await fetch('https://api.dytto.app/v1/simulation-contexts/request', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${access_token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ /* ... */ })
});`
    },
    {
      id: 'jwt',
      name: 'User JWT',
      icon: Key,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      description: 'For user-consented context access where the user grants your app permission',
      usedFor: ['Persona Interaction API', 'Query Context API', 'User-facing applications'],
      credentials: 'JWT token from user authentication',
      howToGet: 'User authenticates via Dytto app and grants your app permission',
      example: `// User authenticates through Dytto OAuth flow
// Your app receives a JWT after user consent

const response = await fetch('https://api.dytto.app/v1/personas/USER_ID/interact', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer USER_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: {
      type: 'freeform_chat',
      instruction: 'What are your favorite restaurants?'
    }
  })
});`
    },
    {
      id: 'service-keys',
      name: 'Agent Service Key',
      icon: Zap,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      description: 'For AI agents in the Dytto ecosystem that need persistent context access',
      usedFor: ['Agent Context API', 'Event Reporting', 'Push Notifications', 'Story Access'],
      credentials: 'API Key (starts with dyt_)',
      howToGet: 'Request agent credentials through the Developer Portal',
      example: `// Simple bearer token authentication
const response = await fetch('https://api.dytto.app/api/agent/context?user_id=USER_UUID', {
  headers: {
    'Authorization': 'Bearer dyt_your_service_key_here'
  }
});

const { content, user_id } = await response.json();`
    }
  ];

  return (
    <div>
      {/* Overview */}
      <motion.section
        id="auth-overview"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{
          ...styles.glass.light,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
          padding: 'clamp(1.25rem, 5vw, 2rem)',
          marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        }}
      >
        <h2 style={{ 
          fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text, 
          marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
          lineHeight: 1.3,
        }}>
          Authentication Overview
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary, 
          marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
          lineHeight: 1.6,
        }}>
          Dytto uses three authentication methods depending on your use case. All methods use 
          bearer tokens in the Authorization header.
        </p>
        
        {/* Stats-style cards like FeedbackPage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {authMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              style={{
                padding: 'clamp(1rem, 4vw, 1.25rem)',
                backgroundColor: method.bgColor,
                borderRadius: '0.75rem',
                border: `1px solid ${theme.utils.alpha(method.color, 0.3)}`,
                textAlign: 'center',
              }}
            >
              <method.icon 
                style={{ 
                  color: method.color, 
                  margin: '0 auto', 
                  marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' 
                }} 
                size={24} 
              />
              <div style={{ 
                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)', 
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text, 
                marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
                lineHeight: 1.3,
              }}>
                {method.name}
              </div>
              <div style={{ 
                fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)', 
                color: theme.colors.textSecondary,
                lineHeight: 1.4,
              }}>
                {method.usedFor[0]}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Individual Auth Methods */}
      {authMethods.map((method, index) => (
        <motion.section
          key={method.id}
          id={method.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          style={{
            ...styles.glass.light,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
            padding: 'clamp(1.25rem, 5vw, 2rem)',
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div style={{
              padding: '0.5rem',
              backgroundColor: method.bgColor,
              borderRadius: '0.5rem',
            }}>
              <method.icon size={20} style={{ color: method.color }} />
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.1rem, 4.5vw, 1.5rem)',
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text,
              lineHeight: 1.3,
            }}>
              {method.name}
            </h2>
          </div>
          
          <p style={{ 
            fontSize: 'clamp(0.85rem, 3vw, 1rem)',
            color: theme.colors.textSecondary, 
            marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
            lineHeight: 1.6,
          }}>
            {method.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div style={{
              padding: 'clamp(0.75rem, 3vw, 1rem)',
              backgroundColor: theme.colors.surface,
              borderRadius: '0.5rem',
            }}>
              <span style={{ 
                fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', 
                color: theme.colors.textTertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Credentials
              </span>
              <p style={{ 
                color: theme.colors.text, 
                fontWeight: theme.typography.fontWeight.medium,
                marginTop: '0.25rem',
                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                lineHeight: 1.4,
              }}>
                {method.credentials}
              </p>
            </div>
            <div style={{
              padding: 'clamp(0.75rem, 3vw, 1rem)',
              backgroundColor: theme.colors.surface,
              borderRadius: '0.5rem',
            }}>
              <span style={{ 
                fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', 
                color: theme.colors.textTertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                How to Get
              </span>
              <p style={{ 
                color: theme.colors.text, 
                fontWeight: theme.typography.fontWeight.medium,
                marginTop: '0.25rem',
                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                lineHeight: 1.4,
              }}>
                {method.howToGet}
              </p>
            </div>
          </div>

          <CodeBlock code={method.example} title="Example" />
        </motion.section>
      ))}
    </div>
  );
};

const PlatformAPISection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const platformEndpoints = Object.values(endpoints).filter(ep => ep.category === 'platform');

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
      >
        <h2 style={{ 
          fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text, 
          marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
          lineHeight: 1.3,
        }}>
          Platform API
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary,
          lineHeight: 1.6,
        }}>
          The Platform API (v1) is designed for third-party integrations, research platforms, 
          and applications that need simulation or user-consented context access.
        </p>
      </motion.div>

      {platformEndpoints.map((endpoint, index) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </div>
  );
};

const AgentAPISection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const agentEndpoints = Object.values(endpoints).filter(ep => ep.category === 'agent');

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
      >
        <h2 style={{ 
          fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text, 
          marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
          lineHeight: 1.3,
        }}>
          Agent API
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary,
          lineHeight: 1.6,
        }}>
          The Agent API is for AI agents in the Dytto ecosystem. These endpoints provide 
          full context access, event reporting, and story retrieval capabilities.
        </p>
      </motion.div>

      {agentEndpoints.map((endpoint, index) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </div>
  );
};

const SDKsSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const sdks = [
    { name: 'JavaScript/TypeScript', status: 'Coming Soon', icon: '🟡', color: '#F59E0B' },
    { name: 'Python', status: 'Coming Soon', icon: '🐍', color: '#3B82F6' },
    { name: 'Swift (iOS)', status: 'In Development', icon: '🍎', color: '#EF4444' },
    { name: 'Kotlin (Android)', status: 'Planned', icon: '🤖', color: '#10B981' },
  ];

  return (
    <motion.section
      id="sdk-overview"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      style={{
        ...styles.glass.light,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
        padding: 'clamp(1.25rem, 5vw, 2rem)',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
      }}
    >
      <h2 style={{ 
        fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text, 
        marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
        lineHeight: 1.3,
      }}>
        SDKs & Tools
      </h2>
      <p style={{ 
        fontSize: 'clamp(0.85rem, 3vw, 1rem)',
        color: theme.colors.textSecondary, 
        marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
        lineHeight: 1.6,
      }}>
        Official SDKs are coming soon. In the meantime, the REST API is simple enough to use 
        directly with fetch or any HTTP client.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {sdks.map((sdk, index) => (
          <motion.div
            key={sdk.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            style={{
              padding: 'clamp(0.75rem, 3vw, 1rem)',
              backgroundColor: theme.colors.surface,
              borderRadius: '0.75rem',
              border: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '56px',
            }}
          >
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>{sdk.icon}</span>
              <span style={{ 
                color: theme.colors.text, 
                fontWeight: theme.typography.fontWeight.medium,
                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
              }}>
                {sdk.name}
              </span>
            </div>
            <span style={{
              fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)',
              color: theme.colors.textSecondary,
              backgroundColor: theme.colors.backgroundSecondary,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
            }}>
              {sdk.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

const RateLimitsSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const limits = [
    { endpoint: 'Simulation API', limit: '10 req/min', burst: '5 concurrent' },
    { endpoint: 'Persona Interaction', limit: '30 req/min', burst: '10 concurrent' },
    { endpoint: 'Query Context', limit: '20 req/min', burst: '5 concurrent' },
    { endpoint: 'Agent Context', limit: '60 req/min', burst: '15 concurrent' },
    { endpoint: 'Report Events', limit: '100 req/min', burst: '20 concurrent' },
    { endpoint: 'Push Notification', limit: '10 req/min', burst: '3 concurrent' },
    { endpoint: 'Fetch Stories', limit: '60 req/min', burst: '10 concurrent' },
    { endpoint: 'Search Stories', limit: '30 req/min', burst: '5 concurrent' },
  ];

  return (
    <motion.section
      id="limits-overview"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      style={{
        ...styles.glass.light,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
        padding: 'clamp(1.25rem, 5vw, 2rem)',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
      }}
    >
      <h2 style={{ 
        fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text, 
        marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
        lineHeight: 1.3,
      }}>
        Rate Limits
      </h2>
      <p style={{ 
        fontSize: 'clamp(0.85rem, 3vw, 1rem)',
        color: theme.colors.textSecondary, 
        marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
        lineHeight: 1.6,
      }}>
        Rate limits are applied per API key. If you exceed the limit, you'll receive a{' '}
        <code style={{ 
          backgroundColor: theme.colors.surface, 
          padding: '0.125rem 0.5rem', 
          borderRadius: '0.25rem',
          fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
        }}>
          429 Too Many Requests
        </code>{' '}
        response.
      </p>

      {/* Mobile-friendly cards instead of table */}
      <div className="space-y-3">
        {limits.map((row, idx) => (
          <motion.div
            key={row.endpoint}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            viewport={{ once: true }}
            style={{
              padding: 'clamp(0.75rem, 3vw, 1rem)',
              backgroundColor: idx % 2 === 0 ? theme.colors.surface : 'transparent',
              borderRadius: '0.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <span style={{ 
              color: theme.colors.text,
              fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
              fontWeight: theme.typography.fontWeight.medium,
              flex: '1 1 50%',
              minWidth: '150px',
            }}>
              {row.endpoint}
            </span>
            <div className="flex gap-3 flex-wrap">
              <span style={{ 
                color: theme.colors.primary,
                fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                fontFamily: 'monospace',
                backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
              }}>
                {row.limit}
              </span>
              <span style={{ 
                color: theme.colors.textSecondary,
                fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
              }}>
                {row.burst}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        viewport={{ once: true }}
        style={{
          marginTop: 'clamp(1rem, 4vw, 1.5rem)',
          padding: 'clamp(0.75rem, 3vw, 1rem)',
          backgroundColor: theme.colors.surface,
          borderRadius: '0.5rem',
          borderLeft: `3px solid ${theme.colors.primary}`,
        }}
      >
        <p style={{ 
          fontSize: 'clamp(0.8rem, 3vw, 0.9rem)', 
          color: theme.colors.textSecondary,
          lineHeight: 1.5,
        }}>
          <strong style={{ color: theme.colors.text }}>Need higher limits?</strong> Contact us at{' '}
          <a href="mailto:api@dytto.app" style={{ color: theme.colors.primary }}>api@dytto.app</a>
          {' '}to discuss enterprise rate limits.
        </p>
      </motion.div>
    </motion.section>
  );
};

const ErrorsSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const errors = [
    { code: '400', name: 'Bad Request', description: 'Invalid request body or parameters', color: '#F59E0B' },
    { code: '401', name: 'Unauthorized', description: 'Missing or invalid authentication token', color: '#F59E0B' },
    { code: '403', name: 'Forbidden', description: 'Valid token but insufficient permissions/scope', color: '#F59E0B' },
    { code: '404', name: 'Not Found', description: 'Resource does not exist', color: '#F59E0B' },
    { code: '409', name: 'Conflict', description: 'Request conflicts with current state', color: '#F59E0B' },
    { code: '422', name: 'Unprocessable Entity', description: 'Request understood but semantically invalid', color: '#F59E0B' },
    { code: '429', name: 'Too Many Requests', description: 'Rate limit exceeded — slow down', color: '#F59E0B' },
    { code: '500', name: 'Internal Server Error', description: 'Something went wrong on our end', color: '#EF4444' },
    { code: '503', name: 'Service Unavailable', description: 'Temporary outage — retry with backoff', color: '#EF4444' },
  ];

  return (
    <motion.section
      id="error-codes"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      style={{
        ...styles.glass.light,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
        padding: 'clamp(1.25rem, 5vw, 2rem)',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
      }}
    >
      <h2 style={{ 
        fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text, 
        marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
        lineHeight: 1.3,
      }}>
        Error Codes
      </h2>
      <p style={{ 
        fontSize: 'clamp(0.85rem, 3vw, 1rem)',
        color: theme.colors.textSecondary, 
        marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
        lineHeight: 1.6,
      }}>
        All errors return a JSON body with an{' '}
        <code style={{ 
          backgroundColor: theme.colors.surface, 
          padding: '0.125rem 0.5rem', 
          borderRadius: '0.25rem',
          fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
        }}>error</code>{' '}
        field describing what went wrong.
      </p>

      <CodeBlock 
        code={`{
  "error": "Invalid authentication token",
  "code": "UNAUTHORIZED",
  "details": {
    "reason": "Token expired",
    "expired_at": "2026-02-05T20:00:00Z"
  }
}`}
        title="Error Response Format"
      />

      <div style={{ marginTop: 'clamp(1rem, 4vw, 1.5rem)' }} className="space-y-2">
        {errors.map((error, idx) => (
          <motion.div
            key={error.code}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.03 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'clamp(0.75rem, 3vw, 1rem)',
              padding: 'clamp(0.75rem, 3vw, 1rem)',
              backgroundColor: idx % 2 === 0 ? 'transparent' : theme.colors.surface,
              borderRadius: '0.5rem',
            }}
          >
            <span style={{
              fontFamily: 'monospace',
              fontWeight: theme.typography.fontWeight.bold,
              color: parseInt(error.code) >= 500 ? '#EF4444' : '#F59E0B',
              minWidth: 'clamp(2.5rem, 8vw, 3rem)',
              fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
            }}>
              {error.code}
            </span>
            <div className="min-w-0 flex-1">
              <span style={{ 
                color: theme.colors.text, 
                fontWeight: theme.typography.fontWeight.medium,
                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
              }}>
                {error.name}
              </span>
              <p style={{ 
                color: theme.colors.textSecondary, 
                fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                marginTop: '0.25rem',
                lineHeight: 1.4,
              }}>
                {error.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

const SkillMdSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <motion.section
      id="skill-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      style={{
        ...styles.glass.light,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
        padding: 'clamp(1.25rem, 5vw, 2rem)',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
      }}
    >
      <h2 style={{ 
        fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text, 
        marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
        lineHeight: 1.3,
      }}>
        Personalized API Documentation (SKILL.md)
      </h2>
      <p style={{ 
        fontSize: 'clamp(0.85rem, 3vw, 1rem)',
        color: theme.colors.textSecondary, 
        marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
        lineHeight: 1.6,
      }}>
        Dytto provides personalized API documentation in the form of a `SKILL.md` file. 
        This documentation is dynamically generated based on the specific scopes and permissions 
        granted to your API key, ensuring you only see the endpoints and functionalities 
        relevant to your integration.
      </p>

      <h3 style={{ 
        fontSize: 'clamp(1rem, 4vw, 1.25rem)',
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.text, 
        marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
        marginTop: 'clamp(1.5rem, 5vw, 2rem)',
        lineHeight: 1.3,
      }}>
        How to Download
      </h3>
      <p style={{ 
        fontSize: 'clamp(0.85rem, 3vw, 1rem)',
        color: theme.colors.textSecondary, 
        marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
        lineHeight: 1.6,
      }}>
        You can download the `SKILL.md` file for any of your API keys directly from the 
        <motion.a 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="/apikeys"
          style={{
            color: theme.colors.primary,
            textDecoration: 'underline',
            marginLeft: '0.3rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          API Keys page <ExternalLink size={14} />
        </motion.a>.
        Simply navigate to your API Keys, select the key you wish to generate documentation for, 
        and click the "Download SKILL.md" button.
      </p>

      <CodeBlock 
        code={`# SKILL.md for My_Agent_Key\n\n## Endpoints Accessible:\n\n### GET /api/agent/context\n- Description: Fetch full user context for an AI agent\n- Authentication: Agent Service Key\n- Scope: agent:read_context\n\n### POST /api/agent/events\n- Description: Agents report events that feed into the user's daily story\n- Authentication: Agent Service Key\n- Scope: agent:write_events\n`}
        title="Example SKILL.md Content"
      />
    </motion.section>
  );
};

// ============================================================
// Main DocsPage Component
// ============================================================
const DocsPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const styles = useThemeStyles();
  
  const [activeSection, setActiveSection] = useState(section || 'introduction');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle initial scroll to section from URL
  useEffect(() => {
    if (section) {
      setActiveSection(section);
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [section]);

  // Handle hash navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    navigate(`/docs#${sectionId}`, { replace: true });
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Determine which section group is active for content rendering
  const getSectionGroup = (id: string): string => {
    for (const section of sidebarSections) {
      if (section.items.some(item => item.id === id)) {
        return section.id;
      }
    }
    return 'getting-started';
  };

  const activeSectionGroup = getSectionGroup(activeSection);

  // Stats for hero section
  const stats = [
    { icon: Server, label: 'Endpoints', value: Object.keys(endpoints).length },
    { icon: Key, label: 'Auth Methods', value: 3 },
    { icon: Cpu, label: 'API Version', value: 'v1' },
  ];

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-6 sm:pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 
              style={{
                color: theme.colors.text,
                fontSize: 'clamp(1.75rem, 6vw, 3rem)',
                fontWeight: theme.typography.fontWeight.bold,
                lineHeight: '1.2',
                marginBottom: theme.semanticSpacing.sm,
              }}
            >
              API{' '}
              <motion.span 
                key={`docs-gradient-${theme.mode}`}
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
                Documentation
              </motion.span>
            </h1>
            <p 
              style={{
                color: theme.colors.textSecondary,
                fontSize: 'clamp(0.875rem, 3vw, 1.125rem)',
                lineHeight: '1.6',
                maxWidth: '48rem',
                margin: '0 auto',
              }}
            >
              Everything you need to integrate Dytto's personal context API into your application.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto mb-6"
          >
            {stats.map((stat, index) => (
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
        </div>
      </section>

      {/* Mobile Menu Toggle */}
      <div 
        className="lg:hidden sticky top-20 z-30 px-4 py-3" 
        style={{ backgroundColor: theme.colors.background }}
      >
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-2 w-full"
          style={{
            padding: 'clamp(0.75rem, 3vw, 1rem)',
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '0.75rem',
            color: theme.colors.text,
            cursor: 'pointer',
            minHeight: '48px',
          }}
        >
          <Menu size={18} />
          <span style={{ 
            fontWeight: theme.typography.fontWeight.medium,
            fontSize: 'clamp(0.875rem, 3vw, 1rem)',
          }}>
            Navigation
          </span>
          <ArrowRight size={16} style={{ marginLeft: 'auto', color: theme.colors.textSecondary }} />
        </motion.button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar */}
          <Sidebar 
            activeSection={activeSection} 
            onNavigate={handleNavigate}
            isMobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />

          {/* Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSectionGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {(activeSectionGroup === 'getting-started') && <GettingStartedSection />}
                {(activeSectionGroup === 'authentication') && (activeSection === 'skill-md' ? <SkillMdSection /> : <AuthenticationSection />)}
                {(activeSectionGroup === 'platform-api') && <PlatformAPISection />}
                {(activeSectionGroup === 'agent-api') && <AgentAPISection />}
                {(activeSectionGroup === 'sdks') && <SDKsSection />}
                {(activeSectionGroup === 'rate-limits') && <RateLimitsSection />}
                {(activeSectionGroup === 'errors') && <ErrorsSection />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DocsPage;
