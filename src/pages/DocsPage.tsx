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
  },

  agentSocial: {
    id: 'agent-social',
    title: "Get Relationships",
    description: "Fetch user's relationships, optionally filtered to overdue contacts",
    method: "GET",
    path: "/api/agent/social",
    auth: "Agent Service Key",
    category: "agent",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch(
  'https://api.dytto.app/api/agent/social?user_id=USER_UUID&overdue=true',
  { headers: { 'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY' } }
);

const { relationships } = await response.json();`,
    response: `{
  "success": true,
  "relationships": [{
    "id": "rel-uuid",
    "name": "Mom",
    "meeting_frequency": "weekly",
    "last_interaction_at": "2026-02-01T...",
    "days_since_contact": 14,
    "overdue": true
  }]
}`
  },

  agentPlaces: {
    id: 'agent-places',
    title: "Search Places",
    description: "Search nearby places using Google Places API",
    method: "GET",
    path: "/api/agent/places",
    auth: "Agent Service Key",
    category: "agent",
    rateLimit: "30 requests / 60 seconds",
    example: `const response = await fetch(
  'https://api.dytto.app/api/agent/places?lat=42.37&lon=-71.11&query=coffee&radius=1000',
  { headers: { 'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY' } }
);

const { places } = await response.json();`,
    response: `{
  "success": true,
  "places": [{
    "name": "Tatte Bakery",
    "rating": 4.6,
    "types": ["cafe", "bakery"],
    "address": "1352 Massachusetts Ave",
    "distance": "0.3 mi",
    "open_now": true
  }]
}`
  },

  // ─── Observe API ─────────────────────────────────────────────
  observe: {
    id: 'observe',
    title: "Observe (Low-Effort Ingestion)",
    description: "Accept any unstructured input and extract facts automatically. Use async=true for fire-and-forget mode.",
    method: "POST",
    path: "/api/v1/observe",
    auth: "API Key (scope: observe or context:write)",
    category: "observe",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/v1/observe', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer dyt_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: "User mentioned their sister Ananya lives in the UK and does neuroscience research",
    source: "maya",     // optional: identify your agent
    async: false        // optional: true = fire-and-forget (202 response), false = wait for extraction
  })
});

const { facts_extracted, stored } = await response.json();`,
    response: `{
  "success": true,
  "facts_extracted": [
    {
      "text": "User has a sister named Ananya",
      "categories": ["family"],
      "confidence": 0.95,
      "entities": ["Ananya"]
    },
    {
      "text": "Ananya lives in the UK",
      "categories": ["family", "places"],
      "confidence": 0.9,
      "entities": ["Ananya", "UK"]
    }
  ],
  "facts_stored": 2,
  "facts_deduplicated": 0,
  "stored": true,
  "processing_time_ms": 1234
}

// With async=true, returns immediately:
// { "success": true, "async": true, "message": "Observation queued for background processing" }`
  },

  observeBatch: {
    id: 'observe-batch',
    title: "Observe Batch",
    description: "Process multiple observations at once (max 10 per request)",
    method: "POST",
    path: "/api/v1/observe/batch",
    auth: "API Key (scope: observe or context:write)",
    category: "observe",
    rateLimit: "20 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/v1/observe/batch', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer dyt_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    observations: [
      { data: "User prefers quiet rides", source: "robotaxi" },
      { data: "Temperature set to 68°F", source: "smart_home" }
    ]
  })
});`,
    response: `{
  "success": true,
  "results": [
    { "index": 0, "success": true, "facts_extracted": 1, "facts_stored": 1 },
    { "index": 1, "success": true, "facts_extracted": 1, "facts_stored": 1 }
  ],
  "total_facts_extracted": 2,
  "total_facts_stored": 2
}`
  },

  // ─── Facts API ───────────────────────────────────────────────
  factsQuery: {
    id: 'facts-query',
    title: "Query Facts",
    description: "Query user facts with scope-based filtering and optional semantic search",
    method: "POST",
    path: "/api/v1/facts/query",
    auth: "API Key or User JWT",
    category: "facts",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/v1/facts/query', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer dyt_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: "What are their food preferences?",  // optional semantic search
    limit: 20
  })
});

const { facts, scope_applied } = await response.json();`,
    response: `{
  "facts": [
    {
      "id": "fact-uuid",
      "text": "Prefers vegetarian food",
      "categories": ["food", "preferences"],
      "confidence": 0.92,
      "similarity": 0.87
    }
  ],
  "total_found": 5,
  "filtered_by_scope": 2,
  "scope_applied": ["food", "preferences"],
  "query_time_ms": 45
}`
  },

  factsCategories: {
    id: 'facts-categories',
    title: "List Fact Categories",
    description: "List all available fact categories and scope mappings",
    method: "GET",
    path: "/api/v1/facts/categories",
    auth: "API Key or User JWT",
    category: "facts",
    rateLimit: "120 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/v1/facts/categories', {
  headers: { 'Authorization': 'Bearer dyt_your_api_key' }
});

