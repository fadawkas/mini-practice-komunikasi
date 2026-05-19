import React from 'react'

interface Step {
  number: number
  label: string
}

interface Props {
  steps: Step[]
  currentStep: number
}

const StepIndicator: React.FC<Props> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep
        const isCompleted = step.number < currentStep
        return (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 scale-110'
                    : isCompleted
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  text-xs sm:text-sm font-medium hidden sm:block transition-colors
                  ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-600' : 'text-slate-400'}
                `}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  h-px w-8 sm:w-12 transition-colors
                  ${isCompleted ? 'bg-green-300' : 'bg-slate-200'}
                `}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default StepIndicator