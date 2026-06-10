# ZARATI | زرعتي — UI Component System
**Version:** 1.0

---

## 1. BUTTONS

### Variants

| Variant | Usage | States |
|---------|-------|--------|
| **Primary** | Main CTAs — "Connect Now", "View Report" | Default, Hover, Active, Disabled, Loading |
| **Secondary** | Supporting actions | Default, Hover, Active, Disabled |
| **Ghost** | Tertiary actions, table row actions | Default, Hover, Active |
| **Danger** | Destructive — delete, revoke | Default, Hover, Active |
| **Link** | Inline text actions | Default, Hover, Visited |

### Size Scale
| Size | Height | Padding H | Font Size | Use |
|------|--------|-----------|-----------|-----|
| `sm` | 32px | 12px | 13px/500 | Table actions, compact UI |
| `md` | 40px | 16px | 14px/500 | Standard UI actions |
| `lg` | 48px | 20px | 16px/600 | Hero CTAs, primary page actions |
| `xl` | 56px | 24px | 18px/600 | Landing pages only |

### CSS Specification — Primary Button
```css
.btn-primary {
  background: var(--za-green-400);
  color: #FFFFFF;
  font-family: var(--za-font-english);
  font-weight: var(--za-weight-semibold);
  border-radius: var(--za-radius-md);
  border: none;
  cursor: pointer;
  transition: background var(--za-duration-normal) var(--za-ease-standard);
  display: inline-flex;
  align-items: center;
  gap: var(--za-space-2);
}
.btn-primary:hover  { background: var(--za-green-500); }
.btn-primary:active { background: var(--za-green-600); transform: scale(0.99); }
.btn-primary:disabled {
  background: var(--za-neutral-300);
  color: var(--za-neutral-500);
  cursor: not-allowed;
}
.btn-primary:focus-visible { box-shadow: var(--za-shadow-focus); }
```

### CSS Specification — Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--za-navy-900);
  border: 1.5px solid var(--za-navy-900);
  border-radius: var(--za-radius-md);
  font-weight: var(--za-weight-semibold);
  transition: all var(--za-duration-normal) var(--za-ease-standard);
}
.btn-secondary:hover {
  background: var(--za-navy-900);
  color: #FFFFFF;
}
```

---

## 2. FORM ELEMENTS

### Text Input
```css
.za-input {
  height: 44px;
  padding: 0 var(--za-space-4);
  font-family: var(--za-font-english);
  font-size: var(--za-text-body-md);
  color: var(--za-text-primary);
  background: var(--za-neutral-0);
  border: 1.5px solid var(--za-border-strong);
  border-radius: var(--za-radius-md);
  transition: border-color var(--za-duration-fast) var(--za-ease-standard);
  width: 100%;
}
.za-input::placeholder { color: var(--za-neutral-500); }
.za-input:hover  { border-color: var(--za-neutral-500); }
.za-input:focus  {
  outline: none;
  border-color: var(--za-green-400);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}
