import type { Board, Direction } from '../types/game'

const BOARD_SIZE = 4
const OBSTACLE = -1

export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0))
}

function placeObstacles(board: Board, count: number = 2): Board {
  const newBoard = board.map(row => [...row])
  const size = newBoard.length
  let placed = 0

  while (placed < count) {
    const r = Math.floor(Math.random() * size)
    const c = Math.floor(Math.random() * size)
    if (newBoard[r][c] === 0) {
      newBoard[r][c] = OBSTACLE
      placed++
    }
  }

  return newBoard
}

export function addRandomTile(board: Board): Board {
  const newBoard = board.map(row => [...row])
  const size = board.length
  const emptyCells: [number, number][] = []
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (newBoard[i][j] === 0) {
        emptyCells.push([i, j])
      }
    }
  }
  
  if (emptyCells.length === 0) {
    return newBoard
  }
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  const [row, col] = emptyCells[randomIndex]
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4
  
  return newBoard
}

export function initializeBoard(): Board {
  let board = createEmptyBoard()
  board = placeObstacles(board, 2)
  board = addRandomTile(board)
  board = addRandomTile(board)
  return board
}

function rotateBoardClockwise(board: Board): Board {
  const size = board.length
  const rotated = Array(size).fill(null).map(() => Array(size).fill(0))
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      rotated[j][size - 1 - i] = board[i][j]
    }
  }
  
  return rotated
}

function rotateBoardCounterClockwise(board: Board): Board {
  const size = board.length
  const rotated = Array(size).fill(null).map(() => Array(size).fill(0))
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      rotated[size - 1 - j][i] = board[i][j]
    }
  }
  
  return rotated
}

function moveRowLeft(row: number[]): { newRow: number[], score: number } {
  // Obstacles (-1) split the row into segments. Each segment compacts/merges separately.
  const length = row.length
  const newRow = Array(length).fill(0)
  let score = 0

  // Keep obstacles in place
  for (let i = 0; i < length; i++) {
    if (row[i] === OBSTACLE) newRow[i] = OBSTACLE
  }

  let segmentStart = 0
  while (segmentStart < length) {
    // find next obstacle or end
    let segmentEnd = segmentStart
    while (segmentEnd < length && row[segmentEnd] !== OBSTACLE) segmentEnd++

    // process [segmentStart, segmentEnd)
    if (segmentEnd > segmentStart) {
      const segment = row.slice(segmentStart, segmentEnd).filter(v => v !== 0)
      const merged: number[] = []
      for (let i = 0; i < segment.length; i++) {
        if (i < segment.length - 1 && segment[i] === segment[i + 1]) {
          const m = segment[i] * 2
          merged.push(m)
          score += m
          i++
        } else {
          merged.push(segment[i])
        }
      }
      // place merged left-aligned within the segment range
      for (let k = 0; k < merged.length; k++) {
        newRow[segmentStart + k] = merged[k]
      }
      // remaining cells (excluding obstacles) are already 0
    }

    // jump past obstacle
    segmentStart = segmentEnd + 1
  }

  return { newRow, score }
}

function moveLeft(board: Board): { newBoard: Board, score: number } {
  let totalScore = 0
  const newBoard = board.map(row => {
    const { newRow, score } = moveRowLeft(row)
    totalScore += score
    return newRow
  })
  
  return { newBoard, score: totalScore }
}

export function move(board: Board, direction: Direction): { newBoard: Board, score: number, moved: boolean } {
  let workingBoard = board.map(row => [...row])
  let originalBoard = JSON.stringify(board)
  
  switch (direction) {
    case 'left':
      const leftResult = moveLeft(workingBoard)
      workingBoard = leftResult.newBoard
      break
    case 'right':
      workingBoard = rotateBoardClockwise(rotateBoardClockwise(workingBoard))
      const rightResult = moveLeft(workingBoard)
      workingBoard = rightResult.newBoard
      workingBoard = rotateBoardClockwise(rotateBoardClockwise(workingBoard))
      break
    case 'up':
      workingBoard = rotateBoardCounterClockwise(workingBoard)
      const upResult = moveLeft(workingBoard)
      workingBoard = upResult.newBoard
      workingBoard = rotateBoardClockwise(workingBoard)
      break
    case 'down':
      workingBoard = rotateBoardClockwise(workingBoard)
      const downResult = moveLeft(workingBoard)
      workingBoard = downResult.newBoard
      workingBoard = rotateBoardCounterClockwise(workingBoard)
      break
  }
  
  const newBoardString = JSON.stringify(workingBoard)
  const moved = originalBoard !== newBoardString
  
  const score = moved ? calculateScore(board, workingBoard) : 0
  
  return { newBoard: workingBoard, score, moved }
}

function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0
}

function calculateScore(oldBoard: Board, newBoard: Board): number {
  let score = 0
  const size = oldBoard.length

  // Precompute per-row passive multipliers based on presence of high-tier units
  const rowMultiplier: number[] = new Array(size).fill(1)
  for (let i = 0; i < size; i++) {
    let hasKing = false // >= 512
    let hasEmperor = false // >= 1024
    for (let j = 0; j < size; j++) {
      const v = newBoard[i][j]
      if (v >= 1024) hasEmperor = true
      else if (v >= 512) hasKing = true
    }
    if (hasKing) rowMultiplier[i] += 0.10
    if (hasEmperor) rowMultiplier[i] += 0.20
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const delta = newBoard[i][j] - oldBoard[i][j]
      if (delta > 0 && isPowerOfTwo(newBoard[i][j])) {
        score += Math.round(delta * rowMultiplier[i])
      }
    }
  }
  return score
}

export function isGameOver(board: Board): boolean {
  const size = board.length
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === 0) {
        return false
      }
      
      if (j < size - 1 && board[i][j] !== OBSTACLE && board[i][j + 1] !== OBSTACLE && board[i][j] === board[i][j + 1]) {
        return false
      }
      
      if (i < size - 1 && board[i][j] !== OBSTACLE && board[i + 1][j] !== OBSTACLE && board[i][j] === board[i + 1][j]) {
        return false
      }
    }
  }
  
  return true
}

export function canMove(board: Board, direction: Direction): boolean {
  const { moved } = move(board, direction)
  return moved
}

