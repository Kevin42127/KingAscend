import { useLanguage } from '../contexts/LanguageContext'

interface GameOverModalProps {
  isOpen: boolean
  score: number
  onRestart: () => void
}

export default function GameOverModal({ isOpen, score, onRestart }: GameOverModalProps) {
  const { t } = useLanguage()
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
      <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full mx-2 sm:mx-4 transition-transform duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-amber-900">{t('gameOver')}</h2>
        <p className="text-center text-base sm:text-lg text-amber-700 mb-4 sm:mb-6">
          {t('yourScore')}：<span className="font-bold text-amber-900">{score}</span>
        </p>
        <button
          onClick={onRestart}
          className="w-full bg-amber-700 text-white py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors duration-200 hover:bg-amber-800"
        >
          {t('playAgain')}
        </button>
      </div>
    </div>
  )
}