const { categories, scopes } = await response.json();`,
    response: `{
  "categories": [
    { "name": "family", "description": "Family members and relationships" },
    { "name": "preferences", "description": "Likes, dislikes, personal choices" },
    { "name": "places", "description": "Locations — home, work, frequently visited" }
  ],
  "scopes": {
    "transportation": ["transportation", "preferences", "places", "schedule"],
    "health": ["health", "lifestyle", "preferences"]
  }
}`
  },

  // ─── Scoped Context API ──────────────────────────────────────
  contextScope: {
    id: 'context-scope',
    title: "Scoped Context",
    description: "Task-based context retrieval — send task, get only relevant context",
    method: "POST",
    path: "/api/context/scope",
    auth: "API Key or User JWT",
    category: "context",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/context/scope', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer dyt_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    task: "Drive user home from work, optimize route and climate",
    agent_type: "robotaxi",
    max_tokens: 2000,
    categories: ["location", "preferences"]  // optional hints
  })
});`,
    response: `{
  "context": {
    "relevant_facts": [
      { "category": "places", "fact": "Lives on Harvard St, Cambridge, MA" },
      { "category": "preferences", "fact": "Prefers temperature at 68°F" }
    ],
    "patterns": [
      { "category": "schedule", "pattern": "Usually leaves work at 5:30 PM" }
    ],
    "preferences": ["Likes quiet rides", "Prefers scenic routes"]
  },
  "scoping_reasoning": "places (matched: home, address); preferences (matched: prefer)",
  "token_count": 450,
  "categories_used": ["places", "transportation", "preferences"],
  "task_received": "Drive user home from work..."
}`
  },

  contextNow: {
    id: 'context-now',
    title: "Context Now (Real-time)",
    description: "Pre-digested 'here's today' snapshot for quick agent bootstrapping",
    method: "GET",
    path: "/api/context/now",
    auth: "API Key or User JWT",
    category: "context",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/context/now', {
  headers: { 'Authorization': 'Bearer dyt_your_api_key' }
});

const snapshot = await response.json();`,
    response: `{
  "timestamp": "2026-02-15T09:30:00-05:00",
  "user_id": "uuid",
  "context_summary": "Ayaan is a software engineer in Cambridge, MA...",
  "todays_activities": [],
  "upcoming_schedule": [],
  "patterns": {
    "temporal": ["Usually wakes at 8am on weekdays"],
    "locations": ["Home", "Office", "Tatte Bakery"],
    "activities": ["Gym 3x/week"]
  },
  "preferences": ["Prefers quiet mornings"]
}`
  },

  // ─── API Keys Management ─────────────────────────────────────
  keysCreate: {
    id: 'keys-create',
    title: "Create API Key",
    description: "Create a new scoped API key for third-party agent access",
    method: "POST",
    path: "/api/keys",
    auth: "User JWT",
    category: "keys",
    rateLimit: "10 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/keys', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer USER_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "My Robotaxi Agent",
    scopes: ["location", "preferences", "schedule"],
    expires_in_days: 90,
    rate_limit_per_minute: 60,
    metadata: {
      agent_type: "robotaxi",
      description: "Waymo integration"
    }
  })
});

// ⚠️ The full key is only shown ONCE!
const { key, key_id } = await response.json();`,
    response: `{
  "success": true,
  "key": "dyt_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "key_id": "uuid",
  "key_prefix": "dyt_a1b2c3",
  "name": "My Robotaxi Agent",
  "scopes": ["location", "preferences", "schedule"],
  "expires_at": "2026-05-15T...",
  "warning": "⚠️ Save this key securely! It will NOT be shown again."
}`
  },

  keysList: {
    id: 'keys-list',
    title: "List API Keys",
    description: "List all your API keys (keys are shown as prefixes only)",
    method: "GET",
    path: "/api/keys",
    auth: "User JWT",
    category: "keys",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/keys', {
  headers: { 'Authorization': 'Bearer USER_JWT_TOKEN' }
});

