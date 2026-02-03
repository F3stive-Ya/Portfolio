import { useState, useEffect } from 'react'

// Get base path for sounds (dev vs prod)
const getBasePath = () => {
    if (window.location.pathname.includes('/Portfolio')) {
        return '/Portfolio'
    }
    return ''
}

function LoginScreen({ onComplete }) {
    const [phase, setPhase] = useState('welcome') // welcome, logging, complete
    const [progress, setProgress] = useState(0)
    const [audioPlayed, setAudioPlayed] = useState(false)

    // Play startup sound when component mounts
    useEffect(() => {
        if (!audioPlayed) {
            const basePath = getBasePath()
            const audio = new Audio(`${basePath}/sounds/startup.wav`)
            audio.volume = 0.5
            audio.play().catch(() => { })
            setAudioPlayed(true)
        }
    }, [audioPlayed])

    // Progress animation - runs for about 4 seconds (100 steps at 40ms = 4s)
    useEffect(() => {
        if (phase === 'logging') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setPhase('complete')
                        return 100
                    }
                    return prev + 1
                })
            }, 40) // 100 steps * 40ms = 4 seconds
            return () => clearInterval(interval)
        }
    }, [phase])

    // Welcome phase - show for 1.5 seconds
    useEffect(() => {
        if (phase === 'welcome') {
            const timer = setTimeout(() => setPhase('logging'), 1500)
            return () => clearTimeout(timer)
        }
    }, [phase])

    // Complete phase - show for 0.5 seconds then transition
    // Total: 1.5s welcome + 4s logging + 0.5s complete = 6 seconds (matches startup.wav)
    useEffect(() => {
        if (phase === 'complete') {
            const timer = setTimeout(() => {
                if (onComplete) onComplete()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [phase, onComplete])

    return (
        <div className="login-screen">
            <div className="login-box">
                <div className="login-header">
                    <img src="icons/computer.svg" alt="" className="login-logo" />
                    <h2>BorgesOS</h2>
                </div>

                {phase === 'welcome' && (
                    <div className="login-content">
                        <p className="login-welcome">Welcome</p>
                    </div>
                )}

                {phase === 'logging' && (
                    <div className="login-content">
                        <p className="login-status">Logging on...</p>
                        <div className="login-progress">
                            <div
                                className="login-progress-bar"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {phase === 'complete' && (
                    <div className="login-content">
                        <p className="login-status">Loading personal settings...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LoginScreen
