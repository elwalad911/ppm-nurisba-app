---
name: Islamic Center Modernist
colors:
  surface: '#f8f9f9'
  surface-dim: '#f1f5f9'
  surface-bright: '#f8f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f4'
  surface-container: '#edeeee'
  surface-container-high: '#e7e8e8'
  surface-container-highest: '#e1e3e3'
  on-surface: '#191c1c'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#f0f1f1'
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
  tertiary: '#006948'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855d'
  on-tertiary-container: '#f5fff7'
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
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9f9'
  on-background: '#191c1c'
  surface-variant: '#e1e3e3'
  primary-strong: '#115e59'
  primary-soft: '#f0fdfa'
  warning: '#f59e0b'
  danger: '#ef4444'
  text-primary: '#1f2937'
  text-secondary: '#4b5563'
  border: '#e2e8f0'
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
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
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
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2rem
  section-gap-lg: 6rem
  section-gap-sm: 3rem
  touch-target: 44px
---

## Brand & Style

This design system embodies a **Modern Islamic Institutional** aesthetic, balancing traditional values of trust and community with a forward-thinking, professional digital presence. The style is rooted in **Corporate Minimalism**—utilizing generous white space, a structured layout, and a focus on clarity to ensure accessibility for donors and administrators alike.

The emotional core is **warmth and transparency**. We achieve this through soft "human" surfaces, sophisticated rounded corners, and a palette that evokes growth (Teal) and urgency (Orange CTA). The interface avoids excessive decoration, relying instead on high-quality typography and subtle depth to guide the user's journey from discovery to donation.

## Colors

The palette is strictly functional and anchored in **Teal-600** as the primary identity color, representing the institution's reliability. 

- **Primary & Tints:** Teal-600 is used for navigation, branding, and structural accents. Use `primary-soft` (#f0fdfa) for large section backgrounds to distinguish them from the main page surface.
- **CTA Strategy:** **Orange-500** is reserved exclusively for high-priority calls to action (e.g., "Donate Now"). This ensures the primary path is never lost in the institutional teal.
- **Success & Progress:** Emerald-600 is used for progress bars and successful transaction states to provide clear positive reinforcement.
- **Surfaces:** The background uses a crisp `#fbfcfc`, while `#f1f5f9` (Surface-Dim) is used for dashboard sidebars and subtle grouping containers.
- **Accessibility:** Ensure all text on primary or secondary backgrounds maintains a WCAG AA contrast ratio. White text should be used on Teal-600 and Orange-500.

## Typography

The typography system uses a pairing of **Geist** for high-impact headlines and **Inter** for sustained reading clarity.

- **Headings:** Utilize `tight` tracking and heavy weights (700-800) to create a sense of authority and modernity.
- **Body Text:** Inter at 16px is the minimum standard for body copy. For campaign descriptions, use `body-lg` to improve readability and editorial feel.
- **Numbers:** Financial transparency is key. Use `number-xl` with `tabular-nums` for Rupiah amounts in campaign cards and donor stats to ensure alignment and readability in lists.
- **Labels:** Use `label-md` for buttons and navigation items, capitalizing on Geist's sharp, technical character.

## Layout & Spacing

This design system uses a **Fluid Grid** model with strict breakpoints to transition from mobile-first simplicity to rich desktop dashboards.

- **Grid System:** 
  - **Mobile:** 1 column, 16px margins.
  - **Tablet:** 2 columns, 24px margins.
  - **Desktop:** 12-column grid with 24px gutters, max-width 1280px.
- **Rhythm:** Use a base 4px/8px scaling system. Sections on the public site should have generous vertical padding (`section-gap-lg`) to maintain a premium, airy feel.
- **Admin Layout:** The admin dashboard should reduce vertical padding to `section-gap-sm` to maximize information density for data tables and stat grids.
- **Navigation:** The top bar is fixed at 72px height, using a backdrop-blur for a "glass" effect that prevents the UI from feeling heavy.

## Elevation & Depth

We use depth to communicate hierarchy and interactivity, moving from flat structural elements to elevated focal points.

- **Tonal Layers:** The default state for the dashboard and background is flat (Level 0).
- **Ambient Shadows:** 
  - **shadow-sm:** Used for the top navigation bar and form inputs to provide a subtle "lift" from the page surface.
  - **shadow-md:** The standard for Campaign and Stat cards. This elevation level triggers a hover state transition (moving -4px on the Y-axis) to indicate interactivity.
  - **shadow-lg:** Reserved for focal elements such as the Donation Modal or "Featured Campaign" hero cards.
- **Glassmorphism:** Apply `bg-white/80 backdrop-blur-md` to the Top Navigation Bar to maintain context of the content scrolling beneath it without sacrificing legibility.

## Shapes

The shape language is defined by large, friendly radii that reinforce the "warm and human" brand personality.

- **Standard Elements:** Buttons and form inputs use `rounded-xl` (0.75rem - 1rem).
- **Containers:** Cards, modals, and featured sections use `rounded-2xl` (1rem - 1.5rem) to create a distinct, modern containerized look.
- **Status Indicators:** Badges and progress bar tracks use `rounded-full` for a distinct pill-shaped silhouette that separates them from structural blocks.

## Components

### Buttons
- **Primary (Teal):** Solid Teal-600 background, white text, `rounded-xl`.
- **CTA (Orange):** Solid Orange-500 background, white text, `rounded-xl`. Used only for "Donate" actions.
- **Ghost/Outline:** Transparent background, Teal-600 border and text. Used for secondary navigation or "Read More".

### Form Inputs
- **Inputs:** `rounded-xl`, border-gray-200, focus: ring-2 ring-teal-600/20, border-teal-600.
- **Labels:** `label-md` using Geist, positioned consistently above the input.

### Cards
- **Campaign Card:** `rounded-2xl`, white surface, `shadow-md`. Features an image at the top, a progress bar in the middle, and the donation CTA at the bottom.
- **Stat Card:** Simple `rounded-xl` container with Surface-Dim background, highlighting a `number-xl` figure.

### Progress Bars
- **Style:** `rounded-full` height 8px.
- **Colors:** Track is `teal-50`, fill is `emerald-600`. Must always be accompanied by numerical text (percentage and amount).

### Navigation
- **Top Bar:** Glassmorphism, 72px height, includes logo and primary menu.
- **Sidebar (Admin):** Surface-Dim background, vertical navigation using `label-md` text and minimalist icons.
- **Bottom Bar (Mobile):** Fixed at 64px, providing quick access to Home, Search, and Profile for the donor portal.

### Alerts
- **Success:** Emerald-50 background, Emerald-700 text/icon.
- **Info:** Primary-soft background, Primary-strong text/icon.
- **Action:** Clear 'X' to dismiss, respecting the 44px touch target.