const { keys } = await response.json();`,
    response: `{
  "success": true,
  "keys": [{
    "id": "uuid",
    "name": "My Robotaxi Agent",
    "key_prefix": "dyt_a1b2c3",
    "scopes": ["location", "preferences", "schedule"],
    "is_active": true,
    "last_used_at": "2026-02-15T08:30:00Z",
    "use_count": 1234,
    "expires_at": "2026-05-15T..."
  }],
  "count": 1
}`
  },

  keysRevoke: {
    id: 'keys-revoke',
    title: "Revoke API Key",
    description: "Revoke an API key to immediately disable access",
    method: "DELETE",
    path: "/api/keys/{key_id}",
    auth: "User JWT",
    category: "keys",
    rateLimit: "30 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/keys/KEY_UUID', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer USER_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reason: "No longer needed"  // optional
  })
});`,
    response: `{
  "success": true,
  "message": "API key KEY_UUID has been revoked"
}`
  },

  keysScopes: {
    id: 'keys-scopes',
    title: "List Available Scopes",
    description: "Get all available scopes for API key creation",
    method: "GET",
    path: "/api/keys/scopes",
    auth: "None (public)",
    category: "keys",
    rateLimit: "120 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/keys/scopes');
const { scopes, descriptions } = await response.json();`,
    response: `{
  "scopes": [
    "location", "schedule", "preferences", "relationships",
    "work", "health", "lifestyle", "financial", "food", "travel",
    "context:read", "patterns:read", "stories:read", "search:execute", "observe"
  ],
  "descriptions": {
    "location": "Access to location data (home, work, frequent places)",
    "preferences": "Access to user preferences and settings",
    "context:read": "Read full context narrative",
    "observe": "Push observations to extract facts"
  }
}`
  },

  // ─── Context Search Stream (NEW) ─────────────────────────────
  contextSearchStream: {
    id: 'context-search-stream',
    title: "Search Context (Streaming)",
    description: "SSE streaming synthesis — first token in <1s, full synthesis in 5-10s",
    method: "POST",
    path: "/api/context/search/stream",
    auth: "API Key or User JWT",
    category: "context",
    rateLimit: "30 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/context/search/stream', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer dyt_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: "What did I do last week?"
  })
});

// Read SSE stream
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  const events = text.split('\\n\\n');
  for (const event of events) {
    if (event.startsWith('data: ')) {
      const data = JSON.parse(event.slice(6));
      if (data.token) process.stdout.write(data.token);
      if (data.type === 'done') console.log('\\nSources:', data.sources);
    }
  }
}`,
    response: `// SSE Events:
data: {"type": "retrieval_done", "story_count": 7}
data: {"token": "Based"}
data: {"token": " on"}
data: {"token": " your"}
...
data: {"type": "done", "sources": ["2026-02-18", "2026-02-19", ...]}`
  },

  // ─── Entity API (NEW) ─────────────────────────────────────────
  entitySearch: {
    id: 'entity-search',
    title: "Find Entities",
    description: "Search for people, pets, places, and objects in the user's life",
    method: "GET",
    path: "/api/entities",
    auth: "User JWT",
    category: "entities",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch(
  'https://api.dytto.app/api/entities?q=Eula&type=pet',
  { headers: { 'Authorization': 'Bearer USER_JWT' } }
);

const { entities, count } = await response.json();`,
    response: `{
  "entities": [{
    "id": "uuid",
    "canonical_name": "Eula",
    "entity_type": "pet",
    "first_seen_at": "2026-01-15T...",
    "mention_count": 47,
    "aliases": ["the cat", "fluffy"]
  }],
  "count": 1
}`
  },

  entityQuery: {
    id: 'entity-query',
    title: "Entity Query (MCP)",
    description: "Natural language queries about entities — 'How old is Eula?'",
    method: "GET",
    path: "/api/mcp/entity-query",
    auth: "User JWT",
    category: "entities",
    rateLimit: "30 requests / 60 seconds",
    example: `const response = await fetch(
  'https://api.dytto.app/api/mcp/entity-query?q=How%20old%20is%20Eula',
  { headers: { 'Authorization': 'Bearer USER_JWT' } }
);

const { suggested_answer, results } = await response.json();`,
    response: `{
  "query": "How old is Eula",
  "entities_found": 1,
  "results": [{
    "entity": { "canonical_name": "Eula", "entity_type": "pet" },
    "facts": [
      { "attribute_key": "birthday", "value": "2020-03-15" },
      { "attribute_key": "species", "value": "cat" }
    ]
  }],
  "suggested_answer": "Eula was born on March 15, 2020, making her about 6 years old."
}`
  },

  // ─── Knowledge Gaps (NEW) ─────────────────────────────────────
  knowledgeGaps: {
    id: 'knowledge-gaps',
    title: "Knowledge Gaps",
    description: "Surface context items the user hasn't mentioned this session",
    method: "GET",
    path: "/v1/personas/{persona_id}/knowledge-gaps",
    auth: "User JWT",
    category: "platform",
    rateLimit: "20 requests / 60 seconds",
    example: `const response = await fetch(
  'https://api.dytto.app/v1/personas/USER_ID/knowledge-gaps?context=We%20discussed%20work%20today&limit=5',
  { headers: { 'Authorization': 'Bearer USER_JWT' } }
);

const { unmentioned_items } = await response.json();`,
    response: `{
  "persona_id": "uuid",
  "unmentioned_items": [
    {
      "category": "relationship",
      "item": "Mom: no contact in 14 days",
      "urgency": "high",
      "why_relevant": "Close relationship, weekly contact pattern"
    },
    {
      "category": "project",
      "item": "Dytto API docs update",
      "urgency": "medium",
      "why_relevant": "Active project mentioned 3 days ago"
    }
  ],
  "items_surfaced": 2
}`
  },

  // ─── Context Staleness (NEW) ──────────────────────────────────
  contextStaleness: {
    id: 'context-staleness',
    title: "Context Staleness",
    description: "Detect temporal claims that may be outdated (graduation, job changes)",
    method: "GET",
    path: "/v1/context/staleness",
    auth: "User JWT",
    category: "platform",
    rateLimit: "5 requests / 300 seconds",
    example: `const response = await fetch('https://api.dytto.app/v1/context/staleness', {
  headers: { 'Authorization': 'Bearer USER_JWT' }
});

const { stale_claims, total_stale } = await response.json();`,
    response: `{
  "stale_claims": [{
    "claim": "MS graduation December 2025",
    "predicted_date": "2025-12-19",
    "days_since_predicted": 67,
    "confidence_level": "unverified",
    "hedge": "Expected to graduate December 2025 — verify if completed",
    "update_suggestion": "Confirm: Did the graduation happen as planned?"
  }],
  "total_stale": 1,
  "checked_at": "2026-02-25T10:30:00Z"
}`
  },

  // ─── Agent Story Dates ────────────────────────────────────────
  agentStoryDates: {
    id: 'agent-story-dates',
    title: "Story Dates",
    description: "Get recent story dates for calendar views",
    method: "GET",
    path: "/api/agent/stories/dates",
    auth: "Agent Service Key",
    category: "agent",
    rateLimit: "60 requests / 60 seconds",
    example: `const response = await fetch(
  'https://api.dytto.app/api/agent/stories/dates?user_id=USER_UUID&days=30',
  { headers: { 'Authorization': 'Bearer YOUR_AGENT_SERVICE_KEY' } }
);

const { dates, count } = await response.json();`,
    response: `{
  "success": true,
  "dates": ["2026-02-25", "2026-02-24", "2026-02-22", ...],
  "count": 28
}`
  },

  // ─── Fact by ID ───────────────────────────────────────────────
  factById: {
    id: 'fact-by-id',
    title: "Get Fact by ID",
    description: "Retrieve a specific fact with full details",
    method: "GET",
    path: "/api/v1/facts/{fact_id}",
    auth: "API Key or User JWT",
    category: "facts",
    rateLimit: "120 requests / 60 seconds",
    example: `const response = await fetch('https://api.dytto.app/api/v1/facts/FACT_UUID', {
  headers: { 'Authorization': 'Bearer dyt_your_api_key' }
});

const fact = await response.json();`,
    response: `{
  "id": "uuid",
  "text": "Prefers quiet rides with temperature at 68°F",
  "categories": ["preferences", "transportation"],
  "confidence": 0.92,
  "source": "observation",
  "entities": ["Uber"],
  "created_at": "2026-02-08T02:45:00Z"
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
    ]
  },
  {
    id: 'api-keys',
    title: 'API Keys',
    icon: Key,
    items: [
      { id: 'keys-scopes', title: 'Available Scopes' },
      { id: 'keys-create', title: 'Create Key' },
      { id: 'keys-list', title: 'List Keys' },
      { id: 'keys-revoke', title: 'Revoke Key' },
    ]
  },
  {
    id: 'observe-api',
    title: 'Observe API',
    icon: Zap,
    items: [
      { id: 'observe', title: 'Observe (Low-Effort)' },
      { id: 'observe-batch', title: 'Batch Observe' },
    ]
  },
  {
    id: 'context-api',
    title: 'Context API',
    icon: Cpu,
    items: [
      { id: 'context-scope', title: 'Scoped Context' },
      { id: 'context-now', title: 'Context Now' },
      { id: 'context-search-stream', title: 'Search (Streaming)' },
    ]
  },
  {
    id: 'facts-api',
    title: 'Facts API',
    icon: FileText,
    items: [
      { id: 'facts-query', title: 'Query Facts' },
      { id: 'facts-categories', title: 'List Categories' },
      { id: 'fact-by-id', title: 'Get Fact by ID' },
    ]
  },
  {
    id: 'entities-api',
    title: 'Entities API',
    icon: Cpu,
    items: [
      { id: 'entity-search', title: 'Find Entities' },
      { id: 'entity-query', title: 'Entity Query (MCP)' },
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
      { id: 'knowledge-gaps', title: 'Knowledge Gaps' },
      { id: 'context-staleness', title: 'Context Staleness' },
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
      { id: 'agent-story-dates', title: 'Story Dates' },
      { id: 'agent-search', title: 'Search Stories' },
      { id: 'agent-social', title: 'Get Relationships' },
      { id: 'agent-places', title: 'Search Places' },
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
          full context access, event reporting, story retrieval, relationships, and places search.
        </p>
      </motion.div>

      {agentEndpoints.map((endpoint, index) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </div>
  );
};

const APIKeysSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const keysEndpoints = Object.values(endpoints).filter(ep => ep.category === 'keys');

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
          API Keys Management
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary,
          lineHeight: 1.6,
        }}>
          Create and manage scoped API keys for third-party agents. Keys are prefixed with{' '}
          <code style={{ 
            backgroundColor: theme.colors.surface, 
            padding: '0.125rem 0.5rem', 
            borderRadius: '0.25rem',
            fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
          }}>dyt_</code>{' '}
          and can be scoped to specific categories of user context.
        </p>
      </motion.div>

      {keysEndpoints.map((endpoint, index) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </div>
  );
};

