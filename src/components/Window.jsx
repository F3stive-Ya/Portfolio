function Window({
    id,
    title,
    state,
    isActive,
    onClose,
    onMinimize,
    onMaximize,
    onTitlebarMouseDown,
    onTitlebarDoubleClick,
    onWindowMouseDown,
    onResizeStart,
    children,
    bodyStyle = {},
    className = '',
    hideMaximize = false
}) {
    if (!state) return null

    const { isOpen, isMinimized, isMaximized, zIndex, position } = state

    // Determine visibility
    const isVisible = isOpen && !isMinimized

    const windowStyle = {
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        zIndex
    }

    const windowClasses = [
        'window',
        isVisible ? 'visible' : '',
        isMaximized ? 'maximized' : '',
        isActive ? 'active' : '',
        className
    ]
        .filter(Boolean)
        .join(' ')

    // Handle control button clicks
    const handleControlClick = (e, action) => {
        e.stopPropagation()
        action()
    }

    // Handle titlebar mouse down (for dragging)
    const handleTitlebarMouseDown = (e) => {
        if (e.target.closest('.window-controls')) return
        onTitlebarMouseDown(e)
    }

    // Handle titlebar double click (for maximize toggle)
    const handleTitlebarDoubleClick = (e) => {
        if (e.target.closest('.window-controls')) return
        onTitlebarDoubleClick()
    }

    // Handle resize start
    const handleResizeMouseDown = (e, direction) => {
        e.preventDefault()
        e.stopPropagation()
        if (onResizeStart) {
            onResizeStart(e, direction)
        }
    }

    return (
        <div
            id={`window-${id}`}
            className={windowClasses}
            style={windowStyle}
            onMouseDown={onWindowMouseDown}
        >
            {/* Resize handles (only when not maximized) */}
            {!isMaximized && onResizeStart && (
                <>
                    <div
                        className="resize-handle resize-handle-n"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
                    />
                    <div
                        className="resize-handle resize-handle-s"
                        onMouseDown={(e) => handleResizeMouseDown(e, 's')}
                    />
                    <div
                        className="resize-handle resize-handle-e"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
                    />
                    <div
                        className="resize-handle resize-handle-w"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
                    />
                    <div
                        className="resize-handle resize-handle-ne"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
                    />
                    <div
                        className="resize-handle resize-handle-nw"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
                    />
                    <div
                        className="resize-handle resize-handle-se"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
                    />
                    <div
                        className="resize-handle resize-handle-sw"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
                    />
                </>
            )}
            <div
                className="titlebar"
                onMouseDown={handleTitlebarMouseDown}
                onDoubleClick={handleTitlebarDoubleClick}
            >
                <div className="title">{title}</div>
                <div className="window-controls">
                    <div
                        className="btn minimize"
                        title="Minimize"
                        onClick={(e) => handleControlClick(e, onMinimize)}
                    />
                    {!hideMaximize && (
                        <div
                            className="btn maximize"
                            title="Maximize"
                            onClick={(e) => handleControlClick(e, onMaximize)}
                        />
                    )}
                    <div
                        className="btn close"
                        title="Close"
                        onClick={(e) => handleControlClick(e, onClose)}
                    />
                </div>
            </div>
            <div className="window-body" style={bodyStyle}>
                {children}
            </div>
        </div>
    )
}

export default Window
