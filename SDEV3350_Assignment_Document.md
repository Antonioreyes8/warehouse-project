# SDEV 3350 Final Project: Artist Discovery Platform

## Project Title

Artist Discovery and Collaboration Platform

## 1. Problem Statement

This system solves the problem of connecting emerging artists with opportunities and collaborators in a gatekeeper-free environment. The platform allows artists to:

- Create professional profiles showcasing their work
- Discover like-minded collaborators through a personality quiz system
- Share project recaps with media galleries
- Access community resources and financial transparency
- Participate in an allowlist-based access control system

The core challenge addressed is creating a supportive creative community while maintaining quality standards through peer-driven discovery rather than traditional gatekeeping.

## 2. System Architecture & Design Patterns

### Repository Pattern (Primary Pattern)

The system implements a clear Repository pattern to abstract data access:

```
lib/
├── artists/
│   ├── queries.ts      # Read operations repository
│   ├── mutations.ts    # Write operations repository
│   └── profileFieldDescriptions.ts
├── projects/
│   ├── queries.ts      # Project data repository
│   ├── media.ts        # Media file repository
│   └── types.ts        # Domain models
├── auth/
│   └── authorization.ts # Authorization repository
└── supabase/
    ├── client.ts       # Infrastructure layer
    └── server.ts       # Server-side client
```

**Why Repository Pattern?**

- **Problem Solved**: Separates business logic from data access concerns
- **Benefits**: Easy to test, swap data sources, maintain single responsibility
- **Implementation**: Each domain (artists, projects, auth) has dedicated repository classes

### Strategy Pattern (Enhanced Implementation)

The authorization system explicitly implements Strategy pattern with dedicated strategy classes:

```typescript
// lib/auth/authorization.ts
interface AuthorizationStrategy {
	execute(email: string): Promise<boolean>;
}

class PrimaryTableStrategy implements AuthorizationStrategy {
	async execute(email: string): Promise<boolean> {
		// Check "authorized_artists" table
	}
}

class FallbackTableStrategy implements AuthorizationStrategy {
	async execute(email: string): Promise<boolean> {
		// Check "authorized" table
	}
}

class AuthorizationService {
	private strategies: AuthorizationStrategy[] = [
		new PrimaryTableStrategy(),
		new FallbackTableStrategy(),
		new LegacyTableStrategy(),
	];

	async isAuthorized(user: User): Promise<boolean> {
		for (const strategy of this.strategies) {
			try {
				const authorized = await strategy.execute(normalizedEmail);
				if (authorized) return true;
			} catch (error) {
				console.warn("Authorization strategy failed:", error);
			}
		}
		return false;
	}
}
```

**Why Enhanced Strategy Pattern?**

- **Problem Solved**: Database schema evolution with explicit error handling
- **Benefits**: Fault-tolerant, extensible, clear separation of concerns
- **Implementation**: Each strategy is a separate class with error handling

### Factory Pattern (Media Creation)

Added Factory pattern for type-safe media object creation:

```typescript
// lib/projects/media.ts
class MediaFactory {
	static createMedia(fileName: string, projectSlug: string): Media {
		const extension = fileName.split(".").pop()?.toLowerCase() || "";

		if (this.VIDEO_EXTENSIONS.includes(extension)) {
			return { type: "video", src: url };
		}
		return { type: "image", src: url }; // Default to image
	}

	static isValidMediaFile(fileName: string): boolean {
		// Validates file extensions
	}
}
```

**Why Factory Pattern?**

- **Problem Solved**: Complex media object creation logic centralized
- **Benefits**: Single responsibility, easy to extend, type safety
- **Implementation**: Static factory methods for different media types
w
### Service Layer Pattern

Business logic is separated from UI components:

```
app/
├── components/          # UI components only
├── artists/[slug]/      # Route handlers
├── dashboard/           # Protected routes
└── api/                 # API routes

lib/                     # Service layer
├── artists/            # Artist services
├── projects/           # Project services
├── auth/              # Auth services
└── discovery/         # Discovery services
```

## 3. Anti-Patterns Avoided

### God Object Anti-Pattern (Avoided)

**What it is**: A class that knows too much or does too much
**How we avoided it**:

- Single Responsibility Principle applied throughout
- Components focused only on UI rendering
- Business logic separated into focused service classes
- No monolithic classes handling multiple concerns

**Evidence**:

```typescript
// ❌ Anti-pattern (what we avoided)
class ArtistManager {
    handleAuth() {...}
    renderProfile() {...}
    processPayments() {...}
    sendEmails() {...}
}

// ✅ Our approach
class ArtistService { /* data operations only */ }
class ArtistProfile { /* UI component only */ }
class AuthService { /* auth logic only */ }
```

### Tight Coupling Anti-Pattern (Avoided)

**What it is**: Components that are heavily dependent on each other
**How we avoided it**:

- Dependency injection through interfaces
- Repository pattern abstracts data access
- Mocked dependencies in tests prove loose coupling

