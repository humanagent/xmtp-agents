# Quick Reference Guide

## 🚀 Common Design Changes

### 1. Change the Accent Color

**File:** `src/design/tokens.css`  
**Line:** ~30

```css
/* Find this line and change the color */
--accent: #CF1C0F;  /* Current: Orange-red */
```

**Example colors:**
- Blue: `#2E7BFF`
- Green: `#10B981`
- Purple: `#8B5CF6`
- Orange: `#F97316`
- Pink: `#EC4899`

### 2. Make UI Less Dense (Bigger Elements)

**File:** `src/design/tokens.css`  
**Lines:** ~95-100

```css
/* Current (Dense) */
--button-height-sm: 1.75rem;     /* 28px */
--button-height-default: 2rem;   /* 32px */
--input-height: 1.75rem;         /* 28px */

/* Change to (Spacious) */
--button-height-sm: 2rem;        /* 32px */
--button-height-default: 2.5rem; /* 40px */
--input-height: 2rem;            /* 32px */
```

### 3. Make Text Bigger

**File:** `src/design/tokens.css`  
**Lines:** ~132-136

```css
/* Current (Readable) */
--text-xs: 0.875rem;   /* 14px */
--text-sm: 1rem;       /* 16px */

/* Change to (Larger) */
--text-xs: 1rem;       /* 16px */
--text-sm: 1.125rem;   /* 18px */
```

### 4. Make Corners More Rounded

**File:** `src/design/tokens.css`  
**Lines:** ~88-90

```css
/* Current (Sharp) */
--radius: 0.125rem;  /* 2px */

/* Change to (Rounded) */
--radius: 0.5rem;    /* 8px */
```

### 5. Slower Animations

**File:** `src/design/tokens.css`  
**Lines:** ~125-128

```css
/* Current (Fast) */
--duration-fast: 150ms;
--duration-default: 200ms;

/* Change to (Slower) */
--duration-fast: 250ms;
--duration-default: 350ms;
```

### 6. Change Success/Error Colors

**File:** `src/design/tokens.css`  
**Lines:** ~35-45

```css
/* Find these lines */
--success: #4CAF50;      /* Green */
--warning: #F59E0B;      /* Amber */
--destructive: #F48771;  /* Red */
```

### 7. Change Background Colors

**File:** `src/design/tokens.css`  
**Lines:** ~18-25

```css
/* Current (Pure Black) */
--background: #000000;        /* Main bg */
--surface-elevated: #09090b;  /* Headers */
--surface-card: #27272a;      /* Cards */

/* Change to (Dark Gray) */
--background: #0a0a0a;        /* Softer black */
--surface-elevated: #1a1a1a;  /* Lighter panels */
--surface-card: #2a2a2a;      /* Lighter cards */
```

## 📖 Need More Help?

Read the full documentation: [`src/design/README.md`](./README.md)

## 🔍 Token Categories

### Colors
- **Lines 18-60** in `tokens.css`
- Includes: backgrounds, text, accent, semantic colors

### Spacing & Sizing
- **Lines 88-115** in `tokens.css`
- Includes: border radius, heights, icons, typography

### Motion & Animation
- **Lines 125-145** in `tokens.css`
- Includes: durations, easing, slide distances, scales

### Interaction States
- **Lines 152-160** in `tokens.css`
- Includes: hover colors, focus rings, disabled opacity

## 💡 Pro Tips

1. **Test your changes:** After editing `tokens.css`, refresh your browser to see changes
2. **Use semantic colors:** Reference tokens like `var(--accent)` instead of hex codes
3. **Keep contrast high:** Ensure text remains readable (4.5:1 ratio minimum)
4. **Be consistent:** Change values in `tokens.css`, not in individual components
5. **Document changes:** If you add new tokens, update the README

## 🎯 Token Naming Convention

```css
/* Category prefix + semantic name */
--surface-elevated    /* Surface category */
--text-primary        /* Text category */
--button-height-sm    /* Component category */
--duration-fast       /* Motion category */
```

## 🚨 Common Mistakes

❌ **DON'T** hardcode colors in components:
```tsx
<div style={{ backgroundColor: '#CF1C0F' }}>  // Bad
```

✅ **DO** use tokens or Tailwind classes:
```tsx
<div className="bg-accent">  // Good
<div style={{ backgroundColor: 'var(--accent)' }}>  // Also good
```

---

**Last Updated:** Jan 2026  
**Current Accent:** #CF1C0F (Orange-red)  
**Current Typography:** Readable (14px base, increased from 12px)  
**Current Spacing:** Dense (28px/32px buttons)

## 🔧 Recent Fixes (v0.1.16)

- **Fixed:** Removed circular CSS variable references that prevented accent color from showing
- **Fixed:** Increased base font size from 12px to 14px for better readability
- **Note:** All colors now reference direct hex values to avoid cascade issues
