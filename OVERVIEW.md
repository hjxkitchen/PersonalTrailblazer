# PersonalTrailblazer

## Original Prompt
> remove the iscreen image for each project in portfolio section, Also make the portfolio section the default tab selected when the site loads. And in edit, I should be able to drag and drop images and/or videos and create a multi-slide.Carousel for each app, and then when I click on each app, it should open an app page with more description and other details, etc., about the app, with a larger header.

---

## Checkpoint 1 — Portfolio cards cleanup, media carousel & app detail modal

**Changes made:**

- **`usePortfolio.tsx`**: Changed default `view` from `"main"` to `"extended"` so the Portfolio tab is selected on load.

- **`ExtendedProjectEditModal.tsx`**: Updated `ExtendedProject` interface with new optional fields (`media`, `longDescription`, `technologies`). Added a full media management section to the edit modal: drag-and-drop file upload zone (images are compressed via canvas to ≤1400px JPEG), URL input for external media (YouTube, Vimeo, direct links), thumbnail grid with remove buttons and drag-to-reorder.

- **`MissionSection.tsx`**: Removed the static thumbnail image (`ThumbnailImage` component + `THUMBNAIL_MAP`) from all project cards. Cards are now text-only with a clean layout. In edit mode, each card shows a small drop zone at the top so files can be dragged directly onto a card to add media. A media count badge appears on cards that have media. Clicking a card (non-edit mode) opens the new `AppDetailModal`.

- **`AppDetailModal.tsx`** (new file): Full-detail overlay with large title (up to `text-6xl`), category badge, short description, full-width `aspect-video` media carousel with prev/next arrows, dot indicators, slide counter, long description, technology tags, and "Open Project" CTA button. YouTube/Vimeo URLs render as embeds; direct video files play inline; images show normally. Closes on Escape or backdrop click.

**Data model** (`ExtendedProject`):
```typescript
{
  id, name, description, url, category,  // existing
  media?: string[],          // data URLs (images/video) or external URLs
  longDescription?: string,  // shown in detail view
  technologies?: string[],   // tag chips in detail view
}
```
Existing projects without `media`/`longDescription`/`technologies` continue to work unchanged.

---

## Checkpoint 2 — Portfolio List View (Finder-style)

**Changes made:**

- **`MissionSection.tsx`**: Added a List/Grid toggle button next to "The Portfolio" heading (hidden in edit mode). Clicking it switches between the card grid and a compact Finder-style table.
  - **Table columns**: Name · Category · Description · URL · Media count — all sortable by clicking the column header (Name, Category, URL presence, Media count).
  - Sort direction toggles on repeated clicks; active column highlighted in blue with ↑/↓ chevron; inactive columns show a dim ⇅ icon.
  - Rows are alternating-shade, hover-highlighted; clicking a row opens the AppDetailModal same as a card click. URL column renders a clickable hostname with ExternalLink icon; cells show `—` when empty.
  - Category filter tabs still work in list view (filters rows to the active category).
  - Button text/icon swaps between "List" (List icon) and "Grid" (LayoutGrid icon) to reflect current state.
  - Grid view is always shown in edit mode regardless of toggle state.

---

## Checkpoint 3 — List View: filter bar, inline row editing, improved table layout

**Changes made to `MissionSection.tsx`:**

- **Filter bar** (above the table): Category dropdown and Visible/Hidden/All pill-toggle so users can filter list rows without changing the global category tab. Shows a live project count on the right.
- **`listFilteredProjects`** derived from `sortedProjects`, applying both visibility and category filters.
- **Inline row editing**: Clicking the pencil icon in edit mode now opens the row in-place (blue-tinted background) with text inputs for Name, Description, GitHub, URL; a select for Category; and a visibility toggle button. Save (Check icon) / Cancel (X icon) buttons commit or discard the draft. Uses `editingRowId` + `rowDraft` state with `startRowEdit` / `saveRowEdit` / `cancelRowEdit` helpers.
- **Table layout improvements**: Switched to `minmax(0, Xfr)` column template to prevent grid blowout; header cells use a reusable `SortBtn` component; rows use consistent `px-3` padding.
- **Bulk action bar** redesigned to be more compact (text-xs, smaller gaps).
- Added `Check` to lucide-react imports.
- Build verified clean.
