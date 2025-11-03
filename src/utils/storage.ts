const BEST_SCORE_KEY = '2048_best_score'

export function getBestScore(): number {
  if (typeof window === 'undefined') {
    return 0
  }
  
  const stored = localStorage.getItem(BEST_SCORE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

export function setBestScore(score: number): void {
  if (typeof window === 'undefined') {
    return
  }
  
  localStorage.setItem(BEST_SCORE_KEY, score.toString())
}

export function clearBestScore(): void {
  if (typeof window === 'undefined') {
    return
  }
  
  localStorage.removeItem(BEST_SCORE_KEY)
}

