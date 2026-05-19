---
name: perf-test-writer
description: >
  Generates k6 load and performance test suites for the TalentForge backend API. Creates smoke,
  load, stress, spike, soak, breakpoint, and auth-perf scenarios with shared helpers, SLA
  thresholds, and realistic user journey simulation. Use this skill when the user wants to add
  load tests, performance tests, capacity testing, benchmark the API, stress test the backend,
  or measure auth throughput. Triggers after backend-writer produces approved API endpoints.
  Also triggers when the user says "add load tests", "performance test", "stress test the API",
  "benchmark login", "k6 tests", "capacity test", or "how much load can it handle".
triggers:
  - load test
  - performance test
  - stress test
  - benchmark
  - k6
  - capacity test
  - how much load
  - perf test
  - add load tests
  - stress test the API
  - spike test
  - soak test
  - auth throughput
---

# Performance Test Writer

Generates a complete k6 load and performance test suite tailored to the project's API surface, user personas, and SLA requirements.

## Context Manifest

```yaml
unit_type: one_shot
mode: build          # forger overrides to `plan` for pre-build plan invocations
required_inputs:
  - docs/architecture/api.md
  - docs/architecture/system.md
  - backend/app/api/routes/
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/domain-doc.md
  - frontend/
budget_tokens: 900000
outputs:
  - k6/smoke.js
  - k6/load.js
  - k6/stress.js
  - k6/spike.js
  - k6/soak.js
  - k6/helpers/auth.js
artifacts:
  pre_build_plan:   docs/quality/perf-test-spec.md      # MODE: plan only
  summary:          docs/quality/perf-test-summary.md   # MODE: build only
  return_contract:  docs/quality/.perf-test-writer.return.json
```

## MODE Convention

Forger sets `MODE: plan` or `MODE: build` in the Task prompt. **The Task-prompt `MODE:` header always takes precedence over the manifest's `mode:` default** (see `_shared/manifest-format.md` §MODE Convention → Precedence).

### MODE: plan
Write ONLY the pre-build plan at `artifacts.pre_build_plan` (see manifest). No code changes. No writes to `outputs:` paths. No summary, tracker slice, or return contract.

The plan must contain the required section headers from `_shared/artifact-taxonomy.md (project-level perf-test-spec)`:
Scenarios (smoke/load/stress/spike/soak/breakpoint/auth-perf) · Per-scenario VU + duration profile · SLA thresholds (p95/p99/error rate) · User journey list · Shared helpers inventory · Open questions

Target length ~600–800 words. This is what the user reviews at the **plan mini-gate** before any code is written.

On completion return `status: complete` with `artifact_paths.pre_build_plan` set and the other `artifact_paths.*` null.

### MODE: build
Read the approved plan from `artifacts.pre_build_plan` — forger guarantees it exists and was approved at the plan mini-gate. Then:
1. Write code to the paths declared in `outputs:` (manifest).
2. Write the per-unit summary at `artifacts.summary` (≤300 words) with these five headers: Suite files created, Scenario coverage table, Throughput + latency baseline targets, Known limitations, How to run.
3. Write the JSON return contract at `artifacts.return_contract` per `_shared/return-contract.md`.

Never write code in `MODE: plan`. Never overwrite the pre-build plan in `MODE: build` — it is already approved and immutable for this phase.

Forger invokes as a Task subagent (one_shot — the perf suite is generated once per project after all phases are built, operating on the full API surface). Return JSON contract: see `.claude/skills/_shared/return-contract.md`. Do NOT call AskUserQuestion; forger owns the approval gate.

---

## Pre-conditions

Before generating, confirm:
1. Backend is implemented (API routes exist in `backend/app/api/routes/`)
2. API spec is available (check `docs/architecture/api.md` or scan the OpenAPI schema at `/api/v1/openapi.json`)
3. Auth is implemented (login endpoint exists, superuser is seeded)
4. Database is running and migrations are applied

If any pre-condition is missing, tell the user what to do first.

