# The Creative Incubator & Portfolio 🎨💻
### *Changing the world, one byte at a time.*

A digital home and sacred space for marginalized artists. This project serves as a community-funded creative incubator, designed to combat technofeudalism and gentrification by providing a platform where art is prioritized over profit.

---

## 🌟 Project Vision
This is more than a portfolio; it is a **digital garden** and an **incubator**. It addresses the intersection of:
* **Identity & Culture:** Highlighting voices often silenced by traditional tech structures.
* **Technofeudalism:** Building a community-owned space that exists outside the standard "user-as-product" model.
* **Art as Sanctuary:** Creating a "sacred space" for creative expression using modern web technologies.

---

## 🛠️ Tech Stack
| Technology | Usage |
| :--- | :--- |
| **Next.js 14+** | React framework with App Router for optimized performance and SEO. |
| **TypeScript** | Ensuring type safety across all creative and technical modules. |
| **Supabase** | Backend-as-a-Service for managing artist data, project metadata, and guestbooks. |
| **CSS Modules** | Localized styling to prevent scope-creep and ensure design consistency. |

---

## 🏗️ Architecture: The "Colocation" Strategy
We utilize a modern, scalable directory structure that prioritizes **Colocation**. Instead of scattering logic, we keep routes, UI components, and styles together.

```text
/app
  ├── (marketing)      # Grouped routes for Manifesto and Guidelines
  ├── /projects        # Dynamic routing via [slug] for artist projects
  ├── /contact         # Centered "Bubble" form with white outlines
  ├── layout.tsx       # Global branding and font definitions
  └── globals.css      # Core variables (--bg-dark, --text-light)
/components
  ├── /ui              # Reusable atoms (Buttons, Inputs, Cards)
  └── /layout          # Global shared components (Header, Footer)
/lib                   # Supabase clients and helper functions
/public                # Fonts (TimesNewRoman) and static assets
```

---

## ✨ Key Features

### 1. Dynamic Project Routing
Utilizes Next.js dynamic segments (`[slug]`) to render individual project pages from a single template. This allows the incubator to scale effortlessly as new artists join.

### 2. High-Fidelity UI/UX
* **Typography:** Custom-loaded *TimesNewRomanExtraBold* for a classic, authoritative feel.
* **Responsive Sections:** Adaptive layouts for the `RulesSection` (split-screen) and `ProjectsSection` (auto-grid).
* **The "Bubble" Contact Form:** A high-contrast, centered form featuring 2px white outlines and smooth focus transitions.

### 3. Community-First Guidelines
Dedicated sections for the **Manifesto** and **Rules of Conduct**, ensuring the digital space remains safe and focused on its creative mission.

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/creative-incubator.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📜 Manifesto Snippet
> *"In an age of digital gentrification, we reclaim the web as a space for art. We move beyond bits and bytes to create something that breathes."*

---

## 🤝 Contributing
I’m a Computer Science student currently developing this as a tool for marginalized artists in **Denton County** and beyond. If you are interested in the intersection of tech and social justice, feel free to open a PR or reach out via the Contact form.