import { useEffect, useRef } from 'react'

function ContextMenu({ x, y, items, onClose }) {
    const menuRef = useRef(null)

    // Adjust position to stay within viewport
    useEffect(() => {
        if (!menuRef.current) return
        const rect = menuRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        let adjustedX = x
        let adjustedY = y

        if (x + rect.width > viewportWidth) {
            adjustedX = viewportWidth - rect.width - 8
        }
        if (y + rect.height > viewportHeight) {
            adjustedY = viewportHeight - rect.height - 8
        }

        menuRef.current.style.left = `${adjustedX}px`
        menuRef.current.style.top = `${adjustedY}px`
    }, [x, y])

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [onClose])

    const handleItemClick = (item) => {
        if (item.disabled) return

        // Execute the onClick handler if provided
        // The handler is responsible for closing the menu
        if (item.onClick) {
            item.onClick()
        }
    }

    return (
        <>
            {/* Invisible backdrop to catch outside clicks */}
            <div
                className="context-menu-backdrop"
                onClick={onClose}
                onContextMenu={(e) => { e.preventDefault(); onClose() }}
            />
            <div
                ref={menuRef}
                className="context-menu"
                style={{ left: x, top: y }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {items.map((item, index) => {
                    if (item.type === 'separator') {
                        return <div key={index} className="context-menu-separator" />
                    }
                    return (
                        <div
                            key={index}
                            className={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            {item.icon && (
                                <img src={item.icon} alt="" className="context-menu-icon" />
                            )}
                            {item.label}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default ContextMenu
