# Phase 0 Research: Call To Action section

No `[NEEDS CLARIFICATION]` markers remained in the spec. This document records the
implementation-approach decisions made during planning for this small, static section.

## Decision: Static, no interactive state

**Decision**: The `Cta` component takes no props (or an empty props type) and owns no
state — it renders the heading, subtext, background image/overlay, and button exactly as
shown in the mockup, with no conditional branches.

**Rationale**: The spec and mockup both describe a single fixed resting state with one
link. Unlike `Testimonial` (which needed a carousel hook), there's no multiplicity or
variation to manage here — introducing state or props would add a layer, not a benefit.

**Alternatives considered**:

- *Accept heading/subtext/button label as props for future reuse* — rejected: there is
  exactly one consumer (`home`) and one instance of this section; adding a props surface
  for content that isn't expected to vary would be speculative generality with nothing to
  validate it against.

## Decision: Button links to the existing `/booking` route

**Decision**: The "Book a consultation" button is a React Router `Link` pointing to
`PAGE_ROUTES_DATA.BOOKING.path` (`/booking`), imported from `app/routes/constants/index.ts`,
rather than a hardcoded string literal.

**Rationale**: The `/booking` route already exists in this codebase (`app/routes/pages/booking/index.tsx`
per `PAGE_ROUTES_DATA`), and it is exactly the "book a free consultation" destination the
spec describes. Referencing the shared route constant avoids a second hardcoded copy of the
path drifting out of sync if the route ever changes.

**Alternatives considered**:

- *Hardcode `href="/booking"` directly in the anchor* — rejected: the project already
  centralizes route paths in `PAGE_ROUTES_DATA`; bypassing it here would be an inconsistent,
  easily-missed duplicate of the same string.

## Decision: Background image and overlay are plain CSS, not Cloudinary

**Decision**: The CTA background image is applied via a plain CSS `background-image` (as in
the mockup), with the translucent overlay as a separate absolutely-positioned layer —
mirroring the mockup's `.cta-bg` / `.cta-overlay` structure exactly, translated to camelCase
class names (`ctaBg`, `ctaOverlay`).

**Rationale**: The constitution reserves the Cloudinary pipeline for video assets
(`cloudinary.asset` on video fields). This is a static background photograph, not video, and
the mockup itself uses a plain CSS background image — consistent with how the Hero section's
background image is already handled elsewhere in the codebase.

**Alternatives considered**:

- *Route the background image through Cloudinary helpers* — rejected: those helpers
  (`app/lib/cloudinary/video.ts`) exist specifically for video delivery/poster-frame URLs;
  there is no equivalent or expectation for static background photography in this codebase.

## Decision: Accessibility treatment for the background and button

**Decision**: The background image + overlay div are decorative (no `alt` text needed, since
they're CSS backgrounds, not `<img>` elements); the button is a real `<Link>` (renders as an
anchor), giving native keyboard focus and activation with no custom key handling; text
contrast against the overlay is verified against the constitution's 4.5:1 (normal text) /
3:1 (large text) minimums.

**Rationale**: Matches the constitution's WCAG 2.1 AA requirement and the existing pattern
used elsewhere on the page (e.g., `Testimonial`'s decorative quote mark). Since this section
has exactly one interactive element (the button) and no dynamic content changes, there is no
need for `aria-live` regions or other patterns used by `Testimonial`'s carousel.

**Alternatives considered**:

- *Add an `alt`-bearing `<img>` for the background instead of CSS `background-image`* —
  rejected: the mockup treats the background as decorative layering behind text, not
  meaningful image content: a CSS background keeps that intent clear and matches the existing
  Hero section's approach.
