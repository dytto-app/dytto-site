# Dytto API Documentation Review
**Last Updated:** 2026-03-01
**Reviewer:** Maya (Automated bi-weekly cron)

## ✅ Updates Made This Cycle (March 1, 2026)

### Major Additions to DocsPage.tsx

1. **Context Search Stream** (`POST /api/context/search/stream`)
   - ✅ NEW: SSE streaming synthesis endpoint for real-time context search
   - First token in <1s, full synthesis in 5-10s
   - Use for chat UI, not for agents (agents should use fast=true mode)

2. **Entity API Section** (NEW)
   - ✅ `GET /api/entities` — Find entities by name/type
   - ✅ `GET /api/mcp/entity-query` — Natural language entity queries ("How old is Eula?")
   - Enables agents to answer factual questions about people/pets/places in user's life

3. **Platform API Updates**
   - ✅ `GET /v1/personas/{id}/knowledge-gaps` — Surface context items user hasn't mentioned
   - ✅ `GET /v1/context/staleness` — Detect temporal claims that may be outdated

4. **Agent API Addition**
   - ✅ `GET /api/agent/stories/dates` — Get recent story dates for calendar views

5. **Facts API Addition**
   - ✅ `GET /api/v1/facts/{fact_id}` — Get specific fact by ID (was noted as missing)

6. **Observe API Update**
   - ✅ Updated documentation to include `async=true` parameter for fire-and-forget mode

### APIShowcase.tsx Redesign
- Replaced simulation/persona examples with more developer-friendly examples:
  - **Observe API** — Low-effort fact ingestion
  - **Scoped Context** — Task-based context retrieval
  - **Agent Context** — Full context for AI personalization

### Rate Limits Updated
- Added limits for all new endpoints (Entity Query, Context Search Stream, etc.)

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
| `/api/v1/observe` | POST | API Key (observe scope) | ✅ Documented (with async param) |
| `/api/v1/observe/batch` | POST | API Key (observe scope) | ✅ Documented |

### Facts API — `/api/v1/facts/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/v1/facts/query` | POST | API Key or JWT | ✅ Documented |
| `/api/v1/facts/categories` | GET | API Key or JWT | ✅ Documented |
| `/api/v1/facts/{fact_id}` | GET | API Key or JWT | ✅ Documented (NEW) |

### Entity API — `/api/entities/*` (NEW)

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/entities` | GET | User JWT | ✅ Documented |
| `/api/entities/{id}` | GET | User JWT | ⚠️ Exists, not documented |
| `/api/entities/{id}/facts` | GET | User JWT | ⚠️ Exists, not documented |
| `/api/entities/search` | GET | User JWT | ⚠️ Exists, not documented |
| `/api/mcp/entity-query` | GET | User JWT | ✅ Documented |
| `/api/entities/by-type/{type}` | GET | User JWT | ⚠️ Exists, not documented |
| `/api/entity-gaps` | GET | User JWT | ⚠️ Exists (PM agent), not documented |
| `/api/entity-gaps/{id}/resolve` | POST | User JWT | ⚠️ Exists (PM agent), not documented |

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
| `/api/context/search/stream` | POST | API Key or JWT | ✅ Documented (NEW) |
| `/api/context/initialize` | POST | User JWT | ❌ Consumer app |
| `/api/context/process` | POST | User JWT | ❌ Internal |

### Platform API — `/v1/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/v1/simulation-contexts/request` | POST | OAuth | ✅ Documented |
| `/v1/personas/{id}/interact` | POST | User JWT | ✅ Documented |
| `/v1/personas/{id}/interact/simple` | POST | User JWT | ✅ Documented |
| `/v1/personas/{id}/query-context` | POST | User JWT | ✅ Documented |
| `/v1/personas/{id}/knowledge-gaps` | GET | User JWT | ✅ Documented (NEW) |
| `/v1/context/staleness` | GET | User JWT | ✅ Documented (NEW) |

### Agent API — `/api/agent/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/agent/context` | GET | Service Key | ✅ Documented |
| `/api/agent/events` | GET/POST | Service Key | ✅ Documented |
| `/api/agent/notify` | POST | Service Key | ✅ Documented |
| `/api/agent/stories` | GET | Service Key | ✅ Documented |
| `/api/agent/stories/dates` | GET | Service Key | ✅ Documented (NEW) |
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
| OAuth 2.0 Client Credentials | Bearer token from `/oauth/token` | Platform API (simulation) |
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

1. **Document Entity CRUD endpoints** — `/api/entities/{id}`, `/api/entities/{id}/facts`, `/api/entities/by-type/{type}`

2. **Document `/api/keys/{key_id}/skill.md`** — Generates personalized SKILL.md files for agent developers

3. **Consider documenting `/api/stories/dates`** for consumer apps — useful for calendar integration

4. **Fix TypeScript errors in DocsPage.tsx** — The `endpoint.scope` property access causes TS errors because not all endpoints have a scope field

5. **Consider interactive API playground** — Let devs test endpoints directly from docs

6. **Add Python SDK examples** — Show requests library usage alongside fetch

---

## Files Changed This Cycle

- `src/pages/DocsPage.tsx` — Added 7 new endpoints, new Entities API section
- `src/components/APIShowcase.tsx` — Redesigned with agent-focused examples
- `API_REVIEW.md` — Updated

---

## TypeScript Note

Pre-existing TS errors exist in DocsPage.tsx and DocsPageClient.tsx:
- `endpoint.scope` property access errors (not all endpoints have scope field)
- `react-router-dom` module not found errors

These are unrelated to documentation content and should be fixed separately.

---

## Next Run

Scheduled: March 15, 2026 at 4:00 AM (bi-weekly cron)
