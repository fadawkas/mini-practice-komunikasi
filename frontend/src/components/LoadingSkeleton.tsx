import React from 'react'

interface Props {
  title: string
  description: string
}

const LoadingSkeleton: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Animated gradient orb */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-cyan-500/20 animate-orb blur-xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-500 animate-orb opacity-80" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/80 animate-pulse" />
        </div>
      </div>

      {/* Skeleton card */}
      <div className="w-full max-w-md rounded-[2rem] bg-white/75 backdrop-blur-xl border border-white/60 shadow-glass p-6 mb-4">
        <div className="skeleton-shimmer rounded-xl h-4 w-3/4 mx-auto mb-4" />
        <div className="skeleton-shimmer rounded-xl h-3 w-1/2 mx-auto mb-6" />
        <div className="skeleton-shimmer rounded-xl h-3 w-full mb-2" />
        <div className="skeleton-shimmer rounded-xl h-3 w-5/6 mb-2" />
        <div className="skeleton-shimmer rounded-xl h-3 w-4/6" />
      </div>

      {/* Animated loading dots */}
      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-dot" />
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-dot" />
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-dot" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  )
}

export default LoadingSkeleton