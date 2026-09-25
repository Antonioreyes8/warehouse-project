# Repository Guide

This guide is a map for reading the implementation, not a claim that every
feature is complete or every security policy is verified. It covers the
handwritten application, data, styling, tests, and configuration under this
repository. Generated `coverage/`, `.next/`, `node_modules/`, and graph output
are build artifacts and are not application source.

## How to Read the Code

Start with `app/` to understand a URL and its rendered UI. Follow imports into
`lib/` to find data access, authorization, storage, and domain algorithms. The
`tests/` tree shows expected behavior and mocked database responses. CSS Module
files are paired with components using a `styles` import; their class names are
scoped to avoid accidental cross-page style collisions.

## Stack and Why It Is Used

- **Next.js App Router** maps folders and `page.tsx`/`route.ts` files to URLs.
  Pages are Server Components by default; a `"use client"` directive opts a
  module into browser state, event handlers, and browser APIs.
- **React 19** composes pages from components. State and effects belong in
  client components; effects are for synchronizing with external systems, not
  for copying values that can be derived during render.
- **TypeScript** catches mismatched data and component contracts before the
  production build. `@/*` is a root alias, so `@/lib/...` maps to `lib/...`.
- **Supabase** provides Postgres queries, OAuth sessions, and Storage. The
  repository uses distinct clients to avoid mixing browser auth, server cookies,
  and privileged service-role credentials.
- **CSS Modules** keep component styles local. Global styles and font/icon setup
  are centralized in `app/globals.css` and `app/layout.tsx`.
- **Vitest** runs the unit/API-style tests with jsdom and mocked Supabase calls.
  V8 coverage is a gate only for the configured included files, not a measure
  of the entire app.

## Request and Authentication Flow

1. `app/layout.tsx` renders the shared site shell and global CSS. It also
   forwards stray OAuth error query parameters to `/login`; `/auth/callback`
   and `/login` handle their own errors. The footer is hidden at `/linktree`.
2. `app/login/page.tsx` uses the browser Supabase client to start Google OAuth
   and requests `/auth/callback` as the redirect URI.
3. `app/auth/callback/page.tsx` exchanges the PKCE authorization code for a
   session, then navigates an authenticated user to `/dashboard/profile`.
4. `middleware.ts` refreshes Supabase auth cookies for incoming requests. It is
   not the same thing as the separate role checks made by server pages/APIs.
5. Artist access is checked against `allowed_users` in
   `lib/auth/authorization.ts`. The artist dashboard checks in the browser;
   the admin dashboard and admin API use server-side checks.

## Pages, One by One

| Route | Source | What it renders and how it works |
|---|---|---|
| `/` | `app/page.tsx` | Composes the home hero and project grid. `app/home/heroSection.tsx` owns the hero media; `app/home/projectsSection.tsx` loads project data through `lib/projects/queries.ts`. The home route is a server-rendered composition, while its sections can make independent presentation decisions. |
| `/login` | `app/login/page.tsx` | Client page for Google OAuth. It checks an existing session, listens for a later `SIGNED_IN` event, and renders OAuth errors from URL parameters. `Suspense` isolates the search-param-dependent error display so the login form can render independently. |
| `/auth/callback` | `app/auth/callback/page.tsx` | Client-side PKCE callback. It handles provider errors, exchanges the code, checks for a session, and redirects. A ref prevents duplicate code exchange during React development effect replay. |
| `/dashboard/profile` | `app/dashboard/profile/page.tsx` | Client-side profile editor. It checks session and allowlist access, loads the profile/work data, and updates profile fields and portfolio works. Image type/size checks and Storage uploads happen in the browser. These UI checks are not a substitute for correct database RLS and Storage policies. The deletion flow shown here removes the profile record and signs out; it does not establish that the Supabase Auth user is deleted. |
| `/dashboard/admin` | `app/dashboard/admin/page.tsx` | Server page checks the signed-in user and admin role before rendering the client UI in `app/dashboard/admin/AdminDashboard.tsx`. The UI calls the admin API instead of holding a service-role key. |
| `/artists/[slug]` | `app/artists/[slug]/page.tsx` | Server-rendered public artist detail, where `slug` is looked up as a username. It loads artist works and composes the artist header/about/bio/info/hot-takes/work sections. A missing profile gets an in-page empty state. Public visibility depends on Supabase policies; this page does not perform an admin check. |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Server-rendered project detail. It looks up and normalizes project metadata, loads recap media from Storage, and composes cause, collaborator, and recap sections. Missing projects use Next.js `notFound()`. |
| `/discovery/quiz` | `app/discovery/quiz/page.tsx` | Client quiz driven by `lib/discovery/questions.ts`. Answers are kept in React state, persisted to `localStorage` at completion, then the browser moves to the result route. No account is required. |
| `/discovery/quiz/result` | `app/discovery/quiz/result/page.tsx` | Client result page reads the saved answers, fetches artist data through `lib/discovery/apis.ts`, scores matches, and supports name lookup/suggestions. The source currently sorts candidates for the winner; the separately constructed max heap is not used for selection. |
| `/manifesto` | `app/manifesto/page.tsx` | Server page composition for manifesto content. `app/manifesto/manifestoSection.tsx` uses the interactive canvas in `lib/manifesto/interactiveCanvas.tsx`, which needs browser drawing/state APIs. Text data lives in `lib/manifesto/paragraphs.ts`. |
| `/guidelines` | `app/guidelines/page.tsx` | Static server-rendered route that composes the guidelines content component. It needs no client state or remote query. |
| `/FAQ` | `app/FAQ/page.tsx` | Static server-rendered FAQ route. Questions and answers are local content in `app/FAQ/faqSection.tsx`; anchors provide navigation between topics. The route spelling is uppercase in the source. |
| `/financial` | `app/financial/page.tsx` | Route metadata and page composition for the financial section. `app/financial/financialSection.tsx` renders a client-side Recharts visualization with hard-coded allocation values, not live accounting data. |
| `/linktree` | `app/linktree/page.tsx` | Client-rendered curated link hub with share actions using browser APIs. Its footer is hidden by the root layout. Link content is currently embedded in the page rather than fetched from a CMS. |

