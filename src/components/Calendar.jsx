import { useState, useEffect } from 'react'
import '../index.css'

function Calendar() {
    const [date, setDate] = useState(new Date())
    const [displayDate, setDisplayDate] = useState(new Date())

    useEffect(() => {
        // Update current date every minute to keep "today" accurate
        const interval = setInterval(() => {
            setDate(new Date())
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    const prevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1))
    }

    const currentYear = displayDate.getFullYear()
    const currentMonth = displayDate.getMonth()
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

    const weeks = []
    let days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        days.push(null)
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
    }

    // Fill the last week with empty cells
    while (days.length % 7 !== 0) {
        days.push(null)
    }

    // Split into weeks
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7))
    }

    const isToday = (day) => {
        return (
            day === date.getDate() &&
            currentMonth === date.getMonth() &&
            currentYear === date.getFullYear()
        )
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="calendar-month-year">
                    {monthNames[currentMonth]} {currentYear}
                </div>
                <div className="calendar-nav">
                    <button onClick={prevMonth}>▲</button>
                    <button onClick={nextMonth}>▼</button>
                </div>
            </div>
            <table className="calendar-grid">
                <thead>
                    <tr>
                        <th>S</th>
                        <th>M</th>
                        <th>T</th>
                        <th>W</th>
                        <th>T</th>
                        <th>F</th>
                        <th>S</th>
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week, i) => (
                        <tr key={i}>
                            {week.map((day, j) => (
                                <td key={j} className={day ? (isToday(day) ? 'today' : '') : 'empty'}>
                                    {day}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="calendar-footer">
                Today: {date.toLocaleDateString()}
            </div>
        </div>
    )
}

export default Calendar
