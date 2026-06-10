# ZARATI | زرعتي — Design System
## Spacing, Grid, Motion, Icons, Illustration
**Version:** 1.0

---

## 1. SPACING SYSTEM

Base unit: **4px**  
Scale: Linear × 4 for small increments, then exponential for layout spacing.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon padding, micro gaps |
| `space-2` | 8px | Inline element gaps, tight padding |
| `space-3` | 12px | Component internal padding (compact) |
| `space-4` | 16px | Standard component padding |
| `space-5` | 20px | Form field height padding |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section internal spacing |
| `space-10` | 40px | Component group gaps |
| `space-12` | 48px | Section padding (mobile) |
| `space-16` | 64px | Section padding (desktop) |
| `space-20` | 80px | Major section breaks |
| `space-24` | 96px | Hero sections |
| `space-32` | 128px | Full-bleed section spacing |

---

## 2. GRID SYSTEM

### Web — Desktop (1440px canvas)
```
Columns: 12
Gutter:  24px
Margin:  80px (sides)
Max content width: 1280px
```

### Web — Tablet (768–1024px)
```
Columns: 8
Gutter:  20px
Margin:  40px (sides)
```

### Web — Mobile (375px)
```
Columns: 4
Gutter:  16px
Margin:  20px (sides)
```

### Dashboard
```
Columns: 12
Gutter:  16px
Margin:  24px (sides)
Sidebar: 240px fixed | Collapsible to 64px
```

### Document / Report
```
A4 / Letter
Margins: 25mm all sides (government standard)
Content width: 160mm
Column option: 2-col at 72mm each, 16mm gutter
```

---

## 3. BORDER RADIUS SYSTEM

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | Government documents, formal tables |
| `radius-xs` | 2px | Table row hover, subtle inputs |
| `radius-sm` | 4px | Badges, tags, chips |
| `radius-md` | 8px | Buttons, form inputs |
| `radius-lg` | 12px | Cards, panels |
| `radius-xl` | 16px | Feature cards, modals |
| `radius-2xl` | 24px | Hero cards, feature highlights |
| `radius-full` | 9999px | Pills, avatars, circular icons |

**Design language note:** ZARATI uses restrained rounding — primarily `radius-md` and `radius-lg`. We are not a consumer app. Excessive rounding reads as playful; our default is precision.

---

## 4. ELEVATION / SHADOW SYSTEM

| Token | CSS Value | Usage |
|-------|-----------|-------|
| `shadow-none` | none | Flat elements, inside cards |
| `shadow-xs` | `0 1px 2px rgba(15,45,94,0.06)` | Subtle separation |
| `shadow-sm` | `0 2px 4px rgba(15,45,94,0.08)` | Cards at rest |
| `shadow-md` | `0 4px 12px rgba(15,45,94,0.10)` | Cards on hover |
| `shadow-lg` | `0 8px 24px rgba(15,45,94,0.12)` | Modals, dropdowns |
| `shadow-xl` | `0 16px 48px rgba(15,45,94,0.16)` | Hero cards, featured panels |
| `shadow-focus` | `0 0 0 3px rgba(76,175,80,0.35)` | Focus rings (accessibility) |

Note: All shadows use the brand navy (`#0F2D5E`) as the shadow color, not pure black — this creates brand-consistent depth.

---

## 5. ICON SYSTEM

### Style
- **Type:** Outlined with 1.5px stroke (never filled, never flat)
- **Corner radius:** 1px on icon paths (consistent with brand geometry)
- **Grid:** 24×24px base, exportable at 16/20/24/32/48px
- **Reference:** Phosphor Icons or Lucide — both follow the same outlined enterprise style
- **Custom icons:** Agricultural set (crop types, farm tools, weather, market) — outlined, matching stroke weight

### Categories Required
| Category | Icon Count | Examples |
|----------|-----------|---------|
| Navigation | 20 | Dashboard, Reports, Map, Settings, Users |
| Agriculture | 40 | Wheat, Cotton, Sorghum, Tractor, Irrigation, Soil, Weather |
| Data & Analytics | 20 | Chart, Trend, Alert, KPI, Download |
| People & Roles | 15 | Farmer, Trader, Government, Investor, NGO |
| Actions | 25 | Upload, Share, Filter, Search, Export |
| Status | 10 | Success, Warning, Error, Pending, Verified |

