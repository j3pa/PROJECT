interface StatCardProps {
  label: string
  value: string | number
  sub: string
  dotColor?: string
  valueColor?: string
  tone?: 'green' | 'orange' | 'blue' | 'purple'
  icon?: 'box' | 'clock' | 'document' | 'plane'
}

const toneStyle = {
  green: {
    iconBg: 'bg-green-100 text-green-600',
    spark: '#22c55e',
    glow: 'from-green-50',
  },
  orange: {
    iconBg: 'bg-orange-100 text-orange-500',
    spark: '#f59e0b',
    glow: 'from-orange-50',
  },
  blue: {
    iconBg: 'bg-blue-100 text-blue-600',
    spark: '#0b74e8',
    glow: 'from-blue-50',
  },
  purple: {
    iconBg: 'bg-purple-100 text-purple-600',
    spark: '#8b5cf6',
    glow: 'from-purple-50',
  },
}

function CardIcon({ icon }: { icon: NonNullable<StatCardProps['icon']> }) {
  if (icon === 'clock') {
    return (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (icon === 'document') {
    return (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    )
  }

  if (icon === 'plane') {
    return (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11l18-7-7 18-3-8-8-3Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" strokeLinejoin="round" />
      <path d="m8.5 12 2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function StatCard({
  label,
  value,
  sub,
  dotColor,
  valueColor = 'text-[#0d1a4a]',
  tone = 'blue',
  icon = 'document',
}: StatCardProps) {
  const style = toneStyle[tone]
  const lineColor = dotColor || style.spark

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br ${style.glow} to-white px-6 py-6 shadow-sm`}>
      <div className="flex items-start gap-5">
        <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ${style.iconBg}`}>
          <CardIcon icon={icon} />
        </div>
        <div className="min-w-0">
          <div className="mb-3 text-[15px] font-semibold text-gray-500">{label}</div>
          <div className={`mb-3 text-[42px] font-bold leading-none ${valueColor}`}>{value}</div>
          <div className="text-[15px] text-gray-500">{sub}</div>
        </div>
      </div>

      <svg className="mt-6 h-12 w-full" viewBox="0 0 210 42" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 30 C18 25 23 18 39 22 C55 27 59 37 78 33 C94 29 98 17 115 20 C132 23 134 38 153 35 C172 32 172 18 190 17 C199 17 203 20 210 22"
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.95"
        />
      </svg>
    </div>
  )
}
