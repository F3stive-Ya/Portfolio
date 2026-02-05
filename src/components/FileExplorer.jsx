import { useState, useRef, useEffect, useCallback } from 'react'
import { ICONS } from '../config/icons'

// Generate Desktop children from ICONS array (only those shown on desktop)
const generateDesktopChildren = () => {
    const children = {}
    ICONS.filter((icon) => icon.showOnDesktop !== false).forEach((icon) => {
        children[icon.label] = {
            type:
                icon.id === 'fileexplorer' || icon.id === 'mycomputer' || icon.id === 'settings'
                    ? 'shortcut'
                    : 'file',
            name: icon.label,
            icon: icon.icon,
            windowId: icon.id
        }
    })
    return children
}

// File system structure mimicking Windows 95
const FILE_SYSTEM = {
    'C:': {
        type: 'drive',
        name: 'Local Disk (C:)',
        icon: 'icons/hard_disk_drive-0.png',
        children: {
            Desktop: {
                type: 'folder',
                name: 'Desktop',
                icon: 'icons/directory_closed_cool-0.png',
                children: generateDesktopChildren()
            },
            Documents: {
                type: 'folder',
                name: 'My Documents',
                icon: 'icons/directory_closed_cool-0.png',
                children: {
                    'Resume.pdf': {
                        type: 'file',
                        name: 'Resume',
                        icon: 'icons/write_file-0.png',
                        windowId: 'resume'
                    }
                }
            },
            Projects: {
                type: 'folder',
                name: 'Projects',
                icon: 'icons/directory_closed_cool-0.png',
                children: {
                    Python: {
                        type: 'folder',
                        name: 'Python',
                        icon: 'icons/directory_closed_cool-0.png',
                        children: {
                            DiceGame: {
                                type: 'project',
                                name: 'Dice Game',
                                id: 'dice-game',
                                icon: 'icons/game_solitaire-0.png'
                            },
                            CarRacer: {
                                type: 'project',
                                name: 'Car Racer',
                                id: 'car-racer',
                                icon: 'icons/joystick-0.png'
                            },
                            PasswordMaker: {
                                type: 'project',
                                name: 'Password Maker',
                                id: 'password-maker',
                                icon: 'icons/key_win-0.png'
                            },
                            CommonFactors: {
                                type: 'project',
                                name: 'Common Factors',
                                id: 'common-factors',
                                icon: 'icons/calculator-0.png'
                            }
                        }
                    },
                    Assembly: {
                        type: 'folder',
                        name: 'Assembly',
                        icon: 'icons/directory_closed_cool-0.png',
                        children: {
                            Calculator: {
                                type: 'project',
                                name: 'Assembly Calculator',
                                id: 'assembly-calculator',
                                icon: 'icons/processor-0.png'
                            }
                        }
                    }
                }
            },
            Games: {
                type: 'folder',
                name: 'Games',
                icon: 'icons/directory_closed_cool-0.png',
                children: {
                    Minesweeper: {
                        type: 'file',
                        name: 'Minesweeper',
                        icon: 'icons/mine_game-0.png',
                        windowId: 'minesweeper'
                    },
                    FreeCell: {
                        type: 'file',
                        name: 'FreeCell',
                        icon: 'icons/game_solitaire-0.png',
                        windowId: 'freecell'
                    },
                    Pinball: {
                        type: 'file',
                        name: 'Pinball',
                        icon: 'icons/pinball-0.png',
                        windowId: 'pinball'
                    }
                }
            }
        }
    }
}

