import { useLanguage } from '../contexts/LanguageContext'

interface ScoreBoardProps {
  score: number
  bestScore: number
}

export default function ScoreBoard({ score, bestScore }: ScoreBoardProps) {
  const { t } = useLanguage()
  
  return (
    <div className="flex gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6 w-full max-w-md justify-center">
      <div className="bg-amber-700 text-white px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded text-center flex-1 min-w-0">
        <div className="text-xs sm:text-sm opacity-90">{t('score')}</div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{score}</div>
      </div>
      <div className="bg-amber-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded text-center flex-1 min-w-0">
        <div className="text-xs sm:text-sm opacity-90">{t('bestScore')}</div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{bestScore}</div>
      </div>
    </div>
  )
}

