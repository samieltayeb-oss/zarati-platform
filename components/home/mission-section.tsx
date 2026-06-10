interface MissionDict {
  title: string
  description: string
  transparency: { title: string; description: string }
  access: { title: string; description: string }
  intelligence: { title: string; description: string }
}

interface Props {
  dict: MissionDict
}

const PILLARS = [
  { key: 'transparency' as const, icon: '📊' },
  { key: 'access' as const, icon: '🤝' },
  { key: 'intelligence' as const, icon: '🤖' },
]

export function MissionSection({ dict }: Props) {
  return (
    <section className="bg-surface py-16 sm:py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text mb-4">{dict.title}</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">{dict.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map(({ key, icon }) => (
            <div
              key={key}
              className="text-center p-6 rounded-2xl bg-bg border border-border hover:border-primary/30 transition-colors"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-lg font-semibold text-text mb-2">{dict[key].title}</h3>
              <p className="text-muted text-sm leading-relaxed">{dict[key].description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
