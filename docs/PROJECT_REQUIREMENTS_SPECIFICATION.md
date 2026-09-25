# Project Requirements Specification: The Diaspora Project

**Specification version:** 2.0  
**Reviewed:** September 25, 2026  
**Repository:** `my-next-app`  
**Companion code guide:** [docs/REPOSITORY_GUIDE.md](docs/REPOSITORY_GUIDE.md)

This is a working software specification grounded in the current repository. Status describes what is visible in code and tests; it does not certify the production Supabase schema, policies, OAuth provider configuration, or hosting environment.

## 1. Purpose and Scope

The Diaspora Project is a community-first platform for presenting artists and creative projects, helping visitors discover artists, and allowing approved artists and administrators to manage selected data.

The application in this repository includes:

- Public home, artist, project, discovery, manifesto, guidelines, FAQ, financial-information, and link-hub routes.
- Google OAuth sign-in through Supabase.
- Artist profile and portfolio editing.
- Allowlist-based artist access and separate administrator operations.
- API routes for administrator account management.

This repository does not contain database migrations or SQL setup scripts. Database resources and policies are deployment prerequisites, not artifacts created by `next build`.

## 2. Status Vocabulary

- **Implemented in code**: The relevant route, component, helper, or handler is present. This does not imply complete end-to-end testing or deployed setup.
- **Partial**: Some behavior exists, but a stated guarantee or workflow is incomplete or depends on unverified infrastructure.
- **External prerequisite**: Must be configured in Supabase or the hosting provider and cannot be verified from this repository alone.
- **Not verified**: Source inspection or current automated tests do not prove the requirement.

## 3. Users and Core Outcomes

| User | Desired outcome |
|---|---|
| Visitor | Browse artists and projects, read informational pages, and use the discovery quiz without an account. |
| Approved artist | Sign in, view/edit their profile, manage featured work, and upload profile/work media. |
| Administrator | Review allowlisted accounts, grant/revoke access, change roles, suspend/reinstate accounts, and have mutations attempted in an audit log. |
| Maintainer | Run lint, type-checked production builds, tests, and CI without production secrets being needed at build time. |

## 4. Functional Requirements and Current Status

### 4.1 Public Pages and Discovery

| ID | Requirement and acceptance outcome | Status |
|---|---|---|
| REQ-PUB-001 | The home route presents the project and a project listing. Project data comes from the project query layer rather than being duplicated in the route. | Implemented in code |
| REQ-PUB-002 | A visitor can open an artist page by username and see available profile information and work. Missing profiles produce a deliberate empty state. | Implemented in code; public data policy not verified |
| REQ-PUB-003 | A visitor can open a project page by slug and see project, collaborator, cause, and available recap media. Unknown slugs use the framework not-found response. | Implemented in code; storage setup not verified |
| REQ-PUB-004 | The quiz accepts answers without login, preserves completed answers for the result route, and presents a ranked artist match. | Implemented in code; test coverage partial |
| REQ-PUB-005 | Informational routes exist for manifesto, guidelines, FAQ, financial information, and link hub. | Implemented in code |
| REQ-PUB-006 | Public profile routes provide route-specific metadata and all displayed images use framework optimization. | Partial/not verified: the artist route has no route-specific metadata in inspected code, and several images opt out of optimization. |

### 4.2 Authentication and Artist Access

| ID | Requirement and acceptance outcome | Status |
|---|---|---|
| REQ-AUTH-001 | A visitor can start Google OAuth with Supabase and return through `/auth/callback`, where the PKCE code is exchanged before dashboard navigation. | Implemented in code; provider settings are an external prerequisite |
| REQ-AUTH-002 | Artist app access is allowed only when the signed-in email matches an active `allowed_users` row. Lookup failures deny access. | Implemented in code; RLS and deployed table are external prerequisites |
| REQ-AUTH-003 | Auth sessions are refreshed through request middleware, and callback/login/dashboard routes respond to auth state. | Implemented in code; Next currently warns that the middleware convention is deprecated |
| REQ-AUTH-004 | The signed-in artist's existing profile can be found and edits target the correct profile. | Partial: the dashboard reads by email; a user-ID helper exists and profile updates try numeric ID then email. The project has a known `profiles.id` versus Auth UUID mismatch. |
| REQ-AUTH-005 | UI checks are backed by server/database policies so users cannot access another artist's private data by bypassing the UI. | Not verified: dashboard checks include client-side logic; production RLS/Storage policies are not in this repository. |

### 4.3 Profile and Portfolio Management

| ID | Requirement and acceptance outcome | Status |
|---|---|---|
| REQ-PROF-001 | An approved artist can edit supported profile fields, including biography, location, mediums, status, and social/contact links. | Implemented in code; field-level UI tests partial |
| REQ-PROF-002 | The editor can upload profile and work images after client-side type/size validation. | Implemented in code; storage policies and upload integration tests not verified |
| REQ-PROF-003 | An artist can retain, add, update, reorder, and remove work records through the work synchronization helper. | Implemented in code; automated coverage partial |
| REQ-PROF-004 | Profile deletion requires deliberate user action, removes the profile record, and ends the local session. | Partial: code removes the profile row and signs out; deletion of the Supabase Auth identity is not demonstrated. |
| REQ-PROF-005 | A new artist can create their own profile through the dashboard. | Not implemented in the inspected dashboard flow; existing profiles are loaded for editing and setup may require manual provisioning. |

### 4.4 Administrator Operations

