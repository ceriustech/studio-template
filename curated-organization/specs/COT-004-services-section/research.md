# Research: COT-004 Services section

## Unknowns

No [NEEDS CLARIFICATION] markers were present in the spec. There are no technical unknowns for this presentational feature.

## Decisions

- Keep content static in first iteration. If later requested, content can be migrated to Sanity and the component updated to accept props or load via a loader.
- Implement as route-local components under `app/routes/pages/home/components/Services/`.

## Rationale

This approach minimizes scope, keeps the UI easy to review for visual parity, and avoids editorial migration work until content ownership is confirmed.
