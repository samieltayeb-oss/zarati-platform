import type { MetadataRoute } from 'next'

const BASE = 'https://zarati.sd'
const LOCALES = ['ar', 'en'] as const

type Frequency = 'yearly' | 'monthly' | 'weekly' | 'daily' | 'always' | 'hourly' | 'never'

interface Route {
  path: string
  priority: number
  changeFrequency: Frequency
}

const ROUTES: Route[] = [
  { path: '',           priority: 1.0, changeFrequency: 'weekly'  },
  { path: '/register',  priority: 0.9, changeFrequency: 'monthly' },
  { path: '/about',     priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact',   priority: 0.8, changeFrequency: 'monthly' },
  { path: '/crops',     priority: 0.8, changeFrequency: 'daily'   },
  { path: '/marketplace', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/weather',   priority: 0.7, changeFrequency: 'daily'   },
  { path: '/overview',  priority: 0.7, changeFrequency: 'daily'   },
  { path: '/login',     priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy',   priority: 0.4, changeFrequency: 'yearly'  },
  { path: '/terms',     priority: 0.4, changeFrequency: 'yearly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap(locale =>
    ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date('2026-06-10'),
      changeFrequency,
      priority,
    }))
  )
}