### Shared UI and Styles

- `app/components/Header.tsx` and `Footer.tsx` provide the shared navigation
  and site footer; their CSS Modules are `header.module.css` and
  `footer.module.css`.
- Artist presentation is split into `aboutSection.tsx`, `artistHeader.tsx`,
  `artistBio.tsx`, `artistInfo.tsx`, `artistHotTakes.tsx`, and
  `artistWorks.tsx`. Each component has its own CSS Module; shared layout and
  empty-state rules are in `page-layout.module.css` and `empty-state.module.css`.
- Project detail uses `causeSection.tsx`, `collaboratorsSection.tsx`, and
  `recapSection.tsx`, styled by `project-sections.module.css` and
  `project-layout.module.css`. `project.module.css` is a legacy/plain stylesheet
  imported by the project route, unlike the paired CSS Modules.
- Home sections use `home-hero.module.css` and `home-projects.module.css`;
  `home.module.css` contains home-level layout styles.
- Profile editor styles are divided into shell, form, buttons, state, and
  responsive modules under `app/dashboard/profile/`. This separation lets the
  large editor tune form layout, interaction states, and breakpoints without
  putting every selector in one stylesheet.
- Login, OAuth callback, admin, FAQ, manifesto, guidelines, financial, quiz,
  quiz-result, and link-hub views each have nearby style files. Global reset,
  typography, and shared design tokens belong in `app/globals.css`.

## API Routes

| Endpoint | Methods | Responsibilities |
|---|---|---|
| `/api/admin/accounts` | `GET`, `POST` | Admin-guarded account listing and collaborator invitation. The POST route validates the email before passing the requested role to the mutation layer. |
| `/api/admin/accounts/[email]` | `PATCH`, `DELETE` | Admin-guarded role/status changes and allowlist revocation. Dynamic email path segments are encoded by the client. |
| `/api/admin/whoami` | `GET` | Reports whether the current signed-in user is an admin so the UI can decide whether to show admin navigation. It is a display helper, not the security boundary for mutations. |

`lib/admin/guard.ts` verifies the session and role. `lib/admin/queries.ts` and
`lib/admin/mutations.ts` perform privileged operations through
`lib/supabase/admin.ts`. The service-role key bypasses RLS, so this client is
server-only and initialized lazily: static build analysis can import route
modules without production secrets, while a real admin operation still fails
clearly if its secrets are absent. Mutation code attempts to write audit rows
to `admin_audit_log`; an audit-write failure is logged but does not roll back
the primary action.

## Data and Domain Modules

- `lib/supabase/client.ts`: browser Supabase client for client components and
  browser-side operations. Uses the public URL and anon key; database policies
  must constrain what this client can read or write.
- `lib/supabase/server.ts`: cookie-bound server client for server-rendered
  requests, allowing auth-aware server reads without exposing service-role
  privileges.
- `lib/supabase/admin.ts`: server-only, lazy service-role client for admin-only
  work. Never import it into a client component or expose its key with a
  `NEXT_PUBLIC_` prefix.
- `lib/auth/authorization.ts`: the shared active-allowlist and role decisions.
  It treats `allowed_users` as the source of access truth and fails closed when
  a lookup errors or throws.
- `lib/artists/queries.ts`: typed artist/work read helpers and allowlist query.
  Helpers normalize email and return stable empty/null values on query errors.
- `lib/artists/mutations.ts`: profile updates/deletes and portfolio-work sync.
  Profile update tries a numeric ID when possible, then email fallback; work
  sync separates retained rows, inserts, upserts, and removed-row deletion.
- `lib/artists/profileFieldDescriptions.ts`: reusable labels/help descriptions
  for the editor's profile fields.
