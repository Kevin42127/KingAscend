import { useState, useEffect, useCallback } from 'react'
import type { Board, Direction } from '../types/game'
import { initializeBoard, move, addRandomTile, isGameOver as checkGameOver } from '../utils/gameLogic'
import { getBestScore, setBestScore, clearBestScore } from '../utils/storage'

export function useGame() {
  const [board, setBoard] = useState<Board>(initializeBoard())
  const [previousBoard, setPreviousBoard] = useState<Board>(initializeBoard())
  const [score, setScore] = useState(0)
  const [bestScore, setBestScoreState] = useState(getBestScore())
  const [isGameOver, setIsGameOver] = useState(false)

  useEffect(() => {
    const storedBestScore = getBestScore()
    if (storedBestScore > bestScore) {
      setBestScoreState(storedBestScore)
    }
  }, [])

  const handleMove = useCallback((direction: Direction) => {
    if (isGameOver) return

    setPreviousBoard(board)
    const { newBoard, score: moveScore, moved } = move(board, direction)

    if (!moved) return

    const updatedBoard = addRandomTile(newBoard)
    setBoard(updatedBoard)
    
    let finalScore = moveScore
    setScore(prev => {
      const newScore = prev + finalScore
      if (newScore > bestScore) {
        setBestScoreState(newScore)
        setBestScore(newScore)
      }
      return newScore
    })

    if (checkGameOver(updatedBoard)) {
      setIsGameOver(true)
    }
  }, [board, isGameOver, bestScore])

  const resetGame = useCallback(() => {
    const newBoard = initializeBoard()
    setBoard(newBoard)
    setPreviousBoard(newBoard)
    setScore(0)
    setIsGameOver(false)
    clearBestScore()
    setBestScoreState(0)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return

      const key = e.key.toLowerCase()
      switch (key) {
        case 'arrowup':
        case 'w':
          e.preventDefault()
          handleMove('up')
          break
        case 'arrowdown':
        case 's':
          e.preventDefault()
          handleMove('down')
          break
        case 'arrowleft':
        case 'a':
          e.preventDefault()
          handleMove('left')
          break
        case 'arrowright':
        case 'd':
          e.preventDefault()
          handleMove('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleMove, isGameOver])

  return {
    board,
    previousBoard,
    score,
    bestScore,
    isGameOver,
    handleMove,
    resetGame,
  }
}
