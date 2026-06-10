# Contributing to Zarati | المساهمة في زرعتي

## Getting Started

```bash
git clone https://github.com/your-org/zarati.git
cd zarati
npm install
npm run dev
```

The dev server starts at `http://localhost:3000` and redirects to `/ar` (Arabic) automatically.

---

## Development Standards

### Before every commit

```bash
npm run lint       # Must be clean (zero warnings)
npm run test:run   # All tests must pass
npm run build      # Production build must succeed
```

### Branch naming

```
feat/marketplace-search
fix/rtl-table-alignment
chore/update-mock-data
docs/contributing-guide
```

### Commit messages

Keep them short and direct. Start with a verb: `add`, `fix`, `update`, `remove`.

```
add marketplace search filter
fix RTL padding on mobile header
update sesame price in mock data
```

---

## Arabic Quality Standards

Zarati is Arabic-first. Every Arabic string must meet these standards before merging:

- **Natural Sudanese Arabic** — not machine-translated or formal MSA that sounds foreign
- **Correct Arabic typography** — use Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) where appropriate via `Intl.NumberFormat` with `ar-SD` locale
- **Proper RTL layout** — use Tailwind logical properties: `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`; never hardcode `left`/`right` for directional spacing
- **Consistent terminology** — check existing dictionary files (`lib/i18n/dictionaries/ar.json`) before adding new terms
- **No English mixed in** — Arabic UI should be fully Arabic; English words in Arabic text (like brand names) are acceptable, not random English labels

### RTL checklist
- [ ] Padding/margin uses logical properties
- [ ] Icons and arrows are flipped where directional
- [ ] Table text alignment uses `text-start`/`text-end`
- [ ] Numbers and prices display correctly in `ar-SD` locale

---

## i18n Guidelines

1. **Never hardcode UI strings** in components — always source from `getDictionary()` in server components, or use the locale-aware approach in client components
2. **Both languages required** — every new string must have an entry in both `ar.json` and `en.json`
3. **Dictionary structure** — group strings by page/feature namespace (e.g., `home.hero`, `marketplace`, `weather`)
4. **Locale detection** — use `useParams()` in client components to read `lang`; use `params` (awaited) in server components

---

## Adding a New Page

1. Create `app/[lang]/your-page/page.tsx`
2. Add a nav link in `components/layout/header.tsx` (both desktop and mobile)
3. Add dictionary keys to both `ar.json` and `en.json`
4. Add the route to `ROUTES` in `lib/constants.ts`
5. If the page is a new module, add it to `config/modules.ts`

Server component pattern:
```tsx
type Props = { params: Promise<{ lang: string }> }

export default async function MyPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  // ...
}
```

---

## Adding a New Mock Data Entity

1. Create `lib/mock-data/your-entity.ts`
2. Export it from `lib/mock-data/index.ts`
3. Add a service in `lib/services/your-entity-service.ts`
4. Register it in `MOCK_DATA_REGISTRY.md`
5. Add corresponding TypeScript types in `types/`
6. Write tests in `__tests__/lib/services/your-entity-service.test.ts`

---

## Testing Requirements

- All service functions must have tests in `__tests__/lib/services/`
- Tests live in `__tests__/` and follow the same directory structure as `lib/`
- Use Vitest + describe/it/expect
- No mocking of the data layer in unit tests — use real mock data files
- Tests should cover: happy path, edge cases (empty/null), Arabic string values where relevant

---

## File Structure Rules

- **Server components by default** — only add `'use client'` when you need hooks or browser APIs
- **No inline styles** — use Tailwind classes only
- **No new UI libraries** — extend the existing design system in `components/ui/`
- **Lean files** — if a file exceeds ~150 lines, consider splitting
- **No unused imports** — ESLint enforces this

---

## Design System

All UI is built on the custom design system in `components/ui/`. Before creating a new component, check if an existing one can be extended.

| Component | When to use |
|-----------|------------|
| `Button` | Any clickable action |
| `Badge` | Status labels, category tags |
| `Card` | Content containers |
| `Input` | Text input fields |
| `Select` | Dropdown selection |
| `Skeleton` | Loading states |

Colors and spacing are defined as CSS custom properties in `app/globals.css`. Use Tailwind utilities (`bg-primary`, `text-muted`, etc.) — never raw hex values.
