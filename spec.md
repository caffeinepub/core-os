# CORE-OS

## Current State
- InflammationGauge renders with needle tip at `r - sw * 0.1` which lands on/overlaps the arc track visually. No hover tooltip exists explaining what the score is, how it's calculated, or what the zones mean.
- Navigation is 8 flat linear tab buttons with zero grouping, no icons in the tab bar, and no visual hierarchy.
- Badges on Achievements page show no progress toward locked badges, no hover detail, minimal interactivity. Gamification feels passive.

## Requested Changes (Diff)

### Add
- Rich hover/focus tooltip on InflammationGauge: explains what Systemic Inflammation Score is (composite of hs-CRP, IL-6, HRV variability, sleep quality), how each zone maps clinically (Optimal 0-3: anti-aging zone; Moderate 3-6: monitor and intervene; Alert 6-10: active risk, action required), shows current score, category, and 30-day delta.
- Navigation grouped by category with visual dividers: HEALTH (Dashboard, Biometrics, Sleep, Labs), INTELLIGENCE (AI Advisor, Protocols), COMMUNITY (Achievements, Squads). Each tab in header gets an icon. Group labels visible on desktop, collapsed on mobile.
- Locked badge progress bars showing partial completion (e.g., HRV Champion: 14/30 days). Each badge card expands or shows a tooltip on hover with: full description, what actions earn it, and how close the user is.
- XP source breakdown section on Achievements page: table/list showing where XP was earned (Protocol streaks, Lab uploads, Biomarker improvements, Sleep targets hit).

### Modify
- InflammationGauge needle tip: shorten to `r - sw * 0.72` so it stops clearly inside the arc track inner edge with visible clearance.
- Badge cards: always show description text (not just on hover). Show progress indicator for locked badges. Unlocked badges show earned date. Add subtle glow/pulse animation to newly unlocked badges.
- Header nav tabs: add icon to each tab, group with a thin visual separator between groups. On narrower screens show icons-only with tooltip.
- Sidebar nav: add group section labels (HEALTH, INTELLIGENCE, COMMUNITY) above grouped nav items.

### Remove
- "NEW" badge tag on Achievements/Squads sidebar items (replace with meaningful indicators like streak count or challenge count).

## Implementation Plan
1. Fix InflammationGauge needle clearance (shorten tip radius)
2. Add tooltip component on InflammationGauge with score explanation panel
3. Redesign Layout header tabs: grouped with icons and visual separators
4. Update sidebar: add section group labels
5. Update Achievements badges: add progress on locked, hover details, descriptions always visible
6. Add XP source breakdown to Achievements page
7. Validate and build
