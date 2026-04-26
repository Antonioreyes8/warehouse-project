# The Diaspora Project Web App

Community-first artist platform built with Next.js App Router and Supabase.

This repository hosts the public website, artist profiles, project archives, and a protected artist dashboard for editing profile and work content.

## Contents

1. Project Overview
2. Core Product Areas
3. Architecture
4. Routing and Rendering Strategy
5. Data Layer and Supabase Model
6. Authentication and Authorization
7. Storage and Media
8. Styling and CSS Organization
9. Repository Structure
10. Local Development
11. Environment Variables
12. Testing Strategy
13. How to Add or Extend Features
14. Deployment Checklist

## Project Overview

The app is designed around three primary goals:

1. Present projects and artists publicly through curated pages.
2. Let approved artists sign in and manage their own profile/work metadata.
3. Keep content architecture simple enough for non-engineer collaborators to maintain.

## Core Product Areas

1. Home and informational routes:
   - Home, Manifesto, Guidelines, FAQ, Linktree
2. Public artist pages:
   - Dynamic route at /artists/[slug]
   - Displays profile identity, optional details, bio, links, and works
3. Public project pages:
   - Dynamic route at /projects/[slug]
   - Displays context (cause), collaborators, and recap media
4. Protected artist dashboard:
   - Route at /dashboard/profile
   - Edits profile metadata and artist works

## Architecture

High-level stack:

1. Framework: Next.js 16 App Router
2. Runtime split:
   - Server components for public content pages
   - Client components for auth/dashboard interactions
3. Backend platform: Supabase
   - Auth (Google OAuth)
   - Postgres data tables
   - Storage buckets for media
4. Styling approach:
   - CSS Modules for route/component-level styles
   - Minimal global baseline in app/globals.css

## Routing and Rendering Strategy

Public pages are mostly server-rendered from static data and Supabase reads:

1. /artists/[slug]
   - Resolves slug
   - Fetches profile + works
   - Renders fallback empty-state if no profile exists
2. /projects/[slug]
   - Resolves slug from Supabase project catalog
   - Fetches project media from storage helper

Protected pages are client-rendered due to session/auth state needs:

1. /login
   - Starts Google OAuth flow
2. /auth/callback
   - Completes OAuth exchange and redirects on success
   - Shows explicit UI only on actual error
3. /dashboard/profile
   - Session + allowlist gate
   - Profile and work editing workflow

## Data Layer and Supabase Model

Code organization in lib/:

1. lib/artists/queries.ts
   - Profile and works reads
2. lib/artists/mutations.ts
   - Profile updates and works synchronization
3. lib/auth/authorization.ts
   - Allowlist checks
4. lib/projects/media.ts
   - Project media retrieval helpers
5. lib/supabase/client.ts
   - Browser Supabase client
6. lib/supabase/server.ts
   - Server-side Supabase client helper

Main tables and resources used by the app:

1. profiles
   - public artist profile fields
2. artist_works
   - per-profile work items
3. allowed_users and/or authorized_artists
   - allowlist for dashboard access (environment-dependent table naming exists in current code)
4. Storage buckets
   - avatars for profile images
   - projects (or project-specific storage paths) for recap media

## Authentication and Authorization

Current login behavior:

1. User initiates Google OAuth on /login
2. Redirect returns to /auth/callback
3. Callback verifies/loads session and routes to /dashboard/profile
4. Dashboard checks allowlist by normalized email before loading editable content

Important implementation details:

1. Supabase client is configured for PKCE and URL session detection.
2. Callback flow avoids false-positive early error flashes by checking session state before failing.
3. Unauthorized users see a dedicated access denied state instead of editable UI.

## Storage and Media

Artist avatar upload flow:

1. File selected in dashboard
2. Client-side validation for size/type
3. Upload to avatars bucket
4. Public URL stored in profile row

Project recap media flow:

1. Route identifies project slug
2. Media helper loads items from storage
3. Recap section renders image/video tiles with type-based output

## Styling and CSS Organization

The codebase has been normalized to use sectioned CSS modules for larger features.

Patterns used:

1. Keep a feature entry stylesheet as an import hub.
2. Split long styles by concern: shell, sections, buttons/states, responsive overrides.
3. Prefer camelCase class names in CSS Modules.

Examples of current organization:

1. artists/
   - page-layout.module.css
   - empty-state.module.css
   - about-section.module.css
   - works-section.module.css
2. dashboard/profile/
   - profile.module.css (import hub)
   - profile-shell.module.css
   - profile-form.module.css
   - profile-buttons.module.css
   - profile-states.module.css
   - profile-responsive.module.css
3. home/
   - home.module.css (import hub)
   - home-rules.module.css
   - home-projects.module.css
4. linktree/
   - linktree.module.css (import hub)
   - linktree-layout.module.css
   - linktree-links.module.css
5. projects/
   - project.module.css (import hub)
   - project-layout.module.css
   - project-sections.module.css

## Repository Structure

Top-level functional map:

1. app/
   - Route handlers, page components, and CSS modules
2. lib/
   - Data/query/mutation/auth/storage helpers
3. tests/
   - API and form tests (black-box, white-box, edge cases)
4. public/
   - Static assets and fonts

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create local env file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start development server:

```bash
npm run dev
```

4. Build and run production mode locally:

```bash
npm run build
npm run start
```

## Environment Variables

Required:

1. NEXT_PUBLIC_SUPABASE_URL
2. NEXT_PUBLIC_SUPABASE_ANON_KEY

## Testing Strategy

Available scripts:

1. npm test
2. npm run test:coverage
3. npm run test:watch
4. npm run test:ui
5. npm run test:api
6. npm run test:api:coverage
7. npm run test:api:black-box
8. npm run test:api:white-box
9. npm run test:api:edge-cases
10. npm run test:forms
11. npm run test:forms:black-box
12. npm run test:forms:edge-cases

Recommended test commands:

1. Fast API sanity run:

```bash
npm run test:api
```

2. API + lib coverage run (branch-focused quality gate):

```bash
npm run test:api:coverage
```

3. Full repository coverage run:

```bash
npm run test:coverage
```

Coverage notes:

1. Coverage is configured in vitest.config.ts for API-layer modules under lib/artists, lib/auth, and lib/projects.
2. Thresholds are enforced at 90%+ for statements, lines, functions, and branches.
3. HTML coverage report is generated in the default coverage output folder after coverage runs.

Current suites cover:

1. API behavior under expected and edge inputs
2. Dashboard form behavior and input-level edge cases
3. Query/mutation-level helper correctness

## How to Add or Extend Features

Recommended workflow for new pages/features:

1. Create route and component in app/
2. Keep data logic in lib/ (do not embed query logic deeply in UI)
3. Start with one feature stylesheet, then split into sectioned modules if it grows
4. Use camelCase module class naming
5. Add tests in matching tests/ subtree

When adding a new style-heavy route:

1. Create feature-name.module.css as import hub
2. Create companion files like:
   - feature-name-shell.module.css
   - feature-name-sections.module.css
   - feature-name-responsive.module.css

## Deployment Checklist

1. Configure environment variables on host
2. Configure Supabase Auth redirect URLs for deployed domain
3. Verify allowlist table contains expected artist emails
4. Verify storage policies for avatars/projects buckets
5. Smoke test:
   - login
   - callback redirect
   - dashboard edit/save
   - public artist/project pages
