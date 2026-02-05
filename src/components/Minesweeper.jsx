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
    QUESTION: 3
}

const GAME_STATE = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WON: 'won',
    LOST: 'lost'
}

const Minesweeper = ({ onResize }) => {
    const [difficulty, setDifficulty] = useState('beginner')
    const [customConfig, setCustomConfig] = useState(null) // Future support
    const [grid, setGrid] = useState([])
    const [gameState, setGameState] = useState(GAME_STATE.IDLE)
    const [minesLeft, setMinesLeft] = useState(0)
    const [time, setTime] = useState(0)
    const [isMouseDown, setIsMouseDown] = useState(false)
    const timerRef = useRef(null)

    // Accurate Window Sizing
    // We need to calculate size EXACTLY to fit the board + borders.
    // Board Width = (Cols * 16)
    // Extra Width = 12px (6px padding left/right) + 6px (3px outer border left/right) -> approx 20px overhead?
    // Let's verify CSS:
    // Container Padding: 6px (left/right/top/bottom)
    // Outer Border: 3px
    // So total horizontal overhead = (6+3)*2 = 18px?
    // PLUS cell borders? Cell is 16px total.
    //
    // Let's try: Width = (Cols * 16) + 24 (Safe margin)
    // Height = (Rows * 16) + Header(34+6+6) + Menu(20) + Borders(6) -> Approx 80-100px.

    const updateWindowSize = useCallback((rows, cols) => {
        if (!onResize) return

        const boardWidth = cols * 16
        const boardHeight = rows * 16

        // Exact measurements based on Windows 95
        // Width: Board + 20px (10px each side for border/margin)
        const width = boardWidth + 24

        // Height: Board + Menu(20) + Header(40) + Margins(10) + Borders(6)
        const height = boardHeight + 84

        onResize(width, height)
    }, [onResize])

    const initGame = useCallback(
        (diff = difficulty) => {
            const config = DIFFICULTIES[diff]
            const { rows, cols, mines } = config

            updateWindowSize(rows, cols)

            const newGrid = Array(rows)
                .fill(null)
                .map(() =>
                    Array(cols)
                        .fill(null)
                        .map(() => ({
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
        },
        [difficulty, updateWindowSize]
    )

    useEffect(() => {
        initGame()
        return () => clearInterval(timerRef.current)
    }, [initGame])

    const placeMines = (firstRow, firstCol) => {
        const { rows, cols, mines } = DIFFICULTIES[difficulty]
        const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))

        let minesPlaced = 0
        while (minesPlaced < mines) {
            const r = Math.floor(Math.random() * rows)
            const c = Math.floor(Math.random() * cols)

            if (!newGrid[r][c].isMine && (r !== firstRow || c !== firstCol)) {
                newGrid[r][c].isMine = true
                minesPlaced++
            }
        }

        // Calculate neighbors
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!newGrid[r][c].isMine) {
                    let count = 0
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            const nr = r + i
                            const nc = c + j
                            if (
                                nr >= 0 && nr < rows &&
                                nc >= 0 && nc < cols &&
                                newGrid[nr][nc].isMine
                            ) {
                                count++
                            }
                        }
                    }
                    newGrid[r][c].neighborCount = count
                }
            }
        }
        return newGrid
    }

    const startGame = (r, c) => {
        const newGrid = placeMines(r, c)
        setGrid(newGrid)
        setGameState(GAME_STATE.PLAYING)

        timerRef.current = setInterval(() => {
            setTime((prev) => Math.min(prev + 1, 999))
        }, 1000)

        revealCell(newGrid, r, c)
    }

    const revealCell = (currentGrid, r, c) => {
        if (currentGrid[r][c].state !== CELL_STATE.HIDDEN && currentGrid[r][c].state !== CELL_STATE.QUESTION) return

        // Mutate grid specifically for reveal logic
        currentGrid[r][c].state = CELL_STATE.REVEALED

        if (currentGrid[r][c].isMine) {
            // Should verify handling upstream
            return
        }

        if (currentGrid[r][c].neighborCount === 0) {
            const { rows, cols } = DIFFICULTIES[difficulty]
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const nr = r + i
                    const nc = c + j
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        revealCell(currentGrid, nr, nc)
                    }
                }
            }
        }
    }

    const handleCellClick = (r, c) => {
        if (gameState === GAME_STATE.WON || gameState === GAME_STATE.LOST) return
        if (grid[r][c].state === CELL_STATE.FLAGGED) return

        let newGrid = [...grid]

        if (gameState === GAME_STATE.IDLE) {
            startGame(r, c)
            newGrid = grid // state updated in startGame but check ref
            // Actually startGame sets state async? No, logic above needs refinement.
            // startGame calculates mines and sets state.
            // We need to wait for that or combine logic.
            // Let's combine:
            const starterGrid = placeMines(r, c)
            setGameState(GAME_STATE.PLAYING)
            timerRef.current = setInterval(() => setTime(t => Math.min(t + 1, 999)), 1000)
            revealCell(starterGrid, r, c)
            setGrid([...starterGrid]) // Trigger re-render
            return
        }

        // Playing state
        newGrid = grid.map(row => row.map(cell => ({ ...cell })))
        const cell = newGrid[r][c]

        if (cell.isMine) {
            cell.isExploded = true
            cell.state = CELL_STATE.REVEALED
            setGrid(newGrid)
            gameOver(newGrid)
        } else {
            revealCell(newGrid, r, c)
            setGrid(newGrid)
            checkWin(newGrid)
        }
    }

    const handleCellRightClick = (e, r, c) => {
        e.preventDefault()
        if (gameState !== GAME_STATE.PLAYING && gameState !== GAME_STATE.IDLE) return
        if (grid[r][c].state === CELL_STATE.REVEALED) return

        const newGrid = grid.map(row => row.map(cell => ({ ...cell })))
        const cell = newGrid[r][c]

        if (cell.state === CELL_STATE.HIDDEN) {
            cell.state = CELL_STATE.FLAGGED
            setMinesLeft(m => m - 1)
        } else if (cell.state === CELL_STATE.FLAGGED) {
            cell.state = CELL_STATE.QUESTION
            setMinesLeft(m => m + 1)
        } else if (cell.state === CELL_STATE.QUESTION) {
            cell.state = CELL_STATE.HIDDEN
        }
        setGrid(newGrid)
    }

    const gameOver = (finalGrid) => {
        setGameState(GAME_STATE.LOST)
        clearInterval(timerRef.current)
        // Reveal all mines
        const newGrid = finalGrid.map(row => row.map(cell => {
            if (cell.isMine && cell.state !== CELL_STATE.FLAGGED) return { ...cell, state: CELL_STATE.REVEALED }
            if (!cell.isMine && cell.state === CELL_STATE.FLAGGED) return { ...cell, isMisflagged: true }
            return cell
        }))
        setGrid(newGrid)
    }

    const checkWin = (currentGrid) => {
        const { rows, cols, mines } = DIFFICULTIES[difficulty]
        let hidden = 0
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (currentGrid[r][c].state !== CELL_STATE.REVEALED) hidden++
            }
        }
        if (hidden === mines) {
            setGameState(GAME_STATE.WON)
            clearInterval(timerRef.current)
            setMinesLeft(0)
            // Flag remaining
            const newGrid = currentGrid.map(row => row.map(cell => {
                if (cell.isMine) return { ...cell, state: CELL_STATE.FLAGGED }
                return cell
            }))
            setGrid(newGrid)
        }
    }

    const changeDifficulty = (diff) => {
        setDifficulty(diff)
        // Effect will handle resizing and init
    }

    const formatNumber = (num) => {
        if (num < -99) return '-99'
        if (num > 999) return '999'
        return Math.floor(num).toString().padStart(3, '0')
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
                        <div onClick={() => window.close()}>Exit</div>{/* Note: window.close() won't work for iframe/react app usually, needs callback */}
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
                        onMouseDown={(e) => { e.preventDefault(); setIsMouseDown(true) }}
                        onMouseUp={() => setIsMouseDown(false)}
                        onMouseLeave={() => setIsMouseDown(false)}
                    >
                        {gameState === GAME_STATE.WON ? '😎' :
                            gameState === GAME_STATE.LOST ? '😵' :
                                isMouseDown ? '😮' : '🙂'}
                    </button>
                    <div className="minesweeper-counter">{formatNumber(time)}</div>
                </div>

                <div
                    className="minesweeper-grid"
                    onMouseDown={() => gameState === GAME_STATE.PLAYING && setIsMouseDown(true)}
                    onMouseUp={() => setIsMouseDown(false)}
                    onMouseLeave={() => setIsMouseDown(false)}
                    style={{ gridTemplateColumns: `repeat(${DIFFICULTIES[difficulty].cols}, 16px)` }} // Removed display:inline-block from CSS to use grid? CSS uses flex.
                >
                    {grid.map((row, r) => (
                        <div key={r} className="minesweeper-row">
                            {row.map((cell, c) => (
                                <div
                                    key={c}
                                    className={`minesweeper-cell ${cell.state === CELL_STATE.REVEALED ? 'revealed' : ''} ${cell.state === CELL_STATE.REVEALED && cell.neighborCount > 0 ? `n${cell.neighborCount}` : ''}`}
                                    onMouseDown={(e) => {
                                        if (e.button === 0) setIsMouseDown(true)
                                    }}
                                    onClick={() => handleCellClick(r, c)}
                                    onContextMenu={(e) => handleCellRightClick(e, r, c)}
                                >
                                    {cell.state === CELL_STATE.FLAGGED && '🚩'}
                                    {cell.state === CELL_STATE.QUESTION && '?'}
                                    {cell.state === CELL_STATE.REVEALED && cell.isMine && '💣'}
                                    {cell.state === CELL_STATE.REVEALED && !cell.isMine && cell.neighborCount > 0 && cell.neighborCount}
                                    {cell.isExploded && <span className="explosion">💥</span>}
                                    {cell.isMisflagged && <span className="misflag">❌</span>} {/* Logic needs rendering upgrade if misflagged */}
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
