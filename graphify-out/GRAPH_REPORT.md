# Graph Report - my-next-app  (2026-09-17)

## Corpus Check
- 77 files · ~33,837 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 45 file(s) not represented in the graph (top: .css 35, .otf 7, .woff2 2)

## Summary
- 541 nodes · 883 edges · 20 communities (18 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d33dad7c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- profile/page.tsx
- The Diaspora Project
- projects/queries.ts
- admin/mutations.ts
- package.json
- Functional Requirements
- maxHeap.ts
- aboutSection.tsx
- layout.tsx
- Artist Authentication Setup Guide
- scripts
- compilerOptions
- devDependencies
- dependencies
- financialSection.tsx
- faqSection.tsx
- next.config.ts
- guidelinesSection.tsx
- eslint.config.mjs
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `scripts` - 22 edges
2. `compilerOptions` - 16 edges
3. `The Diaspora Project` - 14 edges
4. `ArtistProfilePage()` - 13 edges
5. `Artist` - 11 edges
6. `ArtistSearchTree` - 11 edges
7. `createSupabaseServerClient()` - 11 edges
8. `@supabase/supabase-js` - 11 edges
9. `vitest` - 11 edges
10. `Artist Authentication Setup Guide` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Queries` --references--> `getProjects()`  [INFERRED]
  README.md → lib/projects/queries.ts
- `ArtistPage()` --calls--> `getArtistByUsername()`  [EXTRACTED]
  app/artists/[slug]/page.tsx → lib/artists/queries.ts
- `ArtistPage()` --calls--> `getArtistWorksByProfileId()`  [EXTRACTED]
  app/artists/[slug]/page.tsx → lib/artists/queries.ts
- `AboutSectionProps` --references--> `Artist`  [EXTRACTED]
  app/artists/aboutSection.tsx → lib/artists/queries.ts
- `ArtistHeaderProps` --references--> `Artist`  [EXTRACTED]
  app/artists/artistHeader.tsx → lib/artists/queries.ts

## Import Cycles
- None detected.

## Communities (20 total, 2 thin omitted)

### Community 0 - "profile/page.tsx"
Cohesion: 0.08
Nodes (49): app_auth_callback_callback_module, CallbackState, ALLOWED_AVATAR_TYPES, ArtistProfileFactory, ArtistProfileFormData, ArtistProfilePage(), calculateAgeFromBirthDate(), createEmptyWork() (+41 more)

### Community 1 - "The Diaspora Project"
Cohesion: 0.04
Nodes (48): Adding Features, API Documentation, Application Structure, Architecture, Artist API, Artist Dashboard, Auth API, Build for Production (+40 more)

### Community 2 - "projects/queries.ts"
Cohesion: 0.09
Nodes (32): HeroSection(), app_home_home_module, ProjectsSection(), CauseSection(), Collaborator, CollaboratorsSection(), NormalizedCollaborator, app_projects_project_module (+24 more)

### Community 3 - "admin/mutations.ts"
Cohesion: 0.10
Nodes (30): DELETE(), PATCH(), resolveEmail(), RouteParams, GET(), POST(), GET(), AdminPage() (+22 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (37): app_linktree_linktree_module, aboutLinks, contactLinks, donationLinks, LinkItem, RSVP_LINK, socialLinks, app_login_login_module (+29 more)

### Community 5 - "Functional Requirements"
Cohesion: 0.05
Nodes (42): 1. Problem Definition Clarity, 2. Requirements Quality Assessment, 3. Feasibility Assessment, 4. Business Value Alignment, Artist Profile Management (High Priority), Authentication & Authorization (High Priority), Business Feasibility: ✅ **High**, Development Team Requirements (+34 more)

### Community 6 - "maxHeap.ts"
Cohesion: 0.08
Nodes (21): app_discovery_quiz_quiz_module, ExtendedScoredArtist, QuizResult, ResultPage(), app_discovery_quiz_result_result_module, fetchDiscoveryArtists(), ArtistSearchTree, AVLNode (+13 more)

### Community 7 - "aboutSection.tsx"
Cohesion: 0.08
Nodes (32): app_artists_about_section_module, AboutSection(), AboutSectionProps, normalizeExternalUrl(), normalizeSocialUrl(), app_artists_artist_bio_module, app_artists_artist_header_module, app_artists_artist_hot_takes_module (+24 more)

### Community 8 - "layout.tsx"
Cohesion: 0.07
Nodes (26): Footer(), app_components_footer_module, Header(), app_components_header_module, app_dashboard_admin_admin_module, AccountRole, AccountStatus, AdminAccountRow (+18 more)

### Community 9 - "Artist Authentication Setup Guide"
Cohesion: 0.09
Nodes (21): 1.1 Create Google OAuth Credentials, 1.2 Configure Supabase Auth, 2.1 Run Database Setup SQL, 2.2 Add Authorized Artist Emails, 3.1 Get the User's Auth ID, 3.2 Create the Profile, Artist Authentication Setup Guide, Can't save changes (+13 more)

### Community 10 - "scripts"
Cohesion: 0.09
Nodes (22): scripts, build, dev, lint, start, test, test:all, test:api (+14 more)

### Community 11 - "compilerOptions"
Cohesion: 0.10
Nodes (19): _comment, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 12 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @tailwindcss/postcss (+10 more)

### Community 13 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @chenglou/pretext, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons, @fortawesome/react-fontawesome, next (+8 more)

### Community 14 - "financialSection.tsx"
Cohesion: 0.25
Nodes (6): app_financial_financials, COLORS, data, FinancialSection(), metadata, recharts

### Community 15 - "faqSection.tsx"
Cohesion: 0.40
Nodes (3): app_faq_faq_module, faqData, FAQSection()

### Community 16 - "next.config.ts"
Cohesion: 0.33
Nodes (3): nextConfig, ref_path, ref_vitest_config

### Community 18 - "eslint.config.mjs"
Cohesion: 0.40
Nodes (4): eslintConfig, ref_eslint_config, ref_eslint_config_next_core_web_vitals, ref_eslint_config_next_typescript

## Knowledge Gaps
- **218 isolated node(s):** `faqData`, `RouteParams`, `ArtistPageProps`, `ArtistBioProps`, `HotTakes` (+213 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 283 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getProjects()` connect `projects/queries.ts` to `The Diaspora Project`, `admin/mutations.ts`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `react` connect `layout.tsx` to `profile/page.tsx`, `package.json`, `maxHeap.ts`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `Queries` connect `The Diaspora Project` to `projects/queries.ts`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **What connects `faqData`, `RouteParams`, `ArtistPageProps` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `profile/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08186341022161918 - nodes in this community are weakly interconnected._
- **Should `The Diaspora Project` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `projects/queries.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09494949494949495 - nodes in this community are weakly interconnected._