<!--
File: README.md
Purpose: Project documentation and overview.
Responsibilities:
  - Describe project vision and purpose
  - Document tech stack and architecture
  - Provide setup and usage instructions
Key Concepts:
  - Markdown documentation
  - Project description and guidelines
Dependencies:
  - None
How It Fits:
  - Serves as the main documentation for developers and users
-->

# The Creative Incubator & Portfolio 🎨💻

### _Changing the world, one byte at a time._

## Overview

**What it does:** A digital portfolio and creative incubator platform that provides a community-funded space for marginalized artists to showcase their work, share projects, and connect with collaborators.

**Problem it solves:** Traditional tech platforms often prioritize profit over art, leading to gentrification of digital spaces. This project creates an inclusive "digital garden" where art is valued over monetization, combating technofeudalism by giving voice to artists often silenced by mainstream structures.

**Key Pages & Content:**

- **Home Page:** Features event rules ("BEFORE YOU COME" - be open to unfamiliar art, respect everybody, dress to express yourself, you may be recorded, dance your heart out) overlaid on a party image, plus a grid of project cards showing titles, posters, and dates
- **Projects:** Dynamic pages for each project (like "I.", "II.") with descriptions, collaborators, cause sections, and media recaps
- **Artists:** Dynamic profile pages with bio, contact info, mediums, past projects, and social links
- **Contact:** Form with name, email, and message fields for inquiries and collaboration requests
- **Manifesto:** Three-part statement about revolution, artistic liberation, and support for marginalized voices
- **Guidelines:** Community rules covering mission, media/privacy policies, and shared responsibilities
- **FAQ:** Frequently asked questions (content to be determined)

## Architecture

**High-level design:** Built as a full-stack web application using Next.js App Router for server-side rendering and client-side navigation. The backend relies on Supabase (PostgreSQL-based BaaS) for data storage and file hosting.

**Component relationships:**

- **Frontend:** React components organized by feature (pages, sections, shared components)
- **Data Layer:** Supabase client handles database queries and storage operations
- **Routing:** Dynamic routes for projects (`/projects/[slug]`) and artists (`/artists/[slug]`)
- **Styling:** CSS Modules for component-scoped styles, global typography in `globals.css`

## Tech Stack

### Languages

- **TypeScript:** Primary language for type-safe development
- **JavaScript:** Via Next.js/React ecosystem

### Frameworks

- **Next.js 16.1.6:** React framework with App Router for routing, SSR, and optimization
- **React 19.2.3:** Component library for building user interfaces

### Tools & Libraries

- **Supabase:** Backend-as-a-Service for database (PostgreSQL) and file storage
- **Tailwind CSS:** Utility-first CSS framework for responsive design
- **ESLint:** Code linting and formatting
- **PostCSS:** CSS processing with Autoprefixer

## Folder Structure

```
/app                    # Next.js App Router pages and layouts
├── artists/[slug]/     # Dynamic artist profile pages
├── components/         # Shared UI components (Header, Footer)
├── contact/            # Contact page and form
├── home/               # Home page sections (rules, projects)
├── projects/           # Project pages and data
│   ├── [slug]/         # Dynamic project detail pages
│   └── data.ts         # Static project metadata
└── layout.tsx          # Root layout with global header/footer

/lib                    # Utility functions and external integrations
├── getArtists.ts       # Artist data fetching from Supabase
├── getProjectMedia.ts  # Media file retrieval from storage
└── supabaseClient.ts   # Supabase client initialization

/public                 # Static assets
└── fonts/              # Custom font files (Times New Roman, Helvetica Neue)
```

## How It Works

**Data Flow:**

1. **Static Data:** Project metadata loaded from local `data.ts` files
2. **Dynamic Data:** Artist profiles and media fetched from Supabase on page load
3. **Rendering:** Server components handle data fetching, client components manage interactions

**Key Logic:**

- **Dynamic Routing:** URLs like `/projects/project-I` map to data lookup and component rendering
- **Media Loading:** Project recap images/videos loaded from Supabase Storage buckets
- **Artist Profiles:** Username-based lookup with fallback for missing profiles
- **Responsive Design:** CSS Modules and Tailwind handle mobile/desktop layouts

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd my-next-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Configure Supabase:**
   - Create a new Supabase project
   - Set up a `profiles` table with columns: id, name, username, bio, avatar_url, instagram
   - Create a `projects` storage bucket for media files
   - Enable public read access for the bucket

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Viewing Projects

- Navigate to the home page to see project cards
- Click any project card to view details, collaborators, and media

### Artist Profiles

- Visit `/artists/[username]` to see artist information
- If an artist hasn't set up their profile, a placeholder message appears

### Adding Content

- Projects are added by updating `app/projects/data.ts`
- Artist profiles are managed through Supabase database
- Media files uploaded to Supabase Storage buckets

### Customization

- Modify styles in CSS Modules files
- Update global typography in `app/globals.css`
- Add new sections by creating components in appropriate directories

## Key Concepts

- **Colocation:** Related files (components, styles, data) kept together for maintainability
- **Server Components:** Data fetching happens on the server for better performance
- **Dynamic Routing:** URL-based content loading using Next.js `[slug]` patterns
- **CSS Modules:** Scoped styling to prevent conflicts between components
- **Supabase Integration:** Real-time database and storage for dynamic content
- **Responsive Design:** Mobile-first approach with Tailwind utilities

## Future Improvements

- **CMS Integration:** Add admin panel for content management without code changes
- **User Authentication:** Allow artists to manage their own profiles
- **Search Functionality:** Add search/filter for projects and artists
- **Performance Optimization:** Implement image optimization and caching strategies
- **Testing Suite:** Add unit and integration tests for reliability
- **Multi-language Support:** Internationalization for broader accessibility
- **API Endpoints:** Expose REST APIs for third-party integrations
- **Analytics:** Track engagement metrics for community insights

---

## 📜 Manifesto Snippet

> _"In an age of digital gentrification, we reclaim the web as a space for art. We move beyond bits and bytes to create something that breathes."_

## 🤝 Contributing

This project is developed by a Computer Science student to support marginalized artists in Denton County and beyond. If you're interested in the intersection of tech and social justice, feel free to:

- Open a PR with improvements
- Report issues or bugs
- Suggest new features
- Reach out via the Contact form

For major changes, please open an issue first to discuss the proposed changes.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
