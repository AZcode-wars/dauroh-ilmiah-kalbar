---
name: Amanah Serenity
colors:
  surface: '#fdf9e9'
  surface-dim: '#dedacb'
  surface-bright: '#fdf9e9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f4e4'
  surface-container: '#f2eede'
  surface-container-high: '#ece8d9'
  surface-container-highest: '#e6e3d3'
  on-surface: '#1c1c13'
  on-surface-variant: '#404944'
  inverse-surface: '#323126'
  inverse-on-surface: '#f5f1e1'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#521e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#762e00'
  on-tertiary-container: '#ff9762'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb693'
  on-tertiary-fixed: '#341000'
  on-tertiary-fixed-variant: '#7a3000'
  background: '#fdf9e9'
  on-background: '#1c1c13'
  surface-variant: '#e6e3d3'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  section-gap: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is built to evoke a sense of **Amanah (Trustworthiness)** and **Sakina (Tranquility)**. It targets a community-focused audience seeking spiritual growth through the "Dauroh Manis Raya" event. 

The style is a blend of **Modern Minimalism** and **Soft Spiritualism**. It prioritizes clarity and breathability, utilizing generous whitespace to reflect the peace associated with spiritual gatherings. The visual language avoids excessive ornamentation, instead relying on high-quality typography and a sophisticated, warm color palette to convey professionalism and a family-friendly atmosphere. 

Key visual drivers include:
- **Balance:** Symmetrical layouts that feel grounded and stable.
- **Warmth:** A shift away from clinical whites toward organic, creamy tones.
- **Refinement:** Subtle metallic accents and hairline strokes that suggest quality and care.

## Colors

The palette is rooted in traditional Islamic aesthetics but executed with modern saturation levels.

- **Primary (Emerald Green):** Used for primary actions, branding, and deep structural elements. It represents growth and life.
- **Secondary (Soft Gold):** Reserved for highlights, active states, and call-to-action buttons to add a touch of premium quality.
- **Background (Warm Cream):** Replaces pure white to reduce eye strain and provide a welcoming, "paper-like" feel.
- **Accent (Light Brown):** Used for secondary text, dividers, and grounding elements to maintain the organic, earthy feel.
- **Surface (White):** Used sparingly for card backgrounds to create a subtle lift against the cream page background.

## Typography

This design system uses a high-contrast typographic pair to balance tradition with utility.

**Playfair Display** is the editorial voice. It should be used for major headings and quotes. Its high-contrast strokes provide the "Modern Serif" aesthetic that feels both scholarly and elegant.

**Inter** provides the functional backbone. It is used for all body copy, navigation, and form elements. Its neutral, highly legible character ensures that logistical information about the event is easily consumed.

**Hierarchy Rules:**
- Use `display-lg` for the hero section headline.
- Use `label-md` for small eyebrow text above headings.
- Maintain a generous line-height (1.5x - 1.6x) for body text to ensure a comfortable reading experience.

## Layout & Spacing

The layout follows a **Fixed Grid** approach on desktop to maintain a contained, organized feeling. 

- **Desktop:** 12-column grid with a 1200px max-width. Large 80px gaps between sections to allow the "spiritual" atmosphere to breathe.
- **Tablet:** 8-column grid with 24px margins. 
- **Mobile:** 4-column grid with 16px margins. Headlines scale down significantly to avoid awkward line breaks.

Alignment should be primarily centered for hero sections and testimonials to create a sense of focus, while informational sections (schedules, bios) should be left-aligned for readability.

## Elevation & Depth

To maintain a "soft" feel, depth is created through **Tonal Layering** and **Ambient Shadows** rather than harsh borders.

- **Surface Level 0:** The Warm Cream background (#fffbeb).
- **Surface Level 1 (Cards):** Pure White (#ffffff) backgrounds with a very soft, diffused shadow (15% opacity Primary color tint, 20px blur, 4px Y-offset).
- **Interactive States:** On hover, cards should subtly lift (increase shadow blur) or show a thin 1px border in Soft Gold.

Avoid heavy black shadows; always tint shadows with the Primary Emerald Green to keep the palette cohesive and organic.

## Shapes

The shape language is defined by **pronounced curves**, specifically `rounded-2xl` (1.5rem / 24px) for main containers and cards. These soft corners are essential to the "family-friendly" and "comfortable" narrative.

- **Primary Containers:** 24px corner radius.
- **Buttons & Inputs:** 12px (rounded-lg) to maintain a consistent but distinct profile from the larger cards.
- **Icons:** Use thin-line icons (2px stroke) with rounded terminals to match the typography's softness.

## Components

### Buttons
- **Primary:** Emerald Green background with White text. High-padding (12px 28px).
- **Secondary:** Soft Gold background with Primary Green text for high-visibility CTAs (like "Register Now").
- **Ghost:** Transparent background with an Emerald Green 1px stroke.

### Cards
Cards are the primary content vessel. Use White backgrounds, 24px corner radius, and the defined ambient shadow. Padding within cards should be generous (min 32px).

### Input Fields
Inputs should use a subtle Light Brown border (20% opacity) and the Warm Cream background to blend into the UI. On focus, the border transitions to Soft Gold.

### Lists (Schedule)
The event schedule should use a vertical timeline component with Emerald Green dots and thin 1px Light Brown connecting lines.

### Chips/Tags
Use for categories (e.g., "Youth," "Family," "Session"). These should be pill-shaped with a light tint of the Primary color (5% opacity) and Primary color text.

### Additional Elements
- **Dividers:** Use a 1px Light Brown line with a small decorative geometric Islamic motif in the center to break up long sections.