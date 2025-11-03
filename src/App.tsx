import { useState } from 'react'
import { useGame } from './hooks/useGame'
import GameBoard from './components/GameBoard'
import ScoreBoard from './components/ScoreBoard'
import GameOverModal from './components/GameOverModal'
import ResetConfirmModal from './components/ResetConfirmModal'
import LanguageSelector from './components/LanguageSelector'
import AnnouncementModal from './components/AnnouncementModal'
import { useLanguage } from './contexts/LanguageContext'

function App() {
  const { 
    board, 
    previousBoard, 
    score, 
    bestScore, 
    isGameOver, 
    resetGame, 
    handleMove
  } = useGame()
  const { t } = useLanguage()
  const [showResetModal, setShowResetModal] = useState(false)
  const [showNotice, setShowNotice] = useState(false)

  const handleResetConfirm = () => {
    resetGame()
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-2 sm:p-4 lg:p-6 relative">
      <div className="absolute top-2 left-2 sm:top-4 sm:left-auto sm:right-4 lg:top-6 lg:right-6 z-40">
        <button
          onClick={() => setShowNotice(true)}
          className="bg-amber-100 text-amber-900 border-2 border-amber-300 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-amber-200"
        >
          {t('noticeTitle')}
        </button>
      </div>
      
      <div className="absolute top-2 sm:top-4 lg:top-6 right-2 sm:right-4 lg:right-6 z-40 sm:flex sm:items-center sm:gap-2">
        <div className="hidden sm:block">
          <button
            onClick={() => setShowNotice(true)}
            className="bg-amber-100 text-amber-900 border-2 border-amber-300 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-amber-200"
          >
            {t('noticeTitle')}
          </button>
        </div>
        <LanguageSelector />
      </div>
      
      <div className="text-center mb-3 sm:mb-5 w-full px-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 mb-1 sm:mb-2">{t('title')}</h1>
        <p className="text-xs sm:text-sm lg:text-base text-amber-800 px-3 sm:px-4 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 inline-block max-w-full">{t('instruction')}</p>
      </div>
      
      <div className="w-full max-w-md px-2 sm:px-0">
        <ScoreBoard score={score} bestScore={bestScore} />
      </div>
      
      <div className="w-full px-2 sm:px-0 flex justify-center">
        <GameBoard board={board} previousBoard={previousBoard} onSwipe={handleMove} />
      </div>
      
      <button
        onClick={() => setShowResetModal(true)}
        className="mt-4 sm:mt-5 lg:mt-6 bg-amber-700 text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg text-sm sm:text-base transition-colors duration-200 hover:bg-amber-800 w-full max-w-md mx-auto"
      >
        {t('restart')}
      </button>
      
      <div className="w-full max-w-md px-3 sm:px-0 mt-2 pt-2 text-center border-t border-amber-300">
        <p className="text-[11px] sm:text-xs text-amber-700 leading-snug">
          {t('roleProgressionHint')}
        </p>
      </div>
      
      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetConfirm}
      />
      
      <GameOverModal
        isOpen={isGameOver}
        score={score}
        onRestart={resetGame}
      />

      <AnnouncementModal isOpen={showNotice} onClose={() => setShowNotice(false)} />

    </div>
  )
}

export default App

