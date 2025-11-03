import { useLanguage } from '../contexts/LanguageContext'

interface GameTileProps {
  value: number
}

const valueToRole = (value: number, lang: 'zh-TW' | 'en'): string => {
  const mapZh: Record<number, string> = {
    2: '村民',
    4: '戰士',
    8: '侍衛',
    16: '將軍',
    32: '諸侯',
    64: '公爵',
    128: '親王',
    256: '王子',
    512: '國王',
    1024: '皇帝',
    2048: '天君',
  }
  const mapEn: Record<number, string> = {
    2: 'Villager',
    4: 'Warrior',
    8: 'Guard',
    16: 'General',
    32: 'Lord',
    64: 'Duke',
    128: 'Prince',
    256: 'Crown Prince',
    512: 'King',
    1024: 'Emperor',
    2048: 'Celestial',
  }
  const map = lang === 'en' ? mapEn : mapZh
  return map[value] || String(value)
}

const getRoleFontSize = (roleText: string): string => {
  const len = roleText.length
  if (len >= 3) return 'text-[16px] sm:text-[18px] lg:text-[20px]'
  if (len === 2) return 'text-[20px] sm:text-[24px] lg:text-[26px]'
  return 'text-[24px] sm:text-[28px] lg:text-[32px]'
}

const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    0: 'bg-amber-50',
    2: 'bg-amber-100',
    4: 'bg-amber-200',
    8: 'bg-orange-200',
    16: 'bg-orange-300',
    32: 'bg-orange-400',
    64: 'bg-orange-500',
    128: 'bg-amber-400',
    256: 'bg-amber-500',
    512: 'bg-yellow-500',
    1024: 'bg-yellow-600',
    2048: 'bg-amber-600',
  }
  return colors[value] || 'bg-amber-700'
}

const getTextColor = (value: number): string => {
  return value <= 8 ? 'text-gray-800' : 'text-white'
}

export default function GameTile({ value }: GameTileProps) {
  if (value === 0) {
    return (
      <div className="w-full h-full bg-amber-50 rounded flex items-center justify-center transition-all duration-200">
      </div>
    )
  }

  if (value === -1) {
    return (
      <div className="w-full h-full bg-stone-700 rounded flex items-center justify-center transition-all duration-200">
        <svg className="w-6 h-6 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5l-2 8h18l-2-8zM7 13V7a5 5 0 0110 0v6" />
        </svg>
      </div>
    )
  }

  const { language } = useLanguage()
  const roleText = valueToRole(value, language)
  return (
    <div className={`w-full h-full ${getTileColor(value)} rounded flex items-center justify-center transition-all duration-200`}>
      <span className={`${getTextColor(value)} ${getRoleFontSize(roleText)} font-bold text-center leading-none`}>
        {roleText}
      </span>
    </div>
  )
}

