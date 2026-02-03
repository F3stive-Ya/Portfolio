import { useState, useEffect } from 'react'

function Taskbar({ openWindows, activeWindowId, onTaskClick, onStartClick }) {
    const [dateTime, setDateTime] = useState({ date: '', time: '' })

    // Update clock every second
    useEffect(() => {
        const updateClock = () => {
            const now = new Date()
            setDateTime({
                date: now.toLocaleDateString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }),
                time: now.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            })
        }

        updateClock()
        const interval = setInterval(updateClock, 1000)

        return () => clearInterval(interval)
    }, [])

    // Format window ID for display
    const formatTitle = (id) => {
        return id.charAt(0).toUpperCase() + id.slice(1)
    }

    return (
        <div className="taskbar">
            <button className="start-btn" onClick={onStartClick}>
                Start
            </button>
            <div className="task-buttons">
                {openWindows.map(id => (
                    <div
                        key={id}
                        className={`task-btn${activeWindowId === id ? ' active' : ''}`}
                        onClick={() => onTaskClick(id)}
                    >
                        {formatTitle(id)}
                    </div>
                ))}
            </div>
            <div className="tray">
                <div className="tray-date">{dateTime.date || '--'}</div>
                <div className="tray-clock">{dateTime.time || '--:--'}</div>
            </div>
        </div>
    )
}

export default Taskbar
