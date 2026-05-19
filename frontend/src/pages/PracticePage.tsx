import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { startPractice, submitPractice, SubmitResponse } from '../lib/api'
import BadExampleCard from '../components/BadExampleCard'
import ScoreResultCard from '../components/ScoreResultCard'
import StepIndicator from '../components/StepIndicator'
import LoadingSkeleton from '../components/LoadingSkeleton'

type Step = 'form' | 'loading-start' | 'practice' | 'loading-submit' | 'result'

const steps = [
  { number: 2, label: 'Mulai' },
  { number: 3, label: 'Jawab' },
  { number: 4, label: 'Hasil' },
]

const PracticePage: React.FC = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>()
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [submissionId, setSubmissionId] = useState<number | null>(null)
  const [badExample, setBadExample] = useState('')
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<SubmitResponse | null>(null)
  const [error, setError] = useState('')

  const handleStart = async () => {
    if (!name.trim()) {
      setError('Silakan isi nama terlebih dahulu.')
      return
    }
    setError('')
    setStep('loading-start')
    try {
      const data = await startPractice(sessionCode || 'komunikasi-internal-2026', name.trim())
      setSubmissionId(data.submission_id)
      setBadExample(data.bad_communication_example)
      setStep('practice')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Gagal memulai practice. Coba lagi.')
      setStep('form')
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError('Silakan tulis jawaban terlebih dahulu.')
      return
    }
    setError('')
    setStep('loading-submit')
    try {
      const data = await submitPractice(submissionId!, answer.trim())
      setResult(data)
      setStep('result')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Gagal submit jawaban. Coba lagi.')
      setStep('practice')
    }
  }

  const handleReset = () => {
    setStep('form')
    setName('')
    setSubmissionId(null)
    setBadExample('')
    setAnswer('')
    setResult(null)
    setError('')
  }

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
        {/* Error Toast */}
        {error && (
          <div className="mb-6 max-w-lg mx-auto">
            <div className="rounded-2xl bg-red-50/90 backdrop-blur-sm border border-red-200/50 shadow-sm px-5 py-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Step: Form (initial) */}
        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh]">
            {/* Left column - Hero text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 text-blue-700 text-xs font-medium px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                AI-Powered Practice
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                Latihan Komunikasi
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Internal
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#64748B] max-w-md mx-auto lg:mx-0 leading-relaxed">
                Ubah pesan yang ambigu menjadi komunikasi yang jelas, sopan, dan bisa ditindaklanjuti.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mt-6 justify-center lg:justify-start">
                {[
                  { label: 'AI-generated case', icon: '✨' },
                  { label: 'Instant feedback', icon: '⚡' },
                  { label: 'Live ranking', icon: '🏆' },
                ].map((f) => (
                  <span
                    key={f.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/60 text-slate-600 text-xs font-medium px-3.5 py-1.5 shadow-sm"
                  >
                    {f.icon} {f.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right column - Start card */}
            <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-[#0F172A]">Mulai Practice</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nama Kamu
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Dawa"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-slate-400"
                      onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    />
                  </div>
                  <button
                    onClick={handleStart}
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3.5 px-6 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm"
                  >
                    Mulai Practice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Loading Generate */}
        {step === 'loading-start' && (
          <div className="flex justify-center items-center min-h-[70vh]">
            <LoadingSkeleton
              title="Menyusun contoh komunikasi..."
              description="AI sedang membuat studi kasus singkat untukmu."
            />
          </div>
        )}

        {/* Step: Practice (Answer) */}
        {step === 'practice' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Step Indicator */}
            <StepIndicator steps={steps} currentStep={2} />

            {/* Title */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#0F172A]">Tulis Ulang Pesan</h2>
              <p className="text-sm text-slate-500 mt-1">
                Perbaiki komunikasi di bawah ini menjadi lebih jelas dan profesional.
              </p>
            </div>

            <BadExampleCard badExample={badExample} />

            {/* Answer Editor Card */}
            <div className="rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass p-6">
              <h3 className="font-semibold text-[#0F172A] text-sm mb-1">
                Tulis Versi Komunikasi yang Lebih Baik
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Pastikan pesanmu menjawab tugas, PIC, deadline, output, dan alur follow-up.
              </p>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Tulis jawaban Anda di sini..."
                rows={6}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-slate-400 resize-none"
              />

              {/* Checklist hints */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Apa tugasnya jelas?',
                  'Siapa PIC-nya?',
                  'Kapan deadline-nya?',
                  'Apa output-nya?',
                  'Ke mana melapor jika ada kendala?',
                ].map((hint) => (
                  <label key={hint} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {hint}
                  </label>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full mt-5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3.5 px-6 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm"
              >
                Submit Jawaban
              </button>
            </div>
          </div>
        )}

        {/* Step: Loading Scoring */}
        {step === 'loading-submit' && (
          <div className="flex justify-center items-center min-h-[70vh]">
            <LoadingSkeleton
              title="Menganalisis jawaban..."
              description="AI sedang menilai kejelasan, kelengkapan, tone, dan actionability."
            />
          </div>
        )}

        {/* Step: Result */}
        {step === 'result' && result && (
          <div className="max-w-2xl mx-auto space-y-6">
            <StepIndicator steps={steps} currentStep={4} />

            <ScoreResultCard
              totalScore={result.total_score}
              scoreClarity={result.score_clarity}
              scoreCompleteness={result.score_completeness}
              scoreTone={result.score_tone}
              scoreActionability={result.score_actionability}
              feedback={result.feedback}
              badExample={badExample}
              participantAnswer={answer}
            />

          </div>
        )}
      </div>
    </div>
  )
}

export default PracticePage