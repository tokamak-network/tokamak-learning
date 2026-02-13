# Frontend Visual Polish Design

## Goal
Improve visual quality across all pages while maintaining the current GitHub-style dark theme. Add animations/transitions with Framer Motion and improve typography.

## Tech
- **Framer Motion**: Page transitions, stagger animations, layout animations
- **CSS**: Typography tokens, design token additions, auxiliary animations

## 1. Global Improvements (globals.css)

### Typography
- Headings: `letter-spacing: -0.02em` for modern tight feel
- Body line-height: 1.7 -> 1.75
- Code blocks: subtle left-border accent
- Number badges: `font-variant-numeric: tabular-nums`

### Design Tokens
- Add `--color-surface-hover: #1c2129`
- Add `--shadow-card: 0 2px 8px rgba(0,0,0,0.3)`

### CSS Animations
- `@keyframes fadeInUp` for loading states
- Scrollbar hover width transition

## 2. Landing Page (src/app/page.tsx)

### Hero
- Stagger fade-in: badge -> title -> description -> buttons (0.1s intervals)
- Buttons: hover `scale(1.02)` + box-shadow expansion

### Stats
- Count-up animation on viewport entry (0 -> target number)
- Vertical dividers between stats

### Categories Preview
- Cards: stagger fade-in on viewport intersection
- Card hover: `translateY(-2px)` + subtle shadow

### Footer
- Link hover underline animation

## 3. Curriculum Page (src/app/language/solidity/page.tsx)

### Header
- Solidity icon gradient: gray -> purple/blue
- Fade-in on entry

### Problem Cards
- Stagger animation per category (viewport entry)
- Number badge: hover `scale(1.1)`
- Difficulty badges: subtle glow

### Spacing
- Category gap: 8 -> 10
- Tight letter-spacing on section titles

## 4. Problem Page (src/app/problems/[id]/ProblemClient.tsx)

### Tabs
- Sliding indicator with Framer Motion `layoutId`
- Content fade + slide on tab switch

### Description Panel
- Hint/solution toggle: height collapse/expand animation
- Breadcrumb hover: accent + underline

### Results Panel
- Test results: stagger appearance (one by one)
- Pass: checkmark bounce animation
- "Next problem" button: scale-in + pulse on success
- Compile spinner: dot animation on text

### Editor Toolbar
- Button hover: subtle scale + background transition
- Test button: loading state with progress style

## Files to Modify
1. `package.json` - add framer-motion
2. `src/app/globals.css` - typography, tokens, keyframes
3. `src/app/page.tsx` - landing page animations
4. `src/app/language/solidity/page.tsx` - curriculum animations
5. `src/app/problems/[id]/ProblemClient.tsx` - problem page animations
6. `src/components/Header.tsx` - minor polish
