---
name: Kinetic Zero
colors:
  surface: '#0d0d0d'
  surface-dim: '#0c0c0c'
  surface-bright: '#262626'
  surface-container-lowest: '#050505'
  surface-container-low: '#121212'
  surface-container: '#171717'
  surface-container-high: '#1a1a1a'
  surface-container-highest: '#262626'
  on-surface: '#dfe2ef'
  on-surface-variant: '#d3c5ac'
  inverse-surface: '#dfe2ef'
  inverse-on-surface: '#2c303a'
  outline: '#9c8f79'
  outline-variant: '#4f4633'
  surface-tint: '#f9bd22'
  primary: '#ffe1a7'
  on-primary: '#402d00'
  primary-container: '#fbbf24'
  on-primary-container: '#6c4f00'
  inverse-primary: '#795900'
  secondary: '#ffb2b7'
  on-secondary: '#67001b'
  secondary-container: '#b50036'
  on-secondary-container: '#ffc2c4'
  tertiary: '#cde8ff'
  on-tertiary: '#00344d'
  tertiary-container: '#8ed0ff'
  on-tertiary-container: '#005981'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9f'
  primary-fixed-dim: '#f9bd22'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#ffdadb'
  secondary-fixed-dim: '#ffb2b7'
  on-secondary-fixed: '#40000d'
  on-secondary-fixed-variant: '#92002a'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#0d0d0d'
  on-background: '#dfe2ef'
  surface-variant: '#262626'
  canvas: '#050505'
  wireframe-slate: '#262626'
  text-muted: '#64748B'
  choke-glow: '#F43F5E'
  operational-yellow: '#FBBF24'
typography:
  display-hero:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '300'
    lineHeight: '1.3'
  metric-xl:
    fontFamily: JetBrains Mono
    fontSize: 84px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: -0.05em
  metric-md:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
  body-base:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  display-hero-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '300'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-margin: 2rem
  gutter: 1.5rem
  cell-padding: 1rem
  instrument-gap: 0.5rem
---

## Brand & Style
The design system is a high-precision, technical interface designed for rapid urban intervention. It adopts a **Minimalist / Aerospace** aesthetic characterized by deep matte backgrounds, skeletal wireframe geometry, and extreme typographic clarity. The brand personality is authoritative, systematic, and urgent, evoking the feeling of a mission-critical flight deck.

The visual language focuses on "the physics of traffic," using light and line weight to guide the eye toward systemic failures. It leverages dark-mode ergonomics to reduce cognitive load while highlighting critical anomalies through vivid, glowing atmospheric effects. The target audience—urban planners and rapid response teams—requires an interface that feels like a calibrated instrument rather than a typical dashboard.

## Colors
This design system utilizes a "Void and Vector" color strategy. The primary foundation is a deep matte black (`#090D16`), which serves as a vacuum, allowing chromatic data to pop with high intensity.

- **Primary (Operational Yellow):** Used for actionable highlights, warnings, and active system states. It is the color of intervention.
- **Secondary (The Choke Color):** A vivid rose/red glow reserved exclusively for congestion severity, infrastructure displacement, and critical alerts. It should utilize a Gaussian blur effect to simulate a heat-map "bleed."
- **Tertiary (Systemic Blue):** A technical neon blue used for "Safe Zones," pre-rush hour scheduler highlights, and low-priority temporal masks.
- **Neutrals:** Subtle slate grays are used for structural grid lines and inactive metadata to keep the interface skeletal and light.

## Typography
The typography system follows a strict functional split: **Hanken Grotesk** for semantic communication and **JetBrains Mono** for technical telemetry.

Headings should remain light-weight (`300`) to maintain a sophisticated, aerospace feel even at large scales. Metrics are the priority; they use a monospaced font to ensure that digits do not jump or shift during real-time data updates. Labels and captions are set in uppercase monospaced type with generous letter spacing to mimic cockpit instrumentation labeling. High-contrast white is the default for all primary text to ensure legibility against the deep black canvas.

## Layout & Spacing
The layout uses a **Fixed Grid** system centered on a 12-column span for desktop, moving to a fluid single-column stack for mobile.

The philosophy is "Skeletal Density." While margins and gutters remain generous (32px) to prevent visual clutter, the internal spacing within component clusters is tight and technical (8px), creating a sense of grouped instrumentation.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layers** and **Atmospheric Glow** rather than traditional shadows.

The base layer is the matte black canvas. Secondary surfaces (cards or map containers) use a subtle `1px` border of `wireframe-slate` with no background fill, creating a "hollow" look. High-priority elements, like the "Choke" zones, use a layering of translucent rose gradients and Gaussian blurs (`blur: 40px`) to appear as if they are projected onto a screen or floating in a volumetric space.

Buttons and active pills utilize a "Light-as-Elevation" approach: an active state is not "higher," it is simply illuminated with a primary yellow stroke or a small glowing dot marker.

## Shapes
The shape language is "Soft-Industrial." All containers, buttons, and input fields use a consistent **Soft (0.25rem)** corner radius. This prevents the interface from feeling dangerously sharp while maintaining the structured, technical discipline of a professional tool.

Pill shapes are used sparingly and only for global navigation selectors or status badges, differentiating "system-wide" controls from "data-specific" containers.
