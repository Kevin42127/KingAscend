import type { Board, PowerUpType } from '../types/game'

export function removeTile(board: Board, row: number, col: number): Board {
  const newBoard = board.map(r => [...r])
  if (row >= 0 && row < board.length && col >= 0 && col < board[0].length) {
    newBoard[row][col] = 0
  }
  return newBoard
}

export function clearLowValues(board: Board, maxValue: number = 8): Board {
  const newBoard = board.map(row => row.map(val => val <= maxValue ? 0 : val))
  return newBoard
}

export function shuffleBoard(board: Board): Board {
  const size = board.length
  const values: number[] = []
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] !== 0) {
        values.push(board[i][j])
      }
    }
  }
  
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[values[i], values[j]] = [values[j], values[i]]
  }
  
  const newBoard = board.map(row => row.map(() => 0))
  let index = 0
  
  for (let i = 0; i < size && index < values.length; i++) {
    for (let j = 0; j < size && index < values.length; j++) {
      newBoard[i][j] = values[index++]
    }
  }
  
  return newBoard
}

export function getPowerUpName(type: PowerUpType): string {
  const names: Record<PowerUpType, string> = {
    removeTile: '移除方塊',
    clearLow: '清除小數字',
    doubleScore: '雙倍分數',
    shuffle: '重新排列',
    breakObstacle: '破壞障礙',
  }
  return names[type]
}

export function getPowerUpDescription(type: PowerUpType): string {
  const descriptions: Record<PowerUpType, string> = {
    removeTile: '移除一個指定的方塊',
    clearLow: '清除所有 ≤8 的方塊',
    doubleScore: '下一次合併獲得雙倍分數',
    shuffle: '重新排列所有方塊位置',
    breakObstacle: '破壞一個障礙格',
  }
  return descriptions[type]
}

