import type { Difficulty } from '../types/game'

interface DifficultySelectorProps {
  difficulty: Difficulty
  onSelect: (difficulty: Difficulty) => void
  disabled?: boolean
}

const DIFFICULTY_INFO: Record<Difficulty, { label: string; size: string }> = {
  easy: { label: '簡單', size: '3×3' },
  normal: { label: '普通', size: '4×4' },
  hard: { label: '困難', size: '5×5' },
  expert: { label: '專家', size: '6×6' },
}

export default function DifficultySelector({ difficulty, onSelect, disabled }: DifficultySelectorProps) {
  return (
    <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-5 lg:mb-6 flex-wrap justify-center max-w-md w-full px-2">
      {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((diff) => (
        <button
          key={diff}
          onClick={() => onSelect(diff)}
          disabled={disabled}
          className={`px-2.5 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded transition-colors duration-200 flex-1 min-w-[60px] ${
            difficulty === diff
              ? 'bg-amber-700 text-white'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="font-semibold text-xs sm:text-sm lg:text-base">{DIFFICULTY_INFO[diff].label}</div>
          <div className="text-xs opacity-75">{DIFFICULTY_INFO[diff].size}</div>
        </button>
      ))}
    </div>
  )
}