function TreeItem({
    item,
    path,
    level = 0,
    selectedPath,
    onSelect,
    expandedPaths,
    onToggle,
    onDoubleClick
}) {
    const isFolder = item.type === 'folder' || item.type === 'drive'
    const fullPath = path
    const isExpanded = expandedPaths.includes(fullPath)
    const isSelected = selectedPath === fullPath

    const handleClick = () => {
        if (isFolder) {
            onToggle(fullPath)
        }
        onSelect(fullPath, item)
    }

    const handleDoubleClick = () => {
        if (onDoubleClick) {
            onDoubleClick(fullPath, item)
        }
    }

    return (
        <div>
            <div
                className={`tree-item ${isSelected ? 'selected' : ''}`}
                style={{ paddingLeft: `${8 + level * 16}px` }}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
            >
                {isFolder && <span className="tree-item-toggle">{isExpanded ? '▼' : '▶'}</span>}
                <img
                    src={
                        isFolder && isExpanded && item.icon === 'icons/directory_closed_cool-0.png'
                            ? 'icons/directory_open_cool-0.png'
                            : item.icon || 'icons/directory_closed_cool-0.png'
                    }
                    alt=""
                    className="tree-item-icon"
                />
                <span style={{ marginLeft: 4 }}>{item.name}</span>
            </div>
            {isFolder && isExpanded && item.children && (
                <div className="tree-children">
                    {Object.entries(item.children).map(([key, child]) => (
                        <TreeItem
                            key={key}
                            item={child}
                            path={`${fullPath}\\${key}`}
                            level={level + 1}
                            selectedPath={selectedPath}
                            onSelect={onSelect}
                            expandedPaths={expandedPaths}
                            onToggle={onToggle}
                            onDoubleClick={onDoubleClick}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

function FileItem({ item, itemKey, onDoubleClick }) {
    return (
        <div className="file-item" onDoubleClick={() => onDoubleClick(item, itemKey)}>
            <img
                src={item.icon || 'icons/directory_closed_cool-0.png'}
                alt=""
                className="file-item-icon"
            />
            <span className="file-item-name">{item.name}</span>
        </div>
    )
}

function FileExplorer({ onOpenWindow }) {
    const [currentPath, setCurrentPath] = useState('C:\\Desktop')
    const [selectedPath, setSelectedPath] = useState('C:\\Desktop')
    const [expandedPaths, setExpandedPaths] = useState([
        'C:',
        'C:\\Projects',
        'C:\\Projects\\Python'
    ])
    const [history, setHistory] = useState(['C:\\Desktop'])
    const [historyIndex, setHistoryIndex] = useState(0)
    const [addressInput, setAddressInput] = useState('C:\\Desktop')
    const [sidebarWidth, setSidebarWidth] = useState(180)

    const sidebarRef = useRef(null)
    const isResizing = useRef(false)

    // Sidebar resize handler
    const handleResizeMouseDown = useCallback((e) => {
        e.preventDefault()
        isResizing.current = true
        document.body.style.cursor = 'ew-resize'
        document.body.style.userSelect = 'none'
    }, [])

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing.current || !sidebarRef.current) return
            const sidebarRect = sidebarRef.current.getBoundingClientRect()
            const newWidth = e.clientX - sidebarRect.left
            if (newWidth >= 100 && newWidth <= 400) {
                setSidebarWidth(newWidth)
            }
        }

        const handleMouseUp = () => {
            isResizing.current = false
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const toggleExpand = (path) => {
        setExpandedPaths((prev) =>
            prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
        )
    }

    // Get item at a specific path (moved up for use in navigation)
    const getItemAtPath = (path) => {
        const parts = path.split('\\').filter((p) => p)
        let current = FILE_SYSTEM[parts[0]]
        for (let i = 1; i < parts.length && current; i++) {
            current = current.children?.[parts[i]]
        }
        return current
    }

    const navigateTo = (path, item) => {
        if (item?.type === 'folder' || item?.type === 'drive') {
            setCurrentPath(path)
            setAddressInput(path)
            // Add to history
            const newHistory = history.slice(0, historyIndex + 1)
            newHistory.push(path)
            setHistory(newHistory)
            setHistoryIndex(newHistory.length - 1)
        }
        setSelectedPath(path)
    }

    // Handle address bar Enter key
    const handleAddressKeyDown = (e) => {
        if (e.key === 'Enter') {
            const item = getItemAtPath(addressInput)
            if (item && (item.type === 'folder' || item.type === 'drive')) {
                navigateTo(addressInput, item)
                // Expand path in tree
                const parts = addressInput.split('\\')
                const pathsToExpand = []
                for (let i = 1; i <= parts.length; i++) {
                    pathsToExpand.push(parts.slice(0, i).join('\\'))
                }
                setExpandedPaths((prev) => [...new Set([...prev, ...pathsToExpand])])
            }
        }
    }

    // Handle tree item double-click
    const handleTreeDoubleClick = (path, item) => {
        if (item.type === 'folder' || item.type === 'drive') {
            navigateTo(path, item)
        } else if (item.type === 'project' && item.id && onOpenWindow) {
            // Open project in project viewer window
            onOpenWindow(`project_${item.id.replace(/-/g, '')}`)
        } else if (item.windowId && onOpenWindow) {
            onOpenWindow(item.windowId)
        }
    }

    const goBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1)
            setCurrentPath(history[historyIndex - 1])
            setSelectedPath(history[historyIndex - 1])
        }
    }

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1)
            setCurrentPath(history[historyIndex + 1])
            setSelectedPath(history[historyIndex + 1])
        }
    }

    const goUp = () => {
        const parts = currentPath.split('\\')
        if (parts.length > 1) {
            const parentPath = parts.slice(0, -1).join('\\') || 'C:'
            const parentItem = getItemAtPath(parentPath)
            navigateTo(parentPath, parentItem)
        }
    }

    const currentItem = getItemAtPath(currentPath)
    const currentChildren = currentItem?.children || {}

    const handleItemDoubleClick = (item, key) => {
        const newPath = `${currentPath}\\${key}`

        if (item.type === 'folder') {
            navigateTo(newPath, item)
            if (!expandedPaths.includes(newPath)) {
                setExpandedPaths([...expandedPaths, newPath])
            }
        } else if (item.windowId && onOpenWindow) {
            onOpenWindow(item.windowId)
        } else if (item.type === 'project' && onOpenWindow) {
            // Open project wizard window - normalize ID (remove hyphens)
            const normalizedId = item.id.replace(/-/g, '')
            onOpenWindow('project_' + normalizedId)
        }
    }

    // Check if selected item is a project

    return (
        <div className="file-explorer">
            <div className="file-explorer-toolbar">
                <button
                    className="file-explorer-toolbar-btn"
                    onClick={goBack}
                    disabled={historyIndex === 0}
                    title="Back"
                >
                    ←
                </button>
                <button
                    className="file-explorer-toolbar-btn"
                    onClick={goForward}
                    disabled={historyIndex >= history.length - 1}
                    title="Forward"
                >
                    →
                </button>
                <button
                    className="file-explorer-toolbar-btn"
                    onClick={goUp}
                    disabled={currentPath === 'C:'}
                    title="Up One Level"
                >
                    ↑
                </button>
            </div>
            <div className="file-explorer-address">
                <span>Address:</span>
                <input
                    type="text"
                    className="file-explorer-address-input"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    onKeyDown={handleAddressKeyDown}
                    onBlur={() => setAddressInput(currentPath)}
                />
                <button
                    className="file-explorer-toolbar-btn"
                    onClick={() => {
                        const item = getItemAtPath(addressInput)
                        if (item && (item.type === 'folder' || item.type === 'drive')) {
                            navigateTo(addressInput, item)
                        }
                    }}
                    title="Go"
                >
                    →
                </button>
            </div>
            <div className="file-explorer-main">
                <div
                    className="file-explorer-sidebar"
                    ref={sidebarRef}
                    style={{ width: sidebarWidth }}
                >
                    {Object.entries(FILE_SYSTEM).map(([key, item]) => (
                        <TreeItem
                            key={key}
                            item={item}
                            path={key}
                            selectedPath={selectedPath}
                            onSelect={navigateTo}
                            expandedPaths={expandedPaths}
                            onToggle={toggleExpand}
                            onDoubleClick={handleTreeDoubleClick}
                        />
                    ))}
                    <div
                        className="file-explorer-resize-handle"
                        onMouseDown={handleResizeMouseDown}
                    />
                </div>
                <div className="file-explorer-content">
                    <div className="file-grid">
                        {Object.entries(currentChildren).map(([key, item]) => (
                            <FileItem
                                key={key}
                                item={item}
                                itemKey={key}
                                onDoubleClick={handleItemDoubleClick}
                            />
                        ))}
                        {Object.keys(currentChildren).length === 0 && (
                            <div style={{ padding: 20, color: '#808080' }}>
                                This folder is empty.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="file-explorer-status">
                {Object.keys(currentChildren).length} object(s)
            </div>
        </div>
    )
}

export default FileExplorer
