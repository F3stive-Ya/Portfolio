import { useState, useEffect, useCallback, useRef } from 'react'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import Window from './components/Window'
import StartMenu from './components/StartMenu'
import BiosScreen from './components/BiosScreen'
import FileExplorer from './components/FileExplorer'
import LoginScreen from './components/LoginScreen'
import ErrorDialog from './components/ErrorDialog'
import Terminal from './components/Terminal'
import ProjectViewer from './components/ProjectViewer'
import Minesweeper from './components/Minesweeper'
import BSOD from './components/BSOD'
import MobilePortfolio from './components/MobilePortfolio'

import { useSounds } from './hooks/useSounds'
import { useWindowManager } from './hooks/useWindowManager'
import { WINDOW_CONFIGS } from './config/windows'
import { ICONS } from './config/icons'

// System states
const SYSTEM_STATE = {
    WAITING: 'waiting', // Waiting for user to focus window
    BOOTING: 'booting', // BIOS boot sequence
    LOGGING: 'logging', // Login screen with startup sound
    RUNNING: 'running', // Desktop is active
    SHUTDOWN: 'shutdown' // Shutdown sequence
}



function App() {
    const { playError } = useSounds()
    const {
        windowStates,
        openWindows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        toggleMaximize,
        bringToFront,
        handleDragStart,
        handleResizeStart,
        handleContentResize
    } = useWindowManager()

    const [runErrorDialog, setRunErrorDialog] = useState(null)
    const [startMenuOpen, setStartMenuOpen] = useState(false)
    const [runInput, setRunInput] = useState('')
    const [showBSOD, setShowBSOD] = useState(false)

    // Mobile detection
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024)
    })

    // Listen for resize events to update mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(
                window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024)
            )
        }
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // System boot state
    const [systemState, setSystemState] = useState(() => {
        // Check if we've already booted this session
        const hasBooted = sessionStorage.getItem('borgesOS-booted')
        if (hasBooted) return SYSTEM_STATE.RUNNING

        // If window is already focused, start booting immediately
        if (typeof document !== 'undefined' && document.hasFocus()) {
            return SYSTEM_STATE.BOOTING
        }
        return SYSTEM_STATE.WAITING
    })

    // Handle window focus to start boot sequence
    useEffect(() => {
        if (systemState !== SYSTEM_STATE.WAITING) return

        const handleFocus = () => {
            setSystemState(SYSTEM_STATE.BOOTING)
        }

        window.addEventListener('focus', handleFocus)
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

    // Taskbar click handler
    const handleTaskbarClick = useCallback(
        (winId) => {
            const state = windowStates[winId]
            if (!state.isOpen || state.isMinimized) {
                openWindow(winId)
            } else if (activeWindowId === winId) {
                minimizeWindow(winId)
            } else {
                bringToFront(winId)
            }
        },
        [windowStates, activeWindowId, openWindow, minimizeWindow, bringToFront]
    )

    // Start menu handlers
    const toggleStartMenu = () => setStartMenuOpen((prev) => !prev)
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
                    // Also clear potentially stuck active state
                    if (activeWindowId === 'run') minimizeWindow('run')
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
                    1: 'about',
                    2: 'projects',
                    3: 'contact',
                    4: 'mycomputer',
                    5: 'resume',
                    6: 'settings'
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
    }, [
        windowStates.run,
        activeWindowId,
        startMenuOpen,
        closeWindow,
        openWindow,
        minimizeWindow,
        closeStartMenu
    ])

    // Show mobile portfolio on mobile devices
    if (isMobile) {
        return <MobilePortfolio />
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
                icons={ICONS.filter((icon) => icon.showOnDesktop !== false)}
                onIconDoubleClick={openWindow}
                onContextMenuAction={(action) => {
                    if (action === 'properties') {
                        openWindow('settings')
                    }
                    if (action === 'system_properties') {
                        openWindow('system_properties')
                    }
                }}
            />

            {/* Regular windows */}
            {Object.entries(WINDOW_CONFIGS).map(([id, config]) => (
                <Window
                    key={id}
                    id={id}
                    title={config.title}
                    icon={config.icon}
                    state={windowStates[id]}
                    isActive={activeWindowId === id}
                    onClose={() => closeWindow(id)}
                    onMinimize={() => minimizeWindow(id)}
                    onMaximize={() => toggleMaximize(id)}
                    onTitlebarMouseDown={(e) => handleDragStart(e, id)}
                    onTitlebarDoubleClick={() => toggleMaximize(id)}
                    onWindowMouseDown={() => {
                        if (windowStates[id].isOpen && !windowStates[id].isMinimized) {
                            bringToFront(id)
                        }
                    }}
                    onResizeStart={
                        config.resizable !== false
                            ? (e, direction) => handleResizeStart(e, id, direction)
                            : undefined
                    }
                    bodyStyle={config.bodyStyle}
                >
                    {id === 'fileexplorer' ? (
                        <FileExplorer onOpenWindow={openWindow} />
                    ) : id === 'terminal' ? (
                        <Terminal openWindow={openWindow} triggerBSOD={() => setShowBSOD(true)} />
                    ) : id === 'minesweeper' ? (
                        <Minesweeper
                            onResize={(w, h) => handleContentResize(id, w, h)}
                            onClose={() => closeWindow(id)}
                        />
                    ) : id.startsWith('project_') ? (
                        <ProjectViewer
                            projectId={id.replace('project_', '')}
                            isOpen={windowStates[id]?.isOpen}
                            onOpenWindow={openWindow}
                            onClose={() => closeWindow(id)}
                        />
                    ) : (
                        config.content
                    )}
                </Window>
            ))}

            {/* Run window */}
            <Window
                id="run"
                title="Run"
                icon="icons/file_program_group-0.png"
                state={windowStates.run}
                hideMaximize={true}
                isActive={activeWindowId === 'run'}
                onClose={() => closeWindow('run')}
                onMinimize={() => minimizeWindow('run')}
                onMaximize={() => toggleMaximize('run')}
                onTitlebarMouseDown={(e) => handleDragStart(e, 'run')}
                onTitlebarDoubleClick={() => toggleMaximize('run')}
                onWindowMouseDown={() => {
                    if (windowStates.run?.isOpen && !windowStates.run?.isMinimized) {
                        bringToFront('run')
                    }
                }}
                onResizeStart={(e, direction) => handleResizeStart(e, 'run', direction)}
                className="run-window"
                bodyStyle={{ padding: '14px' }}
            >
                <form onSubmit={handleRunSubmit} className="run-form">
                    <div className="run-top-section">
                        <img src="icons/file_program_group-0.png" alt="" className="run-dialog-icon" />
                        <div className="run-description">
                            <p>
                                Type the name of a program, folder, document, or Internet
                                resource, and Windows will open it for you.
                            </p>
                        </div>
                    </div>

                    <div className="run-input-section">
                        <label>Open:</label>
                        <div className="run-combobox">
                            <input
                                type="text"
                                value={runInput}
                                onChange={(e) => setRunInput(e.target.value)}
                                autoFocus
                                className="combobox-input"
                            />
                            <div className="combobox-button"><span>▼</span></div>
                        </div>
                    </div>

                    <div className="run-buttons">
                        <button type="submit" className="run-btn">OK</button>
                        <button type="button" className="run-btn" onClick={() => closeWindow('run')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Window>

            {/* BSOD */}
            {showBSOD && <BSOD onRestart={handleShutdownComplete} />}

            {/* Error Dialog */}
            {runErrorDialog && (
                <ErrorDialog
                    title={runErrorDialog.title}
                    message={runErrorDialog.message}
                    type={runErrorDialog.type}
                    onClose={() => setRunErrorDialog(null)}
                />
            )}

            {/* Taskbar */}
            <Taskbar
                openWindows={openWindows}
                activeWindowId={activeWindowId}
                onTaskClick={handleTaskbarClick}
                onStartClick={(e) => {
                    e.stopPropagation()
                    toggleStartMenu()
                }}
            />

            {/* Start Menu */}
            <StartMenu isOpen={startMenuOpen} onItemClick={handleStartItemClick} />
        </>
    )
}

export default App
