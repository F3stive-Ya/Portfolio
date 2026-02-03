import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const RecentProgramsContext = createContext(null)

const MAX_RECENT = 5

// Programs that should appear in recent list (excludes system functions like run, settings)
const TRACKABLE_PROGRAMS = ['about', 'projects', 'contact', 'mycomputer', 'resume']

export function RecentProgramsProvider({ children }) {
    const [recentPrograms, setRecentPrograms] = useState(() => {
        const saved = localStorage.getItem('win95-recent-programs')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('win95-recent-programs', JSON.stringify(recentPrograms))
    }, [recentPrograms])

    const addRecentProgram = useCallback((programId) => {
        if (!TRACKABLE_PROGRAMS.includes(programId)) return

        setRecentPrograms(prev => {
            // Remove if already exists, then add to front
            const filtered = prev.filter(id => id !== programId)
            return [programId, ...filtered].slice(0, MAX_RECENT)
        })
    }, [])

    const clearRecentPrograms = useCallback(() => {
        setRecentPrograms([])
    }, [])

    return (
        <RecentProgramsContext.Provider value={{ recentPrograms, addRecentProgram, clearRecentPrograms }}>
            {children}
        </RecentProgramsContext.Provider>
    )
}

export function useRecentPrograms() {
    const context = useContext(RecentProgramsContext)
    if (!context) {
        throw new Error('useRecentPrograms must be used within a RecentProgramsProvider')
    }
    return context
}
