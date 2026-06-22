import React from 'react'

const TrustBadge = ({ score, size = 'md' }) => {
  let colorClass = 'bg-brand-sage'
  let label = 'Excellent'
  
  if (score < 50) {
    colorClass = 'bg-brand-terracotta'
    label = 'Needs Review'
  } else if (score < 80) {
    colorClass = 'bg-brand-warmGold'
    label = 'Good'
  }

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-32 h-32 text-4xl'
  }

  const labelSizeClasses = {
    sm: 'text-[6px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-serif font-bold shadow-lg border-4 border-white/20 relative`}>
        {score}
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${colorClass} text-white ${labelSizeClasses[size]} px-2 py-0.5 rounded-full font-bold uppercase tracking-widest whitespace-nowrap shadow-sm`}>
          {label}
        </div>
      </div>
    </div>
  )
}

export default TrustBadge
