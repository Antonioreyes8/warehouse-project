# The Creative Incubator and Portfolio

Community-first artist platform built with Next.js and Supabase.

## Table of Contents

1. Project Goals
2. Current Features
3. Architecture
4. Data Model and Storage
5. Authentication and Authorization
6. Profile Image Upload Flow
7. Local Setup
8. Environment Variables
9. Supabase Storage Policies
10. Scripts and Testing
11. Folder Map
12. Coding and Documentation Conventions
13. Deployment Notes

## Project Goals

This app creates a digital home for artists to:

1. Publish a public profile page.
2. Share project/media recaps.
3. Update profile details from a protected dashboard.
4. Keep access restricted to allowlisted users.

## Current Features

1. Home route composed from modular sections.
2. Dynamic artist pages via `/artists/[slug]`.
3. Dynamic project pages via `/projects/[slug]`.
4. Google OAuth login via Supabase.
5. Dashboard profile editor for allowlisted users.
6. Avatar upload to Supabase Storage bucket `avatars`.
7. Social link fields and birthday-driven age display.
8. Organized test suites for API and form behavior.

## Architecture

High-level architecture:

1. Next.js App Router for route-based composition.
2. Supabase for auth, Postgres data, and Storage objects.
3. CSS Modules for scoped per-page styles.

Core runtime split:

1. Server-rendered routes for public content pages.
2. Client-rendered dashboard/login routes for auth interactions.
3. Data access utilities in `lib/` for query/mutation isolation.

## Data Model and Storage

Primary table used in profile flows:

1. `public.profiles`
2. Key fields used by dashboard/public pages:
   - `id`
   - `email`
   - `name`
   - `username`
   - `bio`
   - `avatar_url`
   - `birthday`
   - `based_in`
   - `mediums`
   - `past_projects`
   - `ethnic_background`
   - `contact`
   - `status`
   - `member_since`
   - social link fields

Authorization table:

1. `public.allowed_users`
2. Used to gate dashboard access by normalized email.

Storage buckets:

1. `projects` for project recap media.
2. `avatars` for artist profile pictures.

## Authentication and Authorization

Current auth flow:

1. User signs in with Google OAuth on `/login`.
2. App redirects to `/dashboard/profile`.
3. Dashboard checks session and email allowlist.
4. If authorized, profile is loaded by email and editable.

If session is missing, user is redirected to `/login`.
If user is not allowlisted, an access denied message is shown.

## Profile Image Upload Flow

Dashboard avatar flow:

1. User picks a file in dashboard profile editor.
2. Client validates:
   - max size 5MB
   - allowed types: JPG, PNG, WEBP
3. File uploads to bucket `avatars` at path:
   - `auth.uid()/avatar-timestamp.ext`
4. Public URL is generated.
5. URL is stored in `profiles.avatar_url` on save.

Important pattern:

1. Bucket is not linked to `profiles` by a DB foreign key.
2. The link is application-level via `avatar_url` (or path, if you later migrate).

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. Start dev server:

```bash
npm run dev
```

4. Build and run production locally:

```bash
npm run build
npm run start
```

## Environment Variables

Required:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Storage Policies

For the `avatars` bucket, use policies that allow users to manage only their own folder.

Example conditions:

1. Insert check:
   - `bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text`
2. Update using/check:
   - `bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text`
3. Delete using:
   - `bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text`
4. Select using (public avatars):
   - `bucket_id = 'avatars'`

If avatars should be viewable without auth, set the bucket to Public and keep read policy aligned.

## Scripts and Testing

Main scripts:

1. `npm run dev`
2. `npm run build`
3. `npm run start`
4. `npm run lint`
5. `npm test`

Organized test buckets include:

1. API black-box tests.
2. API white-box tests.
3. API edge-case tests.
4. Dashboard form black-box tests.
5. Dashboard form edge-case tests.

## Folder Map

```text
app/
  dashboard/profile/    Protected profile editor and dashboard view
  artists/[slug]/       Public artist pages
  projects/[slug]/      Public project pages
  login/                OAuth sign-in page
  manifesto/            Mission and values page
  guidelines/           Community rules page
  FAQ/                  FAQ page
  linktree/             Link hub page

lib/
  artists/              Artist queries and mutations
  auth/                 Authorization helpers
  projects/             Storage media helpers
  supabase/             Client and server Supabase setup
```

## Coding and Documentation Conventions

This project uses verbose file headers and section comments in route files to explain:

1. Purpose of the file.
2. Responsibilities.
3. Dependencies.
4. How each file fits the full system.

When adding new pages/components, follow the same style so onboarding remains fast.

## Deployment Notes

1. Add production domain in Supabase Auth URL settings.
2. Add redirect URL for OAuth callback target.
3. Ensure Supabase env vars are configured in deployment platform.
4. Verify Storage policies in production project.