### Icon Color Rules
- Default: `ZA-NEUTRAL-600` (#757575)
- Active/selected: `ZA-GREEN-500` (#4CAF50)
- Destructive action: `ZA-ERROR` (#C62828)
- On dark backgrounds: White (#FFFFFF)
- Never use ZA-GOLD on functional icons

---

## 6. ILLUSTRATION STYLE

**Philosophy:** No clip art. No cartoon farmers. No generic stock. ZARATI illustrations are technical, data-forward, and modern — closer to Palantir or Stripe than to an agricultural NGO brochure.

### Illustration Categories

**1. Isometric Data Illustrations**
Precise isometric views of farm infrastructure, data flows, platform diagrams. Colors: ZA-NAVY, ZA-GREEN-500, ZA-SAND as background. Used in: investor decks, website features.

**2. Line Art — Agricultural**
Single-weight, minimal line illustrations of Sudanese landscapes, Nile scenes, crop fields. Style: architectural line drawing, never cartoonish. Used in: reports, print collateral, empty states.

**3. UI Data Illustrations**
Abstract geometric visualizations suggesting data networks, satellite grids, crop maps. Colors: ZA-TEAL, ZA-NAVY, white. Used in: dashboard onboarding, empty states, error pages.

**4. Photographic Augmentation**
Real photography of Sudanese farmland with data overlay elements (simulated satellite grid, crop zone markers, data points). Used in: hero sections, marketing materials.

### What to Avoid
- Generic Western farm imagery (barns, tractors in green fields)
- Smiling cartoon farmers
- Abstract green blobs and leaf shapes
- Adobe Stock-looking imagery
- Any illustration that could belong to any other AgriTech brand

---

## 7. PHOTOGRAPHY STYLE

### Style Direction
**"Ground Truth"** — raw, real, dignified. Sudan's agricultural reality is beautiful. Our photography does not romanticize poverty or perform development-sector aesthetics.

### Subject Guidelines
| Subject | Direction |
|---------|-----------|
| **Farmers** | Working, dignified, purposeful — not posed smiling at camera |
| **Land** | Aerial and ground. The Nile. The Nile Valley. The scale of open farmland |
| **Technology** | Smartphones, tablets, sensors in real agricultural contexts |
| **Markets** | Real commodity markets, grain stores, trader interactions |
| **Data** | Dashboard screens, satellite imagery, mobile app in field use |

### Post-Processing
- Color grade: Warm and saturated greens, rich earth tones, clean sky blues
- Contrast: High clarity. No heavy vignettes
- Overlays: Brand color overlays allowed at 15–25% opacity for marketing materials
- Crop: Rule of thirds, generous sky on aerial shots

---

## 8. MOTION GUIDELINES

### Principles
1. **Purposeful** — motion communicates state change, not decoration
2. **Confident** — no bouncy, playful springs. Clean ease curves
3. **Fast** — enterprise users are productive users. Never animate longer than 400ms

### Duration Scale
| Token | Duration | Usage |
|-------|----------|-------|
| `motion-instant` | 0ms | No animation needed |
| `motion-fast` | 100ms | Hover states, toggles |
| `motion-normal` | 200ms | Dropdown open/close, button state |
| `motion-slow` | 300ms | Modal appear/dismiss, page transitions |
| `motion-deliberate` | 400ms | Feature callouts, onboarding reveals |

### Easing Curves
| Token | Curve | Usage |
|-------|-------|-------|
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most state transitions |
| `ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving |
| `ease-sharp` | `cubic-bezier(0.4, 0, 0.6, 1)` | Drawers, sliding panels |

### Specific Animations
- **Dashboard KPI counters:** Count up from 0, 400ms, ease-standard
- **Chart rendering:** Draw lines left-to-right, 300ms stagger
- **Map loading:** Tiles fade in at 200ms, staggered by distance from center
- **Alerts:** Slide in from top, 200ms ease-enter
- **Logo on loading screens:** Subtle scale 0.95→1.0 at 300ms ease-enter
