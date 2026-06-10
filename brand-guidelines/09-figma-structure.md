# ZARATI | زرعتي — Figma File Structure & Architecture
**Version:** 1.0

---

## FIGMA FILE ORGANIZATION

### Recommended File Structure (5 Figma files)

```
ZARATI Design System [Organization]
├── 🎨 01 — Brand Guidelines
├── 🧩 02 — Design System (Components)
├── 📱 03 — Product UI (Website + Dashboard + Mobile)
├── 📊 04 — Marketing Kit
└── 📁 05 — Presentation Templates
```

---

## FILE 01 — BRAND GUIDELINES

### Pages
```
Cover
├── 1. Logo System
│   ├── Master Logo (all configurations)
│   ├── Clear Space Rules
│   ├── Minimum Size Rules
│   ├── Background Versions (Light/Dark/Mono/White)
│   └── Incorrect Usage
├── 2. Color System
│   ├── Primary Palette
│   ├── Secondary Palette
│   ├── Semantic Colors
│   └── Neutral Scale
├── 3. Typography
│   ├── English — Inter
│   ├── Arabic — IBM Plex Arabic
│   └── Type Scale Specimen
├── 4. Iconography
│   ├── Icon Library (all categories)
│   └── Icon Usage Rules
└── 5. Photography & Illustration
    ├── Photo Style Guide
    └── Illustration Examples
```

---

## FILE 02 — DESIGN SYSTEM (COMPONENTS)

### Figma Component Architecture

```
🔵 Primitives (non-component foundations)
├── Colors (Figma color styles)
├── Typography (Figma text styles)
├── Effects (Shadow styles)
└── Grids (Layout grid styles)

🟢 Base Components (atoms)
├── Button (Primary, Secondary, Ghost, Danger, Link)
│   ├── Sizes: sm, md, lg, xl
│   ├── States: Default, Hover, Active, Disabled, Loading
│   └── Icon variants: Icon-left, Icon-right, Icon-only
├── Input (Text, Password, Search, Number, Textarea)
├── Select, Checkbox, Radio, Toggle
├── Badge, Tag, Chip
├── Avatar (xs, sm, md, lg, xl)
├── Icon (all sizes)
└── Spinner / Loader

🟡 Compound Components (molecules)
├── Form Field (Label + Input + Helper + Error)
├── Card (Base, Data/KPI, Feature, Alert)
├── Table Row
├── List Item
├── Navigation Item
├── Breadcrumb
└── Toast Alert

🔴 Complex Components (organisms)
├── Navigation Bar
├── Sidebar (Expanded + Collapsed)
├── Data Table (full: header, search, pagination)
├── Modal / Dialog
├── Drawer
├── Dropdown Menu
├── Date Picker
├── Data Chart (Line, Bar, Donut, Area)
├── Map Component
└── Empty States
```

### Component Property Naming Convention
```
Component: [Category/ComponentName]
Variant property: "Variant" | "Size" | "State" | "Direction"
Boolean property: "Has Icon" | "Is Disabled" | "Is Loading"
String property: "Label" | "Placeholder" | "Value"
```

---

## FILE 03 — PRODUCT UI

### Pages
```
├── Website
│   ├── Home Page — Desktop
│   ├── Home Page — Mobile
│   ├── Features Page
│   ├── About Page
│   ├── Pricing Page
│   └── Contact Page
├── Dashboard
│   ├── Overview / Home
│   ├── Farmers Map
│   ├── Analytics
│   ├── Market Prices
│   ├── Reports
│   └── Settings
├── Mobile App (iOS/Android)
│   ├── Onboarding (3 screens)
│   ├── Home / Feed
│   ├── My Farm
│   ├── Markets
│   ├── Weather
│   └── Profile
└── Admin Portal
    ├── Organization Dashboard
    ├── User Management
    ├── Data Management
    └── Reports
```

---

## FILE 04 — MARKETING KIT

### Pages
```
├── Social Media Templates
│   ├── LinkedIn (Square, Landscape, Cover)
│   ├── Instagram (Square, Portrait, Story)
│   ├── Facebook (Square, Landscape)
│   └── X / Twitter (Post, Header)
├── Advertising
│   ├── Digital Display (300×250, 728×90, 160×600)
│   └── Google Ads
├── Print Collateral
│   ├── Business Card (Front + Back)
│   ├── A4 Letterhead
│   ├── Roll-Up Banner
│   └── Brochure (Tri-fold)
└── Email Templates
    ├── Transactional
    └── Newsletter
```

---

## FILE 05 — PRESENTATION TEMPLATES

### Pages
```
├── Investor Deck (12 slides)
├── Government Presentation (8 slides)
├── NGO Partnership Deck (10 slides)
├── Sales Proposal Template
└── Product Demo Template
```

---

## FIGMA NAMING CONVENTIONS

### Layer Naming
```
Pattern: [type]/[description]--[variant]--[state]

Examples:
  button/primary--lg--hover
  card/kpi--dark
  input/text--default--error
  icon/crop/wheat--24px
```

### Frame Naming
```
Pattern: [screen-type]/[page-name]/[view]@[breakpoint]

Examples:
  web/home/hero@1440
  web/home/hero@375
  app/farmers-map/default@375
  dashboard/overview/loaded@1280
```

### Color Style Naming
```
brand/green/leaf              → #4CAF50
brand/green/forest            → #0D3B1E
brand/navy/deep               → #0F2D5E
brand/navy/river              → #1565C0
semantic/success/default      → #2E7D32
semantic/error/default        → #C62828
neutral/900                   → #212121
neutral/0                     → #FFFFFF
```

### Text Style Naming
```
display/xl
display/lg
display/md
heading/h1 through h6
body/xl, lg, md, sm
label/default
caption/default
overline/default
arabic/body-lg
arabic/heading-h2
```

---

## DESIGN TOKEN EXPORT

Figma tokens should be exported via **Tokens Studio for Figma** plugin and sync to:
```
/design-system/tokens.css     (CSS custom properties — already created)
/design-system/tokens.json    (Raw token JSON for build pipeline)
/design-system/tokens.js      (JavaScript ES module for React/Next.js)
```

### tokens.json Structure
```json
{
  "color": {
    "brand": {
      "green": {
        "leaf":   { "value": "#4CAF50", "type": "color" },
        "forest": { "value": "#0D3B1E", "type": "color" }
      },
      "navy": {
        "deep":  { "value": "#0F2D5E", "type": "color" },
        "river": { "value": "#1565C0", "type": "color" }
      }
    },
    "semantic": {
      "success": { "value": "#2E7D32", "type": "color" },
      "warning": { "value": "#E65100", "type": "color" },
      "error":   { "value": "#C62828", "type": "color" },
      "info":    { "value": "#0277BD", "type": "color" }
    }
  },
  "spacing": {
    "1":  { "value": "4px",  "type": "spacing" },
    "2":  { "value": "8px",  "type": "spacing" },
    "4":  { "value": "16px", "type": "spacing" },
    "6":  { "value": "24px", "type": "spacing" },
    "8":  { "value": "32px", "type": "spacing" },
    "16": { "value": "64px", "type": "spacing" }
  },
  "borderRadius": {
    "md":   { "value": "8px",    "type": "borderRadius" },
    "lg":   { "value": "12px",   "type": "borderRadius" },
    "full": { "value": "9999px", "type": "borderRadius" }
  }
}
```
