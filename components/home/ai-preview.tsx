import { Badge } from '@/components/ui/badge'

interface AiPreviewDict {
  title: string
  description: string
  badge: string
  planting: string
  pests: string
  market: string
}

interface Props {
  dict: AiPreviewDict
}

export function AiPreview({ dict }: Props) {
  const features = [dict.planting, dict.pests, dict.market]

  return (
    <section className="py-16 sm:py-20 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-8 sm:p-12">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4">{dict.badge}</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-4">{dict.title}</h2>
            <p className="text-muted text-base leading-relaxed mb-8">{dict.description}</p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-text">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">✓</span>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
