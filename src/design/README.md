# Design System Documentation

This folder contains the centralized design system for XMTP Agents. All styling tokens, variables, and guidelines are documented here.

## 📁 File Structure

```
src/design/
├── README.md           # This file - documentation
├── tokens.css          # Core design tokens (EDIT THIS for changes)
└── utilities.css       # Utility classes and animations
```

## 🎨 Making Design Changes

### Change the Accent Color

To update the primary brand color throughout the app:

1. Open `tokens.css`
2. Find the `COLORS - Base Palette` section (around line 33)
3. Update the `--accent` variable:

```css
/* Current value */
--accent: #CF1C0F;  /* Orange-red */

/* Change to your color */
--accent: #YOUR_HEX_COLOR;
```

4. **IMPORTANT:** Also update the direct references in the sidebar section (around lines 91-96):
```css
--sidebar-primary: #CF1C0F;      /* Update this too */
--sidebar-ring: #CF1C0F;         /* And this */
```

5. And in the chart colors section (around line 100):
```css
--chart-1: #CF1C0F;              /* Update this too */
```

**Note:** We use direct hex values instead of CSS variable references to avoid circular dependencies.

**After updating, the color will appear everywhere:**
- All buttons with `variant="default"`
- Selected states in sidebar
- User message bubbles
- Focus rings
- Highlights and badges

### Change Surface Colors

To adjust the background elevations:

```css
--background: #000000;           /* Main background */
--surface-elevated: #09090b;     /* Headers, panels */
--surface-card: #27272a;         /* Cards, elevated elements */
```

### Change Text Colors

```css
--text-primary: #fafafa;         /* Main text */
--text-muted: #a1a1aa;           /* Secondary text */
```

### Change Border Radius

To make UI more/less rounded:

```css
--radius: 0.125rem;  /* Current: 2px (sharp) */
--radius: 0.5rem;    /* Example: 8px (rounded) */
```

### Change Component Sizes

To make UI more/less dense:

```css
--button-height-sm: 1.75rem;     /* 28px */
--button-height-default: 2rem;   /* 32px */
--input-height: 1.75rem;         /* 28px */
```

### Change Animation Speed

```css
--duration-fast: 150ms;      /* Fast interactions */
--duration-default: 200ms;   /* Default transitions */
```

## 🎯 Design Principles

### 1. Pure Black Aesthetic
- Main background: Pure black (#000000)
- Surfaces elevated with zinc scale
- High contrast for readability

### 2. Sharp Edges
- Minimal border radius (2px default)
- No rounded-full elements
- Geometric, precise design

### 3. Dense UI
- Small text sizes (text-xs as base)
- Compact spacing
- Efficient use of screen space

### 4. Fast Motion
- Snappy 150-200ms transitions
- Short slide distances (8-12px max)
- No parallax effects

### 5. Single Accent Color
- One primary accent color
- Dark text on accent for accessibility
- Consistent application throughout

## 🔧 How The System Works

### Token Flow

```
tokens.css → index.css → Tailwind → Components
```

1. **tokens.css**: Core design tokens (colors, spacing, etc.)
2. **index.css**: Imports tokens + adds base styles
3. **Tailwind**: Uses CSS variables for utilities
4. **Components**: Use Tailwind classes or CSS variables

### Using Tokens in Components

#### Via Tailwind Classes (Recommended)
```tsx
<Button className="bg-accent text-accent-foreground">
  Click me
</Button>
```

#### Via CSS Variables (For custom styles)
```tsx
<div style={{ backgroundColor: 'var(--accent)' }}>
  Custom element
</div>
```

## 📚 Token Reference

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | #CF1C0F | Primary brand color |
| `--background` | #000000 | Main background |
| `--surface-elevated` | #09090b | Headers, sidebar |
| `--surface-card` | #27272a | Cards, elevated elements |
| `--text-primary` | #fafafa | Primary text |
| `--text-muted` | #a1a1aa | Secondary text |
| `--border` | #27272a | All borders |

### Component Heights

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--button-height-sm` | 28px | h-7 | Small buttons |
| `--button-height-default` | 32px | h-8 | Default buttons |
| `--input-height` | 28px | h-7 | Text inputs |

### Icon Sizes

| Token | Value | Usage |
|-------|-------|-------|
| `--icon-xs` | 12px | Badges, inline |
| `--icon-sm` | 14px | Buttons, UI |
| `--icon-md` | 16px | Default icons |
| `--icon-lg` | 20px | Headers |
| `--icon-xl` | 24px | Empty states |

### Typography

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--text-xs` | 12px | text-xs | Body text, UI |
| `--text-sm` | 14px | text-sm | Headings |
| `--text-lg` | 18px | text-lg | Section titles |
| `--text-xl` | 20px | text-xl | Page titles |

### Motion

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Hovers, scales |
| `--duration-default` | 200ms | Colors, opacity |
| `--ease-default` | cubic-bezier(0.2, 0.8, 0.2, 1) | Snappy easing |

## 🎭 Interaction States

### Hover States
```tsx
// On zinc backgrounds
className="hover:bg-zinc-800"

// On accent buttons
className="hover:bg-accent/90"
```

### Active States
```tsx
// All pressable elements
className="active:scale-[0.97]"
```

### Focus States
```tsx
// All focusable elements
className="focus-visible:ring-2 focus-visible:ring-ring"
```

### Disabled States
```tsx
// All disabled elements
className="disabled:opacity-50"
```

## 🚀 Common Customization Tasks

### Task: Make UI More Spacious

1. Open `tokens.css`
2. Update component heights:
```css
--button-height-sm: 2rem;        /* Was 1.75rem */
--button-height-default: 2.5rem; /* Was 2rem */
--input-height: 2rem;            /* Was 1.75rem */
```

### Task: Make Text Larger

1. Update typography scale:
```css
--text-xs: 0.875rem;   /* Was 0.75rem (14px) */
--text-sm: 1rem;       /* Was 0.875rem (16px) */
```

### Task: Slower Animations

1. Update durations:
```css
--duration-fast: 250ms;      /* Was 150ms */
--duration-default: 350ms;   /* Was 200ms */
```

### Task: More Rounded Corners

1. Update border radius:
```css
--radius: 0.5rem;  /* Was 0.125rem (8px vs 2px) */
```

## ⚠️ Important Rules

### DO:
✅ Change values in `tokens.css`
✅ Use semantic token names
✅ Test changes in light and dark mode (if applicable)
✅ Keep contrast ratios accessible (4.5:1 minimum)

### DON'T:
❌ Hardcode colors in components
❌ Use inline styles instead of tokens
❌ Mix different design systems
❌ Skip accessibility testing

## 🔗 Related Files

- `.cursor/rules/design.mdc` - Design philosophy and principles
- `src/index.css` - Base styles and imports
- `src/ui/*.tsx` - UI primitive components
- `src/components/**/*.tsx` - Application components

## 📖 Further Reading

- [Tailwind CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [Design Tokens](https://css-tricks.com/what-are-design-tokens/)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
