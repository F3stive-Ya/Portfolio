function ErrorDialog({ title = 'Error', message, type = 'error', icon, buttons = ['OK'], onClose }) {
    // Support 'icon' prop as alias for 'type'
    const dialogType = icon || type

    const getIcon = () => {
        switch (dialogType) {
            case 'error': return '❌'
            case 'warning': return '⚠️'
            case 'info': return 'ℹ️'
            case 'question': return '❓'
            default: return '❌'
        }
    }

    const handleButtonClick = (button) => {
        if (typeof button === 'object' && button.onClick) {
            button.onClick()
        } else if (onClose) {
            onClose(button)
        }
    }

    return (
        <div className="error-dialog-overlay">
            <div className="error-dialog">
                <div className="error-dialog-titlebar">
                    <span>{title}</span>
                    <button className="titlebar-close" onClick={() => onClose && onClose()}>×</button>
                </div>
                <div className="error-dialog-content">
                    <div className="error-dialog-icon">
                        <span style={{ fontSize: '32px' }}>{getIcon()}</span>
                    </div>
                    <div className="error-dialog-message">
                        {message}
                    </div>
                </div>
                <div className="error-dialog-buttons">
                    {buttons.map((button, index) => {
                        const label = typeof button === 'object' ? button.label : button
                        const isPrimary = typeof button === 'object' && button.primary
                        return (
                            <button
                                key={index}
                                className={`error-dialog-btn ${isPrimary ? 'primary' : ''}`}
                                onClick={() => handleButtonClick(button)}
                                autoFocus={index === 0}
                                style={isPrimary ? { border: '2px solid #000' } : {}}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ErrorDialog
