# Dytto API Documentation Review
**Last Updated:** 2026-04-01
**Reviewer:** Maya (Automated bi-weekly cron)

## ✅ Review Cycle (April 1, 2026)

### Status: No Changes Needed

**Analysis Summary:**
- Compared backend API routes (`~/projects/dytto/python-backend/api/`) against documentation
- All documented endpoints remain accurate
- No new endpoints added since last review
- Recent commits (Mar 29 - Mar 30) were code quality fixes only:
  - `62cf9dd` — Replace `traceback.print_exc()` with `logger.exception()` 
  - `d04d2e3` — Same logging improvements in knowledge/dytto routes
  - `cd98196` — Replace bare except clauses with specific exception types

**Live API Tests (April 1, 2026):**
- ✅ `GET /api/keys/scopes` — Returns 20 scopes with descriptions
- ✅ `GET /api/v1/facts/categories` — Returns 15 categories with scope mappings
- ✅ `POST /api/v1/observe` (async mode) — Returns 202 with "Observation queued"
- ✅ `GET /api/context/now` — Returns real-time context snapshot

All examples in documentation match live API behavior.

---

## Previous Updates (March 15, 2026)

### Observe API Updates

1. **`ttl_hours` Parameter for Volatile Facts** (#209)
   - ✅ NEW: Added `ttl_hours` parameter documentation to Observe endpoint
   - Allows setting temporary facts that auto-expire (1-8760 hours)
   - Response now includes `ttl_hours` and `expires_at` when TTL is specified
   - Use cases: Twitter auth state (24h), service status (24h), calendar events (12h)

2. **`async` Parameter Clarification**
   - ✅ Updated docs to show both async (default) and sync response formats
   - Async mode returns 202 with "Observation queued" message
   - Sync mode (async=false) returns full extracted facts

### Facts API Additions

1. **Get Fact by ID** (`GET /api/v1/facts/{fact_id}`)
   - ✅ NEW: Added endpoint documentation
   - Retrieve a specific fact by its UUID
   - Returns full fact details including entities and created_at

### Entity API Section (NEW)

Added complete Entity API documentation with 5 endpoints:

1. **Find Entities** (`GET /api/entities`)
   - ✅ NEW: Search entities by name with optional type filtering
   - Query params: `q` (required), `type` (optional)

2. **Get Entity** (`GET /api/entities/{entity_id}`)
   - ✅ NEW: Get entity with all facts and relationships
   - Returns full entity profile with attributes

3. **Get Entity Facts** (`GET /api/entities/{entity_id}/facts`)
   - ✅ NEW: Get all facts about a specific entity
   - Query params: `key` (filter by attribute), `include_historical`

4. **Search Entities** (`GET /api/entities/search`)
   - ✅ NEW: Semantic search across entities
   - Returns similarity scores and top facts

5. **Natural Language Query** (`GET /api/mcp/entity-query`)
   - ✅ NEW: Ask factual questions in natural language
   - Returns suggested answer based on entity facts

### Sidebar Navigation

- ✅ Added "Get Fact by ID" to Facts API section
- ✅ Added new "Entity API" section with all 5 endpoints

---

## API Endpoints Status

### API Keys Management — `/api/keys/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/keys/scopes` | GET | Public | ✅ Documented |
| `/api/keys` | POST | User JWT | ✅ Documented |
| `/api/keys` | GET | User JWT | ✅ Documented |
| `/api/keys/{key_id}` | DELETE | User JWT | ✅ Documented |
| `/api/keys/{key_id}/skill.md` | GET | User JWT | ⚠️ Exists, not documented (generates SKILL.md for agents) |

### Observe API — `/api/v1/observe`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/v1/observe` | POST | API Key (observe scope) | ✅ Documented (with async + ttl_hours params) |
| `/api/v1/observe/batch` | POST | API Key (observe scope) | ✅ Documented |

### Facts API — `/api/v1/facts/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/v1/facts/query` | POST | API Key or JWT | ✅ Documented |
| `/api/v1/facts/categories` | GET | API Key or JWT | ✅ Documented |
| `/api/v1/facts/{fact_id}` | GET | API Key or JWT | ✅ Documented (NEW this cycle) |

### Entity API — `/api/entities/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/entities` | GET | User JWT | ✅ Documented (NEW this cycle) |
| `/api/entities/{id}` | GET | User JWT | ✅ Documented (NEW this cycle) |
| `/api/entities/{id}/facts` | GET | User JWT | ✅ Documented (NEW this cycle) |
| `/api/entities/search` | GET | User JWT | ✅ Documented (NEW this cycle) |
| `/api/mcp/entity-query` | GET | User JWT | ✅ Documented (NEW this cycle) |
| `/api/entities/by-type/{type}` | GET | User JWT | ⚠️ Exists, not documented (lower priority) |
| `/api/entity-gaps` | GET | User JWT | ❌ Internal (PM agent only) |
| `/api/entity-gaps/{id}/resolve` | POST | User JWT | ❌ Internal (PM agent only) |

### Context API — `/api/context/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/context` | GET | API Key or JWT | ❌ Consumer app, light docs only |
| `/api/context/latest` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/summary` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/patterns` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/insights` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/quality` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/scope` | POST | API Key or JWT | ✅ Documented |
| `/api/context/now` | GET | API Key or JWT | ✅ Documented |
| `/api/context/search` | POST | API Key or JWT | ❌ Consumer app (use fast=true for agents) |
| `/api/context/search/stream` | POST | API Key or JWT | ✅ Documented |
| `/api/context/initialize` | POST | User JWT | ❌ Consumer app |
| `/api/context/process` | POST | User JWT | ❌ Internal |

### Platform API — `/v1/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/v1/simulation-contexts/request` | POST | OAuth | ✅ Documented |
| `/v1/personas/{id}/interact` | POST | User JWT | ✅ Documented |
| `/v1/personas/{id}/interact/simple` | POST | User JWT | ✅ Documented |
| `/v1/personas/{id}/query-context` | POST | User JWT | ✅ Documented |
| `/v1/personas/{id}/knowledge-gaps` | GET | User JWT | ✅ Documented |
| `/v1/context/staleness` | GET | User JWT | ✅ Documented |

### Agent API — `/api/agent/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/agent/context` | GET | Service Key | ✅ Documented |
| `/api/agent/events` | GET/POST | Service Key | ✅ Documented |
| `/api/agent/notify` | POST | Service Key | ✅ Documented |
| `/api/agent/stories` | GET | Service Key | ✅ Documented |
| `/api/agent/stories/dates` | GET | Service Key | ✅ Documented |
| `/api/agent/stories/search` | GET | Service Key | ✅ Documented |
| `/api/agent/social` | GET | Service Key | ✅ Documented |
| `/api/agent/places` | GET | Service Key | ✅ Documented |
| `/api/agent/messages` | GET | Service Key | ⚠️ Exists (polling fallback), not documented |
| `/api/agent/whatsapp/link` | POST | User JWT | ❌ Consumer app integration |
| `/api/agent/whatsapp/status` | GET | User JWT | ❌ Consumer app integration |
| `/api/agent/whatsapp/unlink` | POST | User JWT | ❌ Consumer app integration |

### Stories API — `/api/stories/*` (Consumer App)

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/stories/generate` | POST | User JWT | ❌ Consumer app (requires dataPoints from iOS) |
| `/api/stories/generate-autolife` | POST | User JWT | ❌ Consumer app |
| `/api/stories/generate-autolife-v2` | POST | User JWT | ❌ Consumer app |
| `/api/stories/dates` | GET | API Key or JWT | ⚠️ Useful for agents — consider documenting |
| `/api/stories/date/{date}` | GET | API Key or JWT | ⚠️ Useful for agents — consider documenting |
| `/api/stories/search` | POST | API Key or JWT | ⚠️ Already have /agent/stories/search |

### Internal/Admin — DO NOT DOCUMENT

| Endpoint | Reason |
|----------|--------|
| `/admin/*` | Internal admin functions |
| `/api/mcp/*` (except entity-query) | Clawdbot integration only |
| `/api/chat/*` | Consumer app internal |
| `/api/logs/*` | Internal debugging |
| `/api/schwab/*` | Internal finance integration |
| `/api/plaid/*` | Internal finance integration |

---

## Authentication Methods Summary

| Method | Token Format | Use Case |
|--------|--------------|----------|
| OAuth 2.0 Client Credentials | Bearer token from `/oauth/token` | Platform API (simulation), and for cross-domain authentication redirects |
| User JWT | Bearer token from Supabase auth | Consumer app, user-consented access |
| Agent Service Key | `dyt_...` API key | Agent API, Observe, Facts, Context |

---

## Scope System

### Available Scopes for API Keys

**Domain Scopes (category access):**
- `location` → places, transportation
- `schedule` → calendar, timing patterns
- `preferences` → user likes/dislikes
- `relationships` → family, friends
- `work` → job, career context
- `health` → fitness, medical
- `lifestyle` → routines, hobbies
- `financial` → money-related (use carefully)
- `food` → dietary preferences
- `travel` → places, transportation, schedule
- `entertainment` → movies, music, games

**Capability Scopes:**
- `context:read` — Full context narrative access
- `context:write` — Write context (via observe)
- `patterns:read` — Behavioral patterns
- `stories:read` — Daily stories
- `search:execute` — Semantic search on context
- `observe` — Push observations for fact extraction

---

## Recommendations for Next Cycle

1. **Document `/api/keys/{key_id}/skill.md`** — Generates personalized SKILL.md files for agent developers

2. **Document `/api/entities/by-type/{type}`** — List entities by type (lower priority, but useful)

3. **Consider documenting `/api/stories/dates`** for consumer apps — useful for calendar integration

4. **Add Python SDK examples** — Show requests library usage alongside fetch

5. **Consider interactive API playground** — Let devs test endpoints directly from docs

---

## Files Changed This Cycle

- `src/components/pages/DocsPageClient.tsx` — Added ttl_hours to Observe, added Facts get, added full Entity API section (6 new endpoints total)
- `API_REVIEW.md` — Updated

---

## TypeScript Note

Pre-existing TS errors exist in DocsPageClient.tsx and DocsPageClient.tsx:
- `endpoint.scope` property access errors (not all endpoints have scope field)
- These are unrelated to documentation content and should be fixed separately.

---

## Next Run

Scheduled: April 15, 2026 at 4:00 AM (bi-weekly cron)
