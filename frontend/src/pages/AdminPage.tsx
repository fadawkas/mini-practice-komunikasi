import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { getRanking, getTopThree, resetSubmissions, Ranking, TopThree } from '../lib/api'
import TopThreeCards from '../components/TopThreeCards'
import RankingTable from '../components/RankingTable'
import StatCard from '../components/StatCard'

const AdminPage: React.FC = () => {
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [topThree, setTopThree] = useState<TopThree[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Ranking | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [rankRes, topRes] = await Promise.all([
        getRanking(),
        getTopThree(),
      ])
      setRankings(rankRes)
      setTopThree(topRes)
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleReset = async () => {
    if (!window.confirm('Yakin ingin menghapus semua submission peserta?')) return
    try {
      await resetSubmissions()
      setRankings([])
      setTopThree([])
      setDetail(null)
    } catch (err) {
      console.error('Failed to reset', err)
    }
  }

  // Compute stats from rankings
  const stats = useMemo(() => {
    const total = rankings.length
    const avg = total > 0
      ? Math.round(rankings.reduce((s, r) => s + r.total_score, 0) / total)
      : 0
    const highest = total > 0
      ? Math.max(...rankings.map((r) => r.total_score))
      : 0
    const latest = rankings.length > 0
      ? rankings[0].created_at
        ? new Date(rankings[0].created_at).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
          })
        : '-'
      : '-'
    return { total, avg, highest, latest }
  }, [rankings])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] blob-blue-sm rounded-full" />
        <div className="absolute -top-20 -right-40 w-[500px] h-[500px] blob-violet-sm rounded-full" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] blob-cyan-sm rounded-full" />
        <div className="absolute inset-0 bg-noise opacity-40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/70 text-violet-700 text-xs font-medium px-4 py-1.5 mb-3">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Lab Komunikasi Internal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pantau hasil practice peserta secara real-time.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 text-red-600 text-sm font-semibold px-5 py-2.5 hover:bg-red-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-cyan-500/20 animate-orb blur-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-500 animate-orb opacity-80" />
                </div>
              </div>
              <p className="text-sm text-slate-500">Memuat data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                label="Total Peserta"
                value={stats.total}
                icon="👥"
                color="blue"
              />
              <StatCard
                label="Rata-rata Skor"
                value={stats.avg}
                icon="📊"
                color="violet"
              />
              <StatCard
                label="Skor Tertinggi"
                value={stats.highest}
                icon="🏆"
                color="amber"
              />
              <StatCard
                label="Submission Terbaru"
                value={stats.latest}
                icon="🕐"
                color="cyan"
              />
            </div>

            {/* Top 3 Podium */}
            <section>
              <h2 className="text-base font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <span className="text-lg">🏆</span>
                Top 3 Peserta
              </h2>
              <TopThreeCards topThree={topThree} />
            </section>

            {/* Ranking Table */}
            <section>
              <RankingTable rankings={rankings} onViewDetail={setDetail} />
            </section>
          </div>
        )}

        {/* Detail Modal */}
        {detail && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white/90 backdrop-blur-xl border border-white/60 shadow-glass-lg p-6 sm:p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                    {detail.participant_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{detail.participant_name}</h3>
                    <p className="text-xs text-slate-400">
                      {detail.created_at
                        ? new Date(detail.created_at).toLocaleString('id-ID')
                        : 'Tanggal tidak tersedia'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetail(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Score Hero */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100">
                  <span className="text-3xl font-extrabold text-blue-600">{detail.total_score}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Total Score / 100</p>
              </div>

              {/* Soal & Jawaban */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Soal */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Soal</h4>
                  <div className="rounded-xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-100/50 p-4">
                    <p className="text-sm text-slate-700 leading-relaxed">{detail.bad_communication_example || '-'}</p>
                  </div>
                </div>

                {/* Jawaban Peserta */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Jawaban Peserta</h4>
                  <div className="rounded-xl bg-gradient-to-br from-green-50/80 to-white border border-green-100/50 p-4">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{detail.participant_answer || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Two-column comparison on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Score Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Skor per Kategori</h4>
                  {[
                    { label: 'Clarity', score: detail.score_clarity, color: 'bg-blue-500' },
                    { label: 'Completeness', score: detail.score_completeness, color: 'bg-violet-500' },
                    { label: 'Tone', score: detail.score_tone, color: 'bg-cyan-500' },
                    { label: 'Actionability', score: detail.score_actionability, color: 'bg-emerald-500' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-white/70 border border-slate-100 p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-slate-500">{item.label}</span>
                        <span className="text-sm font-bold text-slate-700">{item.score}/25</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-500`}
                          style={{ width: `${(item.score / 25) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Feedback</h4>
                  <div className="rounded-xl bg-gradient-to-br from-blue-50/80 to-white border border-blue-100/50 p-4">
                    <p className="text-sm text-slate-700 leading-relaxed">{detail.feedback || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setDetail(null)}
                className="w-full rounded-full border border-slate-200 bg-white/70 text-slate-600 font-medium py-2.5 text-sm hover:bg-white hover:shadow-sm transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage