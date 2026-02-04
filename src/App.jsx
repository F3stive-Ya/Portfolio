import { useState, useEffect, useCallback, useRef } from 'react'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import Window from './components/Window'
import StartMenu from './components/StartMenu'
import Settings from './components/Settings'
import BiosScreen, { SYSTEM_INFO } from './components/BiosScreen'
import FileExplorer from './components/FileExplorer'
import LoginScreen from './components/LoginScreen'
import ErrorDialog from './components/ErrorDialog'
import Terminal from './components/Terminal'
import Notepad from './components/Notepad'
import OutlookExpress from './components/OutlookExpress'
import Clippy from './components/Clippy'
import BSOD from './components/BSOD'
import Paint from './components/Paint'
import { useRecentPrograms } from './context/RecentProgramsContext'
import { useSounds } from './hooks/useSounds'

// My Computer content using SYSTEM_INFO
const MyComputerContent = () => (
    <div className="mycomputer-content">
        <h3>System Information</h3>
        <div className="system-info-grid">
            <div className="system-info-row">
                <span className="info-label">CPU:</span>
                <span className="info-value">{SYSTEM_INFO.cpu}</span>
            </div>
            <div className="system-info-row">
                <span className="info-label">RAM:</span>
                <span className="info-value">{SYSTEM_INFO.ram}</span>
            </div>
            <div className="system-info-row">
                <span className="info-label">Storage:</span>
                <span className="info-value">{SYSTEM_INFO.hdd}</span>
            </div>
            <div className="system-info-row">
                <span className="info-label">GPU:</span>
                <span className="info-value">{SYSTEM_INFO.gpu}</span>
            </div>
        </div>
        <div className="drives-section">
            <h4>Drives</h4>
            <p>Hard Drive (C:)<br />Floppy (A:)<br />CD-ROM (D:)</p>
        </div>
    </div>
)

// Window configurations
const WINDOW_CONFIGS = {
    about: {
        title: 'About Me',
        defaultStyle: { top: 100, left: 100, width: 360, height: 260 },
        content: (
            <p>Hello there! My name is Shane Borges, and I am a Cyber-Security student studying at Sheridan College. On this page you can find ways to contact me, my projects, and my resume. Enjoy!</p>
        )
    },
    projects: {
        title: 'Projects',
        defaultStyle: { top: 140, left: 220, width: 420, height: 320 },
        content: (
            <>
                <div className="project">
                    <h3>Dice Game</h3>
                    <ul>
                        <li>Python program that simulates two dice being rolled.</li>
                        <li>User can roll the dice as many times as they want.</li>
                        <li>User can quit the game at any time.</li>
                        <li><a href="https://github.com/F3stive-Ya/DiceGame">GitHub</a></li>
                    </ul>
                </div>
                <div className="project">
                    <h3>Assembly Calculator</h3>
                    <ul>
                        <li>Assembly program that simulates a calculator.</li>
                        <li>User can add, subtract, multiply, and divide two numbers.</li>
                        <li>User can quit the program at any time.</li>
                        <li><a href="https://github.com/F3stive-Ya/AssemblyCalculator">GitHub</a></li>
                    </ul>
                </div>
                <div className="project">
                    <h3>Car Racer</h3>
                    <ul>
                        <li>A Python program that simulates a car race.</li>
                        <li>Randomly generated cars race against each other.</li>
                        <li>Winner is presented to user with distance traveled.</li>
                        <li><a href="https://github.com/F3stive-Ya/CarRacer">GitHub</a></li>
                    </ul>
                </div>
                <div className="project">
                    <h3>Password Maker</h3>
                    <ul>
                        <li>A Python program that generates random passwords based on input word</li>
                        <li>Adds randomly generated characters, integers, and special-characters resulting in an 8 character password</li>
                        <li><a href="https://github.com/F3stive-Ya/PasswordMaker">GitHub</a></li>
                    </ul>
                </div>
                <div className="project">
                    <h3>Common Factors Finder</h3>
                    <ul>
                        <li>A Python program that finds the common factors of two numbers</li>
                        <li><a href="https://github.com/F3stive-Ya/CommonFactors">GitHub</a></li>
                    </ul>
                </div>
            </>
        )
    },
    contact: {
        title: 'Contact',
        defaultStyle: { top: 120, left: 320, width: 360, height: 240 },
        content: (
            <>
                <p>Email: <a href="mailto:shanemborges@gmail.com">shanemborges@gmail.com</a></p>
                <p>LinkedIn: <a href="https://www.linkedin.com/in/shaneborges/" target="_blank" rel="noopener noreferrer">Shane Borges</a></p>
            </>
        )
    },
    mycomputer: {
        title: 'My Computer',
        defaultStyle: { top: 200, left: 150, width: 420, height: 340 },
        content: <MyComputerContent />
    },
    resume: {
        title: 'Resume',
        defaultStyle: { top: 170, left: 180, width: 760, height: 520 },
        content: (
            <div style={{ padding: 0, height: '100%' }}>
                <object data="resume.pdf" type="application/pdf" width="100%" height="100%">
                    <iframe src="resume.pdf" width="100%" height="100%" title="Resume PDF"></iframe>
                </object>
            </div>
        ),
        bodyStyle: { padding: 0 }
    },
    fileexplorer: {
        title: 'File Explorer',
        defaultStyle: { top: 80, left: 140, width: 600, height: 440 },
        // Content rendered dynamically to receive openWindow prop
        content: null,
        bodyStyle: { padding: 0 }
    },
    settings: {
        title: 'Settings',
        defaultStyle: { top: 130, left: 200, width: 400, height: 420 },
        content: <Settings />,
        bodyStyle: { padding: '12px' }
    },
    terminal: {
        title: 'Command Prompt',
        defaultStyle: { top: 100, left: 150, width: 680, height: 420 },
        // Content rendered dynamically to receive props
        content: null,
        bodyStyle: { padding: 0 }
    },
    notepad: {
        title: 'Notepad - Untitled',
        defaultStyle: { top: 120, left: 180, width: 500, height: 400 },
        content: <Notepad />,
        bodyStyle: { padding: 0 }
    },
    outlook: {
        title: 'Outlook Express',
        defaultStyle: { top: 90, left: 160, width: 560, height: 440 },
        content: <OutlookExpress />,
        bodyStyle: { padding: 0 }
    },
    paint: {
        title: 'Paint',
        defaultStyle: { top: 60, left: 100, width: 720, height: 540 },
        content: <Paint />,
        bodyStyle: { padding: 0 }
    }
}

// Icons configuration - imported from config to avoid circular dependencies
import { ICONS } from './config/icons'

// System states
const SYSTEM_STATE = {
    WAITING: 'waiting',    // Waiting for user to focus window
    BOOTING: 'booting',    // BIOS boot sequence
    LOGGING: 'logging',    // Login screen with startup sound
    RUNNING: 'running',    // Desktop is active
    SHUTDOWN: 'shutdown'   // Shutdown sequence
}

// Mobile detection component
const MobileMessage = () => (
    <div className="mobile-message">
        <div className="mobile-message-content">
            <div className="mobile-icon">🖥️</div>
            <h1>Desktop Only</h1>
            <p>Please open this site on Desktop for the full experience.</p>
        </div>
    </div>
)

