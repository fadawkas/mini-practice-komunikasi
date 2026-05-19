import React from 'react'

interface Props {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

const ScoreRing: React.FC<Props> = ({ score, size = 140, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.min(100, Math.max(0, score))
  const offset = circumference - (clampedScore / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 80) return '#16A34A'
    if (s >= 60) return '#F59E0B'
    if (s >= 40) return '#F97316'
    return '#DC2626'
  }

  const color = getColor(clampedScore)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.12)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-extrabold tracking-tight"
          style={{ color }}
        >
          {clampedScore}
        </span>
        {label && (
          <span className="text-xs font-medium text-slate-400 mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

export default ScoreRing