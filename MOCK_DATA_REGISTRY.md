# Mock Data Registry

All mock data files must be replaced with real API calls before going to production.

**Rule:** No mock data file may remain past its target date without a written decision logged below.

---

## Registry

| Module | Mock File | Crops / Records | Future API | Owner | Target Date | Status |
|--------|-----------|-----------------|------------|-------|-------------|--------|
| Crop Prices | `lib/mock-data/crops.ts` | 8 crops, 7-day history | Sudan Commodity Exchange / FAO AMIS | TBD | Month 3 | Pending |
| Weather | `lib/mock-data/weather.ts` | 5 cities, 7-day forecast | OpenWeatherMap or Meteomatics | TBD | Month 3 | Pending |
| Marketplace Listings | `lib/mock-data/marketplace.ts` | 8 listings, 4 sellers | Internal marketplace API (to build) | TBD | Month 4 | Pending |
| National Statistics | `lib/mock-data/statistics.ts` | 5 national KPIs | Sudan Central Bureau of Statistics | TBD | Month 6 | Pending |
| Financing | *(not yet built)* | — | Partner bank / MFI API | TBD | Month 9 | Not Started |

---

## Services backed by mock data

| Service | File | Depends on mock |
|---------|------|----------------|
| `getCrops`, `getTopCrops`, `getCropPrices`, `getCropById` | `lib/services/crop-service.ts` | `crops.ts` |
| `getAllCitiesWeather`, `getWeatherByCity` | `lib/services/weather-service.ts` | `weather.ts` |
| `getListings`, `getListingsByCategory`, `getListingById`, `getFeaturedListings` | `lib/services/marketplace-service.ts` | `marketplace.ts` |

---

## How to swap a mock

1. Create `lib/api/your-api.ts` with the HTTP client
2. Update the service (`lib/services/`) to call the API instead of the mock data
3. Wrap behind `USE_MOCK` flag until the API is validated in staging
4. Delete the mock data file once the API is in production
5. Update status in this registry to `Replaced` with the date

```ts
// lib/services/crop-service.ts — example swap pattern
import { USE_MOCK } from '@/lib/constants'
import { crops } from '@/lib/mock-data'
import { fetchCropsFromAPI } from '@/lib/api/crops-api'

export async function getCrops(): Promise<Crop[]> {
  if (USE_MOCK) return crops
  return fetchCropsFromAPI()
}
```

---

## Environment toggle

```env
# .env.local
NEXT_PUBLIC_USE_MOCK=true
```

`USE_MOCK` is currently hardcoded in `lib/constants.ts`. Env var support will be added in Phase E.

---

## Data quality notes

- All prices are in **SDG (Sudanese Pound)** per ton unless otherwise noted
- Weather temperatures are in **Celsius**
- All Arabic text has been reviewed for natural Sudanese Arabic usage
- Date strings use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
- Last updated: 2026-06-09
