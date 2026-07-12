<!--
SYNC IMPACT REPORT
==================
Version change: 3.1.0 → 3.2.0

Modified principles:
- I. Component-First UI Architecture — components (route-local and shared, including
  Generic/Domain-adapter) no longer start as a single flat file. Every component is now
  always a folder pairing its `.tsx` file with a `.types.ts` file from the start. A
  co-located hook, `utils.ts`, and `config.ts` remain added-only-when-needed. Routes
  themselves are unchanged — `index.tsx` alone by default, `{route}.types.ts` added only
  if needed — since the request that prompted this only concerned components, not routes.
  Flagging that distinction in case it should apply to routes too.

Added principles: N/A
Removed sections: N/A

Templates requiring updates:
- ⚠ .specify/templates/plan-template.md — Source Code tree and Component Design Decisions
  table both currently show components as flat single files; need to show every component
  as a folder with a guaranteed .types.ts.

Follow-up TODOs: Confirm whether routes should also always carry {route}.types.ts, or
stay grow-as-needed as written here.
-->

# Curated Organization Constitution

## Core Principles

### I. Component-First UI Architecture

Every UI feature MUST be implemented as a discrete, self-contained React component before being composed into a page or route. Components MUST:

- Accept props for all variable content (no hardcoded copy inside components).
- Be independently renderable in isolation (no hidden global-state dependencies).
- Not reach into sibling or parent component internals; communicate via props/context only.

**Routes stay flat and grow only as needed; components always pair with their own types.** A route begins as a single `index.tsx` and grows companion files only when it actually needs them. Components — route-local or shared — are different: every component is a folder pairing its `.tsx` file with a `.types.ts` file from the start, since nearly every component takes typed props. Everything else about a component (a co-located hook, `utils.ts`, `config.ts`) is still added only when actually needed.

**Routes:**

```
app/routes/pages/{route}/          // e.g. booking/, gallery/ — named for the actual route
├── index.tsx                      // Route container — loader, renders the route
├── {route}.types.ts               // Added only if the route needs its own types
├── {route}.query.ts               // Colocated Sanity query, added only if the route needs one
├── utils.ts                        // Added only if the route needs its own utilities
└── components/                     // Added only if the route needs more than one sub-component
    ├── VideoPanel/                    // Always a folder — component + types from the start
    │   ├── VideoPanel.tsx
    │   └── VideoPanel.types.ts
    └── Carousel/
        ├── Carousel.tsx
        └── Carousel.types.ts
```

A route with nothing extra to add stays a single file: `index.tsx` alone. There is no generic `feature/` or `features/` directory anywhere in this structure.

