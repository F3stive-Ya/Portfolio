function DesktopIcon({ id, label, iconSrc, onDoubleClick, isSelected }) {
    const handleDragStart = (e) => {
        e.preventDefault()
    }

    return (
        <div
            className={`icon ${isSelected ? 'selected' : ''}`}
            data-window={id}
            draggable="false"
            onDragStart={handleDragStart}
            onDoubleClick={onDoubleClick}
        >
            <div className="icon-inner">
                <img className="icon-img" src={iconSrc} alt="" />
            </div>
            <div className="icon-label">{label}</div>
        </div>
    )
}

export default DesktopIcon
