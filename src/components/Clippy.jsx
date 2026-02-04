import { useState, useEffect } from 'react'

const TIPS = [
    "It looks like you're trying to hire a developer. Would you like help?",
    "Tip: Open the Resume to learn more about Shane's experience!",
    "Did you know? You can type commands in the Run dialog (Ctrl+R).",
    "Try the Terminal! Type 'help' for a list of commands.",
    "Pro tip: Use the Settings to customize your theme colors!",
    "Looking for projects? Check out the Projects window!",
    "Want to get in touch? Open Outlook Express or use Contact!",
    "Fun fact: This portfolio was built with React and Vite!",
    "Drag windows around! You can also resize them from the corners.",
    "Double-click a titlebar to maximize a window!",
]

const Clippy = ({ onAction, onDismiss }) => {
    const [currentTip, setCurrentTip] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    // Check if Clippy should be permanently hidden
    useEffect(() => {
        const isHidden = localStorage.getItem('win95-clippy-hidden')
        if (isHidden) {
            return
        }

        // Show Clippy after a delay
        const showTimer = setTimeout(() => {
            setIsAnimating(true)
            setIsVisible(true)
        }, 5000)

        return () => clearTimeout(showTimer)
    }, [])

    // Rotate tips
    useEffect(() => {
        if (!isVisible) return

        const tipTimer = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % TIPS.length)
        }, 8000)

        return () => clearInterval(tipTimer)
    }, [isVisible])

    const handleDismiss = () => {
        setIsAnimating(true)
        setTimeout(() => {
            setIsVisible(false)
            if (onDismiss) onDismiss()
        }, 300)
    }

    const handleHideForever = () => {
        localStorage.setItem('win95-clippy-hidden', 'true')
        handleDismiss()
    }

    const handleNextTip = () => {
        setCurrentTip(prev => (prev + 1) % TIPS.length)
    }

    const handleOpenResume = () => {
        if (onAction) onAction('resume')
    }

    if (!isVisible) return null

    return (
        <div className={`clippy-container ${isAnimating ? 'clippy-animate' : ''}`}>
            <div className="clippy-bubble">
                <button className="clippy-close" onClick={handleDismiss} title="Dismiss">
                    ×
                </button>
                <p className="clippy-text">{TIPS[currentTip]}</p>
                <div className="clippy-buttons">
                    <button onClick={handleNextTip} className="clippy-btn">
                        Next Tip
                    </button>
                    <button onClick={handleOpenResume} className="clippy-btn clippy-btn-primary">
                        Open Resume
                    </button>
                </div>
                <button className="clippy-hide-forever" onClick={handleHideForever}>
                    Don't show again
                </button>
            </div>
            <div className="clippy-character">
                <img
                    src="icons/msagent-0.png"
                    alt="Clippy"
                    className="clippy-img"
                />
            </div>
        </div>
    )
}

export default Clippy
