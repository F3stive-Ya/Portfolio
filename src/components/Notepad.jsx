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
    const [fileName, setFileName] = useState('Untitled.txt')
    const [cursorCol, setCursorCol] = useState(1)
    const textAreaRef = useRef(null)
    const fileInputRef = useRef(null)

    // Auto-save to localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('win95-notepad-content', content)
            setHasChanges(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [content])

    const updateCursorStats = () => {
        if (textAreaRef.current) {
            const { selectionStart, value } = textAreaRef.current
            const lastNewLine = value.lastIndexOf('\n', selectionStart - 1)
            const col = selectionStart - lastNewLine
            setCursorCol(col)
        }
    }

    const handleNew = () => {
        if (content && hasChanges) {
            if (!window.confirm('You have unsaved changes. Start a new document?')) {
                return
            }
        }
        setContent('')
        setFileName('Untitled.txt')
        setHasChanges(false)
    }

    const handleOpenClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileLoad = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            setContent(event.target.result)
            setFileName(file.name)
            setHasChanges(false)
        }
        reader.readAsText(file)

        // Reset input to allow re-selecting same file
        e.target.value = ''
    }

    const downloadFile = (name) => {
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleSave = () => {
        downloadFile(fileName)
    }

    const handleSaveAs = () => {
        const name = prompt('Save As:', fileName)
        if (name) {
            setFileName(name)
            downloadFile(name)
        }
    }

    const handleChange = (e) => {
        setContent(e.target.value)
        setHasChanges(true)
        updateCursorStats()
    }

    // Calculate stats
    const lines = content.split('\n').length
    const chars = content.length
    const words = content.trim() ? content.trim().split(/\s+/).length : 0

    return (
        <div className="notepad-container">
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".txt,.md,.js,.json,.css,.html"
                onChange={handleFileLoad}
            />
            <div className="notepad-menubar">
                <div className="notepad-menu-item">
                    <span className="notepad-menu-label">File</span>
                    <div className="notepad-dropdown">
                        <button onClick={handleNew}>New</button>
                        <button onClick={handleOpenClick}>Open...</button>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleSaveAs}>Save As...</button>
                    </div>
                </div>
                <div className="notepad-menu-item">
                    <span className="notepad-menu-label">Edit</span>
                    <div className="notepad-dropdown">
                        <button onClick={() => document.execCommand('undo')}>Undo</button>
                        <button
                            onClick={() => {
                                textAreaRef.current?.select()
                                document.execCommand('selectAll')
                            }}
                        >
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
                onKeyUp={updateCursorStats}
                onClick={updateCursorStats}
                wrap={wordWrap ? 'soft' : 'off'}
                spellCheck={false}
            />
            <div className="notepad-statusbar">
                <span>{hasChanges ? 'Modified' : 'Saved'}</span>
                <span>
                    Ln {lines}, Col {cursorCol}
                </span>
                <span>
                    {words} words, {chars} chars
                </span>
            </div>
        </div>
    )
}

export default Notepad
