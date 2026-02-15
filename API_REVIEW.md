# Dytto API Documentation Review
**Last Updated:** 2026-02-15
**Reviewer:** Maya (Automated bi-weekly cron)

## ✅ Updates Made This Cycle (Feb 15, 2026)

### Major Additions to DocsPage.tsx

1. **API Keys Management Section** (`/api/keys/*`)
   - ✅ `GET /api/keys/scopes` — List available scopes
   - ✅ `POST /api/keys` — Create scoped API key
   - ✅ `GET /api/keys` — List user's keys
   - ✅ `DELETE /api/keys/{key_id}` — Revoke a key

2. **Observe API Section** (`/api/v1/observe`)
   - ✅ `POST /api/v1/observe` — Low-effort fact ingestion
   - ✅ `POST /api/v1/observe/batch` — Batch observation processing

3. **Context API Section** (new endpoints)
   - ✅ `POST /api/context/scope` — Task-based scoped context retrieval
   - ✅ `GET /api/context/now` — Real-time context snapshot

4. **Facts API Section** (`/api/v1/facts/*`)
   - ✅ `POST /api/v1/facts/query` — Query facts with scope filtering
   - ✅ `GET /api/v1/facts/categories` — List fact categories

5. **Agent API Additions**
   - ✅ `GET /api/agent/social` — Get user relationships
   - ✅ `GET /api/agent/places` — Search nearby places

### Other Updates
- ✅ Updated sidebar navigation with new API sections
- ✅ Added rate limits for new endpoints
- ✅ Updated endpoint count in stats

---

## API Endpoints Status

### API Keys Management — `/api/keys/*` (NEW)

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/keys/scopes` | GET | Public | ✅ Documented |
| `/api/keys` | POST | User JWT | ✅ Documented |
| `/api/keys` | GET | User JWT | ✅ Documented |
| `/api/keys/{key_id}` | DELETE | User JWT | ✅ Documented |
| `/api/keys/{key_id}/skill.md` | GET | User JWT | ⚠️ Exists, not documented (generates SKILL.md for agents) |

### Observe API — `/api/v1/observe` (NEW)

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/v1/observe` | POST | API Key (observe scope) | ✅ Documented |
| `/api/v1/observe/batch` | POST | API Key (observe scope) | ✅ Documented |

### Facts API — `/api/v1/facts/*` (NEW)

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/v1/facts/query` | POST | API Key or JWT | ✅ Documented |
| `/api/v1/facts/categories` | GET | API Key or JWT | ✅ Documented |
| `/api/v1/facts/{fact_id}` | GET | API Key or JWT | ⚠️ Exists, not documented |

### Context API — `/api/context/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/context` | GET | API Key or JWT | ❌ Consumer app, light docs only |
| `/api/context/latest` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/summary` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/patterns` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/insights` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/quality` | GET | API Key or JWT | ❌ Consumer app |
| `/api/context/scope` | POST | API Key or JWT | ✅ Documented (NEW) |
| `/api/context/now` | GET | API Key or JWT | ✅ Documented (NEW) |
| `/api/context/search` | POST | API Key or JWT | ❌ Consumer app |
| `/api/context/initialize` | POST | User JWT | ❌ Consumer app |
| `/api/context/process` | POST | User JWT | ❌ Internal |

### Platform API — `/v1/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/v1/simulation-contexts/request` | POST | OAuth | ✅ Documented |
| `/v1/personas/{id}/interact` | POST | User JWT | ✅ Documented |
| `/v1/personas/{id}/interact/simple` | POST | User JWT | ✅ Documented |
| `/v1/personas/{id}/query-context` | POST | User JWT | ✅ Documented |

### Agent API — `/api/agent/*`

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/agent/context` | GET | Service Key | ✅ Documented |
| `/api/agent/events` | GET/POST | Service Key | ✅ Documented |
| `/api/agent/notify` | POST | Service Key | ✅ Documented |
| `/api/agent/stories` | GET | Service Key | ✅ Documented |
| `/api/agent/stories/dates` | GET | Service Key | ⚠️ Exists, not documented |
| `/api/agent/stories/search` | GET | Service Key | ✅ Documented |
| `/api/agent/social` | GET | Service Key | ✅ Documented (NEW) |
| `/api/agent/places` | GET | Service Key | ✅ Documented (NEW) |
| `/api/agent/messages` | GET | Service Key | ⚠️ Exists, not documented |
| `/api/agent/whatsapp/link` | POST | User JWT | ❌ Consumer app integration |
| `/api/agent/whatsapp/status` | GET | User JWT | ❌ Consumer app integration |
| `/api/agent/whatsapp/unlink` | POST | User JWT | ❌ Consumer app integration |

### Internal/Admin — DO NOT DOCUMENT

| Endpoint | Reason |
|----------|--------|
| `/admin/*` | Internal admin functions |
| `/api/mcp/*` | Clawdbot integration only |
| `/api/chat/*` | Consumer app internal |
| `/api/logs/*` | Internal debugging |

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
- `patterns:read` — Behavioral patterns
- `stories:read` — Daily stories
- `search:execute` — Semantic search on context
- `observe` — Push observations for fact extraction

---

## Recommendations for Next Cycle

1. **Document `/api/keys/{key_id}/skill.md`** — This endpoint generates personalized SKILL.md files for agent developers based on their key's scopes. Great for onboarding!

2. **Document `/api/v1/facts/{fact_id}`** — Get specific fact by ID

3. **Consider interactive API playground** — Let devs test endpoints directly from docs

4. **Add Python SDK examples** — Show requests library usage alongside fetch

5. **Update APIShowcase.tsx** — Current examples (simulation, persona interaction) are less commonly used than Observe and Scoped Context. Consider showcasing the agent-focused APIs.

---

## Files Changed

- `src/pages/DocsPage.tsx` — Major update (19 new endpoints documented)
- `API_REVIEW.md` — Updated

---

## Testing

To verify changes compile:
```bash
cd ~/projects/dytto-site
npm run build
```

---

## Next Run

Scheduled: March 1, 2026 at 4:00 AM (bi-weekly cron)
