import type { PowerUp, PowerUpType } from '../types/game'
import { useLanguage } from '../contexts/LanguageContext'

interface PowerUpPanelProps {
  powerUps: PowerUp[]
  onUse: (type: PowerUpType) => void
  disabled?: boolean
}

export default function PowerUpPanel({ powerUps, onUse, disabled }: PowerUpPanelProps) {
  const { t } = useLanguage()
  
  const getPowerUpColor = (type: PowerUpType): string => {
    const colors: Record<PowerUpType, string> = {
      removeTile: 'bg-orange-500',
      clearLow: 'bg-amber-500',
      doubleScore: 'bg-yellow-500',
      shuffle: 'bg-amber-600',
      breakObstacle: 'bg-red-600',
    }
    return colors[type]
  }

  const getPowerUpName = (type: PowerUpType): string => {
    return t(type) as string
  }

  const getPowerUpDescription = (type: PowerUpType): string => {
    return t(`${type}Desc`) as string
  }

  if (powerUps.length === 0) {
    return (
      <div className="mb-4 sm:mb-5 lg:mb-6 text-center px-2">
        <p className="text-amber-700 text-xs sm:text-sm">{t('powerUpHint')}</p>
      </div>
    )
  }

  return (
    <div className="mb-4 sm:mb-5 lg:mb-6 w-full max-w-md px-2">
      <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-2 sm:mb-3 text-center">{t('powerUp')}</h3>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center overflow-x-auto no-scrollbar py-1">
        {powerUps.map((powerUp, index) => (
          <button
            key={`${powerUp.type}-${index}`}
            onClick={() => onUse(powerUp.type)}
            disabled={disabled}
            className={`${getPowerUpColor(powerUp.type)} text-white px-2.5 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded transition-opacity duration-200 text-xs sm:text-sm ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
            }`}
            title={getPowerUpDescription(powerUp.type)}
          >
            <div className="font-semibold whitespace-nowrap">{getPowerUpName(powerUp.type)}</div>
            <div className="text-xs opacity-90">×{powerUp.count}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

