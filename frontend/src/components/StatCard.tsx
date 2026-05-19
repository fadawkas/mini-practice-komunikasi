import React from 'react'

interface Props {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  color?: 'blue' | 'violet' | 'cyan' | 'emerald' | 'amber'
}

const colorMap = {
  blue: 'from-blue-500/10 to-blue-600/5 border-blue-200/40',
  violet: 'from-violet-500/10 to-violet-600/5 border-violet-200/40',
  cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-200/40',
  emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200/40',
  amber: 'from-amber-500/10 to-amber-600/5 border-amber-200/40',
}

const StatCard: React.FC<Props> = ({ label, value, icon, trend, color = 'blue' }) => {
  return (
    <div
      className={`rounded-[1.5rem] bg-gradient-to-br ${colorMap[color]} backdrop-blur-sm border shadow-sm p-5`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      <p className="text-2xl font-extrabold text-[#0F172A]">{value}</p>
      {trend && (
        <p className="text-xs text-slate-400 mt-1">{trend}</p>
      )}
    </div>
  )
}

export default StatCard