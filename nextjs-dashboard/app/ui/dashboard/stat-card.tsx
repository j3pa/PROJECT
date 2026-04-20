interface StatCardProps {
  label: string
  value: string | number
  sub: string
  dotColor?: string
  valueColor?: string
}

export default function StatCard({ label, value, sub, dotColor, valueColor = 'text-[#0d1a4a]' }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
      <div className="text-[11px] text-gray-500 mb-2">{label}</div>
      <div className={`text-[28px] font-bold leading-none mb-1 ${valueColor}`}>{value}</div>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
        {dotColor && (
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
        )}
        {sub}
      </div>
    </div>
  )
}