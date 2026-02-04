import { useState, useRef, useCallback, useEffect } from 'react'
import DesktopIcon from './DesktopIcon'
import ContextMenu from './ContextMenu'
import Tooltip from './Tooltip'
import ErrorDialog from './ErrorDialog'

// Icons that should be positioned in the top-right corner by default
const TOP_RIGHT_ICONS = ['settings', 'mycomputer']

// Grid cell size for snapping
const GRID_SIZE = 100
const GRID_ROWS = 6

// Default grid positions for icons
const getDefaultPositions = (icons) => {
    const positions = {}
    let leftIndex = 0
    let rightIndex = 0

    icons.forEach(icon => {
        if (TOP_RIGHT_ICONS.includes(icon.id)) {
            positions[icon.id] = {
                x: window.innerWidth - 100,
                y: 20 + rightIndex * 90
            }
            rightIndex++
        } else {
            const col = Math.floor(leftIndex / GRID_ROWS)
            const row = leftIndex % GRID_ROWS
            positions[icon.id] = {
                x: 20 + col * GRID_SIZE,
                y: 20 + row * 90
            }
            leftIndex++
        }
    })

    return positions
}

// Snap to grid utility
const snapToGrid = (x, y) => ({
    x: Math.round(x / GRID_SIZE) * GRID_SIZE + 20,
    y: Math.round(y / 90) * 90 + 20
})

// Icon properties data - simplified
const getIconProperties = (icon) => ({
    name: icon.label,
    path: `C:\\Desktop\\${icon.label}`,
    owner: 'Shane Borges'
})

