# ZARATI | زرعتي — Typography System
**Version:** 1.0

---

## 1. FONT FAMILIES

### English: Inter
**Rationale:** Inter is the gold standard for enterprise digital interfaces. Used by Stripe, Linear, Notion, and thousands of enterprise products globally. Humanist sans-serif with exceptional legibility at all sizes. Free, open-source, available on Google Fonts and as a variable font. Government-ready, screen-optimized, extensive Latin character support.

- **Variable font:** `Inter Variable` (single file, all weights)
- **Fallback stack:** `'Inter', 'Helvetica Neue', Arial, sans-serif`
- **Source:** fonts.google.com/specimen/Inter

### Arabic: IBM Plex Arabic
**Rationale:** IBM Plex Arabic is the enterprise-grade Arabic typeface used by IBM, major banks, and government institutions across the MENA region. It was designed to harmonize with its Latin counterpart (IBM Plex Sans) and shares the same geometric-humanist DNA as Inter. Government-ready, web-ready, high legibility at small sizes, proper RTL support.

**Alternative if IBM Plex unavailable:** `Noto Sans Arabic` (Google, same quality tier)

- **Weights available:** 100, 200, 300, 400, 500, 600, 700
- **Fallback stack:** `'IBM Plex Arabic', 'Noto Sans Arabic', 'Arial Unicode MS', sans-serif`
- **Source:** fonts.google.com/specimen/IBM+Plex+Arabic

---

## 2. TYPOGRAPHY SCALE

Base size: 16px | Scale ratio: 1.25 (Major Third)

### Display — Hero Moments

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| `type-display-xl` | 72px | 700 | 1.05 | -0.03em | Hero headlines, campaign one-liners |
| `type-display-lg` | 56px | 700 | 1.1 | -0.02em | Section heroes, landing page H1 |
| `type-display-md` | 44px | 600 | 1.15 | -0.02em | Investor deck covers, report covers |

### Heading — Document & UI Structure

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| `type-h1` | 36px | 700 | 1.2 | -0.01em | Page titles |
| `type-h2` | 28px | 600 | 1.25 | -0.01em | Section headings |
| `type-h3` | 22px | 600 | 1.3 | 0 | Card titles, sidebar headings |
| `type-h4` | 18px | 600 | 1.35 | 0 | Sub-section headings |
| `type-h5` | 16px | 600 | 1.4 | 0 | Label headings, small section titles |
| `type-h6` | 14px | 600 | 1.4 | 0.01em | Table column headers |

### Body — Content & UI Text

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| `type-body-xl` | 20px | 400 | 1.6 | 0 | Article intros, proposal summaries |
| `type-body-lg` | 18px | 400 | 1.65 | 0 | Primary body text, reports |
| `type-body-md` | 16px | 400 | 1.7 | 0 | Standard UI body text |
| `type-body-sm` | 14px | 400 | 1.6 | 0 | Secondary content, compact UI |

### Caption & Utility

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| `type-caption` | 12px | 400 | 1.5 | 0.02em | Chart labels, image captions |
| `type-label` | 12px | 500 | 1.4 | 0.05em | Form labels, badge text (ALL CAPS optional) |
| `type-overline` | 11px | 600 | 1.4 | 0.1em | Category labels, pre-headings (ALL CAPS) |
| `type-code` | 14px | 400 | 1.6 | 0 | Code, data strings — font: `'JetBrains Mono', monospace` |

---

## 3. ARABIC TYPOGRAPHY ADJUSTMENTS

Arabic text requires specific adjustments compared to Latin defaults:

| Rule | Value | Reason |
|------|-------|--------|
| Font size multiplier | ×1.1 to ×1.15 | Arabic characters are visually smaller at same px |
| Line height | +0.1 to +0.15 | Arabic ascenders/descenders need more space |
| Letter spacing | 0 always | Arabic is connected script — never add letter-spacing |
| Text direction | `dir="rtl"` | Always set on Arabic containers |
| Font weight cap | 700 max | IBM Plex Arabic 800/900 not available |

**CSS Implementation:**
```css
[lang="ar"], .ar {
  font-family: 'IBM Plex Arabic', 'Noto Sans Arabic', sans-serif;
  direction: rtl;
  font-size: 1.1em;
  line-height: 1.85;
  letter-spacing: 0;
}
```

---

## 4. TYPOGRAPHIC PAIRING RULES

### Hero Section (Light)
```
ZA-NAVY-900 display-xl weight-700
ZA-NEUTRAL-600 body-xl weight-400
ZA-GREEN-500 CTA button label-600
```

### Hero Section (Dark / Navy background)
```
#FFFFFF display-xl weight-700
rgba(255,255,255,0.75) body-xl weight-400
ZA-GREEN-500 CTA button
```

### Dashboard / Data-Dense UI
```
ZA-NEUTRAL-900 h3 weight-600 — card titles
ZA-NEUTRAL-600 body-sm — secondary data
ZA-GREEN-500 data-positive values
ZA-NEUTRAL-400 dividers and borders
```

### Government Report
```
ZA-NAVY-900 h1/h2 — section headings
ZA-NEUTRAL-800 body-lg — body text
ZA-NEUTRAL-300 table borders
ZA-GREEN-500 — accent bars, section markers only
```

---

## 5. DON'T

- Never use more than 2 font weights on one page section
- Never use Inter for Arabic body text
- Never center-align long-form Arabic text
- Never use decorative or display fonts for UI elements
- Never use font sizes below 12px for any readable content
- Never mix IBM Plex Arabic and Noto Sans Arabic on the same page
