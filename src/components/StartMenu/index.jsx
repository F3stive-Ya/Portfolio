import { useRef, useEffect } from 'react'
import { useRecentPrograms } from '../../context/RecentProgramsContext'
import styles from './StartMenu.module.css'

// Program labels for display
const PROGRAM_LABELS = {
    about: 'About Me',
    projects: 'Projects',
    contact: 'Contact',
    mycomputer: 'My Computer',
    resume: 'Resume',
    settings: 'Settings'
}

function StartMenu({ isOpen, onItemClick }) {
    const { recentPrograms } = useRecentPrograms()
    const menuRef = useRef(null)

    // Focus management
    useEffect(() => {
        if (isOpen && menuRef.current) {
            // Find first button to focus? 
            // Better to let user tab in or programmatically focus first item
            // preventing focus trap for now, just aria-hidden toggle
        }
    }, [isOpen])

    const handleClick = (e) => {
        e.stopPropagation()
        // Determine if click was on a button
        const button = e.target.closest('button')
        if (!button) return

        const openId = button.dataset.open
        const action = button.dataset.action

        if (action || openId) {
            onItemClick(action, openId)
        }
    }

    return (
        <div
            id="start-menu"
            ref={menuRef}
            className={`${styles.menu} ${isOpen ? styles.open : ''}`}
            aria-hidden={!isOpen}
            role="menu"
            onClick={handleClick}
        >
            <div className={styles.banner}>Borges OS</div>
            <div className={styles.items} role="group" aria-label="Programs">
                {/* Recently used programs (dynamic) */}
                {recentPrograms.length > 0 ? (
                    <>
                        <div className={styles.sectionLabel}>Recent</div>
                        {recentPrograms.map(programId => (
                            <button
                                key={programId}
                                className={styles.item}
                                data-open={programId}
                                role="menuitem"
                            >
                                {PROGRAM_LABELS[programId] || programId}
                            </button>
                        ))}
                        <div className={styles.separator}></div>
                    </>
                ) : (
                    <>
                        <button className={styles.item} data-open="about" role="menuitem">About Me</button>
                        <button className={styles.item} data-open="resume" role="menuitem">Resume</button>
                        <button className={styles.item} data-open="projects" role="menuitem">Projects</button>
                        <button className={styles.item} data-open="contact" role="menuitem">Contact</button>
                        <div className={styles.separator}></div>
                    </>
                )}

                {/* Fixed items */}
                <div className={styles.sectionLabel}>Programs</div>
                <button className={styles.item} data-open="fileexplorer" role="menuitem">📁 File Explorer</button>
                <button className={styles.item} data-open="terminal" role="menuitem">💻 Command Prompt</button>
                <button className={styles.item} data-open="notepad" role="menuitem">📝 Notepad</button>
                <button className={styles.item} data-open="paint" role="menuitem">🎨 Paint</button>
                <button className={styles.item} data-open="minesweeper" role="menuitem">💣 Minesweeper</button>
                <button className={styles.item} data-open="outlook" role="menuitem">📧 Outlook Express</button>
                <div className={styles.separator}></div>
                <button className={styles.item} data-open="settings" role="menuitem">⚙️ Settings</button>
                <button className={styles.item} data-action="run" role="menuitem">▶️ Run...</button>
                <button className={styles.item} data-action="shutdown" role="menuitem">🔴 Shut Down...</button>
            </div>
        </div>
    )
}

export default StartMenu