---

## Output Structure

Generate all files inside the project's working directory (NOT boilerplate/):

```
k6/
├── lib/
│   ├── config.js          # Base URL, SLA thresholds, env var overrides
│   └── helpers.js          # Auth, CRUD wrappers, user journey, random data
├── scenarios/
│   ├── smoke.js            # CI gate (2 VUs, 30s)
│   ├── load.js             # Normal traffic (50 VUs, 10m)
│   ├── stress.js           # Beyond normal (200 VUs, 15m)
│   ├── spike.js            # Sudden burst (10→300 VUs, 5m)
│   ├── soak.js             # Endurance (50 VUs, 30m+)
│   ├── breakpoint.js       # Find max capacity (10→500+ VUs, auto-abort)
│   └── auth-perf.js        # Login/signup throughput isolation
└── README.md               # Quick-start, scenario matrix, env vars
```

---

## Step 1: Discover the API Surface

Before writing tests, scan the project's actual endpoints:

```bash
# If backend is running
curl -s http://localhost:8000/api/v1/openapi.json | python3 -c "
import json,sys
spec=json.load(sys.stdin)
for path,methods in spec['paths'].items():
    for method in methods:
        print(f'{method.upper():7s} {path}')
"
```

If the backend isn't running, scan `backend/app/api/routes/*.py` for route definitions.

Classify each endpoint:

| Priority | Criteria | Examples |
|----------|----------|---------|
| **P0** | Auth gateway, every-page-load, health probe | `/login/access-token`, `/users/me`, `/utils/health-check/` |
| **P1** | Core CRUD, paginated lists, write paths | `/items/`, `/review-cycles/`, `/goals/` |
| **P2** | Admin operations, infrequent actions | `/users/{id}`, `/password-recovery/` |

---

## Step 2: Generate `k6/lib/config.js`

```javascript
/**
 * Shared configuration: base URL, API paths, default thresholds.
 * Override at runtime: k6 run -e BASE_URL=https://staging.example.com ...
 */

export const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";
export const API = `${BASE_URL}/api/v1`;

// Superuser credentials (from .env / initial_data.py)
export const SUPERUSER_EMAIL = __ENV.SUPERUSER_EMAIL || "admin@example.com";
export const SUPERUSER_PASSWORD = __ENV.SUPERUSER_PASSWORD || "changethis";

// Default thresholds
export const DEFAULT_THRESHOLDS = {
  http_req_failed: [{ threshold: "rate<0.01", abortOnFail: true }],
  http_req_duration: ["p(95)<500", "p(99)<1500"],
};

// Stricter SLA thresholds for production validation
export const SLA_THRESHOLDS = {
  http_req_failed: [{ threshold: "rate<0.001", abortOnFail: true }],
  http_req_duration: ["p(95)<300", "p(99)<800"],
  "http_req_duration{name:health_check}": ["p(99)<100"],
  "http_req_duration{name:login}": ["p(95)<600"],
  "http_req_duration{name:get_me}": ["p(95)<200"],
};
```

**Customization:** Add per-endpoint thresholds for every P0 and P1 endpoint discovered in Step 1.

---

## Step 3: Generate `k6/lib/helpers.js`

Must include:

### Random data generators
```javascript
export function randomString(len = 10) { /* ... */ }
export function randomEmail() { return `k6_${randomString(8)}_${Date.now()}@loadtest.io`; }
export function randomPassword() { return `K6pass_${randomString(12)}!`; }
```

### Auth helpers
```javascript
export function login(email, password) {
  // POST /login/access-token with form-encoded body
  // check() for status 200 and access_token present
  // fail() if login fails — stops the VU iteration
  // Return { token, headers } for authenticated requests
}

export function loginAsSuperuser() { return login(SUPERUSER_EMAIL, SUPERUSER_PASSWORD); }

export function registerAndLogin() {
  // POST /users/signup to create a fresh user
  // Then login() with the new credentials
  // Return { email, password, auth }
}
```

