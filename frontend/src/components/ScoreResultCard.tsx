import React from 'react'
import ScoreRing from './ScoreRing'

interface Props {
  totalScore: number
  scoreClarity: number
  scoreCompleteness: number
  scoreTone: number
  scoreActionability: number
  feedback: string
  badExample?: string
  participantAnswer?: string
}

const ScoreBreakdownItem: React.FC<{ label: string; score: number; max: number; color: string }> = ({
  label,
  score,
  max,
  color,
}) => {
  const pct = Math.min(100, Math.round((score / max) * 100))
  return (
    <div className="rounded-xl bg-white/60 border border-slate-100 p-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>
          {score}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

const ScoreResultCard: React.FC<Props> = ({
  totalScore,
  scoreClarity,
  scoreCompleteness,
  scoreTone,
  scoreActionability,
  feedback,
  badExample,
  participantAnswer,
}) => {
  const breakdowns = [
    { label: 'Clarity', score: scoreClarity, max: 25, color: '#2563EB' },
    { label: 'Completeness', score: scoreCompleteness, max: 25, color: '#7C3AED' },
    { label: 'Tone', score: scoreTone, max: 25, color: '#06B6D4' },
    { label: 'Actionability', score: scoreActionability, max: 25, color: '#16A34A' },
  ]

  return (
    <div className="space-y-4">
      {/* Score Hero Card */}
      <div className="rounded-[2rem] bg-gradient-to-br from-white/90 to-blue-50/60 backdrop-blur-xl border border-white/60 shadow-glass p-8 text-center">
        <ScoreRing score={totalScore} size={160} strokeWidth={10} label="Total Score" />
        <p className="mt-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
          / 100 poin
        </p>
      </div>

      {/* Score Breakdown Grid */}
      <div className="grid grid-cols-2 gap-3">
        {breakdowns.map((b) => (
          <ScoreBreakdownItem key={b.label} {...b} />
        ))}
      </div>

      {/* AI Feedback Card */}
      <div className="rounded-[2rem] bg-gradient-to-br from-blue-50/80 to-white backdrop-blur-sm border border-blue-100/50 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="font-semibold text-blue-800 text-sm">AI Feedback</h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{feedback}</p>
      </div>

      {/* Comparison Section */}
      {badExample && participantAnswer && (
        <div className="rounded-[2rem] bg-white/75 backdrop-blur-xl border border-white/60 shadow-glass p-6">
          <h3 className="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Perbandingan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-red-50/70 border border-red-100/50 p-4">
              <span className="text-xs font-medium text-red-500 uppercase tracking-wide">Sebelum</span>
              <p className="text-sm text-red-700 mt-1 italic">&ldquo;{badExample}&rdquo;</p>
            </div>
            <div className="rounded-xl bg-green-50/70 border border-green-100/50 p-4">
              <span className="text-xs font-medium text-green-500 uppercase tracking-wide">Sesudah</span>
              <p className="text-sm text-green-700 mt-1 italic">&ldquo;{participantAnswer}&rdquo;</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScoreResultCard