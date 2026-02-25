# Vulnerabilities Page Layout Revamp Design

**Date**: 2026-02-25
**Topic**: vulnerabilities-layout

## Overview
The goal of this project is to reorganize and drastically improve the layout of the `src/app/vulnerabilities/` section, encompassing both the list page and the detailed vulnerability client. The chosen approach is a "Vulnerability-Specific Layout" that prioritizes a highly functional, dashboard-style learning environment tailored to security auditing and exploit development, rather than strictly mirroring the sequential course layout.

## 1. List Page (`src/app/vulnerabilities/page.tsx`)
**Concept**: Dashboard Grid
Unlike standard coding problems, vulnerabilities are distinct case studies. The list will be transformed into a high-density, visually engaging grid.

### Features:
- **Responsive Grid**: 1 column (mobile) -> 2 columns (tablet) -> 3 columns (desktop) using Tailwind grids.
- **Card Design (`glow-card`)**: Utilize the app's established `glow-card` styling for consistency.
- **Impact Metrics**: prominently display the incident date and real-world financial losses (e.g., "$50M") directly on the card to emphasize the severity and real-world relevance of the vulnerability.
- **Categorization**: Group cards by vulnerability categories (e.g., Reentrancy, Arithmetic) with clear section headers.
- **Animations**: Implement `framer-motion` for smooth entrance animations (`fadeInUp`, `staggerContainer`) upon page load.
- **Badging**: Retain standard difficulty badges (Beginner, Intermediate, Advanced) using the established color scheme.

## 2. Detailed Page (`src/app/vulnerabilities/[id]/VulnerabilityClient.tsx`)
**Concept**: The Hacker Workspace (3-Column Layout)
The detailed view requires a non-stop, context-heavy workflow (Read Context -> Write Exploit -> Check Results). Tab switching breaks this flow.

### Features & Breakpoints:
- **Wide Desktop (`xl` breakpoint and above)**: Full 3-Column Layout.
  - **Left Panel (Context, fixed ~400px)**: Description, metadata, deployed contracts, hints, and references.
  - **Center Panel (The Lab, `flex-1`)**: The Solidity code editor.
  - **Right Panel (Action & Results, fixed ~400px)**: The `ContractInteraction` view stacked with the `ResultPanel`. Acts as the terminal.
- **Laptop & Tablet (`lg` to `xl`)**: 2-Column Responsive Fallback.
  - **Left Panel**: Description & Context.
  - **Right Panel (`flex-1`)**: Editor. Incorporates internal tabs for **[Code]** and **[Interact/Results]** to manage limited space cleanly.
- **Mobile (`< lg`)**: Maintains a bottom/top tab system (`Description` | `Editor` | `Interact`), restyled with Framer Motion for premium feel.

### Critical UI Improvement: The Action Toolbar
- **Problem**: Execution buttons ("Run Exploit", "Reset") are currently at the bottom of the editor, requiring scrolling on long exploits.
- **Solution**: Relocate these crucial actions to a sleek, fixed **Top Toolbar** directly above the center editor panel (similar to `ProblemClient`). This ensures execution controls are always visible and accessible.
