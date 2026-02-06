# Dytto API Documentation Review
**Last Updated:** 2026-02-06
**Reviewer:** Maya

## ✅ Updates Made This Cycle

### 3. Added API Key Management Endpoints
New API endpoints for managing user API keys:
- `/api/keys` (POST) - Create a new API key with specified scopes and optional expiration.
- `/api/keys/{id}` (DELETE) - Revoke an existing API key.
- Authentication uses User JWT.

### 1. Created `src/components/api/APIDocumentation.tsx`
New comprehensive API reference component with:
- All Platform API endpoints (/v1/*)
- All Agent API endpoints (/api/agent/*)
- Three auth methods explained (OAuth, JWT, Service Key)
- Rate limits documented
- Copy-paste ready code examples
- Response examples

### 2. Updated `src/components/APIShowcase.tsx`
Fixed code examples:
- ✅ Added correct base URL (https://api.dytto.app)
- ✅ Fixed auth header comments (OAuth vs JWT)
- ✅ Updated request/response formats to match Pydantic models
- ✅ Added session_id and save_history params
- ✅ Added custom_inference element type example

---

## API Endpoints Documented

### Platform API (v1) — Third-party integrations

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/v1/simulation-contexts/request` | POST | OAuth (scope: simulation:generate_profiles) | ✅ Documented |
| `/v1/personas/{id}/interact` | POST | User JWT | ✅ Documented |
| `/v1/personas/{id}/interact/simple` | POST | User JWT | ✅ Documented (NEW) |
| `/v1/personas/{id}/query-context` | POST | User JWT | ✅ Documented |

### Agent API — AI agents in ecosystem

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/agent/context` | GET | Service Key | ✅ Documented (NEW) |
| `/api/agent/events` | GET/POST | Service Key | ✅ Documented (NEW) |
| `/api/agent/notify` | POST | Service Key | ✅ Documented (NEW) |
| `/api/agent/stories` | GET | Service Key | ✅ Documented (NEW) |
| `/api/agent/stories/dates` | GET | Service Key | ⚠️ Exists, not documented |
| `/api/agent/stories/search` | GET | Service Key | ✅ Documented (NEW) |
| `/api/agent/social` | GET | Service Key | ⚠️ Exists, not documented |
| `/api/agent/places` | GET | Service Key | ⚠️ Exists, not documented |
| `/api/agent/messages` | GET | Service Key | ⚠️ Exists, not documented |

### API Key Management API — Manage API Keys for Third-Party Agents

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/keys` | POST | User JWT | ✅ Documented (NEW) |
| `/api/keys/{id}` | DELETE | User JWT | ✅ Documented (NEW) |

### Context API — User-facing context endpoints

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/context` | GET | User JWT | ❌ Not documented (consumer app) |
| `/api/context/summary` | GET | User JWT | ❌ Not documented |
| `/api/context/patterns` | GET | User JWT | ❌ Not documented |
| `/api/context/insights` | GET | User JWT | ❌ Not documented |
| `/api/context/now` | GET | User JWT | ❌ Not documented |

### Internal/Admin — DO NOT DOCUMENT

| Endpoint | Reason |
|----------|--------|
| `/admin/*` | Internal admin functions |
| `/api/mcp/update-context` | Clawdbot integration only |
| `/api/chat/*` | Consumer app internal |

---

## Integration Status

### To Use APIDocumentation Component:

```tsx
// In APILandingPage.tsx or a new DocsPage.tsx
import APIDocumentation from '../components/api/APIDocumentation';

// Add to page:
<APIDocumentation />
```

---

## Recommendations for Next Cycle

1. **Add missing Agent API endpoints** — `/api/agent/social`, `/api/agent/places`, `/api/agent/messages`
2. **Create interactive playground** — Let developers test endpoints with their API keys
3. **Generate OpenAPI spec** — Auto-generate from Pydantic models
4. **Add SDK examples** — Python and TypeScript SDK snippets
5. **Document error codes** — Standard error response format

---

## Files Changed

- `src/components/api/APIDocumentation.tsx` — NEW
- `src/components/APIShowcase.tsx` — UPDATED
- `src/components/AuthProvider.tsx` — NEW
- `src/pages/ApiKeysPage.tsx` — NEW
- `src/pages/LoginPage.tsx` — NEW
- `src/utils/supabaseAuth.ts` — NEW
- `src/App.tsx` — UPDATED
- `API_REVIEW.md` — UPDATED

---

## Next Run

Scheduled: Feb 15, 2026 at 4:00 AM (bi-weekly cron)
