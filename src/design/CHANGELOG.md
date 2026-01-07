# Design System Changelog

All notable changes to the design system will be documented in this file.

## [1.0.0] - 2026-01-07

### Initial Release

**Centralized Design System**
- Created `src/design/` folder to encapsulate all styling
- Moved all design tokens to `src/design/tokens.css`
- Moved utilities to `src/design/utilities.css`
- Created comprehensive documentation in `src/design/README.md`
- Added quick reference guide in `src/design/QUICK_REFERENCE.md`
- Added TypeScript exports in `src/design/index.ts`

**Design Tokens**
- Accent color: #CF1C0F (Orange-red)
- Background: #000000 (Pure black)
- Surfaces: #09090b (zinc-950) and #27272a (zinc-800)
- Text: #fafafa (primary) and #a1a1aa (muted)
- Border radius: 0.125rem (2px - minimal)
- Transitions: 150-200ms with cubic-bezier(0.2, 0.8, 0.2, 1)

**Component Sizes**
- Button height (sm): 28px (h-7)
- Button height (default): 32px (h-8)
- Input height: 28px (h-7)
- Typography base: 12px (text-xs)

**Philosophy**
- Pure black aesthetic
- Sharp edges (minimal border radius)
- Dense UI (small text, compact spacing)
- Fast motion (150-200ms)
- Single accent color with high contrast

### Changed from Previous System
- Accent color changed from lime (#c8ff3d) to orange-red (#CF1C0F)
- All design tokens centralized in one location
- Removed duplicate styles across files
- Improved documentation and discoverability

---

## How to Update This Changelog

When making design system changes:

1. Add a new version section at the top (use [Semantic Versioning](https://semver.org/))
2. Use categories: Added, Changed, Deprecated, Removed, Fixed
3. Include the date in YYYY-MM-DD format
4. Describe what changed and why

### Example Entry:

```markdown
## [1.1.0] - 2026-01-15

### Changed
- Accent color changed from #CF1C0F to #2E7BFF (switched to blue for better accessibility)
- Button heights increased by 4px for improved touch targets

### Added
- New `--surface-hover` token for consistent hover states
- Dark mode support (if implemented)

### Fixed
- Border contrast issue on light backgrounds
```

---

## Version History

- **1.0.0** (2026-01-07): Initial centralized design system
