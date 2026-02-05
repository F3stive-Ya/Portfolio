import { useState, useEffect, useCallback, useRef } from 'react'
import '../../index.css'

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

// Styles for the Seven-Segment Display
const Counter = ({ value }) => (
    <div
        style={{
            background: '#000',
            color: '#ff0000',
            fontFamily: 'monospace',
            fontSize: '22px',
            lineHeight: '1',
            padding: '1px 2px',
            border: '2px inset #dfdfdf',
            letterSpacing: '1px'
        }}
    >
        {value}
    </div>
)

const Minesweeper = ({ onResize, onClose }) => {
    const [difficulty, setDifficulty] = useState('beginner')
    const [grid, setGrid] = useState([])
    const [gameState, setGameState] = useState(GAME_STATE.IDLE)
    const [minesLeft, setMinesLeft] = useState(0)
    const [time, setTime] = useState(0)
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [activeMenu, setActiveMenu] = useState(null)

    const timerRef = useRef(null)
    const menuRef = useRef(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const updateWindowSize = useCallback(
        (rows, cols) => {
            if (!onResize) return

            // Exact measurements based on Windows 95
            // Content Heights:
            // Menu Bar: ~24px
            // Game Header: ~46px
            // Board Borders/Padding: ~12px
            // Total Content Overhead: ~82px
            //
            // Window Chrome Heights (from Window.jsx):
            // Titlebar: ~30px
            // Window Borders: ~8px (4px top + 4px bottom)
            // Total Chrome Overhead: ~38px
            //
            // Total Height Required = BoardHeight + ContentOverhead + ChromeOverhead
            // Height = (Rows * 16) + 82 + 38 = (Rows * 16) + 120
            // Adding slight buffer for safety -> 140px

            const boardWidth = cols * 16
            const boardHeight = rows * 16

            const width = boardWidth + 40 // Ensure enough horizontal space
            const height = boardHeight + 140

            onResize(width, height)
        },
        [onResize]
    )

    const initGame = useCallback(
        (diff = difficulty) => {
            const config = DIFFICULTIES[diff]
            const { rows, cols, mines } = config

            // If changing difficulty, trigger resize
            if (diff !== difficulty || !grid.length) {
                updateWindowSize(rows, cols)
            }

            // If we are strictly resetting, we might want to keep the same difficulty
            // but if passed a diff, update state.
            if (diff !== difficulty) {
                setDifficulty(diff)
            }

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
            setActiveMenu(null)
            clearInterval(timerRef.current)
        },
        [difficulty, grid.length, updateWindowSize]
    )

    // Initial load
    useEffect(() => {
        if (grid.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            initGame('beginner')
        }
        return () => clearInterval(timerRef.current)
    }, [initGame, grid.length]) // Depend on grid.length to only run once if empty

    const placeMines = useCallback(
        (firstRow, firstCol) => {
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
                                    nr >= 0 &&
                                    nr < rows &&
                                    nc >= 0 &&
                                    nc < cols &&
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
        },
        [difficulty, grid]
    )

    const startGame = (r, c) => {
        const newGrid = placeMines(r, c)
        // No setGrid here, returned to caller
        setGameState(GAME_STATE.PLAYING)

        timerRef.current = setInterval(() => {
            setTime((prev) => Math.min(prev + 1, 999))
        }, 1000)

        return newGrid
    }

    const revealCell = (currentGrid, r, c) => {
        if (
            currentGrid[r][c].state !== CELL_STATE.HIDDEN &&
            currentGrid[r][c].state !== CELL_STATE.QUESTION
        )
            return

        currentGrid[r][c].state = CELL_STATE.REVEALED

        if (currentGrid[r][c].isMine) {
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

        let newGrid

        if (gameState === GAME_STATE.IDLE) {
            newGrid = startGame(r, c)
            revealCell(newGrid, r, c)
            setGrid(newGrid)
            return
        }

        // Playing state
        newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
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

        const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
        const cell = newGrid[r][c]

        if (cell.state === CELL_STATE.HIDDEN) {
            cell.state = CELL_STATE.FLAGGED
            setMinesLeft((m) => m - 1)
        } else if (cell.state === CELL_STATE.FLAGGED) {
            cell.state = CELL_STATE.QUESTION
            setMinesLeft((m) => m + 1)
        } else if (cell.state === CELL_STATE.QUESTION) {
            cell.state = CELL_STATE.HIDDEN
        }
        setGrid(newGrid)
    }

    const gameOver = (finalGrid) => {
        setGameState(GAME_STATE.LOST)
        clearInterval(timerRef.current)
        // Reveal all mines
        const newGrid = finalGrid.map((row) =>
            row.map((cell) => {
                if (cell.isMine && cell.state !== CELL_STATE.FLAGGED)
                    return { ...cell, state: CELL_STATE.REVEALED }
                if (!cell.isMine && cell.state === CELL_STATE.FLAGGED)
                    return { ...cell, isMisflagged: true }
                return cell
            })
        )
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
            const newGrid = currentGrid.map((row) =>
                row.map((cell) => {
                    if (cell.isMine) return { ...cell, state: CELL_STATE.FLAGGED }
                    return cell
                })
            )
            setGrid(newGrid)
        }
    }

    const formatNumber = (num) => {
        if (num < -99) return '-99'
        if (num > 999) return '999'
        return Math.floor(num).toString().padStart(3, '0')
    }

    const handleMenuClick = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu)
    }

    const handleDifficultySelect = (diff) => {
        initGame(diff)
        setActiveMenu(null)
    }

    return (
        <div
            className="minesweeper-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                background: '#c0c0c0'
            }}
        >
            {/* Menu Bar */}
            <div
                className="minesweeper-menubar"
                ref={menuRef}
                style={{
                    display: 'flex',
                    padding: '2px 0 2px 0',
                    background: '#c0c0c0',
                    userSelect: 'none',
                    flexShrink: 0,
                    minHeight: '24px'
                }}
            >
                <div style={{ position: 'relative' }}>
                    <div
                        className={`menu-item ${activeMenu === 'game' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('game')}
                        style={{
                            padding: '2px 6px',
                            background: activeMenu === 'game' ? '#000080' : 'transparent',
                            color: activeMenu === 'game' ? '#fff' : '#000',
                            cursor: 'default'
                        }}
                    >
                        <u style={{ textDecoration: 'underline' }}>G</u>ame
                    </div>
                    {activeMenu === 'game' && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                zIndex: 100,
                                background: '#c0c0c0',
                                border: '2px outset #dfdfdf',
                                boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
                                minWidth: '120px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div
                                className="hover-item"
                                onClick={() => {
                                    initGame()
                                    setActiveMenu(null)
                                }}
                                style={{ padding: '4px 12px', cursor: 'pointer' }}
                            >
                                New
                            </div>
                            <div
                                style={{
                                    height: '1px',
                                    background: '#808080',
                                    margin: '2px 1px',
                                    borderBottom: '1px solid #fff'
                                }}
                            ></div>
                            <div
                                className="hover-item"
                                onClick={() => handleDifficultySelect('beginner')}
                                style={{
                                    padding: '4px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {difficulty === 'beginner' && (
                                    <span style={{ marginRight: '4px' }}>✓</span>
                                )}
                                <span
                                    style={{ marginLeft: difficulty === 'beginner' ? 0 : '14px' }}
                                >
                                    Beginner
                                </span>
                            </div>
                            <div
                                className="hover-item"
                                onClick={() => handleDifficultySelect('intermediate')}
                                style={{
                                    padding: '4px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {difficulty === 'intermediate' && (
                                    <span style={{ marginRight: '4px' }}>✓</span>
                                )}
                                <span
                                    style={{
                                        marginLeft: difficulty === 'intermediate' ? 0 : '14px'
                                    }}
                                >
                                    Intermediate
                                </span>
                            </div>
                            <div
                                className="hover-item"
                                onClick={() => handleDifficultySelect('expert')}
                                style={{
                                    padding: '4px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {difficulty === 'expert' && (
                                    <span style={{ marginRight: '4px' }}>✓</span>
                                )}
                                <span style={{ marginLeft: difficulty === 'expert' ? 0 : '14px' }}>
                                    Expert
                                </span>
                            </div>
                            <div
                                style={{
                                    height: '1px',
                                    background: '#808080',
                                    margin: '2px 1px',
                                    borderBottom: '1px solid #fff'
                                }}
                            ></div>
                            <div
                                className="hover-item"
                                onClick={() => {
                                    if (onClose) onClose()
                                }}
                                style={{ padding: '4px 12px', cursor: 'pointer' }}
                            >
                                Exit
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ position: 'relative' }}>
                    <div
                        className={`menu-item ${activeMenu === 'help' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('help')}
                        style={{
                            padding: '2px 6px',
                            cursor: 'default',
                            background: activeMenu === 'help' ? '#000080' : 'transparent',
                            color: activeMenu === 'help' ? '#fff' : '#000'
                        }}
                    >
                        <u style={{ textDecoration: 'underline' }}>H</u>elp
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div
                className="minesweeper-game-area"
                style={{
                    padding: '6px',
                    borderLeft: '3px solid #fff',
                    borderTop: '3px solid #fff',
                    borderRight: '3px solid #808080',
                    borderBottom: '3px solid #808080',
                    background: '#c0c0c0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    margin: '0 3px 3px 3px' // slight offset to look like frame
                }}
            >
                {/* Header */}
                <div
                    className="minesweeper-header"
                    style={{
                        border: '2px inset #dfdfdf', // Actually inset is usually border-left/top gray, bottom/right white inverted?
                        // Windows 95 inset: Top/Left = #808080, Bottom/Right = #fff
                        borderLeft: '2px solid #808080',
                        borderTop: '2px solid #808080',
                        borderRight: '2px solid #fff',
                        borderBottom: '2px solid #fff',
                        padding: '4px 6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#c0c0c0',
                        marginBottom: '0'
                    }}
                >
                    <Counter value={formatNumber(minesLeft)} />

                    <button
                        onClick={() => initGame()}
                        onMouseDown={(e) => {
                            e.preventDefault()
                            setIsMouseDown(true)
                        }}
                        onMouseUp={() => setIsMouseDown(false)}
                        onMouseLeave={() => setIsMouseDown(false)}
                        style={{
                            width: '26px',
                            height: '26px',
                            padding: 0,
                            border: '2px outset #dfdfdf',
                            background: '#c0c0c0',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        {gameState === GAME_STATE.WON
                            ? '😎'
                            : gameState === GAME_STATE.LOST
                              ? '😵'
                              : isMouseDown
                                ? '😮'
                                : '🙂'}
                    </button>

                    <Counter value={formatNumber(time)} />
                </div>

                {/* Grid */}
                <div
                    className="minesweeper-grid"
                    onMouseDown={() => gameState === GAME_STATE.PLAYING && setIsMouseDown(true)}
                    onMouseUp={() => setIsMouseDown(false)}
                    onMouseLeave={() => setIsMouseDown(false)}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${DIFFICULTIES[difficulty].cols}, 16px)`,
                        borderLeft: '3px solid #808080',
                        borderTop: '3px solid #808080',
                        borderRight: '3px solid #fff',
                        borderBottom: '3px solid #fff',
                        width: 'fit-content' // Ensure grid wraps tight
                    }}
                >
                    {grid.map((row, r) =>
                        row.map((cell, c) => (
                            <div
                                key={`${r}-${c}`}
                                className={`minesweeper-cell`}
                                onMouseDown={(e) => {
                                    if (e.button === 0) setIsMouseDown(true)
                                }}
                                onClick={() => handleCellClick(r, c)}
                                onContextMenu={(e) => handleCellRightClick(e, r, c)}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    border:
                                        cell.state === CELL_STATE.REVEALED
                                            ? '1px dotted #808080'
                                            : '2px outset #fff', // Revealed has standard 1px gray border or none?
                                    // Revealed cells in Win95 usually have a very subtle border or none (inset look).
                                    // Actually they share a 1px border #808080.
                                    borderWidth: cell.state === CELL_STATE.REVEALED ? '1px' : '2px',
                                    borderStyle:
                                        cell.state === CELL_STATE.REVEALED ? 'solid' : 'outset',
                                    borderColor:
                                        cell.state === CELL_STATE.REVEALED ? '#808080' : '#fff', // Outset uses light/dark automatic, but specific colors help
                                    background:
                                        cell.state === CELL_STATE.REVEALED && cell.isExploded
                                            ? '#ff0000'
                                            : '#c0c0c0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'default',
                                    boxSizing: 'border-box',
                                    color:
                                        cell.neighborCount === 1
                                            ? '#0000ff'
                                            : cell.neighborCount === 2
                                              ? '#008000'
                                              : cell.neighborCount === 3
                                                ? '#ff0000'
                                                : cell.neighborCount === 4
                                                  ? '#000080'
                                                  : cell.neighborCount === 5
                                                    ? '#800000'
                                                    : cell.neighborCount === 6
                                                      ? '#008080'
                                                      : cell.neighborCount === 7
                                                        ? '#000000'
                                                        : cell.neighborCount === 8
                                                          ? '#808080'
                                                          : '#000'
                                }}
                            >
                                {cell.state === CELL_STATE.FLAGGED && '🚩'}
                                {cell.state === CELL_STATE.QUESTION && '?'}
                                {cell.state === CELL_STATE.REVEALED && cell.isMine && '💣'}
                                {cell.state === CELL_STATE.REVEALED &&
                                    !cell.isMine &&
                                    cell.neighborCount > 0 &&
                                    cell.neighborCount}
                                {cell.isMisflagged && <span className="misflag">❌</span>}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <style>{`
                .hover-item:hover {
                    background-color: #000080;
                    color: #fff;
                }
                .minesweeper-cell {
                    font-family: 'Tahoma', sans-serif; /* Win95 font preference */
                }
            `}</style>
        </div>
    )
}

export default Minesweeper
