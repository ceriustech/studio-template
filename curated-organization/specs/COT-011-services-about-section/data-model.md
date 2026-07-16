# Phase 1 Data Model: Services About section

No Sanity schema changes in this pass, and no runtime data entities — this section's photo,
eyebrow label, headline, paragraph, and signature are all fixed values hardcoded in
`about/index.tsx` (see plan.md Content Layer Decisions and research.md). There is no
per-instance configuration, no list of items expected to grow independently of a code change,
and no state that varies over the component's lifetime, so there is no entity to model.

## Fixed content (for reference, not a data entity)

| Field                 | Value                                                                                                                                                                                                              | Notes                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Photo                 | `https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1000&q=80&auto=format`                                                                                                                             | Rendered as a CSS `background-image` with a gradient overlay, per the mockup.             |
| Eyebrow               | "About Curated"                                                                                                                                                                                                    | Rendered uppercase via CSS `text-transform`, not hardcoded uppercase in copy.              |
| Headline (`<h2>`)     | "Where order meets elegance"                                                                                                                                                                                       | Serif, left-aligned within the text column.                                               |
| Descriptive paragraph | "Curated is a professional organizing studio serving the NOVA and DMV area. We transform cluttered, overwhelming spaces into functional sanctuaries — homes and offices that look beautiful and work effortlessly for the way you actually live. Every project starts with listening, and every system we build is designed to last long after we leave." | Sans, max-width constrained per the mockup.                                               |
| Signature             | "— The Curated Team"                                                                                                                                                                                               | Italic serif, rendered below the paragraph.                                               |

## Future migration note

If this copy/image is later moved into Sanity as page-level editorial content,
`about/index.tsx` would accept these values as props (typed from `sanity.types.ts`, with the
photo sourced via `app/lib/sanity/image.ts`'s `urlFor()`) from a `servicesPage` document query,
rather than reading module-level constants. No other part of the component (layout, CSS) would
need to change.
