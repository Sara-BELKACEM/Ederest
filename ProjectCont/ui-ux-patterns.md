# UI/UX Patterns — Course Learning Platform (SAP FI Course Page)

## 0. Design Tokens (Colors, Fonts, Sizes)

> Values below are estimated from the screenshot — close enough to rebuild the look, but fine-tune against real design files if pixel-perfect accuracy is needed.

### Color Palette

| Token | Hex (approx.) | Usage |
|---|---|---|
| `--color-primary` | `#4F46E5` | Logo mark, avatar background, active tab icon bg, progress bar fill, "75%" text, links |
| `--color-primary-light-bg` | `#EEF2FF` | Active nav item background, active sub-lesson highlight |
| `--color-accent-green-bg` | `#ECFDF5` | Current/expanded lesson card background |
| `--color-accent-green-text` | `#059669` | Green status dots on completed sub-lessons |
| `--color-accent-orange` | `#F59E0B` | Streak flame icon, floating action button background |
| `--color-callout-bg` | `#EAF1FB` | Definition/callout box background (light blue) |
| `--color-illustration-bg` | `#DCE7F9` | Diagram/illustration panel background |
| `--color-surface` | `#FFFFFF` | Cards, header, sidebar panel background |
| `--color-page-bg` | `#F5F6F8` | Overall app background behind cards |
| `--color-border` | `#E5E7EB` | Card borders, dividers, progress bar track |
| `--color-text-primary` | `#111827` | Headings, primary body text |
| `--color-text-secondary` | `#6B7280` | Metadata (time, XP counts), captions, breadcrumb |
| `--color-text-muted` | `#9CA3AF` | Disabled/locked lesson labels (e.g. "13min" greyed item) |
| `--color-success-dot` | `#22C55E` | Small completion status dots |

### Typography

| Token | Font | Size | Weight | Usage |
|---|---|---|---|---|
| `--font-family` | Inter / system-ui sans-serif | — | — | Entire UI |
| `--text-page-title` | 16px | 600 (semibold) | Top header ("Introduction à SAP FI") |
| `--text-card-title` | 20px | 700 (bold) | Lesson card headings ("Objectifs pédagogiques") |
| `--text-section-heading` | 24px | 700 (bold) | In-content callout heading ("Qu'est-ce qu'un ERP ?") |
| `--text-subsection-label` | 15px | 600 (semibold) | "Qu'est-ce qu'un ERP ?" subtask heading, sidebar module titles |
| `--text-body` | 15px | 400 (regular) | Paragraph content |
| `--text-body-bold-inline` | 15px | 700 (bold) | Inline emphasis (**ERP**, **objectif**) |
| `--text-nav-item` | 14px | 500 (medium) | Sidebar lesson/module names |
| `--text-metadata` | 13px | 400 (regular) | Time/XP chips, "15 subtasks completed" |
| `--text-stat-value` | 22px | 700 (bold) | "306" XP, "0 days" streak |
| `--text-stat-label` | 12px | 400 (regular) | "Total XP", "Current Streak" labels |
| `--text-badge` | 13px | 500 (medium) | "Subtask 1 of 2", "Bookmark" button label |

### Spacing & Sizing

| Token | Value | Usage |
|---|---|---|
| `--radius-card` | 12px | Cards (stat cards, content cards, lesson tree items) |
| `--radius-pill` | 999px | Bookmark button, XP/streak stat chips |
| `--radius-avatar` | 999px (circle) | User avatar, floating action button |
| `--sidebar-icon-rail-width` | 64px | Far-left persistent icon navigation |
| `--sidebar-panel-width` | ~240px | Course content tree panel |
| `--card-padding` | 20–24px | Internal padding of content/stat cards |
| `--gap-stack` | 12–16px | Vertical spacing between stacked cards |
| `--progress-bar-height` | 6px | Course progress bar |
| `--icon-size-nav` | 20px | Sidebar rail icons |
| `--icon-size-inline` | 14–16px | Clock/trophy metadata icons |
| `--fab-size` | 48px | Bottom-right floating action button |
| `--avatar-size` | 40px | Top-left user avatar |


## 1. Layout Patterns
- **Three-column layout**: fixed icon sidebar (far left) → collapsible course content panel → main lesson content area.
- **Persistent left icon rail**: home, learning/graduation cap, book, network/nodes, target, trophy, profile — quick access to app sections, always visible regardless of page.
- **Sticky top header** on the content panel showing the current lesson title ("Introduction à SAP FI") with a Back navigation link.

## 2. Gamification Patterns
- **XP system**: "Total XP" counter displayed as a stat card (306 XP).
- **Streak tracker**: "Current Streak" stat card with a flame icon (0 days), encouraging daily engagement.
- **Per-lesson XP reward**: each subtask/lesson shows an XP value (e.g., "20 XP") and estimated time ("6 min") before starting.

## 3. Progress Tracking Patterns
- **Course Progress bar**: percentage-based horizontal progress bar (75%) with a fraction label ("15 subtasks completed / 20 total subtasks").
- **Section-level progress**: each module/chapter shows its own completed/total ratio and time estimate (e.g., "2/3 tasks · 36min").
- **Status dot indicators**: small colored dots (green) next to completed sub-lessons in the tree, signaling completion state at a glance.
- **Nested checklist/tree navigation**: expandable modules → lessons → sub-lessons, with visual indentation to show hierarchy.

## 4. Content Navigation Patterns
- **Breadcrumb-style subtask pager**: "Subtask 1 of 2" with prev/next chevrons to move within a lesson.
- **Lesson-level prev/next arrows**: separate chevron controls near the top-right of the content card to move between lessons.
- **Active-state highlighting**: current lesson/section highlighted with a distinct background color (light blue/green) in the sidebar tree.

## 5. Content Presentation Patterns
- **Callout/definition box**: key concept ("Qu'est-ce qu'un ERP ?") presented in a shaded card with bold heading, separate from body text — used to highlight definitions.
- **Bulleted feature list** with checkbox-style bullets (Ventes, Achats, Comptabilité, etc.) to enumerate ERP modules.
- **Inline illustrative diagram**: supporting graphic/icon diagram placed below the text to visually reinforce the concept.
- **Bold keyword emphasis** within paragraphs (e.g., **ERP**, **objectif**) to aid scanning.

## 6. Engagement / Utility Patterns
- **Bookmarking**: a "Bookmark" button on each content card, plus a dedicated "Bookmarks (1)" quick-access entry in the sidebar.
- **Floating action button (FAB)**: bottom-right circular button (orange, document icon) — likely for notes, resources, or quick actions, staying accessible while scrolling.
- **User avatar with presence indicator**: initials avatar ("BY") with a small green online-status dot, top-left.

## 7. Information Hierarchy Patterns
- **Card-based grouping**: distinct white cards with subtle borders/shadows separate stats, progress, navigation, and content sections.
- **Metadata chips**: small icon+text pairs (clock for time, trophy for XP) attached to lesson headers for quick scanning without reading full text.

## 8. Micro-interaction Cues
- **Directional chevrons** (`<` `>`) reused consistently for both lesson-level and subtask-level navigation, creating a predictable interaction pattern.
- **Progressive disclosure**: only the active module's lessons are expanded in the tree; other modules stay collapsed, reducing visual clutter.