function Desktop({ icons, onIconDoubleClick, onContextMenuAction }) {
    // Icon positions with localStorage persistence
    const [iconPositions, setIconPositions] = useState(() => {
        const saved = localStorage.getItem('desktop-icon-positions')
        if (saved) {
            try {
                return JSON.parse(saved)
            } catch {
                return getDefaultPositions(icons)
            }
        }
        return getDefaultPositions(icons)
    })

    // Selected icons
    const [selectedIcons, setSelectedIcons] = useState(new Set())

    // Save positions to localStorage when they change
    useEffect(() => {
        localStorage.setItem('desktop-icon-positions', JSON.stringify(iconPositions))
    }, [iconPositions])

    // Handle window resize - reposition right-aligned icons
    useEffect(() => {
        const handleResize = () => {
            setIconPositions(prev => {
                const newPositions = { ...prev }
                let rightIndex = 0
                icons.forEach(icon => {
                    if (TOP_RIGHT_ICONS.includes(icon.id)) {
                        newPositions[icon.id] = {
                            x: window.innerWidth - 100,
                            y: 20 + rightIndex * 90
                        }
                        rightIndex++
                    }
                })
                return newPositions
            })
        }

        window.addEventListener('resize', handleResize)
        // Also trigger on mount to ensure correct positioning
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [icons])

    // Dragging state
    const [draggingIcon, setDraggingIcon] = useState(null)
    const dragStartPos = useRef({ x: 0, y: 0 })
    const dragStartIconPos = useRef({ x: 0, y: 0 })

    // Selection box state
    const [selectionBox, setSelectionBox] = useState(null)
    const desktopRef = useRef(null)
    const isSelectingRef = useRef(false)
    const startPosRef = useRef({ x: 0, y: 0 })

    // Context menu state
    const [contextMenu, setContextMenu] = useState(null)
    const [iconContextMenu, setIconContextMenu] = useState(null)

    // Properties dialog
    const [propertiesDialog, setPropertiesDialog] = useState(null)

    // Handle icon drag start
    const handleIconMouseDown = useCallback((e, iconId) => {
        if (e.button !== 0) return // Only left click

        e.stopPropagation()

        // Select this icon if not already selected
        if (!selectedIcons.has(iconId)) {
            setSelectedIcons(new Set([iconId]))
        }

        const iconPos = iconPositions[iconId] || { x: 0, y: 0 }
        dragStartPos.current = { x: e.clientX, y: e.clientY }
        dragStartIconPos.current = { x: iconPos.x, y: iconPos.y }
        setDraggingIcon(iconId)
    }, [iconPositions, selectedIcons])

    // Handle icon right-click
    const handleIconContextMenu = useCallback((e, icon) => {
        e.preventDefault()
        e.stopPropagation()

        setSelectedIcons(new Set([icon.id]))
        setContextMenu(null)
        setIconContextMenu({
            x: e.clientX,
            y: e.clientY,
            icon
        })
    }, [])

    // Handle mouse move for icon dragging or selection
    const handleMouseMove = useCallback((e) => {
        // Handle icon dragging
        if (draggingIcon) {
            const deltaX = e.clientX - dragStartPos.current.x
            const deltaY = e.clientY - dragStartPos.current.y

            const newX = Math.max(0, Math.min(window.innerWidth - 80, dragStartIconPos.current.x + deltaX))
            const newY = Math.max(0, Math.min(window.innerHeight - 120, dragStartIconPos.current.y + deltaY))

            setIconPositions(prev => ({
                ...prev,
                [draggingIcon]: { x: newX, y: newY }
            }))
            return
        }

        // Handle selection box and determine which icons are inside
        if (!isSelectingRef.current || !desktopRef.current) return

        const rect = desktopRef.current.getBoundingClientRect()
        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top

        const startX = startPosRef.current.x
        const startY = startPosRef.current.y

        const x = Math.min(startX, currentX)
        const y = Math.min(startY, currentY)
        const width = Math.abs(currentX - startX)
        const height = Math.abs(currentY - startY)

        setSelectionBox({ x, y, width, height })

        // Determine which icons are inside the selection box
        if (width > 5 && height > 5) {
            const newSelected = new Set()
            icons.forEach(icon => {
                const pos = iconPositions[icon.id]
                if (pos) {
                    const iconCenterX = pos.x + 48
                    const iconCenterY = pos.y + 46
                    if (iconCenterX >= x && iconCenterX <= x + width &&
                        iconCenterY >= y && iconCenterY <= y + height) {
                        newSelected.add(icon.id)
                    }
                }
            })
            setSelectedIcons(newSelected)
        }
    }, [draggingIcon, icons, iconPositions])

    // Handle mouse up - snap to grid
    const handleMouseUp = useCallback(() => {
        if (draggingIcon) {
            // Snap to grid on release
            const currentPos = iconPositions[draggingIcon]
            if (currentPos) {
                const snapped = snapToGrid(currentPos.x, currentPos.y)
                setIconPositions(prev => ({
                    ...prev,
                    [draggingIcon]: snapped
                }))
            }
        }
        setDraggingIcon(null)
        isSelectingRef.current = false
        setSelectionBox(null)
    }, [draggingIcon, iconPositions])

    // Handle desktop mouse down (for selection box)
    const handleDesktopMouseDown = useCallback((e) => {
        if (contextMenu) setContextMenu(null)
        if (iconContextMenu) setIconContextMenu(null)

        // Deselect all icons if clicking on desktop background
        if (!e.target.closest('.icon')) {
            setSelectedIcons(new Set())
        }

        // Don't start selection if clicking on an icon
        if (e.target.closest('.icon-wrapper')) return

        const rect = desktopRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        startPosRef.current = { x, y }
        isSelectingRef.current = true
        setSelectionBox({ x, y, width: 0, height: 0 })
    }, [contextMenu, iconContextMenu])

    const handleDesktopContextMenu = useCallback((e) => {
        e.preventDefault()

        // Only show desktop context menu if not clicking on an icon
        if (e.target.closest('.icon-wrapper')) return

        setIconContextMenu(null)
        setContextMenu({
            x: e.clientX,
            y: e.clientY
        })
    }, [])

    // Arrange icons in default grid
    const arrangeIcons = useCallback(() => {
        const newPositions = getDefaultPositions(icons)
        setIconPositions(newPositions)
        setContextMenu(null)
    }, [icons])

    // Line up icons - snap all to nearest grid position
    const lineUpIcons = useCallback(() => {
        const newPositions = {}
        icons.forEach(icon => {
            const pos = iconPositions[icon.id]
            if (pos) {
                newPositions[icon.id] = snapToGrid(pos.x, pos.y)
            }
        })
        setIconPositions(newPositions)
        setContextMenu(null)
    }, [icons, iconPositions])

    const desktopMenuItems = [
        { label: 'Refresh', onClick: () => window.location.reload() },
        { type: 'separator' },
        { label: 'New Folder', disabled: true },
        { label: 'New Shortcut', disabled: true },
        { type: 'separator' },
        { label: 'Arrange Icons', onClick: arrangeIcons },
        { label: 'Line up Icons', onClick: lineUpIcons },
        { type: 'separator' },
        { label: 'Properties', onClick: () => { setContextMenu(null); onContextMenuAction?.('properties') } }
    ]

    const getIconMenuItems = (icon) => [
        { label: 'Open', onClick: () => { setIconContextMenu(null); onIconDoubleClick(icon.id) } },
        { type: 'separator' },
        { label: 'Cut', disabled: true },
        { label: 'Copy', disabled: true },
        { type: 'separator' },
        { label: 'Create Shortcut', disabled: true },
        { label: 'Delete', disabled: true },
        { label: 'Rename', disabled: true },
        { type: 'separator' },
        {
            label: 'Properties', onClick: () => {
                setIconContextMenu(null)
                setPropertiesDialog(getIconProperties(icon))
            }
        }
    ]

    // Ensure all icons have positions
    useEffect(() => {
        const newPositions = { ...iconPositions }
        let updated = false
        icons.forEach(icon => {
            if (!newPositions[icon.id]) {
                const defaults = getDefaultPositions(icons)
                newPositions[icon.id] = defaults[icon.id]
                updated = true
            }
        })
        if (updated) {
            setIconPositions(newPositions)
        }
    }, [icons])

    return (
        <div
            className="desktop"
            ref={desktopRef}
            onMouseDown={handleDesktopMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleDesktopContextMenu}
        >
            {/* Free-positioned icons */}
            {icons.map(icon => {
                const pos = iconPositions[icon.id] || { x: 0, y: 0 }
                const isSelected = selectedIcons.has(icon.id)
                return (
                    <Tooltip key={icon.id} text={icon.label}>
                        <div
                            className={`icon-wrapper ${draggingIcon === icon.id ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
                            style={{
                                position: 'absolute',
                                left: pos.x,
                                top: pos.y,
                                zIndex: draggingIcon === icon.id ? 1000 : 1
                            }}
                            onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
                            onContextMenu={(e) => handleIconContextMenu(e, icon)}
                        >
                            <DesktopIcon
                                id={icon.id}
                                label={icon.label}
                                iconSrc={icon.icon}
                                onDoubleClick={() => onIconDoubleClick(icon.id)}
                                isSelected={isSelected}
                            />
                        </div>
                    </Tooltip>
                )
            })}

            {/* Selection box */}
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

            {/* Desktop context menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={desktopMenuItems}
                    onClose={() => setContextMenu(null)}
                />
            )}

            {/* Icon context menu */}
            {iconContextMenu && (
                <ContextMenu
                    x={iconContextMenu.x}
                    y={iconContextMenu.y}
                    items={getIconMenuItems(iconContextMenu.icon)}
                    onClose={() => setIconContextMenu(null)}
                />
            )}

            {/* Properties dialog */}
            {propertiesDialog && (
                <ErrorDialog
                    title={`${propertiesDialog.name} Properties`}
                    message={
                        <div style={{ textAlign: 'left', fontSize: '11px', lineHeight: '1.8' }}>
                            <p><strong>File Name:</strong> {propertiesDialog.name}</p>
                            <p><strong>Path:</strong> {propertiesDialog.path}</p>
                            <p><strong>Owner:</strong> {propertiesDialog.owner}</p>
                        </div>
                    }
                    icon="info"
                    buttons={[
                        { label: 'OK', onClick: () => setPropertiesDialog(null), primary: true }
                    ]}
                    onClose={() => setPropertiesDialog(null)}
                />
            )}
        </div>
    )
}

export default Desktop
