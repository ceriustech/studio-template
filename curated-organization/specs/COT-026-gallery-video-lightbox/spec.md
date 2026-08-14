# Feature Specification: Gallery Video Poster & Lightbox

**Feature Branch**: `COT-026-gallery-video-lightbox`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "COT-026: Gallery page — video poster frames, native controls, and image lightbox

Description:

Rework the media panels on the Gallery page so videos rest on a real poster frame with standard playback controls, and so any panel opens in a full-screen lightbox that can be cycled through.

This ticket covers the UI layer only. Sanity and Cloudinary integration are not yet set up, so all media is sourced from local static files in `/public` for now. Build the media type so that swapping to remote sources later changes only how URL strings are produced, not the components that consume them — components should accept plain `src` and `poster` strings and stay unaware of where they came from.

Videos are capped at two per project, tagged Before and After. Videos and images cycle as separate sets in the lightbox: opening a video arrows between videos only, opening an image arrows between images only.

The end result of the UI should match the design screenshots exactly

Acceptance Criteria: (see full ticket for the complete list covering video panels, image panels, lightbox behavior, and accessibility/performance requirements)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor previews a project's Before/After videos at a glance (Priority: P1)

A visitor browsing a project on the Gallery page sees each video panel resting on a clear photographic still (the poster frame), labeled "Before" or "After" in the corner, with a play button overlaid and the clip's length shown in the corner. Today the panel shows a blank or first-frame video with the literal text "paused · poster" next to a play toggle, which plays the clip inline when clicked. Instead, clicking the panel opens a full-screen viewer where the clip plays with the browser's standard playback controls.

**Why this priority**: This is the core visual defect the ticket exists to fix — the placeholder text and inline playback are the most visible problems on the page today, and every other requirement builds on this panel resting correctly on a poster image.

**Independent Test**: Load the Gallery page, locate any project's Before/After video panels, and confirm each panel shows a real photo (not a blank frame), a Before or After label in the top-left corner, a duration chip in the bottom-right corner, a play icon overlaid on the photo, and no "paused" or "poster" text anywhere. Click a panel and confirm it opens a full-screen viewer with the video playing and standard playback controls, rather than playing inline in the panel.

**Acceptance Scenarios**:

1. **Given** a project's video panel is at rest (not yet opened), **When** the visitor looks at it, **Then** it shows a poster photo, a Before or After label top-left, a duration chip bottom-right, a play icon over the poster, and no "paused · poster" or similar placeholder text.
2. **Given** a project's video panel is at rest, **When** the visitor clicks anywhere on the panel, **Then** a full-screen viewer opens and the video begins playing automatically with the browser's native playback controls visible, rather than the video playing inline in the small panel.
3. **Given** the full-screen viewer is open and playing a video, **When** the visitor looks at the video controls, **Then** the standard playback bar is present, the browser's built-in download option is not offered, and captions are available whenever the project supplies them for that clip.
4. **Given** a project has two videos (one Before, one After), **When** the visitor is content-editing or configuring that project's media, **Then** it is not possible to attach a third video to the same project.

---

### User Story 2 - Visitor enlarges a project's detail photos (Priority: P2)

A visitor looking at a project's supporting photos (countertops, finishes, close-ups) wants to see them larger than the small thumbnail strip on the page. Clicking any photo opens the same full-screen viewer used for videos, showing that photo enlarged with its caption, and lets the visitor move to the next or previous photo in that same project without leaving the viewer or ever landing on the project's videos.

**Why this priority**: Delivers the second half of the "any panel opens a lightbox" requirement and is independently valuable — a visitor can browse a project's full photo set without the video-specific work being finished, and vice versa.

**Independent Test**: Load the Gallery page, click any detail photo thumbnail in a project, and confirm a full-screen viewer opens showing that photo enlarged with its caption beneath it. Confirm moving to the next/previous item only ever shows other photos from that same project, never a video panel.

**Acceptance Scenarios**:

1. **Given** a project has several detail photos, **When** the visitor clicks any one of them, **Then** the full-screen viewer opens already showing that exact photo, enlarged, with its caption beneath it.
2. **Given** the full-screen viewer is open on a photo, **When** the visitor moves to the next or previous item, **Then** only that project's other photos are shown — the project's videos are never reachable from that navigation.
3. **Given** the full-screen viewer is open on a video, **When** the visitor moves to the next or previous item, **Then** only that project's other video (if any) is shown — the project's photos are never reachable from that navigation.
4. **Given** a photo thumbnail on the page, **When** it is rendered, **Then** it carries no Before/After label (that label is reserved for videos only).

---

