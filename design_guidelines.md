# ClimateCare AI Design Guidelines

## Design Approach: Data-Focused Design System

**Selected Framework:** Material Design 3 (Material You) principles adapted for data visualization and monitoring dashboards

**Justification:** This climate health platform is data-intensive, requiring clear information hierarchy, robust component patterns for dashboards, maps, and charts, with emphasis on usability and accessibility for emergency monitoring scenarios.

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts CDN) - excellent for data-dense UIs and dashboards
- Monospace: JetBrains Mono - for numerical data, coordinates, timestamps

**Type Scale:**
- Hero/Dashboard Title: text-4xl font-bold (36px)
- Section Headers: text-2xl font-semibold (24px)
- Card Titles: text-lg font-semibold (18px)
- Body/Data Labels: text-base font-medium (16px)
- Metrics/Numbers: text-3xl font-bold (30px) for key stats
- Small Labels/Captions: text-sm (14px)
- Micro Data: text-xs (12px) for timestamps, footnotes

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 as primary spacing system
- Tight spacing: p-2, gap-2 (within components)
- Standard spacing: p-4, gap-4 (between related elements)
- Section spacing: p-6, gap-6 (card padding, form groups)
- Major sections: p-8, gap-8 (dashboard sections, panels)

**Grid Structure:**
- Main layout: Full-height split with 60/40 ratio (map area / control panel)
- Desktop: Map on left (60vw), controls/data panel on right (40vw)
- Tablet: Collapsible side panel overlay
- Mobile: Stack vertically, map above, controls below

**Container Constraints:**
- Side panel max-width: 600px with scrolling
- Card containers: p-6 standard, p-4 compact
- Form max-width: 480px centered in panels

## Component Library

### Navigation & Controls
**Top Header Bar:**
- Height: h-16 with px-6 horizontal padding
- Logo/title on left, user actions/settings on right
- Fixed position with subtle shadow for depth

**Map Controls:**
- Floating action buttons positioned absolute top-4 right-4
- Button group with gap-2 vertical stack
- Include: zoom controls, layer toggle, settings, help
- Size: w-10 h-10 per button

**Filter Panel:**
- Collapsible drawer from side panel
- Stacked filter groups with gap-4
- Each filter: label + control + clear option
- Multi-select chips for active filters

### Data Visualization

**Risk Map Layer:**
- Full-viewport map container (MapLibre GL)
- Neighborhood polygons with stroke-2 borders
- Interactive hover states (cursor-pointer)
- Legend positioned bottom-left, floating card with p-4

**Neighborhood Popup:**
- Card elevation with max-w-sm
- Header: neighborhood name + overall risk score (large, prominent)
- Body: Three-column grid showing HSI/CSI/AQRI with icons
- Footer: "View Details" link
- Padding: p-4 overall, gap-3 between sections

**Time Slider:**
- Fixed bottom positioning, full-width with px-8
- Height: h-20 with internal padding
- Date markers every 24h
- Current selection indicator with label above

### Dashboard Cards

**Summary Cards (Top of Side Panel):**
- Grid: grid-cols-1 gap-4
- Each card: rounded-lg p-6
- Structure: Icon + Label + Large Number + Trend indicator
- Height: auto-fit content

**Highest Risk List:**
- Scrollable container max-h-64
- List items with gap-2, px-4 py-3 each
- Three-column internal layout: Neighborhood | Risk Score | Quick View icon

**Chart Cards:**
- Aspect ratio 16:9 for time series
- Padding: p-6 with gap-4 for title and chart
- Chart.js container with responsive: true config
- Legend positioned top-right of chart area

### Forms & Input

**Community Portal Form:**
- Single column layout with gap-6
- Input groups: label (text-sm font-medium) above input with gap-2
- Input fields: h-12 px-4 with rounded borders
- Textarea: min-h-32 for message field
- Submit button: w-full h-12 prominent placement

**Search/Filter Inputs:**
- Compact height: h-10 with px-3
- Leading icon with mr-2 spacing
- Clear button on trailing edge (visible on input focus/content)

### Alerts & Notifications

**Alert Banner:**
- Fixed top positioning below header (if critical)
- Height: auto with py-4 px-6
- Dismissible with close button (absolute right-4)
- Icon + Message + Action button horizontal layout with gap-4

**Alert Panel (Side Panel Section):**
- Scrollable list with max-h-96
- Each alert: p-4 with gap-3 internal spacing
- Structure: Timestamp (small) + Alert type + Affected areas + Severity indicator

**Web Push Toast:**
- Fixed bottom-right positioning with m-4
- Max-width: 400px, p-4
- Auto-dismiss with progress indicator
- Stacked if multiple (gap-2)

### Modals & Overlays

**Risk Score Explanation Modal:**
- Centered overlay with max-w-2xl
- Header: text-2xl with close button
- Body: Three sections explaining each index with gap-6
- Visual: Simple diagram or formula display
- Padding: p-8 overall

**Settings Panel:**
- Slide-in from right, full-height
- Width: 400px with p-6
- Sections separated with gap-8
- Toggle switches for preferences (colorblind mode, units, etc.)

## Responsive Breakpoints

**Desktop (lg: 1024px+):**
- Side-by-side map + panel layout
- Full chart visibility
- Three-column summary cards possible

**Tablet (md: 768px):**
- Collapsible side panel with hamburger menu
- Map takes full width when panel collapsed
- Two-column summary cards

**Mobile (base < 768px):**
- Vertical stack: map (60vh) above controls
- Single column cards with gap-4
- Bottom sheet for filters/details
- Simplified navigation with bottom tab bar

## Interaction Patterns

**Map Interactions:**
- Click neighborhood: Show popup
- Hover: Highlight polygon with increased opacity
- Double-click: Zoom to neighborhood bounds
- Right-click: Open context menu (export data, set alert)

**Time Slider:**
- Drag to scrub through forecast
- Click date marker to jump
- Play button for animation through forecast days

**Loading States:**
- Skeleton screens for dashboard cards (h-24 shimmer animation)
- Spinner overlay for map data loading
- Progressive loading: show cached data while fetching updates

## Accessibility Features

**Color Independence:**
- Risk levels indicated by patterns + numerical values, not color alone
- Colorblind-safe palette toggle in settings
- High contrast mode option

**Keyboard Navigation:**
- Tab through all interactive elements
- Arrow keys for slider, map pan (with focus)
- Escape to close modals/popups
- Shortcuts documented in help panel

**Screen Readers:**
- ARIA labels on all icons and controls
- Live regions for alert announcements
- Descriptive alt text for data visualizations

## Performance Considerations

**Map Rendering:**
- Simplify polygons for small viewport sizes
- Lazy load detailed popup data
- Debounce hover interactions (300ms)

**Chart Rendering:**
- Limit initial render to 7 days
- Virtualize long lists (alerts, neighborhoods)
- Throttle time slider updates during drag

## Icons & Assets

**Icon Library:** Heroicons via CDN (outline style for interface, solid for indicators)

**Map Markers:** Custom SVG for weather stations (<!-- CUSTOM ICON: weather station pin -->)

**Images:** No hero images required. This is a functional dashboard. All visual content is data-driven (maps, charts, metrics).