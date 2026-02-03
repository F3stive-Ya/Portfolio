import { useState, useEffect, useCallback } from 'react'

// System hardware info (shared with My Computer window)
export const SYSTEM_INFO = {
    cpu: 'Quantum Core @ 4.2 GHz',
    ram: '32768 MB',
    hdd: '2 TB SSD',
    gpu: 'HyperGraphics 9000'
}

// BIOS text lines to display progressively
const BOOT_SEQUENCE = [
    { text: 'BorgesOS BIOS v1.0', delay: 0 },
    { text: 'Copyright (C) 2026 Shane Borges', delay: 200 },
    { text: '', delay: 300 },
    { text: 'Initializing system...', delay: 400 },
    { text: 'Detecting hardware...', delay: 700 },
    { text: `  CPU: ${SYSTEM_INFO.cpu} ... OK`, delay: 900 },
    { text: `  RAM: ${SYSTEM_INFO.ram} ... OK`, delay: 1100 },
    { text: `  HDD: ${SYSTEM_INFO.hdd} ... OK`, delay: 1300 },
    { text: `  GPU: ${SYSTEM_INFO.gpu} ... OK`, delay: 1500 },
    { text: '', delay: 1600 },
    { text: 'Loading BorgesOS...', delay: 1800 },
    { text: '', delay: 2200 },
    { text: 'Press any key to continue...', delay: 2500 },
]

const SHUTDOWN_SEQUENCE = [
    { text: 'Shutting down BorgesOS...', delay: 0 },
    { text: '', delay: 200 },
    { text: 'Saving user settings...', delay: 400 },
    { text: 'Closing applications...', delay: 700 },
    { text: 'Unmounting drives...', delay: 1000 },
    { text: '', delay: 1200 },
    { text: 'It is now safe to restart your computer.', delay: 1400 },
    { text: '', delay: 1600 },
    { text: 'Press any key to restart...', delay: 1800 },
]

function BiosScreen({ mode, onComplete }) {
    const [visibleLines, setVisibleLines] = useState([])
    const [showCursor, setShowCursor] = useState(true)
    const [waitingForInput, setWaitingForInput] = useState(false)

    const sequence = mode === 'boot' ? BOOT_SEQUENCE : SHUTDOWN_SEQUENCE
    const lastMessageDelay = sequence[sequence.length - 1].delay

    useEffect(() => {
        // Show lines progressively
        const timers = sequence.map((line, index) => {
            return setTimeout(() => {
                setVisibleLines(prev => [...prev, line.text])
            }, line.delay)
        })

        // After last message, wait for user input
        const waitTimer = setTimeout(() => {
            setWaitingForInput(true)
        }, lastMessageDelay + 200)

        // Cursor blink
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev)
        }, 500)

        return () => {
            timers.forEach(t => clearTimeout(t))
            clearTimeout(waitTimer)
            clearInterval(cursorInterval)
        }
    }, [mode, lastMessageDelay])

    // Listen for any key or click to continue
    useEffect(() => {
        if (!waitingForInput) return

        const handleInput = () => {
            if (onComplete) onComplete()
        }

        document.addEventListener('keydown', handleInput)
        document.addEventListener('click', handleInput)

        return () => {
            document.removeEventListener('keydown', handleInput)
            document.removeEventListener('click', handleInput)
        }
    }, [waitingForInput, onComplete])

    return (
        <div className="bios-screen">
            <div className="bios-content">
                {visibleLines.map((line, index) => (
                    <div key={index} className="bios-line">
                        {line || '\u00A0'}
                    </div>
                ))}
                <span className={`bios-cursor ${showCursor ? 'visible' : ''}`}>█</span>
            </div>
        </div>
    )
}

export default BiosScreen