### CRUD wrappers

For EACH endpoint discovered in Step 1, create a wrapper function:
```javascript
export function healthCheck() { /* GET /utils/health-check/ with tag */ }
export function getMe(authHeaders) { /* GET /users/me with tag */ }
export function listItems(authHeaders) { /* GET /items/ with tag */ }
export function createItem(authHeaders) { /* POST /items/ with tag */ }
// ... one function per endpoint
```

Every wrapper MUST:
1. Use `tags: { name: "endpoint_name" }` for per-endpoint metric filtering
2. Use `check()` to verify expected status code
3. Return the response object

### User journey function
```javascript
export function userJourney(email, password) {
  // 1. Login
  // 2. GET /users/me (profile load)
  // 3. GET main list endpoint (e.g., /items/, /review-cycles/)
  // 4. POST create a resource
  // 5. GET the created resource
  // 6. PUT/PATCH update it
  // 7. DELETE it (cleanup)
}
```

The journey should mirror actual user behavior. Include the project's domain-specific endpoints (review cycles, goals, etc.) if they exist.

---

## Step 4: Generate Scenario Files

### 4.1 Smoke Test (`scenarios/smoke.js`)

```javascript
export const options = {
  vus: 2,
  duration: "30s",
  thresholds: { ...DEFAULT_THRESHOLDS, http_req_duration: ["p(95)<1000"] },
};

export default function () {
  healthCheck();
  const { headers } = loginAsSuperuser();
  getMe(headers);
  // Hit every P0 and P1 endpoint once
  // CRUD cycle: create → read → update → delete
  sleep(1);
}
```

### 4.2 Average Load Test (`scenarios/load.js`)

```javascript
export const options = {
  stages: [
    { duration: "2m", target: 50 },   // ramp up
    { duration: "5m", target: 50 },   // steady state
    { duration: "2m", target: 0 },    // ramp down
  ],
  thresholds: SLA_THRESHOLDS,
};

export function setup() {
  // Pre-register 20 test users to avoid signup bottleneck
  const users = [];
  for (let i = 0; i < 20; i++) {
    const u = registerAndLogin();
    users.push({ email: u.email, password: u.password });
  }
  return { users };
}

export default function (data) {
  const user = data.users[__VU % data.users.length];
  if (Math.random() < 0.1) healthCheck();
  userJourney(user.email, user.password);
  sleep(1 + Math.random() * 2);  // think time
}
```

### 4.3 Stress Test (`scenarios/stress.js`)

Ramp in stages: 25 → 50 → 100 → 150 → 200 VUs, then scale down. Relaxed thresholds: `p(95)<800`, `errors<5%`.

### 4.4 Spike Test (`scenarios/spike.js`)

Baseline 10 VUs → instant jump to 300 → hold 1m → drop back → observe recovery. Generous thresholds: `p(95)<2000`, `errors<10%`.

### 4.5 Soak Test (`scenarios/soak.js`)

50 VUs sustained for 30+ minutes. Same SLA thresholds as load. Add a custom `Trend` metric for iteration duration to detect drift.

### 4.6 Breakpoint Test (`scenarios/breakpoint.js`)

Use `ramping-arrival-rate` executor. Start at 5 iter/s, ramp to 300 iter/s over 20 minutes. Auto-abort when `p(95)>2000` or `error rate>5%` (with 30s delay).

### 4.7 Auth Performance Test (`scenarios/auth-perf.js`)

Three concurrent sub-scenarios:
- **login_flood**: `constant-arrival-rate` at 20 login/s for 3m
- **signup_burst**: `ramping-vus` 0→30 for signup concurrency
- **token_validation**: `constant-vus` 20 VUs repeatedly calling `/users/me`

Custom metrics: `login_latency`, `signup_latency`, `login_success_total`, `signup_success_total`.

---

## Step 5: Generate `k6/README.md`

