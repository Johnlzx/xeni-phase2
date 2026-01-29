---
name: UI UX Pro Max
description: AI-powered design intelligence for building professional UI/UX. Generates complete design systems with style, color, typography, and layout recommendations across multiple platforms and frameworks.
---

# UI UX Pro Max

An AI-powered design intelligence skill that provides searchable databases of UI styles, color palettes, font pairings, chart types, and UX guidelines. It generates complete, tailored design systems based on project requirements.

## Prerequisites

Python 3.x (no external dependencies required).

## How to Use This Skill

When user requests UI/UX work (design, build, create, implement, review, fix, improve), follow this workflow:

### Step 1: Analyze User Requirements

Extract key information from user request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, education, etc.
- **Stack**: React, Vue, Next.js, or default to `html-tailwind`

### Step 2: Generate Design System (REQUIRED)

**Always start with `--design-system`** to get comprehensive recommendations with reasoning:

```bash
python3 /Users/zhongxin/Documents/CosX/Xeni/Prototype/xeni-phase2/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

This command:
1. Searches 5 domains in parallel (product, style, color, landing, typography)
2. Applies reasoning rules from `ui-reasoning.csv` to select best matches
3. Returns complete design system: pattern, style, colors, typography, effects
4. Includes anti-patterns to avoid

**Example:**
```bash
python3 /Users/zhongxin/Documents/CosX/Xeni/Prototype/xeni-phase2/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

### Step 2b: Persist Design System (Master + Overrides Pattern)

To save the design system for hierarchical retrieval across sessions, add `--persist`:

```bash
python3 /Users/zhongxin/Documents/CosX/Xeni/Prototype/xeni-phase2/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

This creates:
- `design-system/MASTER.md` — Global Source of Truth with all design rules
- `design-system/pages/` — Folder for page-specific overrides

**With page-specific override:**
```bash
python3 /Users/zhongxin/Documents/CosX/Xeni/Prototype/xeni-phase2/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

### Step 3: Supplement with Detailed Searches (as needed)

After getting the design system, use domain searches to get additional details:

```bash
python3 /Users/zhongxin/Documents/CosX/Xeni/Prototype/xeni-phase2/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

| Need | Domain | Example |
|------|--------|---------|
| More style options | `style` | `--domain style "glassmorphism dark"` |
| Chart recommendations | `chart` | `--domain chart "real-time dashboard"` |
| UX best practices | `ux` | `--domain ux "animation accessibility"` |
| Alternative fonts | `typography` | `--domain typography "elegant luxury"` |
| Landing structure | `landing` | `--domain landing "hero social-proof"` |

### Step 4: Stack Guidelines (Default: html-tailwind)

Get implementation-specific best practices:

```bash
python3 /Users/zhongxin/Documents/CosX/Xeni/Prototype/xeni-phase2/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

Available stacks: `html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`, `astro`, `nuxtjs`, `nuxt-ui`

## Search Reference

### Available Domains

| Domain | Use For | Example Keywords |
|--------|---------|------------------|
| `product` | Product type recommendations | SaaS, e-commerce, portfolio, healthcare, beauty |
| `style` | UI styles, colors, effects | glassmorphism, minimalism, dark mode, brutalism |
| `typography` | Font pairings, Google Fonts | elegant, playful, professional, modern |
| `color` | Color palettes by product type | saas, ecommerce, healthcare, beauty, fintech |
| `landing` | Page structure, CTA strategies | hero, testimonial, pricing, social-proof |
| `chart` | Chart types, library recommendations | trend, comparison, timeline, funnel, pie |
| `ux` | Best practices, anti-patterns | animation, accessibility, z-index, loading |
| `react` | React/Next.js performance | waterfall, bundle, suspense, memo, rerender |
| `web` | Web interface guidelines | aria, focus, keyboard, semantic |

## Output Formats

```bash
# ASCII box (default) - best for terminal display
python3 /Users/zhongxin/Documents/CosX/Xeni/Prototype/xeni-phase2/skills/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system

# Markdown - best for documentation
python3 /Users/zhongxin/Documents/CosX/Xeni/Prototype/xeni-phase2/skills/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system -f markdown
```

## Common Rules for Professional UI

### Icons & Visual Elements
- Use SVG icons (Heroicons, Lucide, Simple Icons) — never emojis as UI icons
- Use consistent icon sizing with fixed viewBox (24x24)
- Verify brand logos from Simple Icons

### Interaction
- Add `cursor-pointer` to all clickable elements
- Hover states with smooth transitions (150-300ms)
- No layout shift on hover (avoid scale transforms that shift layout)

### Light/Dark Mode Contrast
- Light mode: `bg-white/80` or higher opacity for glass cards
- Text contrast minimum 4.5:1 ratio
- Muted text: slate-600 minimum in light mode

### Layout & Spacing
- Floating navbar with proper edge spacing
- Account for fixed navbar height in content padding
- Consistent max-width across sections
- Responsive at 375px, 768px, 1024px, 1440px

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use SVG instead)
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback with smooth transitions
- [ ] Light mode text has sufficient contrast (4.5:1 minimum)
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

## Tips for Better Results

1. **Be specific with keywords** - "healthcare SaaS dashboard" > "app"
2. **Search multiple times** - Different keywords reveal different insights
3. **Always check UX** - Search "animation", "z-index", "accessibility" for common issues
4. **Use stack flag** - Get implementation-specific best practices
