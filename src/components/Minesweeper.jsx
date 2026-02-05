import { useState, useEffect, useCallback, useRef } from 'react'
import '../index.css'

const DIFFICULTIES = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
}

const CELL_STATE = {
    HIDDEN: 0,
    REVEALED: 1,
    FLAGGED: 2,
    QUESTION: 3 // Optional, classic feature
}

const GAME_STATE = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WON: 'won',
    LOST: 'lost'
}

const Minesweeper = () => {
    const [difficulty, setDifficulty] = useState('beginner')
    const [grid, setGrid] = useState([])
    const [gameState, setGameState] = useState(GAME_STATE.IDLE)
    const [minesLeft, setMinesLeft] = useState(0)
    const [time, setTime] = useState(0)
    const [isMouseDown, setIsMouseDown] = useState(false)
    const timerRef = useRef(null)

    // Initialize game
    const initGame = useCallback((diff = difficulty) => {
        const { rows, cols, mines } = DIFFICULTIES[diff]

        // Create empty grid
        const newGrid = Array(rows).fill(null).map(() =>
            Array(cols).fill(null).map(() => ({
                isMine: false,
                state: CELL_STATE.HIDDEN,
                neighborCount: 0
            }))
        )

        setGrid(newGrid)
        setGameState(GAME_STATE.IDLE)
        setMinesLeft(mines)
        setTime(0)
        clearInterval(timerRef.current)
    }, [difficulty])

    useEffect(() => {
        initGame()
        return () => clearInterval(timerRef.current)
    }, [initGame])

    // Place mines (on first click to ensure safety)
    const placeMines = (firstRow, firstCol) => {
        const { rows, cols, mines } = DIFFICULTIES[difficulty]
        const newGrid = [...grid] // Shallow copy of rows
        // Deep copy needed for mutation during setup? Actually, mapping is safer.
        // Let's just mutate the logic for placement since we are replacing state anyway.
        // But for React state safety, we should clone.
        const gridClone = newGrid.map(row => row.map(cell => ({ ...cell })))

        let minesPlaced = 0
        while (minesPlaced < mines) {
            const r = Math.floor(Math.random() * rows)
            const c = Math.floor(Math.random() * cols)

            // Don't place mine on first clicked cell or neighbors
            if (!gridClone[r][c].isMine &&
                stateIsSafe(r, c, firstRow, firstCol)) {

                gridClone[r][c].isMine = true
                minesPlaced++
            }
        }

        // Calculate neighbors
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!gridClone[r][c].isMine) {
                    let count = 0
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            const nr = r + i
                            const nc = c + j
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gridClone[nr][nc].isMine) {
                                count++
                            }
                        }
                    }
                    gridClone[r][c].neighborCount = count
                }
            }
        }

        return gridClone
    }

    const stateIsSafe = (r, c, firstRow, firstCol) => {
        // Safe if not the clicked cell (and maybe neighbors for strictly fair start, 
        // but standard usually just guarantees the cell itself is not a mine, or is a 0)
        // Windows 95 moves the mine to the first available safe spot if you click one.
        // Simplified: Ensure first click is not a mine.
        if (r === firstRow && c === firstCol) return false
        return true
    }

    const startGame = (r, c) => {
        const newGrid = placeMines(r, c)
        setGrid(newGrid)
        setGameState(GAME_STATE.PLAYING)

        // Start timer
        timerRef.current = setInterval(() => {
            setTime(prev => Math.min(prev + 1, 999))
        }, 1000)

        // Reveal the first clicked cell
        revealCell(newGrid, r, c)
    }

    const revealCell = (currentGrid, r, c) => {
        if (currentGrid[r][c].state !== CELL_STATE.HIDDEN &&
            currentGrid[r][c].state !== CELL_STATE.QUESTION) return

        if (currentGrid[r][c].isMine) {
            // Game Over
            gameOver(currentGrid)
            return
        }

        const newGrid = [...currentGrid] // We are mutating the passed grid reference if it was cloned already
        // But for recursive revealing, we need to operate on the same data structure

        // Check recursion depth/performance - stack size should be fine for 30x16

        const queue = [[r, c]]

        while (queue.length > 0) {
            const [currR, currC] = queue.pop()

            if (newGrid[currR][currC].state === CELL_STATE.REVEALED) continue

            newGrid[currR][currC].state = CELL_STATE.REVEALED

            // If empty cell, reveal neighbors
            if (newGrid[currR][currC].neighborCount === 0) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const nr = currR + i
                        const nc = currC + j
                        if (nr >= 0 && nr < DIFFICULTIES[difficulty].rows &&
                            nc >= 0 && nc < DIFFICULTIES[difficulty].cols &&
                            newGrid[nr][nc].state === CELL_STATE.HIDDEN) {
                            queue.push([nr, nc])
                        }
                    }
                }
            }
        }

        setGrid(newGrid)
        checkWin(newGrid)
    }

    const handleCellClick = (r, c) => {
        if (gameState === GAME_STATE.WON || gameState === GAME_STATE.LOST) return
        if (grid[r][c].state === CELL_STATE.FLAGGED) return

        if (gameState === GAME_STATE.IDLE) {
            startGame(r, c)
        } else {
            // Deep clone to modify state
            const newGrid = grid.map(row => row.map(cell => ({ ...cell })))
            if (newGrid[r][c].isMine) {
                newGrid[r][c].isExploded = true // Mark specifically which mine exploded
                setGrid(newGrid)
                gameOver(newGrid)
            } else {
                revealCell(newGrid, r, c)
            }
        }
    }

    const handleCellRightClick = (e, r, c) => {
        e.preventDefault()
        if (gameState === GAME_STATE.WON || gameState === GAME_STATE.LOST) return
        if (grid[r][c].state === CELL_STATE.REVEALED) return

        const newGrid = grid.map(row => row.map(cell => ({ ...cell })))
        const cell = newGrid[r][c]

        if (cell.state === CELL_STATE.HIDDEN) {
            cell.state = CELL_STATE.FLAGGED
            setMinesLeft(prev => prev - 1)
        } else if (cell.state === CELL_STATE.FLAGGED) {
            cell.state = CELL_STATE.QUESTION
            setMinesLeft(prev => prev + 1)
        } else if (cell.state === CELL_STATE.QUESTION) {
            cell.state = CELL_STATE.HIDDEN
        }

        setGrid(newGrid)
    }

    const gameOver = (finalGrid) => {
        setGameState(GAME_STATE.LOST)
        clearInterval(timerRef.current)

        // Reveal all mines usually
        const newGrid = finalGrid.map(row => row.map(cell => {
            if (cell.isMine && cell.state !== CELL_STATE.FLAGGED) {
                return { ...cell, state: CELL_STATE.REVEALED }
            }
            if (!cell.isMine && cell.state === CELL_STATE.FLAGGED) {
                return { ...cell, isMisflagged: true }
            }
            return cell
        }))
        setGrid(newGrid)
    }

    const checkWin = (currentGrid) => {
        const { rows, cols, mines } = DIFFICULTIES[difficulty]
        let hiddenCount = 0
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (currentGrid[r][c].state !== CELL_STATE.REVEALED) {
                    hiddenCount++
                }
            }
        }

        if (hiddenCount === mines) {
            setGameState(GAME_STATE.WON)
            clearInterval(timerRef.current)
            setMinesLeft(0)
            // Flag remaining mines
            const newGrid = currentGrid.map(row => row.map(cell => {
                if (cell.isMine) {
                    return { ...cell, state: CELL_STATE.FLAGGED }
                }
                return cell
            }))
            setGrid(newGrid)
        }
    }

    // Smiley face based on state
    const getSmiley = () => {
        if (gameState === GAME_STATE.WON) return '😎'
        if (gameState === GAME_STATE.LOST) return '😵'
        if (isMouseDown) return '😮'
        return '🙂'
    }

    const changeDifficulty = (diff) => {
        setDifficulty(diff)
        // initGame happens in useEffect when difficulty changes
    }

    // Number display helper
    const formatNumber = (num) => {
        if (num < -99) return '-99'
        if (num > 999) return '999'
        if (num < 0) return '-' + Math.abs(num).toString().padStart(2, '0')
        return num.toString().padStart(3, '0')
    }

    return (
        <div className="minesweeper-container">
            <div className="minesweeper-menubar">
                <div className="minesweeper-menu-item">
                    Game
                    <div className="minesweeper-submenu">
                        <div onClick={() => initGame()}>New</div>
                        <div className="menu-separator"></div>
                        <div onClick={() => changeDifficulty('beginner')}>Beginner</div>
                        <div onClick={() => changeDifficulty('intermediate')}>Intermediate</div>
                        <div onClick={() => changeDifficulty('expert')}>Expert</div>
                        <div className="menu-separator"></div>
                        <div onClick={() => window.close()}>Exit</div>
                    </div>
                </div>
                <div className="minesweeper-menu-item">Help</div>
            </div>

            <div className="minesweeper-game-area">
                <div className="minesweeper-header">
                    <div className="minesweeper-counter">{formatNumber(minesLeft)}</div>
                    <button
                        className="minesweeper-face-btn"
                        onClick={() => initGame()}
                    >
                        {getSmiley()}
                    </button>
                    <div className="minesweeper-counter">{formatNumber(time)}</div>
                </div>

                <div
                    className={`minesweeper-grid ${difficulty}`}
                    onMouseDown={() => gameState === GAME_STATE.PLAYING && setIsMouseDown(true)}
                    onMouseUp={() => setIsMouseDown(false)}
                    onMouseLeave={() => setIsMouseDown(false)}
                >
                    {grid.map((row, r) => (
                        <div key={r} className="minesweeper-row">
                            {row.map((cell, c) => (
                                <div
                                    key={c}
                                    className={`minesweeper-cell ${cell.state === CELL_STATE.REVEALED ? 'revealed' : ''
                                        } ${cell.state === CELL_STATE.REVEALED && cell.neighborCount > 0 ? `n${cell.neighborCount}` : ''
                                        }`}
                                    onClick={() => handleCellClick(r, c)}
                                    onContextMenu={(e) => handleCellRightClick(e, r, c)}
                                >
                                    {cell.state === CELL_STATE.FLAGGED && '🚩'}
                                    {cell.state === CELL_STATE.QUESTION && '?'}
                                    {cell.state === CELL_STATE.REVEALED && cell.isMine && '💣'}
                                    {cell.state === CELL_STATE.REVEALED && !cell.isMine && cell.neighborCount > 0 && cell.neighborCount}
                                    {cell.isExploded && <span className="explosion">💥</span>}
                                    {cell.isMisflagged && <span className="misflag">❌</span>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Minesweeper