function App() {
    const { addRecentProgram } = useRecentPrograms()
    const { playOpen, playClose, playMinimize, playClick, playError } = useSounds()

    const [runErrorDialog, setRunErrorDialog] = useState(null)

    // Mobile detection
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.innerWidth <= 768 ||
            ('ontouchstart' in window && window.innerWidth <= 1024)
    })

    // Listen for resize events to update mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(
                window.innerWidth <= 768 ||
                ('ontouchstart' in window && window.innerWidth <= 1024)
            )
        }
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // System boot state
    const [systemState, setSystemState] = useState(() => {
        // Check if we've already booted this session
        const hasBooted = sessionStorage.getItem('borgesOS-booted')
        return hasBooted ? SYSTEM_STATE.RUNNING : SYSTEM_STATE.WAITING
    })

    // Window state management
    const [windowStates, setWindowStates] = useState(() => {
        const initial = {}
        Object.keys(WINDOW_CONFIGS).forEach(id => {
            initial[id] = {
                isOpen: false,
                isMinimized: false,
                isMaximized: false,
                zIndex: 10,
                position: { ...WINDOW_CONFIGS[id].defaultStyle }
            }
        })
        // Add run window
        initial.run = {
            isOpen: false,
            isMinimized: false,
            isMaximized: false,
            zIndex: 10,
            position: { top: 220, left: 260, width: 420, height: 190 }
        }
        return initial
    })

    const [openWindows, setOpenWindows] = useState([])
    const [activeWindowId, setActiveWindowId] = useState(null)
    const [startMenuOpen, setStartMenuOpen] = useState(false)
    const [zCounter, setZCounter] = useState(20)
    const [runInput, setRunInput] = useState('')
    const [showBSOD, setShowBSOD] = useState(false)

    // Drag state
    const dragRef = useRef(null)
    const resizeRef = useRef(null)

    // Minimum window sizes
    const MIN_WIDTH = 200
    const MIN_HEIGHT = 150

    // Handle window focus to start boot sequence
    useEffect(() => {
        if (systemState !== SYSTEM_STATE.WAITING) return

        const handleFocus = () => {
            setSystemState(SYSTEM_STATE.BOOTING)
        }

        // If window is already focused, start booting
        if (document.hasFocus()) {
            setSystemState(SYSTEM_STATE.BOOTING)
        } else {
            window.addEventListener('focus', handleFocus)
        }

        return () => window.removeEventListener('focus', handleFocus)
    }, [systemState])

    // Handle boot completion
    const handleBootComplete = useCallback(() => {
        sessionStorage.setItem('borgesOS-booted', 'true')
        setSystemState(SYSTEM_STATE.RUNNING)
    }, [])

    // Handle shutdown completion
    const handleShutdownComplete = useCallback(() => {
        // Clear session and reload
        sessionStorage.removeItem('borgesOS-booted')
        sessionStorage.removeItem('borgesOS-resume-opened')
        localStorage.removeItem('win95-recent-programs')
        window.location.reload()
    }, [])

    // Bring window to front
    const bringToFront = useCallback((winId) => {
        setZCounter(prev => {
            const newZ = prev + 1
            setWindowStates(prevStates => ({
                ...prevStates,
                [winId]: { ...prevStates[winId], zIndex: newZ }
            }))
            return newZ
        })
        setActiveWindowId(winId)
    }, [])

    // Open window
    const openWindow = useCallback((winId) => {
        // Clear run input when opening run dialog
        if (winId === 'run') {
            setRunInput('')
        }

        // Track recently used programs (not run or settings)
        addRecentProgram(winId)

        // Play open sound
        playOpen()

        setWindowStates(prev => ({
            ...prev,
            [winId]: { ...prev[winId], isOpen: true, isMinimized: false }
        }))
        setOpenWindows(prev => prev.includes(winId) ? prev : [...prev, winId])
        bringToFront(winId)
    }, [bringToFront, addRecentProgram, playOpen])

    // Auto-open Resume after boot completes
    const hasOpenedResumeRef = useRef(false)
    useEffect(() => {
        if (systemState === SYSTEM_STATE.RUNNING && !hasOpenedResumeRef.current) {
            // Check if this is a fresh boot (not page refresh during same session)
            const isFirstBoot = !sessionStorage.getItem('borgesOS-resume-opened')
            if (isFirstBoot) {
                // Small delay for smooth transition from BIOS to desktop
                const timer = setTimeout(() => {
                    openWindow('resume')
                    sessionStorage.setItem('borgesOS-resume-opened', 'true')
                }, 300)
                hasOpenedResumeRef.current = true
                return () => clearTimeout(timer)
            }
        }
    }, [systemState, openWindow])

    // Close window
    const closeWindow = useCallback((winId) => {
        // Play close sound
        playClose()

        setWindowStates(prev => ({
            ...prev,
            [winId]: { ...prev[winId], isOpen: false, isMaximized: false, isMinimized: false }
        }))
        setOpenWindows(prev => prev.filter(id => id !== winId))
        setActiveWindowId(prev => {
            if (prev === winId) {
                const remaining = openWindows.filter(id => id !== winId)
                return remaining.length > 0 ? remaining[remaining.length - 1] : null
            }
            return prev
        })
    }, [openWindows, playClose])

    // Minimize window
    const minimizeWindow = useCallback((winId) => {
        playMinimize()
        setWindowStates(prev => ({
            ...prev,
            [winId]: { ...prev[winId], isMinimized: true }
        }))
        setActiveWindowId(prev => prev === winId ? null : prev)
    }, [playMinimize])

    // Toggle maximize
    const toggleMaximize = useCallback((winId) => {
        setWindowStates(prev => {
            const state = prev[winId]
            if (!state.isOpen || state.isMinimized) {
                return {
                    ...prev,
                    [winId]: { ...state, isOpen: true, isMinimized: false }
                }
            }
            return {
                ...prev,
                [winId]: { ...state, isMaximized: !state.isMaximized }
            }
        })
        bringToFront(winId)
    }, [bringToFront])

    // Taskbar click handler
    const handleTaskbarClick = useCallback((winId) => {
        const state = windowStates[winId]
        if (!state.isOpen || state.isMinimized) {
            openWindow(winId)
        } else if (activeWindowId === winId) {
            minimizeWindow(winId)
        } else {
            bringToFront(winId)
        }
    }, [windowStates, activeWindowId, openWindow, minimizeWindow, bringToFront])

    // Start menu handlers
    const toggleStartMenu = () => setStartMenuOpen(prev => !prev)
    const closeStartMenu = () => setStartMenuOpen(false)

    // Run dialog handlers
    const handleRunSubmit = (e) => {
        e.preventDefault()
        const cmd = runInput.trim().toLowerCase()
        if (!cmd) return

        const aliases = ['about', 'projects', 'contact', 'mycomputer', 'resume', 'run', 'settings']
        if (aliases.includes(cmd)) {
            openWindow(cmd)
            closeWindow('run')
            setRunInput('')
        } else if (cmd.startsWith('http://') || cmd.startsWith('https://')) {
            window.open(cmd, '_blank')
            closeWindow('run')
            setRunInput('')
        } else {
            playError()
            setRunErrorDialog({
                title: 'Run',
                message: `Cannot find file '${cmd}' (or one of its components). Make sure the path and filename are correct and that all required libraries are available.`,
                type: 'error'
            })
        }
    }

    // Start menu item click
    const handleStartItemClick = (action, openId) => {
        if (openId) openWindow(openId)
        if (action === 'run') openWindow('run')
        if (action === 'shutdown') {
            // Start shutdown sequence
            closeStartMenu()
            setSystemState(SYSTEM_STATE.SHUTDOWN)
            return
        }
        closeStartMenu()
    }

    // Drag handlers
    const handleMouseDown = useCallback((e, winId) => {
        const state = windowStates[winId]
        if (state.isMaximized) return

        bringToFront(winId)
        dragRef.current = {
            winId,
            startX: e.clientX,
            startY: e.clientY,
            startLeft: state.position.left,
            startTop: state.position.top
        }
        e.preventDefault()
    }, [windowStates, bringToFront])

    // Handle window resize start
    const handleResizeStart = useCallback((e, winId, direction) => {
        const state = windowStates[winId]
        if (!state || state.isMaximized) return

        bringToFront(winId)
        resizeRef.current = {
            winId,
            direction,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: state.position.width,
            startHeight: state.position.height,
            startLeft: state.position.left,
            startTop: state.position.top
        }
        e.preventDefault()
    }, [windowStates, bringToFront])

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Handle dragging
            if (dragRef.current) {
                const { winId, startX, startY, startLeft, startTop } = dragRef.current
                setWindowStates(prev => ({
                    ...prev,
                    [winId]: {
                        ...prev[winId],
                        position: {
                            ...prev[winId].position,
                            left: startLeft + (e.clientX - startX),
                            top: startTop + (e.clientY - startY)
                        }
                    }
                }))
            }

            // Handle resizing
            if (resizeRef.current) {
                const { winId, direction, startX, startY, startWidth, startHeight, startLeft, startTop } = resizeRef.current
                const deltaX = e.clientX - startX
                const deltaY = e.clientY - startY

                setWindowStates(prev => {
                    const newPosition = { ...prev[winId].position }

                    // Handle horizontal resize
                    if (direction.includes('e')) {
                        newPosition.width = Math.max(MIN_WIDTH, startWidth + deltaX)
                    }
                    if (direction.includes('w')) {
                        const newWidth = Math.max(MIN_WIDTH, startWidth - deltaX)
                        if (newWidth > MIN_WIDTH) {
                            newPosition.width = newWidth
                            newPosition.left = startLeft + deltaX
                        }
                    }

                    // Handle vertical resize
                    if (direction.includes('s')) {
                        newPosition.height = Math.max(MIN_HEIGHT, startHeight + deltaY)
                    }
                    if (direction.includes('n')) {
                        const newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY)
                        if (newHeight > MIN_HEIGHT) {
                            newPosition.height = newHeight
                            newPosition.top = startTop + deltaY
                        }
                    }

                    return {
                        ...prev,
                        [winId]: {
                            ...prev[winId],
                            position: newPosition
                        }
                    }
                })
            }
        }

        const handleMouseUp = () => {
            dragRef.current = null
            resizeRef.current = null
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    // Close start menu on outside click
    useEffect(() => {
        const handleClick = () => closeStartMenu()
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger shortcuts when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // Only allow Escape in input fields
                if (e.key === 'Escape') {
                    if (windowStates.run?.isOpen && !windowStates.run?.isMinimized) {
                        closeWindow('run')
                    }
                }
                return
            }

            // Ctrl + R: Open Run dialog
            if (e.ctrlKey && e.key.toLowerCase() === 'r') {
                e.preventDefault()
                openWindow('run')
                return
            }

            // Alt + F4: Close active window
            if (e.altKey && e.key === 'F4') {
                e.preventDefault()
                if (activeWindowId) {
                    closeWindow(activeWindowId)
                }
                return
            }

            // Escape: Close run window, start menu, or deselect active window
            if (e.key === 'Escape') {
                if (startMenuOpen) {
                    closeStartMenu()
                } else if (windowStates.run?.isOpen && !windowStates.run?.isMinimized) {
                    closeWindow('run')
                } else if (activeWindowId) {
                    minimizeWindow(activeWindowId)
                }
                return
            }

            // Ctrl + M: Minimize active window
            if (e.ctrlKey && e.key.toLowerCase() === 'm') {
                e.preventDefault()
                if (activeWindowId) {
                    minimizeWindow(activeWindowId)
                }
                return
            }

            // Ctrl + 1-6: Quick open windows
            if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
                e.preventDefault()
                const windowMap = {
                    '1': 'about',
                    '2': 'projects',
                    '3': 'contact',
                    '4': 'mycomputer',
                    '5': 'resume',
                    '6': 'settings'
                }
                const windowId = windowMap[e.key]
                if (windowId) {
                    openWindow(windowId)
                }
                return
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [windowStates.run, activeWindowId, startMenuOpen, closeWindow, openWindow, minimizeWindow, closeStartMenu])

    // Show mobile message on mobile devices
    if (isMobile) {
        return <MobileMessage />
    }

    // Show BIOS screen during boot or shutdown
    if (systemState === SYSTEM_STATE.WAITING) {
        return (
            <div className="bios-screen waiting-screen">
                <div className="bios-content">
                    <div className="bios-line">Click anywhere or focus window to start...</div>
                    <span className="bios-cursor visible">█</span>
                </div>
            </div>
        )
    }

    if (systemState === SYSTEM_STATE.BOOTING) {
        return <BiosScreen mode="boot" onComplete={() => setSystemState(SYSTEM_STATE.LOGGING)} />
    }

    if (systemState === SYSTEM_STATE.LOGGING) {
        return <LoginScreen onComplete={handleBootComplete} />
    }

    if (systemState === SYSTEM_STATE.SHUTDOWN) {
        return <BiosScreen mode="shutdown" onComplete={handleShutdownComplete} />
    }

    return (
        <>
            <Desktop
                icons={ICONS}
                onIconDoubleClick={openWindow}
                onContextMenuAction={(action) => {
                    if (action === 'properties') {
                        openWindow('settings')
                    }
                }}
            />

            {/* Regular windows */}
            {Object.entries(WINDOW_CONFIGS).map(([id, config]) => (
                <Window
                    key={id}
                    id={id}
                    title={config.title}
                    state={windowStates[id]}
                    isActive={activeWindowId === id}
                    onClose={() => closeWindow(id)}
                    onMinimize={() => minimizeWindow(id)}
                    onMaximize={() => toggleMaximize(id)}
                    onTitlebarMouseDown={(e) => handleMouseDown(e, id)}
                    onTitlebarDoubleClick={() => toggleMaximize(id)}
                    onWindowMouseDown={() => {
                        if (windowStates[id].isOpen && !windowStates[id].isMinimized) {
                            bringToFront(id)
                        }
                    }}
                    onResizeStart={(e, direction) => handleResizeStart(e, id, direction)}
                    bodyStyle={config.bodyStyle}
                >
                    {id === 'fileexplorer' ? (
                        <FileExplorer onOpenWindow={openWindow} />
                    ) : id === 'terminal' ? (
                        <Terminal openWindow={openWindow} triggerBSOD={() => setShowBSOD(true)} />
                    ) : (
                        config.content
                    )}
                </Window>
            ))}

            {/* Run window */}
            <Window
                id="run"
                title="Run"
                state={windowStates.run}
                isActive={activeWindowId === 'run'}
                onClose={() => closeWindow('run')}
                onMinimize={() => minimizeWindow('run')}
                onMaximize={() => toggleMaximize('run')}
                onTitlebarMouseDown={(e) => handleMouseDown(e, 'run')}
                onTitlebarDoubleClick={() => toggleMaximize('run')}
                onWindowMouseDown={() => {
                    if (windowStates.run?.isOpen && !windowStates.run?.isMinimized) {
                        bringToFront('run')
                    }
                }}
                onResizeStart={(e, direction) => handleResizeStart(e, 'run', direction)}
                className="run-window"
                hideMaximize
            >
                <div className="run-form-container">
                    Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
                </div>
                <form onSubmit={handleRunSubmit}>
                    <div className="run-input-row">
                        <label htmlFor="run-input">Open:</label>
                        <input
                            id="run-input"
                            type="text"
                            className="run-input"
                            value={runInput}
                            onChange={(e) => setRunInput(e.target.value)}
                            autoFocus={windowStates.run?.isOpen}
                        />
                    </div>
                    <div className="run-buttons">
                        <button type="submit" className="run-btn">OK</button>
                        <button type="button" className="run-btn" onClick={() => closeWindow('run')}>Cancel</button>
                    </div>
                </form>
            </Window>

            <Taskbar
                openWindows={openWindows}
                activeWindowId={activeWindowId}
                onTaskClick={handleTaskbarClick}
                onStartClick={(e) => {
                    e.stopPropagation()
                    toggleStartMenu()
                }}
            />

            <StartMenu
                isOpen={startMenuOpen}
                onItemClick={handleStartItemClick}
            />

            {/* Run Error Dialog */}
            {runErrorDialog && (
                <ErrorDialog
                    title={runErrorDialog.title}
                    message={runErrorDialog.message}
                    type={runErrorDialog.type}
                    onClose={() => setRunErrorDialog(null)}
                />
            )}

            {/* Clippy Assistant */}
            {systemState === SYSTEM_STATE.RUNNING && (
                <Clippy
                    onAction={openWindow}
                    onDismiss={() => { }}
                />
            )}

            {/* BSOD Easter Egg */}
            {showBSOD && (
                <BSOD onRecover={() => setShowBSOD(false)} />
            )}
        </>
    )
}

export default App
