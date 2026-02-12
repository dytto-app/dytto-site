import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Check, Key, Shield, Zap } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';

// ============================================================
// API Documentation - Accurate as of 2026-02-05
// ============================================================

const endpoints = {
  // Platform API (v1) - for third-party integrations
  simulation: {
    title: "Simulation Agents",
    description: "Generate anonymized user personas for research and testing",
    method: "POST",
    path: "/v1/simulation-contexts/request",
    auth: "OAuth 2.0 Client Credentials",
    scope: "simulation:generate_profiles",
    rateLimit: "10 requests / 60 seconds",
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
    title: "Persona Interaction",
    description: "Make Dytto respond AS a user persona, grounded in their real context",
    method: "POST",
    path: "/v1/personas/{persona_id}/interact",
    auth: "User JWT",
    rateLimit: "30 requests / 60 seconds",
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
  "parsed_response": "I love Indian food, especially from places in Cambridge. I'm also a fan of good sushi...",
  "raw_response_text": "...",
  "session_id": "session-uuid",
  "dytto_metadata": {
    "context_version_used": "2026-02-05T20:00:00Z"
  }
}`
  },

  interactSimple: {
    title: "Simple Interaction",
    description: "Quick interaction endpoint for testing - just send a message",
    method: "POST",
    path: "/v1/personas/{persona_id}/interact/simple",
    auth: "User JWT",
    rateLimit: "30 requests / 60 seconds",
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
  "response": "I work at AmFam in Boston as a software engineer focused on AI...",
  "session_id": "session-uuid"
}`
  },
  
  queryContext: {
    title: "Query Context",
    description: "Access specific aspects of user context with consent",
    method: "POST",
    path: "/v1/personas/{user_id}/query-context",
    auth: "User JWT",
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
        },
        {
          element_type: "custom_inference",
          field_name: "productivity_pattern",
          description_for_llm: "Describe when the user is most productive",
          desired_format: "string"
        }
      ],
      purpose_of_query: "Personalized coaching recommendations"
    }
  })
});`,
    response: `{
  "user_persona_id": "uuid",
  "retrieved_context_elements": {
    "answer_specific_question_result": ["Building a successful startup while maintaining work-life balance"],
    "derived_mood_over_time": {
      "period_covered": "last_30_days",
      "data_points": [{ "timestamp": "...", "mood_value": "focused" }]
    },
    "custom_inference_results": {
      "productivity_pattern": "Most productive in early afternoon (1-4 PM)"
    }
  },
  "access_metadata": {
    "consent_reference_used": "full_context_access",
    "timestamp": "2026-02-05T21:00:00Z"
  }
}`
  },

  // Agent API - for AI agents in the ecosystem
  agentContext: {
    title: "Agent Context",
    description: "Fetch full user context for an AI agent",
    method: "GET",
    path: "/api/agent/context",
    auth: "Agent Service Key",
    example: `const response = await fetch('https://api.dytto.app/api/agent/context?user_id=USER_UUID', {
  headers: {
    'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY'
  }
});

