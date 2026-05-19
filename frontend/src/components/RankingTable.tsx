import React, { useState, useMemo } from 'react'
import { Ranking } from '../lib/api'

interface Props {
  rankings: Ranking[]
  onViewDetail: (ranking: Ranking) => void
}

const getScoreColor = (score: number, max: number) => {
  const pct = (score / max) * 100
  if (pct >= 80) return 'text-emerald-600'
  if (pct >= 60) return 'text-amber-600'
  if (pct >= 40) return 'text-orange-600'
  return 'text-red-600'
}

const RankingTable: React.FC<Props> = ({ rankings, onViewDetail }) => {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return rankings
    const q = search.toLowerCase()
    return rankings.filter((r) => r.participant_name.toLowerCase().includes(q))
  }, [rankings, search])

  return (
    <div className="rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass p-5 sm:p-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Ranking
        </h2>
        <div className="relative w-full sm:w-56">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari peserta..."
            className="w-full rounded-xl border border-slate-200 bg-white/80 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <div className="inline-block min-w-full align-middle px-5 sm:px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500 tracking-wider">
                <th className="pb-3 pr-2 font-semibold">#</th>
                <th className="pb-3 pr-2 font-semibold">Nama</th>
                <th className="pb-3 pr-2 text-center font-semibold">Total</th>
                <th className="pb-3 pr-2 text-center hidden sm:table-cell font-semibold">Clarity</th>
                <th className="pb-3 pr-2 text-center hidden sm:table-cell font-semibold">Complete</th>
                <th className="pb-3 pr-2 text-center hidden sm:table-cell font-semibold">Tone</th>
                <th className="pb-3 pr-2 text-center hidden sm:table-cell font-semibold">Action</th>
                <th className="pb-3 text-center font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.rank}
                  className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 pr-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2 font-medium text-[#0F172A]">{item.participant_name}</td>
                  <td className={`py-3.5 pr-2 text-center font-bold ${getScoreColor(item.total_score, 100)}`}>
                    {item.total_score}
                  </td>
                  <td className="py-3.5 pr-2 text-center hidden sm:table-cell text-slate-600">{item.score_clarity}</td>
                  <td className="py-3.5 pr-2 text-center hidden sm:table-cell text-slate-600">{item.score_completeness}</td>
                  <td className="py-3.5 pr-2 text-center hidden sm:table-cell text-slate-600">{item.score_tone}</td>
                  <td className="py-3.5 pr-2 text-center hidden sm:table-cell text-slate-600">{item.score_actionability}</td>
                  <td className="py-3.5 text-center">
                    <button
                      onClick={() => onViewDetail(item)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Lihat
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    {search ? 'Tidak ada peserta yang cocok.' : 'Belum ada data ranking.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RankingTable