**Evidence**:

```typescript
// All components depend on abstractions, not concretions
import { supabase } from "@/lib/supabase/client"; // Interface
// Not: import { createClient } from "@supabase/supabase-js"; // Concretion
```

### Magic Strings Anti-Pattern (Avoided)

**What it is**: Hardcoded strings scattered throughout code
**How we avoided it**:

- Centralized constants and types
- Environment variables for configuration
- Type-safe string unions

**Evidence**:

```typescript
// lib/projects/types.ts
export type CollaboratorRole =
	| "Artists"
	| "Organizers"
	| "Preparation"
	| "Media"
	| "Technical Production";

// No magic strings like: role === "Artists"
```

## 4. Code Quality & Clean Code Principles

### Single Responsibility Principle

Each class/function has one reason to change:

```typescript
// ✅ Single responsibility
export async function getProjectMedia(slug: string): Promise<Media[]>;
// Only fetches media - no UI, no auth, no validation

export async function isArtistAuthorized(user: User): Promise<boolean>;
// Only checks authorization - no data fetching, no UI
```

### Meaningful Naming Conventions

Consistent naming throughout the codebase:

```typescript
// Files: kebab-case
lib/artists/queries.ts
lib/projects/media.ts

// Functions: camelCase, descriptive
getArtistByUsername()
updateArtistProfile()

// Types: PascalCase
export type Artist = {...}
export type Media = {...}

// Components: PascalCase
export default function Footer() {...}
```

### Error Handling Patterns

Consistent error handling with early returns:

```typescript
export async function getProjectMedia(slug: string): Promise<Media[]> {
	const { data, error } = await supabase.storage.from("projects").list(slug);

	if (error) {
		console.error("Supabase error fetching recap images:", error);
		return []; // Graceful degradation
	}

	// Continue with success path...
}
```

## 5. Testing Strategy

### Test Coverage: 71 Tests Passing

- **Unit Tests**: 8 white-box tests for internal logic
- **Integration Tests**: 4 end-to-end workflow tests
- **API Tests**: 11 standard API behavior tests
- **Edge Case Tests**: 6 failure scenario tests
- **Form Validation Tests**: 20 input validation tests
- **Authentication Tests**: 14 auth failure tests
- **Media Tests**: 8 file upload/retrieval tests

### Testing Patterns Used

```typescript
// Arrange-Act-Assert pattern
describe("API White-Box: queries.ts behavior", () => {
	it("targets profiles.username when fetching by username", async () => {
		// Arrange
		mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

		// Act
		await getArtistByUsername("antonioreyes");

		// Assert
		expect(mockFrom).toHaveBeenCalledWith("profiles");
		expect(mockSelect).toHaveBeenCalledWith("*");
		expect(mockEq).toHaveBeenCalledWith("username", "antonioreyes");
	});
});
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
jobs:
  build-and-test:
    steps:
      - name: Run ESLint
      - name: Run Next.js build
      - name: Run test coverage
```

## 6. Reflection & Design Decisions

### What Problem Does Your System Solve?

The system addresses the challenge of artist discovery in an oversaturated creative market. Traditional platforms rely on algorithmic recommendations or gatekeeper approval. This system empowers artists to find collaborators through shared values and creative philosophy, measured through a personality quiz system that matches based on artistic beliefs rather than follower counts.

### What Design Decisions Did You Make?

1. **Repository Pattern**: Chose this over Active Record pattern because it provides better testability and separation of concerns. The repository layer acts as a clean abstraction over Supabase, making it easy to swap data sources if needed.

2. **Strategy Pattern for Authorization**: Implemented multiple fallback tables because the database schema evolved during development. Rather than force a migration, the strategy pattern allows graceful handling of legacy data.

3. **Service Layer Separation**: All business logic lives in `/lib` while UI components focus only on presentation. This decision was made to ensure components remain lightweight and testable.

4. **TypeScript Strict Mode**: Enabled strict null checks and explicit typing to catch errors at compile time rather than runtime, reducing bugs in production.

### What Pattern Did You Use and Why?

**Primary Pattern: Repository Pattern**

- **Why**: Provides clean separation between data access and business logic
- **Benefits**: Improved testability, maintainability, and ability to change data sources
- **Implementation**: Each domain (artists, projects, auth) has dedicated repository classes that encapsulate all data operations

**Secondary Pattern: Strategy Pattern**

- **Why**: Needed flexible authorization that could handle database schema changes
- **Benefits**: Extensible, fault-tolerant, easy to add new authorization methods
- **Implementation**: Authorization tries multiple table strategies in order

### What Anti-Pattern Did You Avoid?

**God Object Anti-Pattern**

- **Why avoided**: Leads to unmaintainable code where one class knows everything
- **How avoided**: Applied Single Responsibility Principle rigorously
- **Evidence**: No class handles more than one concern (UI, data, auth, etc. are separate)