### User Story 3 - Visitor navigates and dismisses the full-screen viewer confidently (Priority: P3)

A visitor inside the full-screen viewer wants ordinary ways to move around and exit: arrow buttons, keyboard arrows, a row of small thumbnails at the bottom (on larger screens) they can tap to jump directly to an item, a swipe gesture on a touchscreen, the Escape key, or clicking the dimmed area outside the media. On a phone-sized screen, the same position sense is instead given by a small row of dot indicators beneath the caption, since there's no room for a thumbnail row. A keyboard-only or screen-reader visitor can reach and operate every one of these without a mouse, and closing the viewer returns their focus to the exact thumbnail they opened.

**Why this priority**: This is the interaction and accessibility layer that makes Stories 1 and 2 usable for everyone, but the viewer already functions minimally (open, show item, close) once Stories 1–2 are done, so this layer can be completed and verified as its own increment.

**Independent Test**: Open the full-screen viewer from any panel and, without touching a mouse, confirm Escape closes it, left/right arrow keys move to the previous/next item in the current set, focus lands inside the viewer on open and returns to the originating thumbnail on close, and Tab cycles only through controls inside the viewer. Separately, on a touchscreen or touch-emulated browser, confirm a horizontal swipe moves to the next/previous item and a row of small dots (one per item, current one distinguished) is visible beneath the caption instead of a thumbnail row; on a tablet/desktop-sized viewport confirm a row of thumbnails is visible at the bottom instead, with the currently shown item visually distinguished and every other thumbnail clickable to jump straight to it.

**Acceptance Scenarios**:

1. **Given** the full-screen viewer is open, **When** the visitor presses Escape, **Then** the viewer closes and focus returns to the thumbnail that opened it.
2. **Given** the full-screen viewer is open, **When** the visitor presses the left or right arrow key, clicks the previous/next control, or (on touch) swipes horizontally, **Then** the viewer shows the previous/next item within the current set (videos-only or photos-only).
3. **Given** the full-screen viewer is open, **When** the visitor clicks the dimmed backdrop area, **Then** the viewer closes; **When** they click the media itself, **Then** the viewer stays open.
4. **Given** the full-screen viewer is open, **When** the visitor repeatedly presses Tab or Shift+Tab, **Then** keyboard focus cycles only among the controls inside the viewer and never escapes to the page behind it.
5. **Given** the full-screen viewer is open on a tablet or desktop-sized screen, **When** the visitor looks at the bottom of the viewer, **Then** a row of small thumbnails for the current set is visible, the currently shown item is visually distinguished from the rest, and clicking any thumbnail jumps the viewer to that item; **Given** the same viewer is open on a mobile-sized screen, **Then** that thumbnail row is replaced by a row of small dot indicators (one per item in the set, the active one visually distinguished) beneath the caption, and visible on-screen previous/next buttons are not shown — moving between items on mobile relies on the swipe gesture (and the keyboard, if one is attached).
6. **Given** the full-screen viewer is open, **When** the visitor scrolls or tries to scroll the page behind it, **Then** the page underneath does not move, and no horizontal shift or layout jump occurs when the viewer opens or closes.
7. **Given** the visitor is moving between photos in the viewer, **When** they advance to the next or previous photo, **Then** the new photo appears without a blank or empty flash.
8. **Given** the full-screen viewer is open on a video, **When** the visitor looks at the enlarged video, **Then** its Before/After label still renders as an overlay on the video (top-left), matching the label shown on its resting panel.
9. **Given** the full-screen viewer is open on a video and the thumbnail row is visible (tablet/desktop), **When** the visitor looks beneath each video thumbnail in that row, **Then** its Before/After label renders as text beneath the thumbnail; photo thumbnails in the row carry no such label.

---

### Edge Cases

- A project with only one video (or one photo) in a set: the previous/next controls and thumbnail row still render but moving forward/backward stays on that single item (or the controls are hidden when a set has only one item).
- A video with no captions supplied for that project: the viewer plays normally without a captions option, rather than showing a broken or empty captions control.
- A visitor with "reduce motion" enabled at the operating-system level: hover highlights, the play-icon fade, and open/close transitions are not animated, but every control still works exactly the same.
- A visitor tabs to a video panel or photo thumbnail using only a keyboard: the panel/thumbnail is reachable and operable (opens the viewer) without a pointer.
- The viewer is opened, then the visitor's device rotates or the browser window is resized across the mobile/tablet breakpoint while it stays open: the thumbnail row appears or disappears accordingly without closing the viewer.
- A photo lacks a defined larger/original version: the viewer falls back to showing the same image used for the thumbnail, scaled up.

## Requirements *(mandatory)*

