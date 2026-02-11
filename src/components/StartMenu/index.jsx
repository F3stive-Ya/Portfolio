import { useRef, useEffect } from 'react'
import { useRecentPrograms } from '../../context/RecentProgramsContext'
import { ICONS } from '../../config/icons'
import { WINDOW_CONFIGS } from '../../config/windows'
import styles from './StartMenu.module.css'

// Derive label from ICONS or WINDOW_CONFIGS (single source of truth)
const getLabel = (id) => ICONS.find((i) => i.id === id)?.label || WINDOW_CONFIGS[id]?.title || id

// Pre-filter icon categories
const favoriteIcons = ICONS.filter((i) => i.category === 'favorites')
const gameIcons = ICONS.filter((i) => i.category === 'games')

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
                        {recentPrograms.map((programId) => (
                            <button
                                key={programId}
                                className={styles.item}
                                data-open={programId}
                                role="menuitem"
                            >
                                {getLabel(programId)}
                            </button>
                        ))}
                        <div className={styles.separator}></div>
                    </>
                ) : (
                    <>
                        <button className={styles.item} data-open="about" role="menuitem">
                            About Me
                        </button>
                        <button className={styles.item} data-open="resume" role="menuitem">
                            Resume
                        </button>
                        <button className={styles.item} data-open="projects" role="menuitem">
                            Projects
                        </button>
                        <button className={styles.item} data-open="contact" role="menuitem">
                            Contact
                        </button>
                        <div className={styles.separator}></div>
                    </>
                )}

                {/* Favorites — dynamically generated from ICONS config */}
                <div className={styles.sectionLabel}>Favorites</div>
                {favoriteIcons.map((icon) => (
                    <button
                        key={icon.id}
                        className={styles.item}
                        data-open={icon.id}
                        role="menuitem"
                    >
                        {icon.emoji} {icon.label}
                    </button>
                ))}

                {/* Games — dynamically generated from ICONS config */}
                <div className={styles.sectionLabel}>Games</div>
                {gameIcons.map((icon) => (
                    <button
                        key={icon.id}
                        className={styles.item}
                        data-open={icon.id}
                        role="menuitem"
                    >
                        {icon.emoji} {icon.label}
                    </button>
                ))}
                <div className={styles.separator}></div>
                <button className={styles.item} data-open="settings" role="menuitem">
                    ⚙️ Settings
                </button>
                <button className={styles.item} data-action="run" role="menuitem">
                    ▶️ Run...
                </button>
                <button className={styles.item} data-action="shutdown" role="menuitem">
                    🔴 Shut Down...
                </button>
            </div>
        </div>
    )
}

export default StartMenu