.za-input.error  { border-color: var(--za-color-error); }
```

### Arabic Input
```css
.za-input[dir="rtl"],
.za-input.ar {
  font-family: var(--za-font-arabic);
  text-align: right;
  direction: rtl;
}
```

### Form Label
```css
.za-label {
  display: block;
  font-size: var(--za-text-label);
  font-weight: var(--za-weight-medium);
  color: var(--za-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--za-space-2);
}
```

### Select Dropdown
- Height: 44px, same border/radius as input
- Custom chevron icon using SVG (brand navy color)
- `appearance: none` override for cross-browser consistency

### Checkbox / Radio
- Size: 18×18px
- Border: 2px solid `ZA-NEUTRAL-400`
- Checked: Fill `ZA-GREEN-400`, white checkmark
- Focus: `shadow-focus` ring

---

## 3. CARDS

### Data Card (KPI)
```
┌──────────────────────────────────┐
│ [Icon]  Card Title               │
│                                  │
│  84,000                          │ ← type-h1, ZA-NEUTRAL-900
│  Active Farmers                  │ ← type-body-sm, ZA-NEUTRAL-600
│                                  │
│  ↑ 12.4%  vs. last month        │ ← type-caption, ZA-SUCCESS
└──────────────────────────────────┘
```
- Background: `ZA-NEUTRAL-0`
- Border: 1px `ZA-NEUTRAL-200`
- Padding: `space-6` (24px)
- Radius: `radius-lg` (12px)
- Shadow: `shadow-sm`
- Hover: `shadow-md`

### Feature Card
```
┌──────────────────────────────────┐
│  [Full-width image or gradient]  │
│  ──────────────────────────────  │
│  Feature Title                   │ ← type-h3
│  Supporting description text     │ ← type-body-sm
│                                  │
│  [Learn More →]                  │
└──────────────────────────────────┘
```
- Padding: `space-6`
- Radius: `radius-xl`
- Shadow: `shadow-md`

### Alert Card
| Type | Left border | Background |
|------|-------------|------------|
| Success | 4px ZA-SUCCESS | ZA-SUCCESS-LIGHT |
| Warning | 4px ZA-WARNING | ZA-WARNING-LIGHT |
| Error | 4px ZA-ERROR | ZA-ERROR-LIGHT |
| Info | 4px ZA-INFO | ZA-INFO-LIGHT |

---

## 4. DATA TABLES

### Structure
```
┌────────────────────────────────────────────────────────────┐
│  Table Title          [Search ___]  [Filter ▼]  [Export]   │
├──────────┬────────────┬────────────┬────────────┬──────────┤
│ Farmer   │ Region     │ Crop Type  │ Yield (MT) │ Status   │
├──────────┼────────────┼────────────┼────────────┼──────────┤
│ Ahmed M. │ Khartoum N │ Sorghum    │ 2.4        │ ● Active │
│ Fatima A.│ Gezira     │ Cotton     │ 1.8        │ ● Active │
│ ...      │            │            │            │          │
└──────────┴────────────┴────────────┴────────────┴──────────┘
│  Showing 1–20 of 4,820              [← 1 2 3 ... →]        │
└────────────────────────────────────────────────────────────┘
```

### Table CSS Rules
- Header: `ZA-NEUTRAL-100` background, `type-h6` + `weight-semibold`, `ZA-NEUTRAL-700`
- Row height: 52px
- Row hover: `ZA-NEUTRAL-50` background
- Row border: 1px `ZA-NEUTRAL-200` bottom
- Status badges: Pill, `radius-full`, 6px×6px dot + label
- Sortable columns: Chevron icon appears on hover

---

## 5. CHARTS & DATA VISUALIZATION

### Chart Color Sequence (for multi-series)
```
Series 1: #4CAF50  (ZA-GREEN-400 — Leaf)
Series 2: #0F2D5E  (ZA-NAVY-900 — Navy)
Series 3: #00897B  (ZA-TEAL-500 — Data Teal)
Series 4: #F4A800  (ZA-GOLD-500 — Gold)
Series 5: #1565C0  (ZA-BLUE-500 — River Blue)
Series 6: #C8A96E  (ZA-SAND-400 — Sand)
```

### Chart Types & Usage
| Chart | Usage | Library |
|-------|-------|---------|
| Line chart | Yield trends, price history, platform growth | Recharts / Chart.js |
| Bar chart | Regional comparison, crop breakdown, intake volumes | Recharts |
| Area chart | Cumulative metrics, coverage growth | Recharts |
| Donut chart | Market share, crop distribution | Recharts |
| Choropleth map | Regional data, state-level metrics | MapboxGL / Leaflet |
| Scatter plot | Yield vs. rainfall correlation | Recharts |
| Heatmap | Seasonal crop calendar, field activity density | Custom |

### Chart Rules
- Always include axis labels with units
- Grid lines: `ZA-NEUTRAL-200`, 1px dashed
- Tooltip: `ZA-NAVY-900` background, white text, 8px radius
- Legend: Bottom, horizontal, `type-caption`
- Empty state: Illustrated placeholder, never blank axes
- Arabic charts: Mirror chart direction for RTL layouts

---

## 6. MAP COMPONENTS

ZARATI's map layer is central to the product identity.

### Map Style
- **Base map:** Custom Mapbox style — muted satellite for field views, clean vector for national overview
- **Color scheme:** Desaturated base, brand colors for data overlays
- **Crop zones:** Filled polygons with 40% opacity ZA-GREEN family
- **Farmer markers:** Custom pin using Z-mark icon
- **Data heat:** ZA-TEAL → ZA-GREEN-400 gradient scale

### Map Controls
- Zoom: Bottom-right cluster
- Layer toggle: Top-right panel card
- Legend: Bottom-left floating card, `shadow-md`
- Full-screen toggle: Top-right

---

## 7. NAVIGATION

### Top Navigation Bar (Web)
```
┌──────────────────────────────────────────────────────────────────┐
│  [ZARATI Logo]   Platform ▼  Analytics ▼  Markets  Reports     │
│                                            [AR|EN]  [🔔]  [●]  │
└──────────────────────────────────────────────────────────────────┘
```
- Height: 64px
- Background: `ZA-NEUTRAL-0` with 1px `ZA-NEUTRAL-200` bottom border
- Logo: compact lockup (mark + wordmark, no tagline)
- Active item: `ZA-GREEN-400` underline, `weight-semibold`
- Hover: `ZA-NEUTRAL-100` background
- Sticky on scroll

### Dashboard Sidebar
```
Width: 240px (expanded) | 64px (collapsed)
Background: ZA-NAVY-900
Text: rgba(255,255,255,0.75)
Active item: ZA-GREEN-400 left border, rgba(76,175,80,0.15) background
Icon: 20px, white
```

### Mobile Navigation
- Bottom tab bar: 5 items max
- Active: `ZA-GREEN-400` icon + label
- Background: `ZA-NEUTRAL-0` with top shadow

---

## 8. BADGES & STATUS INDICATORS

| Badge | Color | Usage |
|-------|-------|-------|
| `verified` | `ZA-GREEN-400` | Verified farmer, certified trader |
| `active` | `ZA-SUCCESS` | Active user, live data |
| `pending` | `ZA-GOLD-500` | Awaiting approval, in progress |
| `inactive` | `ZA-NEUTRAL-400` | Dormant account |
| `government` | `ZA-NAVY-900` | Government entity |
| `premium` | `ZA-GOLD-500` + border | Premium features/organizations |

### Badge CSS
```css
.za-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--za-space-1);
  padding: 2px 8px;
  border-radius: var(--za-radius-full);
  font-size: var(--za-text-label);
  font-weight: var(--za-weight-medium);
  line-height: 1.4;
}
```

---

## 9. ALERTS & TOAST NOTIFICATIONS

### Toast (system notifications)
- Position: Top-right on desktop, top-center on mobile
- Max width: 380px
- Auto-dismiss: 5 seconds (configurable)
- Animation: Slide in from right, fade out

### Alert Banner (inline)
- Full-width within content area
- Left-bordered (4px) with semantic color
- Dismissible with × button
- Supports body text + optional action link

---

## 10. DESIGN TOKENS — COMPONENT REFERENCE

```css
/* Usage example */
.za-card {
  background:    var(--za-surface-card);
  border:        1px solid var(--za-border-default);
  border-radius: var(--za-radius-lg);
  padding:       var(--za-space-6);
  box-shadow:    var(--za-shadow-sm);
  transition:    box-shadow var(--za-duration-normal) var(--za-ease-standard);
}
.za-card:hover {
  box-shadow: var(--za-shadow-md);
}
```