**Route-local sub-components** (inside a route's own `components/` folder) are never split into Generic/Domain-adapter pairs — that split is reserved for shared components only (below). Every route-local sub-component pairs its component file with its own types file from the start; a co-located hook (`useVideoPanel.ts`) or `utils.ts` are added only if the component actually needs them.

**Shared, cross-route components** live in `app/components/`, named for what they are, and follow the same always-paired-with-types rule as route-local components:

```
app/components/{Name}/
├── {Name}.tsx
└── {Name}.types.ts
```

A co-located hook or `utils.ts` are added only if the component actually needs them.

The generic-engine/domain-adapter split is used only when a shared component genuinely owns behavior that gets presented differently by more than one consumer (e.g. a `Carousel` that runs autoplay-only on the homepage hero and user-controlled with visible arrows on the Gallery page). Both halves of the split follow the same rule — types always present, everything else added as needed:

```
app/components/{Generic}/             // Owns state/behavior, no domain knowledge
├── index.tsx
├── {Generic}.types.ts
├── use{Generic}.ts                    // Added only if needed
└── utils.ts                           // Added only if needed

app/components/{DomainX}{Generic}/    // Presentation + config only, consumes {Generic}
├── {DomainX}index.tsx
├── {DomainX}{Generic}.types.ts
├── config.ts                          // Added only if needed
└── utils.ts                           // Added only if needed
```

If a shared component doesn't need behavior that varies per consumer — it just takes props — it MUST NOT be forced into a Generic/Domain-adapter split. That split solves a specific problem (one engine, several presentations); applying it where that problem doesn't exist adds indirection without benefit.

Rules:

- Every component (route-local or shared) is a folder pairing its `.tsx` file with a `.types.ts` file from the start. A co-located hook, `utils.ts`, and `config.ts` are added only when actually needed. Routes themselves are the exception — `{route}.types.ts` is added only if the route needs it.
- Domain-adapter files/folders MUST NOT contain business logic — presentation and config only. Shared logic belongs in the generic component.
- Hooks are co-located with the component they serve, whether route-local or shared.
- File naming: route containers use `index.tsx` (directory-import convention, matching this project's routing). Shared component containers under `app/components/` use an explicit filename matching the folder (e.g. `Carousel/Carousel.tsx`) — never `index.tsx`.

**Rationale**: Routes vary widely in complexity — many stay simple enough that a types file would sit empty, so they keep the grow-as-needed rule. Components are different: almost every component takes props, and in a strict-TypeScript codebase those props need a type either way. Pairing the types file with the component from the start removes a per-component judgment call — valuable when components are being scaffolded by an agent rather than hand-written one at a time. Everything genuinely optional (hooks, utils, config) still grows in only when needed, and the generic-engine/domain-adapter split remains reserved for shared components that actually have more than one presentation.

### II. Content Ownership

Content is either editorial (lives in Sanity, editable without a deploy) or functional (lives in code). If the client would reasonably expect to edit it herself in a CMS, it's editorial. If it's transactional or behavioral — form fields, validation, third-party embeds, business logic — it's code, even if it appears on the same page as editorial content.

Content types MUST be modeled once per concept and reused across every view that needs them. A concept MUST NOT be duplicated into a second schema to serve a second page or layout — if the same document type is presented two different ways (e.g. a summary card view vs. a detail view), that is a component/query concern, not a new content type.

Sanity query and type code stays colocated with the route or component that consumes it, per the Sanity Content Layer principle. There is no top-level directory that separates "CMS logic" from "UI logic" — a feature owns its content contract and its presentation together.

**Rationale**: Without an explicit rule, a form field can accidentally become a CMS field, or the same concept can get modeled twice because it's rendered two different ways. Deciding editorial-vs-functional once, at the principle level, keeps that judgment call from being re-litigated per feature.

### III. Sanity Content Layer

Sanity is the CMS. The Studio lives in the separate `studio/` project at the repo root; `app/` consumes content via the client library and MUST NOT edit schemas from within `app/`.

Client & shared setup lives in `app/lib/sanity/`:

```
app/lib/sanity/
├── client.ts              // published perspective, CDN enabled, public-safe
├── client.preview.ts      // drafts perspective, server-only read token, no CDN
├── image.ts               // urlFor() builder — the only sanctioned way to build Sanity image URLs
├── queries/
│   ├── index.ts             // barrel export
│   ├── navigation.ts         // e.g. nav, siteSettings — anything used on 2+ routes
│   └── ...                   // one file per shared/global query group
└── sanity.types.ts          // generated by `sanity typegen generate`, committed to source control
```

Query rules:

- Every GROQ query MUST be defined with `defineQuery` from the `groq` package, assigned to a uniquely named exported const. Inline `client.fetch(groq\`...\`)` calls are forbidden — they aren't picked up by typegen.
- Shared/cross-route queries live in `app/lib/sanity/queries/`. Page-specific queries are colocated next to their route (e.g. `app/routes/pages/blog/blog.query.ts`) and imported into that route's loader only.
- After any schema or query change, `sanity schema extract` MUST run in `studio/`, then `sanity typegen generate` MUST run in `app/` before the change is considered complete. Hand-written content types are not permitted — if typegen can't infer it, fix the query.
- Route loaders import result types from `sanity.types.ts`; never re-declare or cast content shapes manually.

Preview/draft mode:

- `client.preview.ts` is the only client permitted to use the `drafts` perspective, and only when a preview session is authenticated via a server-side secret/cookie — never exposed to the browser bundle.
- Any route that supports editor preview MUST branch its loader between `client.ts` and `client.preview.ts` based on preview-session state, not duplicate its query logic.

Environment variables (server-only unless explicitly prefixed for client exposure): `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`, `SANITY_PREVIEW_SECRET`.

**Rationale**: A typed, single source of truth for content shapes (generated, not hand-maintained) keeps loaders and components honest about what Sanity actually returns. Separating the public and preview clients makes it structurally difficult to leak a read token or draft content to the public bundle.

### IV. Media & Video (Cloudinary)

Video is hosted on Cloudinary via the official `sanity-plugin-cloudinary` plugin, not Sanity's native file/image pipeline. Editors upload through Sanity Studio; Cloudinary stores and serves the file.

- Video fields (e.g. `beforeVideo`/`afterVideo` on `galleryProject`) use the `cloudinary.asset` schema type.
- Where video is the specified format for a feature, it is a required field — no static-image fallback and no unused alternate-format fields carried "just in case."
- Poster frames are generated from the video asset via Cloudinary URL transformation, never uploaded as a separate image field.
- `app/lib/cloudinary/video.ts` is the single sanctioned helper for building Cloudinary delivery URLs, including poster-frame generation. Components MUST NOT construct Cloudinary or Sanity asset URLs by hand.

Environment variables: `CLOUDINARY_CLOUD_NAME` (server-only unless explicitly required client-side for delivery URL construction).

**Rationale**: Cloudinary is purpose-built for media delivery in a way Sanity's asset pipeline isn't for video specifically. Routing all delivery-URL construction through one helper prevents transformation parameters from being duplicated — and drifting — across every component that happens to render a video.

### V. TypeScript Strict Mode (NON-NEGOTIABLE)

All source files MUST be TypeScript. The following constraints MUST be observed at all times:

- `strict: true` in `tsconfig.json`; no `@ts-ignore` or `any` without an explicit, documented exception.
- Route types MUST be derived from React Router's generated `+types/` files (e.g., `Route.MetaFunction`).
- Shared data shapes MUST be defined as TypeScript interfaces or types in `app/types/` or co-located with their module — content shapes specifically come from `sanity.types.ts` per the Sanity Content Layer principle, never re-declared.
- No runtime type assertions (`as SomeType`) as a substitute for proper typing.

**Rationale**: TypeScript catches contract mismatches between routes, loaders, and components before they reach production. The `+types/` generation from React Router and Sanity's typegen make this cost-free for both route-level and content-level types.

### VI. Mobile-First Responsive Design

All UI MUST be designed and implemented mobile-first, using the breakpoints defined in `app/constants/index.ts`. Specifically:

- Base styles target mobile viewports; larger breakpoints layer on top using `QUERIES` constants or Tailwind responsive prefixes.
- No layout or feature MUST be inaccessible on screens narrower than 320px (`BREAKPOINTS.mobileS`).
- Navigation, forms, and interactive elements MUST be touch-friendly (minimum 44×44 px tap target).
- New breakpoints MUST be added to `app/constants/index.ts` before use; ad-hoc magic pixel values are forbidden.

**Rationale**: The target audience for a professional organizing service accesses the site primarily on mobile. Consistent breakpoint management prevents drift between design and implementation.

### VII. Accessibility Standards (WCAG 2.1 AA)

Every page and component MUST meet WCAG 2.1 Level AA. Non-negotiable requirements:

- All images MUST have descriptive `alt` text (decorative images use `alt=""`); videos rendered via the Media principle MUST have an accessible label or transcript-equivalent where the video conveys information not otherwise available on the page.
- Color contrast ratio MUST meet 4.5:1 for normal text and 3:1 for large text.
- All interactive elements MUST be keyboard-navigable and have visible focus indicators.
- Forms MUST have associated `<label>` elements; errors MUST be announced via `aria-live` regions.
- Page structure MUST use semantic HTML landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`).

**Rationale**: Professional service businesses depend on trust. Accessibility failures exclude potential clients and expose the business to legal risk.

### VIII. Performance & SEO First

Every route MUST be server-side rendered (SSR) via React Router's framework mode. Additional requirements:

- Each route MUST export a `meta` function providing `title`, `description`, and Open Graph tags.
- Images MUST be served in modern formats (WebP/AVIF) and include explicit `width`/`height` attributes to prevent layout shift (CLS); videos MUST specify poster and dimensions for the same reason.
- No client-side-only data fetching for content visible above the fold; use React Router `loader` functions instead.
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms on a simulated mid-range mobile device.

**Rationale**: Curated Organization's primary acquisition channel is organic search. SSR and correct metadata directly impact discoverability and booking conversions.

## Technology Stack & Constraints

- **Framework**: React Router v7 (framework mode with SSR) — do not eject to SPA mode.
- **Language**: TypeScript (strict). No plain `.js` source files in `app/`.
- **Styling**: TailwindCSS v4. Utility classes preferred; custom CSS only for animations or Tailwind-impossible cases.
- **CMS**: Sanity.io, per the Content Ownership and Sanity Content Layer principles.
- **Media**: Cloudinary for video, per the Media & Video principle.
- **UI components**: shadcn/ui components (`components.json`) are the sanctioned base — they're copied into the repo as owned, editable source, not installed as an opaque dependency. Installing an actual packaged UI library (MUI, Chakra, Ant Design, etc.) requires a constitution amendment.
- **Runtime**: Node.js server (Express adapter). No serverless rewrites without an explicit amendment.
- **Deployment**: Docker-containerized. The `build/client/` and `build/server/` outputs are the single deployment artifact.
- **External fonts**: Google Fonts (Inter) via `<link>` in `root.tsx`. No font files bundled into the repo.

## Development Workflow

- **Branching**: Feature branches from `main`; branch names follow `###-kebab-description` convention.
- **Specs before code**: Non-trivial features MUST have a spec (`/speckit.specify`) before implementation begins.
- **No dead code**: Deleted files, commented-out blocks, and unused exports MUST be removed, not left as comments.
- **Commits**: Conventional Commits format (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`). One logical change per commit.
- **Review gates**: PRs MUST pass TypeScript compilation (`npm run typecheck`), lint, and a visual check of affected routes before merge.

## Governance

This constitution supersedes all other documented or undocumented practices. When a practice conflicts with a principle herein, the constitution wins and the conflicting practice MUST be updated.

**Amendment procedure**:

1. Propose the change in a PR with a rationale comment referencing the affected principle(s).
2. Increment `CONSTITUTION_VERSION` per semantic versioning (MAJOR for removals/redefinitions, MINOR for additions, PATCH for clarifications).
3. Update `LAST_AMENDED_DATE` to the merge date.
4. Run `/speckit.constitution` after merging to propagate changes to templates — as a properly formed amendment prompt, not raw command text pasted into the file.

**Compliance review**: Constitution Check MUST be performed at the start of every `/speckit.plan` run (before Phase 0 research). Violations found during implementation are blocking; they require either a fix or a documented, approved exception logged in the plan's Complexity Tracking table.

**Version**: 3.2.0 | **Ratified**: 2026-07-10 | **Last Amended**: 2026-07-10