| ID | Requirement and acceptance outcome | Status |
|---|---|---|
| REQ-ADMIN-001 | The admin dashboard is rendered only after a server-side session and admin-role check. | Implemented in code |
| REQ-ADMIN-002 | Admin API operations re-check the current user's admin role server-side; UI visibility alone never authorizes a mutation. | Implemented in code |
| REQ-ADMIN-003 | Admins can list accounts, grant allowlist access, change role/status, and revoke access. | Implemented in code; database availability is an external prerequisite |
| REQ-ADMIN-004 | Admin mutations attempt to write an audit record with actor, operation, target, and details. | Implemented in code; audit-write failure is logged and does not roll back the primary operation |
| REQ-ADMIN-005 | A suspended allowlist entry cannot access protected artist dashboard flows. | Implemented for app authorization checks; suspension does not disable Supabase Auth login or hide public artist pages |
| REQ-ADMIN-006 | Service-role credentials are unavailable to browser bundles and unnecessary for static build-time route collection. | Implemented through a server-only lazy client; production admin requests still require the secret |

### 4.5 Security and Operations

| ID | Requirement and acceptance outcome | Status |
|---|---|---|
| REQ-SEC-001 | All data access is protected by appropriately scoped PostgreSQL RLS policies. | External prerequisite/not verified: no migration or policy files are present |
| REQ-SEC-002 | Storage uploads are constrained by server/database policy as well as client-side validation. | Partial/not verified: client validation exists; deployed Storage policies are unavailable here |
| REQ-SEC-003 | `SUPABASE_SERVICE_ROLE_KEY` is server-only and never exposed through a public environment variable. | Implemented by client separation and environment naming; production deployment must honor it |
| REQ-OPS-001 | CI installs the lockfile, runs lint, builds, and runs the configured API coverage suite. | Implemented in `.github/workflows/ci.yml` |
| REQ-OPS-002 | CI build completes without real Supabase credentials. | Implemented through lazy admin-client initialization and placeholder public CI values |
| REQ-OPS-003 | New behavior has focused tests and the configured coverage gates remain enforced. | Implemented: Vitest thresholds are 25% lines/statements, 77% functions, and 78% branches for the measured file set |

## 5. Architecture and Technology Decisions

- **Next.js App Router** organizes URL handling, server rendering, and API handlers by filesystem route. Server Components are the default; browser-only interactions are isolated in Client Components.
- **React** composes route sections and supplies state for interactive views. Derived display values should be computed during render; effects are reserved for external synchronization such as auth subscriptions and network loading.
- **TypeScript** gives shared contracts to route components and data helpers. Strict checking and the root `@/*` alias are configured in `tsconfig.json`.
- **Supabase** combines Postgres, Auth, and Storage. Separate browser, cookie-bound server, and privileged admin clients enforce distinct runtime and security responsibilities.
- **CSS Modules** scope styles by feature/component; global styles and shared shell setup stay in `app/globals.css` and `app/layout.tsx`.
- **Vitest/V8** tests isolated logic with mocked Supabase query chains. This makes failure branches deterministic but is not a substitute for deployed database, browser, or OAuth end-to-end tests.
- **ESLint and GitHub Actions** catch static issues and gate the CI build/test workflow. `npm run lint`, `npm run build`, and `npm run test:api:coverage` are the relevant current checks.

The longer route-by-route walkthrough, data flow, source-file map, and test map are maintained in [docs/REPOSITORY_GUIDE.md](docs/REPOSITORY_GUIDE.md).

## 6. Test Strategy and Coverage Limits

Tests are organized under `tests/artists/`, `tests/admin/`, `tests/auth/`, `tests/forms/`, `tests/projects/`, and `tests/integration/`. Shared Supabase mocks and Vitest setup live under `tests/__mocks__/` and `tests/setup.ts`.

The CI coverage command is `npm run test:api:coverage`. `vitest.config.ts` includes `lib/artists/**/*.ts`, `lib/auth/**/*.ts`, and `lib/projects/**/*.ts`, then excludes `lib/projects/**/*.ts`. As a result, the coverage gate does not measure App Router pages, admin modules, discovery modules, most UI, or project helpers. Configured minimums are:

- Lines: 25%
- Statements: 25%
- Functions: 77%
- Branches: 78%

Passing these minimums only demonstrates the configured test slice cleared its gate. It is not a 77% or 78% whole-repository coverage commitment.

## 7. External Prerequisites and Open Questions

These items must be verified in the deployed Supabase/hosting environments:

- Google provider credentials and allowed redirect URLs, including `/auth/callback`.
- The `profiles`, `artist_works`, `allowed_users`, `projects`, and `admin_audit_log` resources referenced in code, including their columns and constraints.
- RLS policies that limit profile writes and reads appropriately.
- Storage buckets and policies for artist media and project recaps.
- The first administrator's active `allowed_users` row and role.
- Values for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-only `SUPABASE_SERVICE_ROLE_KEY` in deployment.

The repository currently has no `.env.example`, SQL migration directory, or root `LICENSE` file. Those should not be inferred from README examples or code references.

## 8. Acceptance Checklist for Changes

A change is ready for review when applicable items below are satisfied:

1. The route/component follows the existing App Router and server/client boundary conventions.
2. Data access stays in the appropriate domain module, and privileged operations remain behind server-side role checks.
3. User-visible errors and empty states are deliberate; uncertain database or network outcomes fail closed for authorization.
4. Focused tests cover successful behavior and relevant error/edge paths.
5. `npm run lint`, `npm run build`, and the relevant test command pass.
6. README, this specification, and the repository guide remain consistent with the code and do not claim unverified Supabase configuration.