const { content, user_id } = await response.json();`,
    response: `{
  "content": "Ayaan is a software engineer in Cambridge, MA. He works at AmFam in Boston and is building Dytto, a personal context API for AI agents. He has a cat named Eula...",
  "user_id": "uuid"
}`
  },

  agentEvents: {
    title: "Report Events",
    description: "Agents report events that feed into the user's daily story",
    method: "POST",
    path: "/api/agent/events",
    auth: "Agent Service Key",
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
    title: "Push Notification",
    description: "Send a proactive notification to the user",
    method: "POST",
    path: "/api/agent/notify",
    auth: "Agent Service Key",
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
    title: "Fetch Stories",
    description: "Get a user's daily story by date",
    method: "GET",
    path: "/api/agent/stories",
    auth: "Agent Service Key",
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
    "highlights": ["Shipped v1.0.2 to TestFlight", "Fixed Hetzner OAuth"],
    "mood": "focused"
  }
}`
  },

  agentSearch: {
    title: "Search Stories",
    description: "Semantic search across user's story history",
    method: "GET",
    path: "/api/agent/stories/search",
    auth: "Agent Service Key",
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

const authMethods = [
  {
    name: "OAuth 2.0 Client Credentials",
    icon: Shield,
    description: "For third-party platform integrations (simulation API)",
    endpoints: ["/v1/simulation-contexts/request"],
    howTo: "Register your app, get client_id/secret, exchange for access token with required scopes"
  },
  {
    name: "User JWT",
    icon: Key,
    description: "For user-consented context access (persona API)",
    endpoints: ["/v1/personas/*/interact", "/v1/personas/*/query-context"],
    howTo: "User authenticates via Dytto app, grants your app permission, you receive JWT"
  },
  {
    name: "Agent Service Key",
    icon: Zap,
    description: "For AI agents in the Dytto ecosystem",
    endpoints: ["/api/agent/*"],
    howTo: "Agent Service Keys are generated via the Dytto Developer Portal. When creating a new key, the 'observe' scope is included by default to enable richer context. You can restrict the key to read-only access, which removes all write scopes (e.g., 'observe', 'context:write'). A key with write access (including 'observe') helps build richer context for your agents."
  }
];

interface APIDocumentationProps {
  compact?: boolean;
}

const APIDocumentation: React.FC<APIDocumentationProps> = ({ compact = false }) => {
  const [activeEndpoint, setActiveEndpoint] = useState('simulation');
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentEndpoint = endpoints[activeEndpoint as keyof typeof endpoints];

  const categories = [
    { id: 'platform', label: 'Platform API', endpoints: ['simulation', 'interact', 'interactSimple', 'queryContext'] },
    { id: 'agent', label: 'Agent API', endpoints: ['agentContext', 'agentEvents', 'agentNotify', 'agentStories', 'agentSearch'] }
  ];

  return (
    <section style={styles.bg.tertiary} className="py-16 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 style={{ ...styles.typography.h1, color: theme.colors.text, marginBottom: theme.semanticSpacing.lg }}>
            API Reference
          </h2>
          <p style={{ ...styles.typography.bodyLarge, color: theme.colors.textSecondary, maxWidth: '48rem', margin: '0 auto' }}>
            Complete documentation for integrating with Dytto's personal context platform.
          </p>
        </motion.div>

        {/* Auth Methods */}
        <div className="mb-12">
          <h3 style={{ ...styles.typography.h4, color: theme.colors.text, marginBottom: theme.semanticSpacing.md }}>
            Authentication
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {authMethods.map((method) => (
              <div
                key={method.name}
                style={{
                  ...styles.glass.light,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '0.75rem',
                  padding: theme.semanticSpacing.md
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <method.icon size={18} style={{ color: theme.colors.primary }} />
                  <span style={{ ...styles.typography.h6, color: theme.colors.text }}>{method.name}</span>
                </div>
                <p style={{ ...styles.typography.caption, color: theme.colors.textSecondary, marginBottom: '0.5rem' }}>
                  {method.description}
                </p>
                <code style={{ fontSize: '0.7rem', color: theme.colors.primary }}>
                  {method.endpoints.join(', ')}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Endpoint Categories */}
        <div className="flex flex-wrap gap-4 mb-6">
          {categories.map((cat) => (
            <div key={cat.id}>
              <span style={{ ...styles.typography.caption, color: theme.colors.textSecondary, marginBottom: '0.5rem', display: 'block' }}>
                {cat.label}
              </span>
              <div className="flex flex-wrap gap-2">
                {cat.endpoints.map((epId) => {
                  const ep = endpoints[epId as keyof typeof endpoints];
                  return (
                    <button
                      key={epId}
                      onClick={() => setActiveEndpoint(epId)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: theme.typography.fontSize.sm,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: activeEndpoint === epId ? theme.colors.primary : theme.colors.surface,
                        color: activeEndpoint === epId ? theme.colors.background : theme.colors.textSecondary
                      }}
                    >
                      {ep.title}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Active Endpoint Details */}
        <motion.div
          key={activeEndpoint}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...styles.glass.medium,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '1rem',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: theme.semanticSpacing.lg, borderBottom: `1px solid ${theme.colors.border}` }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 style={{ ...styles.typography.h4, color: theme.colors.text }}>{currentEndpoint.title}</h3>
                <p style={{ ...styles.typography.body, color: theme.colors.textSecondary }}>{currentEndpoint.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background,
                  borderRadius: '0.25rem',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: 600
                }}>
                  {currentEndpoint.method}
                </span>
                <code style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.primary }}>
                  {currentEndpoint.path}
                </code>
              </div>
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary }}>
                Auth: <strong>{currentEndpoint.auth}</strong>
              </span>
              {currentEndpoint.rateLimit && (
                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary }}>
                  Rate limit: <strong>{currentEndpoint.rateLimit}</strong>
                </span>
              )}
              {currentEndpoint.scope && (
                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary }}>
                  Scope: <strong>{currentEndpoint.scope}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Code Example */}
          <div style={{ backgroundColor: '#0d1117' }}>
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid #21262d' }}>
              <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>Request</span>
              <button
                onClick={() => copyToClipboard(currentEndpoint.example)}
                className="flex items-center gap-1"
                style={{ color: '#8b949e', fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre style={{
              padding: '1rem',
              margin: 0,
              overflow: 'auto',
              fontSize: '0.8rem',
              lineHeight: 1.5,
              color: '#c9d1d9',
              fontFamily: 'ui-monospace, monospace'
            }}>
              <code>{currentEndpoint.example}</code>
            </pre>
          </div>

          {/* Response Example */}
          {currentEndpoint.response && (
            <div style={{ backgroundColor: '#161b22' }}>
              <div className="px-4 py-2" style={{ borderTop: '1px solid #21262d', borderBottom: '1px solid #21262d' }}>
                <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>Response</span>
              </div>
              <pre style={{
                padding: '1rem',
                margin: 0,
                overflow: 'auto',
                fontSize: '0.8rem',
                lineHeight: 1.5,
                color: '#7ee787',
                fontFamily: 'ui-monospace, monospace'
              }}>
                <code>{currentEndpoint.response}</code>
              </pre>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default APIDocumentation;
