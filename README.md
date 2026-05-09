# The Diaspora Project

**Website:** [thediasporaproject.org](https://thediasporaproject.org)

A community-first artist platform built with Next.js App Router and Supabase. This repository hosts the public website, artist profiles, project archives, and a protected artist dashboard for editing profile and work content.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Architecture](#architecture)
5. [API Documentation](#api-documentation)
6. [Guidelines](#guidelines)
7. [Contributing](#contributing)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Repository Structure](#repository-structure)
11. [Environment Variables](#environment-variables)
12. [License](#license)

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
- Node.js 18+
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-next-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables (see [Environment Variables](#environment-variables)).

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

#### Client-Server Split
- **Server Components**: Public pages (artists, projects, informational)
- **Client Components**: Authenticated pages (dashboard, login)

#### Data Layer
- **Queries**: Read operations in `lib/*/queries.ts`
- **Mutations**: Write operations in `lib/*/mutations.ts`
- **Auth**: Authorization helpers in `lib/auth/`
- **Storage**: Media helpers in `lib/projects/media.ts`

#### Styling Organization
- Feature-based CSS Modules
- Sectioned stylesheets for complex components
- Responsive design with mobile-first approach

### Database Schema

#### Tables
- `profiles`: Artist profile data
- `artist_works`: Individual work items
- `allowed_users`: Email allowlist for artist access

#### Storage Buckets
- `avatars`: Profile pictures
- `works`: Artist work images
- `projects`: Project recap media

## API Documentation

### Artist API

#### Queries
- `getArtistByUsername(username: string)`: Fetch artist by username
- `getArtistByUserId(userId: string)`: Fetch artist by Supabase user ID
- `getArtistByEmail(email: string)`: Fetch artist by email
- `getArtistWorksByProfileId(profileId: string)`: Fetch artist's works
- `isEmailAuthorized(email: string)`: Check if email is allowlisted

#### Mutations
- `updateArtistProfile(artistId, email, updates)`: Update profile fields
- `deleteArtistProfile(artistId)`: Delete artist profile
- `syncArtistWorks(profileId, works)`: Sync artist's work portfolio

### Project API

#### Queries
- `getProjects()`: Fetch all projects
- `getProjectBySlug(slug)`: Fetch project by slug

#### Media
- `getProjectMedia(slug)`: Fetch project media files

### Auth API
- `isArtistAuthorized(user)`: Check user authorization

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
5. Run the test suite: `npm run test:coverage`
6. Submit a pull request

### Adding Features
1. Create route/component in `app/`
2. Add data logic in `lib/`
3. Use CSS Modules for styling
4. Add comprehensive tests
5. Update documentation

### Testing
- Write unit tests for utilities and hooks
- Add integration tests for API functions
- Test UI components with Testing Library
- Maintain 90%+ code coverage

## Testing

### Test Scripts
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run API tests
npm run test:api

# Run form tests
npm run test:forms

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

### Test Organization
- `tests/api/`: API function tests
- `tests/forms/`: Form and UI component tests
- `tests/lib/`: Library utility tests

Coverage thresholds: 90%+ for statements, branches, functions, and lines.

## Deployment

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

### Environment Setup
Ensure these Supabase configurations:
- Auth providers: Google OAuth enabled
- Redirect URLs: Include production domain
- Storage buckets: `avatars`, `works`, `projects` created
- Database tables: `profiles`, `artist_works`, `allowed_users` exist

## Repository Structure

```
my-next-app/
├── app/                    # Next.js App Router pages and components
│   ├── artists/           # Artist profile pages
│   ├── auth/              # Authentication pages
│   ├── components/        # Shared UI components
│   ├── dashboard/         # Protected artist dashboard
│   ├── discovery/         # Discovery features
│   ├── home/              # Home page sections
│   └── ...
├── lib/                   # Data layer and utilities
│   ├── artists/           # Artist-related functions
│   ├── auth/              # Authentication helpers
│   ├── projects/          # Project-related functions
│   ├── supabase/          # Supabase clients
│   └── ui/                # UI utilities
├── public/                # Static assets
├── tests/                 # Test suites
│   ├── api/               # API tests
│   ├── forms/             # Form tests
│   └── lib/               # Library tests
├── coverage/              # Test coverage reports
└── ...
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Create a new Supabase project
2. Enable Google OAuth in Authentication settings
3. Create storage buckets: `avatars`, `works`, `projects`
4. Set up database tables as defined in the schema
5. Configure redirect URLs for your domain

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

For more information, visit [thediasporaproject.org](https://thediasporaproject.org) or contact the development team.