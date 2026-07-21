# Data Model: Hamburger Menu for Navigation

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This feature introduces no Sanity content types, schema changes, or GROQ queries (see [research.md](./research.md) — "No new content" is confirmed in the plan's Content Layer Decisions). The only "data" involved is transient UI state local to the `Navigation` component, documented here for completeness.

## Entity: Mobile Menu State

Not persisted, not fetched — exists only in the browser for the lifetime of a page view.

| Field         | Type      | Description                                                                 |
| ------------- | --------- | ----------------------------------------------------------------------------- |
| `isMenuOpen`  | `boolean` | Whether the mobile navigation menu is currently expanded. Default: `false`.   |

**Transitions**:

- `false → true`: visitor activates the hamburger toggle while the menu is closed (FR-002).
- `true → false`: visitor activates the toggle again, selects a link (FR-004), the viewport crosses from mobile to desktop width (FR-008), or (per Edge Cases) the visitor navigates via browser back/forward or taps outside the open menu.

**Existing entity reused, unchanged**: `NavItem` / `NavItems` (`app/routes/components/navigation/navigation.types.ts`) — the primary link list (Home, Services, Gallery, Booking CTA) sourced from `NAVBAR_DATA`. This feature does not add, remove, or restructure nav items; it only changes how they're revealed on small viewports.
