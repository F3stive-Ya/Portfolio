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
        className
    ].filter(Boolean).join(' ')

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

    return (
        <div
            id={`window-${id}`}
            className={windowClasses}
            style={windowStyle}
            onMouseDown={onWindowMouseDown}
        >
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
