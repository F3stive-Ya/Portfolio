import { useState, useRef, useCallback } from 'react'
import DesktopIcon from './DesktopIcon'

// Icons that should be positioned in the top-right corner
const TOP_RIGHT_ICONS = ['settings', 'mycomputer']

function Desktop({ icons, onIconDoubleClick }) {
    // Split icons into main grid and top-right positioned
    const mainIcons = icons.filter(icon => !TOP_RIGHT_ICONS.includes(icon.id))
    const topRightIcons = icons.filter(icon => TOP_RIGHT_ICONS.includes(icon.id))

    // Selection box state
    const [selectionBox, setSelectionBox] = useState(null)
    const desktopRef = useRef(null)
    const isSelectingRef = useRef(false)
    const startPosRef = useRef({ x: 0, y: 0 })

    const handleMouseDown = useCallback((e) => {
        // Only start selection if clicking directly on desktop (not on icons)
        if (e.target.closest('.icon') || e.target.closest('.icon-area-right')) return

        const rect = desktopRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        startPosRef.current = { x, y }
        isSelectingRef.current = true
        setSelectionBox({ x, y, width: 0, height: 0 })
    }, [])

    const handleMouseMove = useCallback((e) => {
        if (!isSelectingRef.current || !desktopRef.current) return

        const rect = desktopRef.current.getBoundingClientRect()
        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top

        const startX = startPosRef.current.x
        const startY = startPosRef.current.y

        // Calculate box dimensions (handle negative dragging)
        const x = Math.min(startX, currentX)
        const y = Math.min(startY, currentY)
        const width = Math.abs(currentX - startX)
        const height = Math.abs(currentY - startY)

        setSelectionBox({ x, y, width, height })
    }, [])

    const handleMouseUp = useCallback(() => {
        isSelectingRef.current = false
        setSelectionBox(null)
    }, [])

    return (
        <div
            className="desktop"
            ref={desktopRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Main icon grid (left side) */}
            <div className="icon-area">
                {mainIcons.map(icon => (
                    <DesktopIcon
                        key={icon.id}
                        id={icon.id}
                        label={icon.label}
                        iconSrc={icon.icon}
                        onDoubleClick={() => onIconDoubleClick(icon.id)}
                    />
                ))}
            </div>

            {/* Top-right positioned icons */}
            <div className="icon-area-right">
                {topRightIcons.map(icon => (
                    <DesktopIcon
                        key={icon.id}
                        id={icon.id}
                        label={icon.label}
                        iconSrc={icon.icon}
                        onDoubleClick={() => onIconDoubleClick(icon.id)}
                    />
                ))}
            </div>

            {/* Selection box (cosmetic) */}
            {selectionBox && selectionBox.width > 5 && selectionBox.height > 5 && (
                <div
                    className="selection-box"
                    style={{
                        left: selectionBox.x,
                        top: selectionBox.y,
                        width: selectionBox.width,
                        height: selectionBox.height
                    }}
                />
            )}
        </div>
    )
}

export default Desktop
