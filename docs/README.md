# The Diaspora Project

**Website:** [thediasporaproject.org](https://thediasporaproject.org)

A community-first artist platform built with Next.js App Router and Supabase. This repository hosts the public website, artist profiles, project archives, and a protected artist dashboard for editing profile and work content.

For a page-by-page code walkthrough, architecture rationale, and explanation of the main modules, see [docs/REPOSITORY_GUIDE.md](docs/REPOSITORY_GUIDE.md). For Google OAuth and Supabase setup, see [AUTH_SETUP.md](AUTH_SETUP.md).

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Architecture](#architecture)
5. [Routes and APIs](#routes-and-apis)
6. [Guidelines](#guidelines)
7. [Contributing](#contributing)
8. [Testing](#testing)
9. [Deployment and Environment](#deployment-and-environment)
10. [Repository Guide](#repository-guide)
11. [Repository Structure](#repository-structure)

## Introduction

The Diaspora Project is dedicated to creating a safe, inclusive space for artists from marginalized communities. Our platform empowers artists to showcase their work, connect with collaborators, and build meaningful relationships in the creative industry.

The app is designed around three primary goals:

1. Present projects and artists publicly through curated pages.
2. Let approved artists sign in and manage their own profile/work metadata.
3. Keep content architecture simple enough for non-engineer collaborators to maintain.

## Features

### Public Features

- **Artist Profiles**: Dynamic pages showcasing artist information, bio, social links, and featured works.
- **Project Archives**: Curated project pages with collaborators, causes, and recap media.
- **Informational Pages**: Home, Manifesto, Guidelines, FAQ, and Linktree.
- **Discovery Quiz**: Interactive quiz to help users find relevant artists.

### Artist Dashboard

- **Profile Management**: Edit personal information, bio, social links, and status.
- **Work Portfolio**: Add, edit, and delete featured works with images and descriptions.
- **Media Upload**: Upload profile pictures and work images to Supabase Storage.
- **Account Deletion**: Artists can delete their own profiles.

### Technical Features

- **Authentication**: Google OAuth via Supabase Auth.
- **Authorization**: Email-based allowlist for artist access.
- **Responsive Design**: Mobile-first CSS Modules styling.
- **Server-Side Rendering**: Optimized for public pages with Next.js App Router.
- **Type Safety**: Full TypeScript implementation.

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- npm
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd my-next-app
```

2. Install the locked dependencies:

```bash
npm ci
```

3. Create `.env.local` manually in the project root and add the required public
	Supabase values (and the server-only admin key if using admin features).
	There is no `.env.example` in this repository.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key
```

Keep `SUPABASE_SERVICE_ROLE_KEY` private. Do not prefix it with `NEXT_PUBLIC_`.
Do not commit `.env.local`.

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## Architecture

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **Runtime**: React 19
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: CSS Modules
- **Testing**: Vitest with Testing Library
- **Linting**: ESLint
- **Type Checking**: TypeScript

### Application Structure

#### Rendering and Client-Server Boundaries

- Pages are Server Components by default. Public artist/project pages and most
	informational pages render on the server.
- Client Components are used where the UI needs browser APIs, local state,
	event handlers, OAuth session listeners, local storage, or interactive charts.
- The profile dashboard is client-side guarded. The admin dashboard has a
	server-side role check before its client interface is rendered.
- Some routes combine server-rendered composition with client-only sections;
	see the repository guide for route-specific boundaries.

#### Data Layer

- **Queries**: Read operations in `lib/*/queries.ts`
- **Mutations**: Write operations in `lib/*/mutations.ts`
- **Auth**: Allowlist and role helpers in `lib/auth/`; cookie-bound server
	checks are used where access must be decided before rendering.
- **Admin**: Server-only account reads/writes in `lib/admin/`; API routes verify
	admin access before invoking the privileged service-role client.
- **Storage**: Project media helper in `lib/projects/media.ts`; profile and
	work uploads are initiated by the profile dashboard.

#### Styling Organization

- Feature-based CSS Modules
- Sectioned stylesheets for complex components
- Responsive design with mobile-first approach

### Database Schema

#### Tables

- `profiles`: Artist profile data
- `artist_works`: Individual work items
- `allowed_users`: Email allowlist for artist access
- `admin_audit_log`: Records admin mutation audit entries
- Project data is read from the `projects` table in the application code

The repository does not include database migrations or SQL setup files. Verify
the deployed schema, Row Level Security (RLS), and policies independently;
table references in code do not prove that the tables exist or are secured.

#### Storage Buckets and Media

- Profile and work uploads use Supabase Storage from the profile dashboard.
- Project recap media is listed from the `projects` bucket.
- The home hero also references Supabase-hosted media.

The exact bucket names and policies must match the deployed Supabase project.

## Routes and APIs

Pages are listed in detail in [docs/REPOSITORY_GUIDE.md](docs/REPOSITORY_GUIDE.md).
The main API handlers are:

- `/api/admin/accounts`: `GET` lists accounts; `POST` grants allowlist access.
- `/api/admin/accounts/[email]`: `PATCH` changes account status/role; `DELETE`
	revokes allowlist access.
- `/api/admin/whoami`: `GET` reports whether the current user has the admin
	role for UI visibility. Admin mutations still enforce their own server guard.

Artist and project query/mutation helpers are in `lib/artists/` and
`lib/projects/`; the repository guide explains their behavior and callers.

## Guidelines

### Community Guidelines

The Diaspora Project maintains strict community guidelines to ensure a safe and respectful environment. Key principles include:

1. **Respect and Responsibility**: All participants must actively uphold community values.
2. **Privacy and Consent**: Public environment with documented media policies.
3. **Inclusivity**: Commitment to marginalized voices and anti-discrimination.
4. **Collaboration**: Emphasis on cross-disciplinary networking.

For full guidelines, visit [thediasporaproject.org/guidelines](https://thediasporaproject.org/guidelines).

### Code Guidelines

#### Development Practices

- Use TypeScript for all new code
- Follow Next.js App Router conventions
- Keep data logic in `lib/` separate from UI
- Use CSS Modules for styling
- Write tests for new features

#### Code Style

- camelCase for CSS class names
- Descriptive component and function names
- Comprehensive error handling
- Clear documentation comments

## Contributing

We welcome contributions from the community! Here's how to get involved:

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Add tests for new functionality
5. Run `npm run lint`, `npm run build`, and the relevant test command
6. Submit a pull request

### Adding Features

1. Create route/component in `app/`
2. Add data logic in `lib/`
3. Use CSS Modules for styling
4. Add comprehensive tests
5. Update documentation

### Testing

- Write unit tests for utilities and hooks
- Add integration tests for API functions and protected UI flows
- Include white-box tests for internal logic and black-box tests for end-to-end behavior
- Test UI components with Testing Library
- Keep coverage above the thresholds configured in `vitest.config.ts`; these
	thresholds cover selected library files and are not a whole-app target.

## Testing

### Test Scripts

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run artist API tests
npm run test:api

# Run the CI artist API/unit coverage gate
npm run test:api:coverage

# Run form tests
npm run test:forms

# Run integration tests
npm run test:integration

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

### Test Organization

- `tests/artists/api/`: Standard behavior and edge-case tests for artist data
	functions.
- `tests/artists/unit/`: White-box query/mutation and authorization behavior.
- `tests/admin/`: Admin guard and privileged mutation tests.
- `tests/auth/`: Authorization failures and auth-related edge cases.
- `tests/forms/`: Form validation tests.
- `tests/projects/`: Project-media helper tests.
- `tests/integration/`: Composed flows using mocked Supabase interactions;
	these are not browser-driven production E2E tests.
- `tests/__mocks__/` and `tests/setup.ts`: shared mocks and test setup.

Configured thresholds are 25% lines/statements, 77% functions, and 78%
branches. `vitest.config.ts` includes artist/auth/project library patterns but
excludes project library files; app routes, admin, discovery, and UI components
are not covered by this gate.

## Deployment and Environment

### Prerequisites

- Supabase project configured
- Environment variables set
- Domain configured for OAuth redirects

### Deployment Steps

1. Build the application: `npm run build`
2. Configure environment variables on hosting platform
3. Set up Supabase Auth redirect URLs for deployed domain
4. Deploy to hosting platform (Vercel, Netlify, etc.)
5. Verify allowlist table contains artist emails

### Supabase Environment Setup

Set these variables locally in `.env.local` and in the hosting provider:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key
```

The service-role key is required for admin data operations and must remain
server-only. CI builds with placeholder public values and does not have this
secret; lazy initialization lets build-time route collection work without it.
Admin requests still fail if required production variables are missing.

Configure Google OAuth in Supabase and allow the deployed callback URL
`https://your-domain/auth/callback`. Confirm the database schema, RLS rules,
Storage buckets/policies, and initial admin allowlist role in the actual
Supabase project. The repository does not create these resources automatically.

## Repository Guide

See [docs/REPOSITORY_GUIDE.md](docs/REPOSITORY_GUIDE.md) for the route-by-route
walkthrough, request flows, data/client boundaries, source module map, testing
map, and known implementation constraints.

## Repository Structure

```
my-next-app/
├── app/                    # Route pages, API handlers, UI, and CSS
├── lib/                    # Domain logic and Supabase clients
├── public/                 # Fonts and static assets
├── tests/                  # Domain-organized Vitest suites and mocks
├── docs/                   # Repository learning guide
├── .github/workflows/      # Continuous integration
└── ...                     # Next, TypeScript, ESLint, PostCSS, and Vitest config
```

Generated `coverage/`, `.next/`, `node_modules/`, and `graphify-out/` are not
source directories. There is no root `LICENSE` file in the current repository.