const ObserveAPISection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const observeEndpoints = Object.values(endpoints).filter(ep => ep.category === 'observe');

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
          Observe API
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary,
          lineHeight: 1.6,
        }}>
          Low-effort context ingestion for agents. Send any unstructured data — logs, transcripts, 
          notes, JSON — and Dytto automatically extracts, categorizes, and stores facts.
          Design principle: <strong>Low effort = high adoption</strong>.
        </p>
      </motion.div>

      {observeEndpoints.map((endpoint, index) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </div>
  );
};

const ContextAPISection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const contextEndpoints = Object.values(endpoints).filter(ep => ep.category === 'context');

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
          Context API
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary,
          lineHeight: 1.6,
        }}>
          Smart context retrieval endpoints. Instead of fetching everything, describe your task 
          and get only the context you need — reducing token usage and improving relevance.
        </p>
      </motion.div>

      {contextEndpoints.map((endpoint, index) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </div>
  );
};

const FactsAPISection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const factsEndpoints = Object.values(endpoints).filter(ep => ep.category === 'facts');

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
          Facts API
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary,
          lineHeight: 1.6,
        }}>
          Query structured facts about users with automatic scope-based filtering. 
          Your API key's scopes determine which facts you can access — agents only see 
          facts matching their permissions.
        </p>
      </motion.div>

      {factsEndpoints.map((endpoint, index) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </div>
  );
};

