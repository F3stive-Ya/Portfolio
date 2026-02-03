import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const defaultTheme = {
    titlebarStart: '#000080',
    titlebarEnd: '#1084d0',
    taskbarStart: '#d4d0c8',
    taskbarEnd: '#a8a0a0',
    buttonBg: '#c0c0c0',
    activeTaskBtn: '#000000',
    startBtnStart: '#000080',
    startBtnEnd: '#1084d0',
    accentColor: '#000080'
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('win95-theme')
        return saved ? JSON.parse(saved) : defaultTheme
    })

    useEffect(() => {
        localStorage.setItem('win95-theme', JSON.stringify(theme))

        // Apply CSS custom properties
        const root = document.documentElement
        root.style.setProperty('--titlebar-start', theme.titlebarStart)
        root.style.setProperty('--titlebar-end', theme.titlebarEnd)
        root.style.setProperty('--taskbar-start', theme.taskbarStart)
        root.style.setProperty('--taskbar-end', theme.taskbarEnd)
        root.style.setProperty('--button-bg', theme.buttonBg)
        root.style.setProperty('--active-task-btn', theme.activeTaskBtn)
        root.style.setProperty('--start-btn-start', theme.startBtnStart)
        root.style.setProperty('--start-btn-end', theme.startBtnEnd)
        root.style.setProperty('--accent-color', theme.accentColor)
    }, [theme])

    const updateTheme = (key, value) => {
        setTheme(prev => ({ ...prev, [key]: value }))
    }

    const resetTheme = () => {
        setTheme(defaultTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, defaultTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
