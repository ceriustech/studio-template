# Tasks: COT-004 Services section

Total stories: 2 (US1 primary visual implementation, US2 accessibility & responsive checks)

## Phase 1 — Setup

- [x] T001 Create feature folder and placeholder files at `app/routes/pages/home/components/Services/` (Services.tsx, Services.types.ts, ServiceCard.tsx, services.module.css)
- [x] T002 Update Home page to include the Services section by importing `Services` in `app/routes/pages/home/index.tsx` and placing `<Services />` between Intro and Before/After sections

## Phase 2 — Foundational

- [x] T003 [P] Add base styles file `app/routes/pages/home/components/Services/services.module.css` with CSS variables usage and responsive breakpoints

## Phase 3 — User Stories

### US1 (P1) — Render Services section matching mockup

- [x] T004 [US1] Implement `app/routes/pages/home/components/Services/ServiceCard.tsx` and `ServiceCard` props in `Services.types.ts` (title, description, imageUrl, altText)
- [x] T005 [US1] Implement `app/routes/pages/home/components/Services/Services.tsx` to render a semantic `section.services` with header (eyebrow + `h2`), the three `ServiceCard` instances using static content (image URLs from `.specify/site-design/curated-home-mockup.html`), and a centered footer link
- [x] T006 [US1] Ensure card hover state: `transform: translateY(-4px)` and subtle `box-shadow` in `services.module.css`
- [ ] T007 [US1] Use accessible `alt` text for images (or empty alt if decorative) in `ServiceCard.tsx`

### US2 (P2) — Accessibility and responsive behavior

- [ ] T008 [US2] Verify heading order and semantic structure in `app/routes/pages/home/components/Services/Services.tsx`
- [ ] T009 [US2] Confirm responsive grid behavior: 3-column desktop -> 1-column mobile; adjust CSS in `services.module.css` as needed
- [ ] T010 [US2] Run manual visual QA and document differences vs mockup in `specs/COT-004-services-section/research.md`

## Final Phase — Polish & Cross-Cutting

- [ ] T011 Update `specs/COT-004-services-section/checklists/requirements.md` with QA results and mark checklist items
- [ ] T012 Commit changes and open PR branch `COT-004-services-section` with a concise description and link to spec

## Dependencies & Parallelism

- `T001` -> `T004,T005` (components require folder)
- `T003` (styles) is parallelizable with `T004` (component implementation) — marked `[P]`
- Visual QA (`T010`) depends on `T005` and `T006`

## Suggested MVP

- Complete US1 tasks (T004–T007) to ship a pixel-accurate presentational Services section. Follow-up accessibility fixes (US2) can be done in a subsequent patch if needed.
