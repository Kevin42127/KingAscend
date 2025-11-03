import { useLanguage } from '../contexts/LanguageContext'

interface ResetConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ResetConfirmModal({ isOpen, onClose, onConfirm }: ResetConfirmModalProps) {
  const { t } = useLanguage()
  
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
      <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full mx-2 sm:mx-4 transition-transform duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-amber-900">{t('resetConfirm')}</h2>
        <p className="text-center text-base sm:text-lg text-amber-700 mb-4 sm:mb-6">
          {t('resetConfirmText')}<br />
          <span className="text-xs sm:text-sm text-amber-600">{t('resetBestScoreNote')}</span>
        </p>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-amber-700 text-white py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors duration-200 hover:bg-amber-800"
          >
            {t('confirm')}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-amber-100 text-amber-900 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors duration-200 hover:bg-amber-200"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