### Functional Requirements

**Media data**

- **FR-001**: The system MUST represent each project's video clips with, at minimum: a thumbnail poster image, the frame offset that poster was captured at, a Before/After label, a playback duration, a video source, and an optional captions source.
- **FR-002**: The system MUST represent each project's photos with, at minimum: a source image, alternative text, a caption, and an optional larger/original image that is used in place of the thumbnail when viewed full-screen.
- **FR-003**: The system MUST prevent a project from holding more than two video clips.
- **FR-004**: Video clips MUST NOT carry the "before/after" concept confused with photos — photos never carry a Before/After label.
- **FR-005**: The underlying media data MUST be structured so that where a media file physically lives (a local file today, a remote asset later) can change without requiring changes to the panels or viewer that display it.

**Video panels (resting state)**

- **FR-006**: Every video panel MUST display its poster image at rest; no video panel may show a blank frame, the first frame of the clip, or the words "paused" / "poster" as visible text.
- **FR-007**: Every video panel at rest MUST show a play affordance overlaid on the poster, a duration chip in the bottom-right corner, and its Before/After label in the top-left corner.
- **FR-008**: The play affordance MUST disappear once the clip begins actually playing.
- **FR-009**: Clicking or activating a video panel MUST open the full-screen viewer rather than beginning inline playback within the panel.

**Video playback**

- **FR-010**: From the moment a video clip begins playing, the browser's standard/native playback controls MUST be shown, and the built-in "download this video" option MUST be suppressed.
- **FR-011**: Playing video MUST remain inline within its own frame on mobile devices rather than forcing the device's native full-screen video player.
- **FR-012**: When a project's video clip has a captions source, the viewer MUST offer that captions track; when it does not, no broken or empty captions control is shown.

**Image panels**

- **FR-013**: Every photo thumbnail on the page MUST be clickable/activatable and MUST open the full-screen viewer already showing that exact photo.
- **FR-014**: Photo thumbnails MUST be loaded lazily so off-screen thumbnails do not block the initial page load.

**Full-screen viewer**

- **FR-015**: The viewer MUST open over a dimmed backdrop with the active item centered on screen.
- **FR-016**: The viewer MUST show, at all times while open: which item is currently shown and how many total items are in the current set, a close control, and the active item's caption beneath it. On tablet and desktop screen sizes, previous/next controls render as visible on-screen buttons beside the media; on mobile screen sizes, no separate on-screen previous/next buttons are shown — moving between items relies on the swipe gesture (FR-022) and the keyboard (FR-020), matching the provided design screenshots.
- **FR-017**: On tablet and desktop screen sizes, the viewer MUST show a row of thumbnails for the current set at the bottom, visually distinguish the active item within that row, and let the visitor click any thumbnail to jump directly to it; on mobile screen sizes, that row MUST NOT be shown.
- **FR-018**: The viewer MUST treat videos and photos as two separate, non-mixing sets: opening a video only ever cycles to the project's other video(s), and opening a photo only ever cycles to the project's other photos.
- **FR-019**: A video opened in the viewer MUST begin playing automatically with native controls already active.
- **FR-020**: The viewer MUST close when the visitor presses Escape, and MUST move to the previous/next item in the current set when the visitor presses the left/right arrow keys.
- **FR-021**: Clicking the dimmed backdrop MUST close the viewer; clicking the active media itself MUST NOT close it.
- **FR-022**: A horizontal swipe gesture on a touch device MUST move to the previous/next item in the current set.
- **FR-023**: Opening the viewer MUST move keyboard focus into it, and closing the viewer MUST return keyboard focus to the exact thumbnail or panel that opened it.
- **FR-024**: While the viewer is open, Tab and Shift+Tab MUST cycle only through controls inside the viewer and MUST NOT reach the page behind it.
- **FR-025**: While the viewer is open, the page behind it MUST NOT scroll, and neither opening nor closing the viewer may cause any horizontal shift of the page content.
- **FR-026**: The viewer MUST prepare the neighboring photos in the current set in advance so that moving to the next/previous photo never shows an empty or blank frame.
- **FR-027**: The viewer MUST NOT attempt to render before the page has finished loading in the visitor's browser, and must otherwise render nothing rather than error.
- **FR-028**: The viewer MUST be identifiable to assistive technology as a modal dialog, and MUST announce which item and position within the set is currently shown.
- **FR-029**: When the active item in the viewer is a video, its Before/After label MUST also render as an overlay on the enlarged video (top-left), matching the label shown on its resting panel.
- **FR-030**: On mobile screen sizes, in place of the thumbnail row (FR-017), the viewer MUST show a row of dot indicators — one per item in the current set — with the active item's dot visually distinguished from the rest.
- **FR-031**: In the tablet/desktop thumbnail row (FR-017), video-set thumbnails MUST also show their Before/After label as text beneath the thumbnail; photo-set thumbnails carry no such label.