- `lib/projects/types.ts` and `queries.ts`: project shape, database reads,
  normalization, and collaborator enrichment.
- `lib/projects/media.ts`: lists project recap media from Supabase Storage and
  maps storage entries into renderable media items.
- `lib/discovery/questions.ts`: the fixed quiz question bank.
- `lib/discovery/apis.ts`: browser data lookup and matching/search structures
  used by the quiz result view.
- `lib/discovery/maxHeap.ts`: max-heap implementation for ranking data. Check
  the result page before assuming this structure is the active winner-selection
  algorithm; the current page sorts its candidates directly.
- `lib/manifesto/paragraphs.ts` and `interactiveCanvas.tsx`: manifesto copy and
  its browser-only interactive rendering.
- `lib/ui/icons.ts`: Font Awesome icon setup shared by the app.

## Tests and Tooling

| File or directory | What it verifies |
|---|---|
| `tests/setup.ts` | Shared Vitest setup and DOM matchers. |
| `tests/__mocks__/supabase.ts` | Chainable mock methods for query-builder calls; tests set one-off return values to exercise response branches. |
| `tests/artists/api/standard.test.ts` | Artist query/mutation success and ordinary not-found behavior. |
| `tests/artists/api/edge-cases.test.ts` | Database errors, rejected promises, and authorization failure paths. |
| `tests/artists/unit/queries.test.ts` | White-box query construction, fallback strategy, and auth helper cases. |
| `tests/admin/authorization.test.ts` | Admin API guard and role behavior. |
| `tests/admin/mutations.test.ts` | Allowlist writes, role/status changes, revoke behavior, and audit call expectations. |
| `tests/auth/failures.test.ts` | Artist authorization denial and auth edge conditions; some named OAuth/session cases are explanatory placeholder assertions, not integration simulations. |
| `tests/forms/validation.test.ts` | Form validation rules and boundary values. |
| `tests/projects/media.test.ts` | Project media mapping and storage-query behavior. |
| `tests/integration/profile-flow.test.ts` | A composed profile-flow test with mocked Supabase interactions, not a live browser/database E2E suite. |

`vitest.config.ts` uses jsdom and V8 coverage. Its coverage include patterns
target `lib/artists/**/*.ts`, `lib/auth/**/*.ts`, and `lib/projects/**/*.ts`,
but the project glob is subsequently excluded; app components, admin modules,
discovery modules, and UI code are not included. Current configured thresholds
are 25% lines/statements, 77% functions, and 78% branches. Passing this gate is
not proof of whole-application coverage.

## Important Configuration Files

- `package.json` defines dependencies and the npm scripts listed in the README.
- `tsconfig.json` enables strict TypeScript checking, Next's plugin, and the
  `@/*` root import alias.
- `next.config.ts` sets the Turbopack project root and allows the configured
  Supabase image host for Next image handling.
- `eslint.config.mjs` combines Next.js Core Web Vitals and TypeScript presets.
- `postcss.config.mjs` connects Tailwind/PostCSS processing; most view styles
  are nevertheless ordinary CSS Modules.
- `vitest.config.ts` controls test aliases, jsdom setup, included/excluded
  coverage files, and thresholds.
- `.github/workflows/ci.yml` runs on pushes/PRs to `main` or `master`, installs
  from the lockfile, then runs lint, build, and the artist API coverage script.
  CI uses placeholder public Supabase values and does not need the admin secret
  just to build.
- `middleware.ts` refreshes auth cookies. Next currently warns that the
  middleware convention is deprecated in favor of `proxy`; the migration has
  not been performed.

## Known Constraints to Keep in Mind

- The `allowed_users` suspension flag blocks app authorization checks, but it
  does not disable a Supabase Auth account. Public artist pages do not check
  suspension.
- A browser-side dashboard authorization check can improve navigation and user
  feedback, but RLS and Storage policies must enforce data security.
- `profiles.id` has a known schema-format mismatch with Supabase Auth UUIDs in
  this project history. The dashboard uses email to find the profile; verify
  the deployed schema before changing identity matching.
- The repository contains no `.env.example` and no SQL migrations directory.
  Do not assume database tables, RLS policies, buckets, or OAuth provider
  settings are provisioned by this repository.
- Several views intentionally use hard-coded content/data and some images opt
  out of Next image optimization. Requirements should mark those as current
  limitations rather than describing them as dynamic infrastructure.
Most TypeScript modules start with a file-purpose comment. Those headers tell
you the module boundary; comments inside functions should explain a meaningful
constraint or tradeoff, not restate the syntax. For example, the admin client
is lazy so static builds do not need production credentials, and the browser,
cookie-bound server, and service-role clients are kept separate because they
have different execution and security boundaries.

## Stack and Why It Is Used

- **Next.js App Router** maps folders and `page.tsx`/`route.ts` files to URLs.
  Pages are Server Components by default; `