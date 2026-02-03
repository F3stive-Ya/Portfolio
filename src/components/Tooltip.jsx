import { useState, useEffect, useRef } from 'react'

function Tooltip({ text, children, delay = 500 }) {
    const [isVisible, setIsVisible] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const timeoutRef = useRef(null)
    const tooltipRef = useRef(null)

    const handleMouseMove = (e) => {
        // Position tooltip near cursor
        setPosition({ x: e.clientX + 15, y: e.clientY + 15 })
    }

    const handleMouseEnter = (e) => {
        setPosition({ x: e.clientX + 15, y: e.clientY + 15 })
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true)
        }, delay)
    }

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsVisible(false)
    }

    // Adjust position to keep tooltip in viewport
    useEffect(() => {
        if (isVisible && tooltipRef.current) {
            const rect = tooltipRef.current.getBoundingClientRect()
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight

            let newX = position.x
            let newY = position.y

            // Adjust if too close to right edge
            if (newX + rect.width > viewportWidth - 10) {
                newX = viewportWidth - rect.width - 10
            }

            // Adjust if too close to bottom edge
            if (newY + rect.height > viewportHeight - 10) {
                newY = position.y - rect.height - 20
            }

            if (newX !== position.x || newY !== position.y) {
                setPosition({ x: newX, y: newY })
            }
        }
    }, [isVisible, position])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{ display: 'inline-block' }}
        >
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className="win95-tooltip"
                    style={{
                        position: 'fixed',
                        left: position.x,
                        top: position.y,
                        zIndex: 99999
                    }}
                >
                    {text}
                </div>
            )}
        </div>
    )
}

export default Tooltip
