import React from 'react'
import { TopThree } from '../lib/api'

interface Props {
  topThree: TopThree[]
}

const rankGradients: Record<number, { card: string; badge: string; medal: string }> = {
  1: {
    card: 'bg-gradient-to-br from-amber-50 via-amber-100/40 to-yellow-50 border-amber-200/60 ring-2 ring-amber-300/40',
    badge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-sm',
    medal: '🥇',
  },
  2: {
    card: 'bg-gradient-to-br from-slate-50 via-slate-100/30 to-gray-50 border-slate-200/60',
    badge: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-sm',
    medal: '🥈',
  },
  3: {
    card: 'bg-gradient-to-br from-orange-50 via-orange-100/30 to-amber-50 border-orange-200/60',
    badge: 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-sm',
    medal: '🥉',
  },
}

const TopThreeCards: React.FC<Props> = ({ topThree }) => {
  if (topThree.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white/60 backdrop-blur-sm border border-slate-100 py-10 text-center">
        <p className="text-slate-400 text-sm">Belum ada peserta yang submit.</p>
      </div>
    )
  }

  // Determine podium order: rank 2, rank 1, rank 3
  const rank1 = topThree.find((t) => t.rank === 1)
  const rank2 = topThree.find((t) => t.rank === 2)
  const rank3 = topThree.find((t) => t.rank === 3)

  return (
    <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-3">
      {/* Rank 2 */}
      {rank2 && (
        <PodiumCard item={rank2} rankGrad={rankGradients[2]} isCenter={false} />
      )}

      {/* Rank 1 - Center, taller */}
      {rank1 && (
        <PodiumCard item={rank1} rankGrad={rankGradients[1]} isCenter={true} />
      )}

      {/* Rank 3 */}
      {rank3 && (
        <PodiumCard item={rank3} rankGrad={rankGradients[3]} isCenter={false} />
      )}
    </div>
  )
}

const PodiumCard: React.FC<{
  item: TopThree
  rankGrad: { card: string; badge: string; medal: string }
  isCenter: boolean
}> = ({ item, rankGrad, isCenter }) => {
  return (
    <div
      className={`
        relative flex-1 min-w-0 rounded-[2rem] backdrop-blur-xl border shadow-glass p-6 text-center
        ${rankGrad.card}
        ${isCenter ? 'md:scale-105 md:-mb-2' : 'md:scale-95'}
        transition-all duration-300
      `}
    >
      {/* Medal Badge */}
      <div
        className={`
          inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold
          ${rankGrad.badge}
        `}
      >
        <span className="text-sm">{rankGrad.medal}</span>
        <span>Rank #{item.rank}</span>
      </div>

      <p className="text-base sm:text-lg font-bold text-[#0F172A] mt-3 truncate">
        {item.participant_name}
      </p>
      <p className={`font-extrabold mt-1 ${isCenter ? 'text-3xl' : 'text-2xl'}`}>
        {item.total_score}
      </p>
      <p className="text-xs text-slate-400">poin</p>
    </div>
  )
}

export default TopThreeCards