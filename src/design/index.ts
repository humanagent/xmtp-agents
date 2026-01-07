/**
 * Design System Exports
 * 
 * This file exports design system utilities and constants.
 * CSS tokens are imported via index.css and don't need to be exported here.
 * 
 * Use this file to export any TypeScript/JavaScript design utilities,
 * constants, or helper functions.
 */

/**
 * Design token values as TypeScript constants
 * Useful for programmatic access to design values
 */
export const designTokens = {
  colors: {
    accent: '#CF1C0F',
    background: '#000000',
    foreground: '#fafafa',
    surfaceElevated: '#09090b',
    surfaceCard: '#27272a',
    textPrimary: '#fafafa',
    textMuted: '#a1a1aa',
    border: '#27272a',
  },
  spacing: {
    buttonHeightSm: '1.75rem',
    buttonHeightDefault: '2rem',
    buttonHeightLg: '2.5rem',
    inputHeight: '1.75rem',
  },
  radius: {
    default: '0.125rem',
  },
  motion: {
    durationFast: 150,
    durationDefault: 200,
    easingDefault: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  icons: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
} as const;

/**
 * Helper function to get a CSS variable value
 * @param varName - CSS variable name (without --)
 * @returns The computed value of the CSS variable
 */
export function getCSSVariable(varName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${varName}`)
    .trim();
}

/**
 * Helper function to set a CSS variable value
 * @param varName - CSS variable name (without --)
 * @param value - New value for the variable
 */
export function setCSSVariable(varName: string, value: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(`--${varName}`, value);
}

/**
 * Type-safe design token keys
 */
export type DesignTokenKey = keyof typeof designTokens;
export type ColorKey = keyof typeof designTokens.colors;
export type SpacingKey = keyof typeof designTokens.spacing;
export type IconSizeKey = keyof typeof designTokens.icons;
