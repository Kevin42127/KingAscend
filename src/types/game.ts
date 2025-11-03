export type Direction = 'up' | 'down' | 'left' | 'right'

export type Board = number[][]

export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert'

export type PowerUpType = 'removeTile' | 'clearLow' | 'doubleScore' | 'shuffle' | 'breakObstacle'

export interface PowerUp {
  type: PowerUpType
  count: number
}

export interface GameState {
  board: Board
  score: number
  bestScore: number
  isGameOver: boolean
  difficulty: Difficulty
  powerUps: PowerUp[]
}

