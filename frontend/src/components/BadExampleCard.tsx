import React from 'react'

interface Props {
  badExample: string
}

const BadExampleCard: React.FC<Props> = ({ badExample }) => {
  return (
    <div className="rounded-[2rem] bg-red-50/80 backdrop-blur-sm border border-red-200/50 shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <div>
          <span className="inline-block rounded-full border border-red-200 bg-red-100/70 text-red-700 text-xs font-medium px-2.5 py-0.5">
            Perlu diperbaiki
          </span>
          <h3 className="font-semibold text-red-800 text-sm mt-1">
            Contoh Komunikasi yang Kurang Baik
          </h3>
        </div>
      </div>
      <div className="relative pl-4 border-l-2 border-red-200">
        <p className="text-red-800/90 text-base leading-relaxed italic">
          &ldquo;{badExample}&rdquo;
        </p>
      </div>
    </div>
  )
}

export default BadExampleCard