interface StatDict {
  value: string
  label: string
}

interface StatsDict {
  title: string
  farmers: StatDict
  arable: StatDict
  gdp: StatDict
  sesame: StatDict
}

interface Props {
  dict: StatsDict
}

export function StatsSection({ dict }: Props) {
  const stats = [dict.farmers, dict.arable, dict.gdp, dict.sesame]

  return (
    <section className="bg-navy py-14 sm:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-white mb-10">{dict.title}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">{value}</div>
              <div className="text-white/80 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
