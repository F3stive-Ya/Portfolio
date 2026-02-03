import { useCallback, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

// Sound URLs - works in both dev and production
const getBasePath = () => {
    if (window.location.pathname.includes('/Portfolio')) {
        return '/Portfolio'
    }
    return ''
}

const SOUNDS = {
    startup: 'sounds/startup.wav',
    click: 'sounds/DING.WAV',
    error: 'sounds/CHORD.WAV',
    close: 'sounds/Exit.wav',
    open: 'sounds/DING.WAV',
    minimize: 'sounds/minimize.wav',
    chime: 'sounds/CHIMES.WAV'
}

export function useSounds() {
    const { soundEnabled } = useTheme()
    const audioRef = useRef({})

    const playSound = useCallback((soundName, volume = 0.3) => {
        if (!soundEnabled) return

        const basePath = getBasePath()
        const soundPath = `${basePath}/${SOUNDS[soundName]}`

        // Get or create audio element
        if (!audioRef.current[soundName]) {
            audioRef.current[soundName] = new Audio(soundPath)
        }

        const audio = audioRef.current[soundName]
        audio.volume = volume

        // Reset and play
        audio.currentTime = 0
        audio.play().catch(() => {
            // Ignore autoplay errors
        })
    }, [soundEnabled])

    // Force play startup (bypasses soundEnabled check for first play)
    const forcePlayStartup = useCallback(() => {
        const basePath = getBasePath()
        const audio = new Audio(`${basePath}/${SOUNDS.startup}`)
        audio.volume = 0.5
        audio.play().catch(() => { })
        return audio
    }, [])

    return {
        playClick: useCallback(() => playSound('click', 0.2), [playSound]),
        playError: useCallback(() => playSound('error', 0.4), [playSound]),
        playOpen: useCallback(() => playSound('open', 0.2), [playSound]),
        playClose: useCallback(() => playSound('close', 1.0), [playSound]),
        playMinimize: useCallback(() => playSound('minimize', 0.4), [playSound]),
        playChime: useCallback(() => playSound('chime', 0.3), [playSound]),
        playStartup: useCallback(() => playSound('startup', 0.5), [playSound]),
        forcePlayStartup
    }
}

export default useSounds