Must include:
1. Prerequisites (k6 install instructions for Linux/macOS/Docker)
2. Quick start commands for each scenario
3. Scenario matrix table (script, type, VUs, duration, when to run)
4. Environment variable table (BASE_URL, SUPERUSER_EMAIL, etc.)
5. Output/reporting commands (JSON, CSV, Grafana Cloud)
6. Threshold explanation table

---

## Step 6: Run and Verify

After generating all files:

1. **Start the backend** if not running
2. **Re-seed superuser** (tests may have cleaned the DB): `python app/initial_data.py`
3. **Run smoke test** to verify everything works:
   ```bash
   k6 run k6/scenarios/smoke.js
   ```
4. If smoke passes, report success. If it fails, debug and fix.
5. Offer to run the full suite (load, stress, spike, auth-perf) — warn this takes ~30 minutes.

---

## SLA Threshold Guidelines

| Environment | p95 Target | p99 Target | Error Rate | Login p95 |
|-------------|-----------|-----------|------------|-----------|
| Smoke (CI) | < 1,000ms | < 2,000ms | < 1% | < 1,000ms |
| Load (SLA) | < 300ms | < 800ms | < 0.1% | < 600ms |
| Stress | < 800ms | < 2,000ms | < 5% | < 2,000ms |
| Spike | < 2,000ms | < 5,000ms | < 10% | < 3,000ms |
| Soak | < 300ms | < 800ms | < 0.1% | < 600ms |
| Breakpoint | < 2,000ms (abort) | — | < 5% (abort) | — |

---

## Known Performance Characteristics

### argon2 Password Hashing Bottleneck

The boilerplate uses argon2id for password hashing (via `pwdlib`). This is CPU-intensive (~300-500ms per hash on a single core). On a single uvicorn worker, concurrent login requests serialize behind the GIL.

**Impact on test results:**
- Login endpoint will dominate latency at any concurrency > 5 VUs
- Auth-perf scenario will show high latency and dropped iterations — this is expected
- Read-only endpoints (health check, get_me, list_items) are fast when not competing for CPU

**Recommendations to include in reports:**
1. Run with `--workers 4` in production: `uvicorn app.main:app --workers 4`
2. Consider `run_in_executor()` for async password hashing
3. Separate auth workers from CRUD workers behind a load balancer

---

## Cross-Cutting Rules

1. **Discover, don't assume.** Always scan the actual API surface before generating tests. Don't hardcode endpoints from the boilerplate — use whatever the project has implemented.
2. **Tag every request.** Use `tags: { name: "endpoint_name" }` so k6 reports per-endpoint metrics.
3. **Pre-create test users in setup().** Don't have every VU hit `/users/signup` — that bottlenecks on password hashing.
4. **Include think time.** Use `sleep(1 + Math.random() * 2)` between actions to simulate real user pauses.
5. **Clean up after yourself.** Delete items created during the test (in the user journey) to avoid DB bloat.
6. **Use unique emails.** Include timestamp in generated emails to prevent collisions across runs.
7. **Fail fast on auth.** Use `fail()` if login fails — don't continue with an unauthenticated VU.

---

## After Generating Tests

1. Show the scenario matrix table with VU counts, durations, and thresholds
2. Run the smoke test to verify the suite works
3. Offer to run the full suite and generate an HTML execution report
4. Hand off to **forger** for approval
5. After approval, update **forger** context with the k6 test status

---

## Relation to Other Skills

| Skill | Relationship |
|-------|-------------|
| **test-writer** | Generates functional tests (pytest, Playwright). This skill generates load/perf tests (k6). They complement each other. |
| **quality-assurance** | QA tests through the UI. This skill tests API throughput and scalability. QA should reference perf results for timing expectations. |
| **backend-writer** | Produces the API endpoints that this skill tests. Run perf tests after backend is implemented. |
| **api-architect** | Produces the API spec. Use it to discover endpoints and expected behaviors. |
| **phase-verifier** | Can include k6 smoke as a phase gate check alongside e2e_smoke.py. |