**Tight Coupling Anti-Pattern**

- **Why avoided**: Makes code brittle and hard to test/modify
- **How avoided**: Used dependency injection and interface-based design
- **Evidence**: All tests use mocked dependencies proving loose coupling

### What Would You Improve With More Time?

1. **Add Factory Pattern**: Create a component factory for dynamic form generation based on schema definitions.

2. **Implement Observer Pattern**: Add real-time notifications when artists match on the discovery quiz.

3. **Add Circuit Breaker Pattern**: Implement resilience for Supabase API calls to handle service outages gracefully.

4. **Create Adapter Pattern**: Add adapters for different storage backends (AWS S3, Cloudinary) beyond Supabase.

5. **Add Command Pattern**: Implement undo/redo functionality for profile edits.

6. **Implement CQRS Pattern**: Separate read and write models for better performance on analytics-heavy operations.

## 7. UML Design Instructions

Create a class diagram with the following key classes:

### Core Classes:

```
+----------------+     +-------------------+     +-------------------+
|   Supabase     |     |   ArtistService   |     |  ProjectService   |
|   Client       |     |   (Repository)    |     |   (Repository)    |
+----------------+     +-------------------+     +-------------------+
| - url: string  |     | + getByUsername() |     | + getBySlug()     |
| - key: string  |     | + getById()       |     | + getMedia()      |
| + from()       |     | + update()        |     | + getTypes()      |
| + storage()    |     +-------------------+     +-------------------+
+----------------+            |                           |
        ▲                     |                           |
        |                     | uses                      | uses
        |                     ▼                           ▼
+----------------+     +-------------------+     +-------------------+
|  Database      |     |     Artist        |     |     Project       |
|  Tables        |     |   (Entity)        |     |   (Entity)        |
+----------------+     +-------------------+     +-------------------+
| - profiles     |     | - id: string      |     | - slug: string    |
| - projects     |     | - name: string    |     | - title: string   |
| - authorized_* |     | - username: string|     | - description     |
+----------------+     +-------------------+     +-------------------+
```

### Authentication Classes:

```
+-------------------+     +-----------------------+
|  AuthService      |     |   Authorization       |
|  (Repository)     |     |   Strategy            |
+-------------------+     |   (Interface)         |
| + isAuthorized()  |     +-----------------------+
|                   |     | + execute(): boolean  |
+-------------------+     +-----------------------+
        ▲                           ▲
        |                           |
        | implements                | implements
        ▼                           ▼
+-------------------+     +-----------------------+
|   Authorization   |     |   PrimaryTable        |
|   Service         |     |   Strategy            |
|   (Strategy)      |     +-----------------------+
+-------------------+     | + execute()          |
        ▲                 +-----------------------+
        |                       ▲
        | uses                   |
        |                       |
        ▼                       ▼
+-------------------+     +-----------------------+
|    User           |     |   FallbackTable       |
|   (Entity)        |     |   Strategy            |
+-------------------+     +-----------------------+
| - id: string      |     +-----------------------+
| - email: string   |     | + execute()          |
+-------------------+     +-----------------------+
```

### Factory Classes:

```
+-------------------+     +-----------------------+
|   MediaFactory    |     |       Media           |
|   (Factory)       |     |   (Product)           |
+-------------------+     +-----------------------+
| + createMedia()   |     | - type: string       |
| + isValidFile()   |     | - src: string        |
+-------------------+     +-----------------------+
        ▲
        |
        | creates
        |
        ▼
+-------------------+
|   ProjectService  |
|   (Client)        |
+-------------------+
```

### Component Classes:

```
+-------------------+     +-----------------------+
|   Footer          |     |   Header              |
|   (Component)     |     |   (Component)         |
+-------------------+     +-----------------------+
| + render()        |     | + render()            |
| - links[]         |     | - navItems[]          |
+-------------------+     +-----------------------+
        ▲                           ▲
        |                           |
        | extends                   | extends
        ▼                           ▼
+-------------------+     +-----------------------+
|   React.Component |     |   React.Component     |
+-------------------+     +-----------------------+
```

### Relationships to Show:

- **Association**: Services → SupabaseClient (uses)
- **Dependency**: Components → Services (calls)
- **Inheritance**: Concrete classes → Abstract interfaces
- **Composition**: Project has Media[], Artist has Collaborator[]

### Key Design Patterns to Highlight:

1. **Repository Pattern**: ArtistService, ProjectService, AuthService
2. **Strategy Pattern**: AuthorizationService with multiple AuthorizationStrategy implementations
3. **Factory Pattern**: MediaFactory for creating Media objects
4. **Service Layer**: Separation between UI and business logic

This UML diagram should clearly show the layered architecture with clean separation of concerns, demonstrating professional software design principles.</content>
<parameter name="filePath">/Users/antonioreyes-campuzano/Desktop/warehouse-project/my-next-app/SDEV3350_Assignment_Document.md
