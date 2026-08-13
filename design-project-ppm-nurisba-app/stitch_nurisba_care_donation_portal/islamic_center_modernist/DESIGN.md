---
name: Islamic Center Modernist
colors:
  surface: '#f5faf8'
  surface-dim: '#d6dbd9'
  surface-bright: '#f5faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f5f2'
  surface-container: '#eaefed'
  surface-container-high: '#e4e9e7'
  surface-container-highest: '#dee4e1'
  on-surface: '#171d1c'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2c3130'
  inverse-on-surface: '#edf2f0'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#924628'
  on-tertiary: '#ffffff'
  tertiary-container: '#b05e3d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#773215'
  background: '#f5faf8'
  on-background: '#171d1c'
  surface-variant: '#dee4e1'
  primary-dark: '#115e59'
  page-bg: '#fbfcfc'
  section-bg: '#f0fdfa'
  text-heading: '#1f2937'
  text-body: '#4b5563'
  success: '#059669'
  pending: '#f59e0b'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  number-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-mobile: 1rem
  margin-desktop: 2rem
  gutter: 1.5rem
  touch-target: 44px
---

# Design System: ppm-nurisba-app

## Brand Identity
**Name:** ppm-nurisba-app (Pondok Pesantren Nurul Islam)
**Style:** Modern, clean, trustworthy, elegant, Islamic Center aesthetic. Generous white space, floating card components, and sophisticated rounded corners.

## Color Palette
- **Primary:** `#0d9488` (teal-600) — Used for Navbar, Logo, Headings, and emphasis elements.
- **Primary Dark:** `#115e59` (teal-800) — Text on light teal backgrounds.
- **CTA/Accent:** `#f97316` (orange-500) — **Button background only**. High contrast text (white or dark) on top.
- **Page Background:** `#fbfcfc` (Near-white).
- **Section Background:** `#f0fdfa` (teal-50).
- **Body Text:** `#1f2937` (gray-800) for headings, `#4b5563` (gray-600) for descriptions.
- **Success/Progress:** `#059669` (emerald-600).
- **Pending:** `#f59e0b` (amber-500).

## Typography
- **Typeface:** Sans-serif (Inter/Geist style).
- **Headings:** Extrabold/Bold, tight tracking.
- **Body:** Minimum 16px, mobile-first sizing.
- **Numbers:** Large, bold, tabular numbers for Rupiah amounts.

## Layout & Grids
- **Mobile First:** Optimized for portrait, 1 column.
- **Tablet:** 2 columns.
- **Desktop:** 3 columns.
- **Tap Targets:** Minimum 44x44px.

## Component Patterns
- **Navbar:** Sticky top, glassmorphism (white 80% + backdrop blur), subtle shadow separator.
- **Cards:** `rounded-2xl`, `shadow-md`. Hover: translate-y [-4px], smooth transition. Active: scale(0.98).
- **Buttons:** `rounded-xl` or `rounded-full`.
- **Badges:** `rounded-full`, clear status text + icon.

## Visual Hierarchy (Shadows)
- `shadow-2xl`: Focal element only (e.g., Donation Form, Prayer Times).
- `shadow-md`: Grid cards.
- `shadow-sm`: Navbar, secondary UI elements.

## Accessibility
- WCAG AA contrast (4.5:1).
- Visible focus rings.
- Text + Icon for status.
