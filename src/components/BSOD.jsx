import { useEffect, useCallback } from 'react'

const BSOD = ({ onRecover }) => {
    const handleRecover = useCallback(() => {
        if (onRecover) onRecover()
    }, [onRecover])

    // Auto-recover after 5 seconds or on any key press
    useEffect(() => {
        const timer = setTimeout(handleRecover, 5000)

        const handleKeyPress = () => handleRecover()
        const handleClick = () => handleRecover()

        document.addEventListener('keydown', handleKeyPress)
        document.addEventListener('click', handleClick)

        return () => {
            clearTimeout(timer)
            document.removeEventListener('keydown', handleKeyPress)
            document.removeEventListener('click', handleClick)
        }
    }, [handleRecover])

    return (
        <div className="bsod-screen">
            <div className="bsod-content">
                <p className="bsod-title">Windows</p>
                <br />
                <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +</p>
                <p>00010E36. The current application will be terminated.</p>
                <br />
                <p>* Press any key to terminate the current application.</p>
                <p>* Press CTRL+ALT+DEL again to restart your computer. You will</p>
                <p> lose any unsaved information in all applications.</p>
                <br />
                <br />
                <p className="bsod-centered">Press any key to continue _</p>
                <br />
                <br />
                <p className="bsod-easter-egg">
                    (Just kidding! This is an easter egg. Shane's portfolio is working fine! 😄)
                </p>
            </div>
        </div>
    )
}

export default BSOD
