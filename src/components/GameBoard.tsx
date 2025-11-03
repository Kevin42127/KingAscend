import { useEffect, useRef } from 'react'
import GameTile from './GameTile'
import type { Board, Direction } from '../types/game'

interface GameBoardProps {
  board: Board
  previousBoard: Board
  onSwipe?: (direction: Direction) => void
}

export default function GameBoard({ board, previousBoard, onSwipe }: GameBoardProps) {
  const tileRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const usedTiles = useRef<Set<string>>(new Set())
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const BOARD_SIZE = board.length
    usedTiles.current.clear()

    const getTileSize = () => {
      const testElement = tileRefs.current['0-0']
      if (testElement?.parentElement) {
        const rect = testElement.parentElement.getBoundingClientRect()
        const gap = window.innerWidth >= 640 ? 8 : 6
        return rect.width + gap
      }
      return window.innerWidth >= 640 ? 104 : 80
    }

    const tileSize = getTileSize()

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const currentValue = board[row][col]
        const key = `${row}-${col}`
        const tileElement = tileRefs.current[key]

        if (!tileElement) continue

        if (currentValue === 0) {
          tileElement.style.transform = 'translate(0, 0)'
          tileElement.style.transition = 'none'
          continue
        }

        const prevValue = previousBoard[row][col]
        let fromRow = row
        let fromCol = col
        let found = false

        if (prevValue === currentValue) {
          const prevKey = `${row}-${col}`
          if (!usedTiles.current.has(prevKey)) {
            usedTiles.current.add(prevKey)
            tileElement.style.transform = 'translate(0, 0)'
            tileElement.style.transition = 'none'
            continue
          }
        }

        for (let prevRow = 0; prevRow < BOARD_SIZE && !found; prevRow++) {
          for (let prevCol = 0; prevCol < BOARD_SIZE && !found; prevCol++) {
            const prevKey = `${prevRow}-${prevCol}`
            if (previousBoard[prevRow][prevCol] === currentValue && 
                !usedTiles.current.has(prevKey) &&
                (prevRow !== row || prevCol !== col)) {
              fromRow = prevRow
              fromCol = prevCol
              usedTiles.current.add(prevKey)
              found = true
            }
          }
        }

        const isMerged = prevValue !== 0 && currentValue === prevValue * 2

        if (found) {
          const deltaRow = row - fromRow
          const deltaCol = col - fromCol

          tileElement.style.transform = `translate(${deltaCol * tileSize}px, ${deltaRow * tileSize}px) scale(1)`
          tileElement.style.transition = 'none'

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (isMerged) {
                tileElement.style.transform = 'translate(0, 0) scale(1.2)'
                tileElement.style.transition = 'transform 0.15s ease-out'
                setTimeout(() => {
                  tileElement.style.transform = 'translate(0, 0) scale(1)'
                  tileElement.style.transition = 'transform 0.1s ease-out'
                }, 150)
              } else {
                tileElement.style.transform = 'translate(0, 0) scale(1)'
                tileElement.style.transition = 'transform 0.15s ease-out'
              }
            })
          })
        } else {
          if (isMerged) {
            tileElement.style.transform = 'translate(0, 0) scale(1.2)'
            tileElement.style.transition = 'transform 0.15s ease-out'
            setTimeout(() => {
              tileElement.style.transform = 'translate(0, 0) scale(1)'
              tileElement.style.transition = 'transform 0.1s ease-out'
            }, 150)
          } else {
            tileElement.style.transform = 'translate(0, 0) scale(1)'
            tileElement.style.transition = 'transform 0.08s ease-out'
          }
        }
      }
    }
  }, [board, previousBoard])

  useEffect(() => {
    const boardElement = boardRef.current
    if (!boardElement || !onSwipe) return

    let bodyOverflow = ''

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStart.current = { x: touch.clientX, y: touch.clientY }
      
      bodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current) return

      e.preventDefault()
      e.stopPropagation()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      document.body.style.overflow = bodyOverflow
      
      if (!touchStart.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.current.x
      const deltaY = touch.clientY - touchStart.current.y
      const minSwipeDistance = 30

      if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        touchStart.current = null
        return
      }

      e.preventDefault()
      e.stopPropagation()

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          onSwipe('right')
        } else {
          onSwipe('left')
        }
      } else {
        if (deltaY > 0) {
          onSwipe('down')
        } else {
          onSwipe('up')
        }
      }

      touchStart.current = null
    }

    const handleTouchCancel = () => {
      document.body.style.overflow = bodyOverflow
      touchStart.current = null
    }

    boardElement.addEventListener('touchstart', handleTouchStart, { passive: false })
    boardElement.addEventListener('touchmove', handleTouchMove, { passive: false })
    boardElement.addEventListener('touchend', handleTouchEnd, { passive: false })
    boardElement.addEventListener('touchcancel', handleTouchCancel, { passive: false })

    return () => {
      document.body.style.overflow = bodyOverflow
      boardElement.removeEventListener('touchstart', handleTouchStart)
      boardElement.removeEventListener('touchmove', handleTouchMove)
      boardElement.removeEventListener('touchend', handleTouchEnd)
      boardElement.removeEventListener('touchcancel', handleTouchCancel)
    }
  }, [onSwipe])

  return (
    <div 
      ref={boardRef}
      className="bg-amber-800 p-1.5 sm:p-2 rounded-lg inline-block relative max-w-full"
      style={{
        display: 'inline-block',
        touchAction: 'none',
      }}
    >
      <div 
        className={`grid gap-1.5 sm:gap-2 relative`}
        style={{
          gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="relative aspect-square"
              style={{ 
                overflow: 'hidden',
                width: 'clamp(48px, 12vw, 96px)',
                minWidth: board.length >= 6 ? '48px' : board.length >= 5 ? '56px' : '64px',
                maxWidth: board.length <= 3 ? '96px' : board.length <= 4 ? '80px' : board.length <= 5 ? '72px' : '64px',
              }}
            >
              {value !== 0 && (
                <div
                  ref={el => {
                    tileRefs.current[`${rowIndex}-${colIndex}`] = el
                  }}
                  className="absolute w-full h-full"
                  style={{
                    transform: 'translate(0, 0)',
                    transition: 'transform 0.15s ease-out',
                  }}
                >
                  <GameTile value={value} />
                </div>
              )}
              {value === 0 && <GameTile value={0} />}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
