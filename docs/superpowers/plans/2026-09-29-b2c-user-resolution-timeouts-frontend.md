# B2C User Resolution Timeout Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax (- [ ]) for tracking.

**Goal:** Replace both transactional frontend 60-second Axios timeouts with one global three-minute timeout without changing response shapes or error status behavior.

**Architecture:** Define one server-side timeout constant in the existing server configuration module. Import it into both API proxy and authentication routes so the clients cannot drift. Keep existing error handling and the 500 response contract unchanged.

**Tech Stack:** TypeScript, Express, Axios, Jest, Angular/Jest configuration, Prettier.

---

### Task 1: Add and test the shared timeout constant

**Files:**
- Modify: src/server/config/constants.config.ts
- Create: src/server/config/constants.config.spec.ts

- [ ] **Step 1: Write the failing test**

~~~typescript
import { REQUEST_TIMEOUT_MS } from './constants.config';

describe('server request timeout configuration', () => {
  it('uses the global three-minute timeout', () => {
    expect(REQUEST_TIMEOUT_MS).toBe(180_000);
  });
});
~~~

Run:

~~~bash
npx jest --config ./jest.config.json --runInBand src/server/config/constants.config.spec.ts
~~~

Expected: FAIL because REQUEST_TIMEOUT_MS is not exported.

- [ ] **Step 2: Add the constant**

Add near ENVIRONMENT:

~~~typescript
/** Maximum time for a server-side outbound API or auth request. */
export const REQUEST_TIMEOUT_MS = 3 * 60 * 1000;
~~~

Keep the existing environment configuration unchanged.

- [ ] **Step 3: Run the focused test**

~~~bash
npx jest --config ./jest.config.json --runInBand src/server/config/constants.config.spec.ts
~~~

Expected: PASS.

### Task 2: Apply the shared timeout to both Axios instances

**Files:**
- Modify: src/server/routes/api.routes.ts:5-20
- Modify: src/server/routes/authentication.routes.ts:1-60

- [ ] **Step 1: Update API proxy**

Import REQUEST_TIMEOUT_MS with ENVIRONMENT from the existing config module and replace the literal timeout:

~~~typescript
axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  httpsAgent: new https.Agent({ keepAlive: true })
});
~~~

Do not alter URL routing, headers, status handling, or telemetry severity.

- [ ] **Step 2: Update authentication routes**

Import REQUEST_TIMEOUT_MS from the same config module and replace timeout: 60000 with timeout: REQUEST_TIMEOUT_MS.

Do not change MSAL configuration, token acquisition, sessions, redirects, or auth error responses.

- [ ] **Step 3: Add a source-level regression check**

Run:

~~~bash
! rg -n "timeout:\\s*60000|timeout:\\s*180000" src/server/routes/api.routes.ts src/server/routes/authentication.routes.ts
rg -n "timeout:\\s*REQUEST_TIMEOUT_MS" src/server/routes/api.routes.ts src/server/routes/authentication.routes.ts
~~~

Expected: both routes use the shared constant and contain no timeout literal.

### Task 3: Verify and commit the frontend implementation

- [ ] **Step 1: Run tests**

~~~bash
npx jest --config ./jest.config.json --runInBand src/server/config/constants.config.spec.ts
npm test -- --runInBand
~~~

- [ ] **Step 2: Run lint and formatting**

~~~bash
npm run lint
npm run prettier:check
~~~

- [ ] **Step 3: Build SSR**

~~~bash
npm run build:ssr
~~~

- [ ] **Step 4: Review the diff**

~~~bash
git diff --check develop...HEAD
git diff --stat develop...HEAD
git status --short --branch
~~~

Confirm only the shared timeout constant, its test, and the two Axios route usages changed. Commit:

~~~bash
git add src/server/config/constants.config.ts \
  src/server/config/constants.config.spec.ts \
  src/server/routes/api.routes.ts \
  src/server/routes/authentication.routes.ts
git commit -m "fix: increase frontend request timeout to three minutes"
~~~

