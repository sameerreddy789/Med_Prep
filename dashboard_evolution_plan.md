# Dashboard Evolution Plan

## Goal
Shift from "Input-focused" (Upload) to "Progress-focused" (Syllabus & Mastery).

## 1. Navigation Updates
Standardize across all pages:
- Dashboard
- Learn (formerly Study Studio)
- Clinical Sim (formerly Exam Arena)
- Profile

## 2. CSS Additions
- `.syllabus-hero`: Glass card for active curriculum.
- `.progress-bar-bg` & `.progress-bar-fill`: Custom progress bars.
- `.status-badge`: Green (Mastered), Grey (Locked).
- `.mastery-heatmap`: Grid layout for topic completion.
- `.heatmap-cell`: Individual topic squares (Green/Yellow/Grey).
- `.milestone-counter`: Stat bar for streak/XP.

## 3. Component Structure (Index.html)

### Hero Section (Left Col)
- **Active Curriculum** (User provided snippet)
- **Quick Actions** (Moved "Quick Upload" here as a smaller button)
- **Daily Mix** (Adaptive "Review Mistakes" logic)

### Sidebar (Right Col)
- **Mastery Heatmap** (Grid of squares)
- **Milestone Counter** (Stats)

## 4. Page Updates
- `index.html`: Major layout refactor.
- `studio.html`: Nav update.
- `simulation.html`: Nav update.
