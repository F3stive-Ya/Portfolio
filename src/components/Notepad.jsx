import { useState, useRef, useEffect } from 'react'

const Notepad = () => {
    const [content, setContent] = useState(() => {
        const saved = localStorage.getItem('win95-notepad-content')
        return (
            saved ||
            `Welcome to Notepad!
===================

This is Shane's Windows 95 Portfolio.

Feel free to take some notes here - they'll be saved automatically!

Try these keyboard shortcuts:
- Ctrl+A: Select all
- Ctrl+Z: Undo

Have fun exploring! 🖥️`
        )
    })

    const [wordWrap, setWordWrap] = useState(true)
    const [hasChanges, setHasChanges] = useState(false)
    const textAreaRef = useRef(null)

    // Auto-save to localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('win95-notepad-content', content)
            setHasChanges(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [content])

    const handleNew = () => {
        if (content && hasChanges) {
            if (!window.confirm('You have unsaved changes. Start a new document?')) {
                return
            }
        }
        setContent('')
        setHasChanges(false)
    }

    const handleChange = (e) => {
        setContent(e.target.value)
        setHasChanges(true)
    }

    // Calculate stats
    const lines = content.split('\n').length
    const chars = content.length
    const words = content.trim() ? content.trim().split(/\s+/).length : 0

    return (
        <div className="notepad-container">
            <div className="notepad-menubar">
                <div className="notepad-menu-item">
                    <span className="notepad-menu-label">File</span>
                    <div className="notepad-dropdown">
                        <button onClick={handleNew}>New</button>
                    </div>
                </div>
                <div className="notepad-menu-item">
                    <span className="notepad-menu-label">Edit</span>
                    <div className="notepad-dropdown">
                        <button onClick={() => document.execCommand('undo')}>Undo</button>
                        <button onClick={() => document.execCommand('selectAll')}>
                            Select All
                        </button>
                    </div>
                </div>
                <div className="notepad-menu-item">
                    <span className="notepad-menu-label">Format</span>
                    <div className="notepad-dropdown">
                        <button onClick={() => setWordWrap(!wordWrap)}>
                            {wordWrap ? '✓ ' : '  '}Word Wrap
                        </button>
                    </div>
                </div>
            </div>
            <textarea
                ref={textAreaRef}
                className="notepad-textarea"
                value={content}
                onChange={handleChange}
                wrap={wordWrap ? 'soft' : 'off'}
                spellCheck={false}
            />
            <div className="notepad-statusbar">
                <span>{hasChanges ? 'Modified' : 'Saved'}</span>
                <span>Ln {lines}, Col 1</span>
                <span>
                    {words} words, {chars} chars
                </span>
            </div>
        </div>
    )
}

export default Notepad
