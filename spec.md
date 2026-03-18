# CORE-OS

## Current State
Biometrics page has a small static pie chart for sleep architecture showing one night's data (Deep/REM/Light/Awake percentages). No multi-night navigation, no hypnogram, no trend view. Layout nav has a 'Sleep Analysis' item that currently routes to biometrics.

## Requested Changes (Diff)

### Add
- `SleepNight` data type with date, sleep/wake times, hypnogram segments (stage + start/end minutes), sleep score, HRV, and per-stage percentages
- 14 nights of realistic mock sleep data in mockData.ts
- New `SleepAnalysis` page (`src/frontend/src/pages/SleepAnalysis.tsx`) with:
  - **Night selector**: prev/next arrows + date display, swipeable/clickable list of stored nights
  - **Gantt hypnogram**: horizontal bar chart showing actual sleep stages (Awake/REM/Light/Deep) across clock hours of the night (x-axis = time, y-axis = stage, segments colored by stage)
  - **Per-night stats strip**: Sleep Score, Total Duration, Deep %, REM %, HRV, Efficiency
  - **Trends section** (hidden by default, expandable via 'Show Trends' button):
    - Multi-line chart over last 14 nights with toggleable metrics: Deep %, REM %, Light %, Total Duration, Sleep Score, HRV
    - Each metric has a toggle chip to show/hide its line

### Modify
- `App.tsx`: add `sleep` -> `SleepAnalysis` page mapping
- `Layout.tsx`: update sidebar Sleep Analysis item to navigate to `sleep` page (not biometrics)
- Header nav: add 'Sleep' tab link

### Remove
- Static sleep pie chart from Biometrics page (replace with a 'View Sleep Analysis' link card)

## Implementation Plan
1. Extend mockData.ts with SleepNight interface and 14-night dataset with realistic hypnogram segments
2. Build SleepAnalysis.tsx: night navigator, Gantt hypnogram using recharts, stats strip, collapsible trend section
3. Update App.tsx to include sleep page
4. Update Layout.tsx sidebar to route sleep item to 'sleep' page and add Sleep tab to header nav
5. Replace Biometrics sleep pie with a compact link card
