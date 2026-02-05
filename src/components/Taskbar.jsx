import { useState, useEffect, useRef } from 'react'
import Tooltip from './Tooltip'
import Calendar from './Calendar'

function Taskbar({ openWindows, activeWindowId, onTaskClick, onStartClick }) {
    const [dateTime, setDateTime] = useState({ date: '', time: '' })
    const [showCalendar, setShowCalendar] = useState(false)
    const calendarRef = useRef(null)

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target) &&
                !event.target.closest('.tray-clock') &&
                !event.target.closest('.tray-date')
            ) {
                setShowCalendar(false)
            }
        }

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showCalendar])

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
        if (id === 'mycomputer') return 'My Computer'
        if (id === 'fileexplorer') return 'File Explorer'
        return id.charAt(0).toUpperCase() + id.slice(1)
    }

    return (
        <div className="taskbar">
            <button className="start-btn" onClick={onStartClick}>
                Start
            </button>
            <div className="task-buttons">
                {openWindows.map((id) => (
                    <Tooltip key={id} text={formatTitle(id)}>
                        <button
                            className={`task-btn${activeWindowId === id ? ' active' : ''}`}
                            onClick={() => onTaskClick(id)}
                        >
                            {formatTitle(id)}
                        </button>
                    </Tooltip>
                ))}
            </div>
            <div className="tray">
                {/* System tray icons */}
                <div className="tray-icons">
                    <Tooltip text="Volume">
                        <div className="tray-icon">🔊</div>
                    </Tooltip>
                    <Tooltip text="Network Connected">
                        <div className="tray-icon">🌐</div>
                    </Tooltip>
                    <Tooltip text="Security Active">
                        <div className="tray-icon">🛡️</div>
                    </Tooltip>
                </div>
                <Tooltip text={`${dateTime.date} ${dateTime.time}`}>
                    <div
                        className="tray-date"
                        onClick={() => setShowCalendar(!showCalendar)}
                        style={{ cursor: 'pointer' }}
                    >
                        {dateTime.date || '--'}
                    </div>
                </Tooltip>
                <div
                    className="tray-clock"
                    onClick={() => setShowCalendar(!showCalendar)}
                    style={{ cursor: 'pointer' }}
                >
                    {dateTime.time || '--:--'}
                </div>
            </div>

            {/* Calendar Popup */}
            {showCalendar && (
                <div className="calendar-popup" ref={calendarRef}>
                    <Calendar />
                </div>
            )}
        </div>
    )
}

export default Taskbar
