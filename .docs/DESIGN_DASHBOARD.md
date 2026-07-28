---
name: Serenity Operations
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#3f4944'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7973'
  outline-variant: '#bec9c2'
  surface-tint: '#1b6b51'
  primary: '#004532'
  on-primary: '#ffffff'
  primary-container: '#065f46'
  on-primary-container: '#8bd6b7'
  inverse-primary: '#8bd6b6'
  secondary: '#5e5e5c'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdc'
  on-secondary-container: '#636360'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca730'
  on-tertiary-container: '#4f3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a6f2d1'
  primary-fixed-dim: '#8bd6b6'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#e4e2de'
  secondary-fixed-dim: '#c8c6c3'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 260px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system focuses on "Operational Serenity"—balancing the premium, heritage-driven aesthetic of the parent brand with the high-density requirements of an administrative dashboard. The target audience is operational staff and management who require clarity, speed, and precision.

The design style is **Corporate / Modern** with a **Minimalist** lean. It utilizes generous whitespace within data-heavy views to reduce cognitive load while maintaining the warmth of the brand through a specific "Warm Cream" surface strategy. The tone is authoritative, trustworthy, and calm.

## Colors
This design system utilizes a palette rooted in natural, prestigious tones to convey reliability.

*   **Primary (Emerald Green):** Used for primary actions, active navigation states, and "Success" indicators. It represents growth and stability.
*   **Secondary (Warm Cream):** Applied as the main application background to soften the interface compared to pure white, reducing eye strain during long shifts.
*   **Tertiary (Soft Gold):** Used sparingly for high-level highlights, premium membership indicators, or featured data points.
*   **Neutral (Slate):** The primary color for text, borders, and "Neutral/Inactive" status badges. It provides a grounded, professional contrast.
*   **Surface:** Card backgrounds should remain pure white (#FFFFFF) to pop against the Warm Cream (#FDFBF7) page background.

## Typography
The typographic hierarchy distinguishes between branding and utility. 

*   **Page Headers:** Use *Playfair Display* for main page titles and high-level section headers to maintain the brand’s prestigious feel.
*   **UI & Data:** Use *Inter* for all navigation, buttons, table data, and form labels. It is chosen for its exceptional legibility at small sizes and its neutral, systematic character.
*   **Numerical Data:** Use the "data-mono" style for tabular figures to ensure alignment and vertical scanning efficiency.

## Layout & Spacing
The layout follows a **Fixed Grid** model for the sidebar and a **Fluid Grid** for the main content area.

*   **Sidebar:** A structured, vertical 260px column anchored to the left. 
*   **Main Canvas:** Uses a 12-column grid with 24px gutters. Content should be encapsulated in "Summary Cards" or "Data Tables."
*   **Mobile Adaption:** On mobile, the sidebar collapses into a hamburger menu. The 12-column grid reflows to a single column, and horizontal margins reduce to 16px.
*   **Density:** Spacing is compact (8px/16px) to maximize the "above the fold" information density.

## Elevation & Depth
The design system uses **Tonal Layers** combined with **Ambient Shadows** to create a structured hierarchy.

*   **Level 0 (Background):** The Warm Cream (#FDFBF7) base layer.
*   **Level 1 (Cards/Containers):** Pure White (#FFFFFF) surfaces with a very soft, diffused shadow (Offset: 0, 2px; Blur: 8px; Opacity: 4% Black) to distinguish them from the background.
*   **Level 2 (Dropdowns/Modals):** Higher contrast shadows (Offset: 0, 8px; Blur: 24px; Opacity: 8% Black) to indicate temporary overlay.
*   **Outlines:** Use a 1px border (#E2E8F0) for tables and input fields instead of shadows to maintain a clean, professional look.

## Shapes
The shape language is **Soft** and restrained. 

*   **Cards & Modals:** Use a 0.5rem (8px) radius to feel modern but structured.
*   **Buttons & Inputs:** Use a 0.25rem (4px) radius for a more precise, "utility-first" appearance.
*   **Status Badges:** Use a full pill-shape (9999px) to clearly differentiate status indicators from interactive buttons.

## Components
*   **Buttons:** Primary buttons are Solid Emerald Green with White text. Secondary buttons are Outline Slate.
*   **Status Badges:** 
    *   *Success:* Soft Emerald Green background with Dark Emerald text.
    *   *Neutral:* Soft Slate background with Dark Slate text.
*   **Data Tables:** Clean rows with 1px Slate-200 bottom borders. Header cells use `label-md` in Slate-500. Row hover state uses a 2% Emerald Green tint.
*   **Summary Cards:** Compact containers featuring a `label-sm` title, a `headline-md` value, and a small icon or trend indicator.
*   **Input Fields:** Minimalist design with a 1px Slate-300 border. Focus state shifts border to Emerald Green with a subtle glow.
*   **Sidebar:** Dark theme variant using a deep version of the Primary color or a high-contrast Slate, with Soft Gold used solely for the "Active" indicator marker.