const EntitiesAPISection: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const entitiesEndpoints = Object.values(endpoints).filter(ep => ep.category === 'entities');

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
          Entities API
        </h2>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1rem)',
          color: theme.colors.textSecondary,
          lineHeight: 1.6,
        }}>
          Query and manage entities in a user's life — people, pets, places, objects, and organizations. 
          The Entity Query endpoint enables natural language questions like "How old is Eula?" 
          with answers grounded in extracted facts.
        </p>
      </motion.div>

      {entitiesEndpoints.map((endpoint, index) => (
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
    { endpoint: 'Knowledge Gaps', limit: '20 req/min', burst: '5 concurrent' },
    { endpoint: 'Context Staleness', limit: '5 req/5min', burst: '1 concurrent' },
    { endpoint: 'Agent Context', limit: '60 req/min', burst: '15 concurrent' },
    { endpoint: 'Report Events', limit: '100 req/min', burst: '20 concurrent' },
    { endpoint: 'Push Notification', limit: '10 req/min', burst: '3 concurrent' },
    { endpoint: 'Fetch Stories', limit: '60 req/min', burst: '10 concurrent' },
    { endpoint: 'Story Dates', limit: '60 req/min', burst: '10 concurrent' },
    { endpoint: 'Search Stories', limit: '30 req/min', burst: '5 concurrent' },
    { endpoint: 'Observe', limit: '60 req/min', burst: '10 concurrent' },
    { endpoint: 'Observe Batch', limit: '20 req/min', burst: '5 concurrent' },
    { endpoint: 'Facts Query', limit: '60 req/min', burst: '10 concurrent' },
    { endpoint: 'Scoped Context', limit: '60 req/min', burst: '10 concurrent' },
    { endpoint: 'Context Now', limit: '60 req/min', burst: '15 concurrent' },
    { endpoint: 'Context Search Stream', limit: '30 req/min', burst: '5 concurrent' },
    { endpoint: 'Entity Search', limit: '60 req/min', burst: '10 concurrent' },
    { endpoint: 'Entity Query (MCP)', limit: '30 req/min', burst: '5 concurrent' },
    { endpoint: 'Create API Key', limit: '10 req/min', burst: '3 concurrent' },
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
                {(activeSectionGroup === 'authentication') && <AuthenticationSection />}
                {(activeSectionGroup === 'api-keys') && <APIKeysSection />}
                {(activeSectionGroup === 'observe-api') && <ObserveAPISection />}
                {(activeSectionGroup === 'context-api') && <ContextAPISection />}
                {(activeSectionGroup === 'facts-api') && <FactsAPISection />}
                {(activeSectionGroup === 'entities-api') && <EntitiesAPISection />}
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
