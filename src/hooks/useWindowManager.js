import { useState, useCallback, useRef, useEffect } from 'react'
import { WINDOW_CONFIGS } from '../config/windows'
import { useRecentPrograms } from '../context/RecentProgramsContext'
import { useSounds } from './useSounds'

// Minimum window sizes
const MIN_WIDTH = 200
const MIN_HEIGHT = 150

export function useWindowManager() {
    const { addRecentProgram } = useRecentPrograms()
    const { playOpen, playClose, playMinimize } = useSounds()

    // Window states
    const [windowStates, setWindowStates] = useState(() => {
        const initial = {}
        Object.keys(WINDOW_CONFIGS).forEach((id) => {
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
    const [, setZCounter] = useState(20)

    // Drag state
    const dragRef = useRef(null)
    const resizeRef = useRef(null)

    // Bring window to front
    const bringToFront = useCallback((winId) => {
        setZCounter((prev) => {
            const newZ = prev + 1
            setWindowStates((prevStates) => ({
                ...prevStates,
                [winId]: { ...prevStates[winId], zIndex: newZ }
            }))
            return newZ
        })
        setActiveWindowId(winId)
    }, [])

    // Open window
    const openWindow = useCallback(
        (winId) => {
            // Track recently used programs (not run or system dialogs usually, handled by addRecentProgram logic inside hook or context)
            // Note: The original App.jsx logic called addRecentProgram(winId)
            addRecentProgram(winId)

            // Play open sound
            playOpen()

            setWindowStates((prev) => ({
                ...prev,
                [winId]: { ...prev[winId], isOpen: true, isMinimized: false }
            }))
            setOpenWindows((prev) => (prev.includes(winId) ? prev : [...prev, winId]))
            bringToFront(winId)
        },
        [bringToFront, addRecentProgram, playOpen]
    )

    // Close window
    const closeWindow = useCallback(
        (winId) => {
            playClose()
            setWindowStates((prev) => ({
                ...prev,
                [winId]: { ...prev[winId], isOpen: false, isMaximized: false, isMinimized: false }
            }))
            setOpenWindows((prev) => prev.filter((id) => id !== winId))
            setActiveWindowId((prev) => {
                if (prev === winId) {
                    const remaining = openWindows.filter((id) => id !== winId)
                    return remaining.length > 0 ? remaining[remaining.length - 1] : null
                }
                return prev
            })
        },
        [openWindows, playClose]
    )

    // Minimize window
    const minimizeWindow = useCallback(
        (winId) => {
            playMinimize()
            setWindowStates((prev) => ({
                ...prev,
                [winId]: { ...prev[winId], isMinimized: true }
            }))
            setActiveWindowId((prev) => (prev === winId ? null : prev))
        },
        [playMinimize]
    )

    // Toggle maximize
    const toggleMaximize = useCallback(
        (winId) => {
            setWindowStates((prev) => {
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
        },
        [bringToFront]
    )

    // Handlers for drag/resize to be used by Windows
    const handleDragStart = useCallback(
        (e, winId) => {
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
        },
        [windowStates, bringToFront]
    )

    const handleResizeStart = useCallback(
        (e, winId, direction) => {
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
        },
        [windowStates, bringToFront]
    )

    // Global mouse listeners for drag/resize
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Handle dragging
            if (dragRef.current) {
                const { winId, startX, startY, startLeft, startTop } = dragRef.current
                setWindowStates((prev) => ({
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
                const {
                    winId,
                    direction,
                    startX,
                    startY,
                    startWidth,
                    startHeight,
                    startLeft,
                    startTop
                } = resizeRef.current
                const deltaX = e.clientX - startX
                const deltaY = e.clientY - startY

                setWindowStates((prev) => {
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

    const handleContentResize = useCallback((id, width, height) => {
        setWindowStates((prev) => {
            if (prev[id]?.position?.width === width && prev[id]?.position?.height === height) {
                return prev
            }
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    position: { ...prev[id].position, width, height }
                }
            }
        })
    }, [])

    return {
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
        handleContentResize,
        setWindowStates // Exposed if needed for edge cases
    }
}
