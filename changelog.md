# Changelog

## Unreleased

### Added
- **Resize from corners** — selected elements show corner handles in edit mode; drag any corner to resize
  - Content elements (heading, text, story, project, link): width-only resize, height stays auto
  - Shape elements (line, arrow, square): proportional scale resize (uniform scale factor from horizontal delta)
- **Ctrl/Cmd+Z undo** — up to 50-step history; snapshots taken before drag, resize, draw, edit, and delete
- **Follow mode toggle** — pill button at top-right; click to zoom in 1.4× and have the canvas smoothly pan to follow the mouse; click again to exit

### Changed
- Corner resize uses uniform scale (aspect-ratio-preserving) instead of free bounds

---

## 2026-03-26

### Added
- **Drag to draw** — line, arrow, and box shapes can be drawn directly on the canvas by clicking and dragging
- **New element types** — line, arrow, square added alongside heading, text, story, project, link
- **Multi-select** — shift-click to select multiple elements; drag moves all selected together
- **Mini toolbar** — appears above selected element with edit, delete, and type label
- **Zoom controls** — zoom in/out buttons and fit-to-view in bottom-right corner
- **JSON editor** — raw JSON editing for the full canvas data
- **Draw mode indicator** — banner shown while a draw tool is active

### Changed
- Spatial canvas header replaced with ultra-slim bar for more canvas space

---

## Earlier

- Spatial Canvas tab with password-protected immersive editing
- Mouse-reactive animations and click burst effects on portfolio page
- JSON-driven portfolio with password-protected edit mode
- Edit JSON button on all three portfolio section toolbars