**General**

- **FR-032**: Every hover highlight, fade, and open/close transition throughout the affected panels and viewer MUST be suppressed for visitors who have "reduce motion" enabled at the operating-system level, without disabling the underlying functionality.
- **FR-033**: Every interactive control introduced or changed by this feature (play affordance, close, previous/next, thumbnails, panels) MUST have a visible focus indicator and an accessible label describing what it does.
- **FR-034**: No part of this feature may read from or write to the visitor's browser storage.

### Key Entities

- **Video Clip**: One Before or After clip belonging to a project. Carries its playable source, a poster still image, the timestamp that still was captured at, its Before/After label, its duration, and an optional captions source. At most two exist per project.
- **Photo**: One supporting image belonging to a project (e.g., a detail or finish shot). Carries its thumbnail source, alternative text, a caption, and an optional larger source used when enlarged. Carries no Before/After label.
- **Project**: A single portfolio entry on the Gallery page that groups one set of Video Clips (0–2) and one set of Photos together.
- **Viewer Session**: The transient state of the full-screen viewer while open — which set (videos or photos) is active, which item within that set is currently shown, and which panel or thumbnail should regain focus when it closes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero video panels on the Gallery page display the words "paused" or "poster" as visible text, and 100% of video panels show a real poster photo at rest.
- **SC-002**: 100% of video and photo panels on the Gallery page open the full-screen viewer in a single click or tap, landing on the exact item that was clicked.
- **SC-003**: Inside the full-screen viewer, a visitor can move to any other item in the current set — using the on-screen controls, keyboard arrows, touch swipe, or the thumbnail row — without ever seeing a blank or empty frame, and without ever being shown an item from the other set (a video visitor never sees a photo, and vice versa).
- **SC-004**: A visitor using only a keyboard can open any panel, move through the full-screen viewer, and close it, ending with focus back on the exact panel or thumbnail they started from, with zero interactive controls unreachable by keyboard.
- **SC-005**: A side-by-side visual comparison of the reworked Gallery page against the provided design screenshots shows matching layout, labeling, and controls across mobile, tablet, and desktop screen sizes.
- **SC-006**: Attempting to configure a project with a third video is not possible in the underlying data — every project in the live site holds at most two videos.
- **SC-007**: With "reduce motion" enabled, 100% of hover and transition effects on the affected panels and viewer are suppressed while every control remains fully operable.

## Assumptions

- "Local static files in `/public`" means the project's existing bundled video files and remote poster/detail-photo URLs are replaced with files served from the app's local `/public` directory for this ticket; no CMS (Sanity) or asset-hosting (Cloudinary) integration is introduced or required.
- The existing 18 portfolio pieces already on the Gallery page are updated to the new media shape (poster, posterOffset, tag, duration, captionsSrc for clips; alt, caption, optional fullSrc for photos) using locally-available or newly-sourced still images; captions files are only wired up where they already exist — clips without one simply omit captions, per FR-012.
- Reaching the end of a set (last video/photo) and moving "next" wraps back around to the first item, and vice versa for "previous" — the standard behavior for this kind of full-screen viewer — since the ticket does not specify boundary behavior.
- The existing category filter (Before/After is a separate, new concept from the existing room-category filter) is unaffected by this work; this ticket only adds the Before/After label to videos and does not change how projects are filtered or organized on the page.
- "Tablet and desktop" for the thumbnail row, and "mobile" for hiding it, follow the same breakpoint boundaries already used elsewhere on this site for its mobile/tablet/desktop layouts.
- Duration values are authored per clip as part of its media data rather than measured automatically from the video file.
- This ticket does not require producing a distinct, unique poster still for every clip if suitable local imagery is not available for all of them; reusing representative local images across similar clips is acceptable as long as no panel is left blank or showing placeholder text.
- The provided design screenshots (mobile and desktop, image set and video set) are the literal source of truth for FR-029–FR-031 and the mobile/tablet split in FR-016–FR-017: mobile shows an item counter and caption but no separate on-screen previous/next buttons, with a dot-indicator row beneath the caption instead of a filmstrip; tablet/desktop shows explicit previous/next chevrons beside the media and a filmstrip beneath the caption; an open video keeps its Before/After tag visible on the enlarged video itself; and filmstrip thumbnails for a video set carry a "Before"/"After" text label beneath them while image-set thumbnails do not.
