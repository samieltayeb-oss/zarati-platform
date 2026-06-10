'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

const DICT = {
  en: {
    code: '404',
    title: 'Page Not Found',
    body: "The page you're looking for doesn't exist or has been moved.",
    back: 'Back to Home',
  },
  ar: {
    code: '٤٠٤',
    title: 'الصفحة غير موجودة',
    body: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    back: 'العودة للرئيسية',
  },
}

export default function NotFound() {
  const params = useParams()
  const lang = (params?.lang as string) === 'en' ? 'en' : 'ar'
  const t = DICT[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <div dir={dir} className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-8xl font-bold text-primary/20 select-none mb-4">{t.code}</p>
      <h1 className="text-2xl font-bold text-text mb-3">{t.title}</h1>
      <p className="text-muted max-w-sm mb-8">{t.body}</p>
      <Link
        href={`/${lang}`}
        className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-primary-dark"
      >
        {t.back}
      </Link>
    </div>
  )
}
