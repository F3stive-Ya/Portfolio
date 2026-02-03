import { useRecentPrograms } from '../context/RecentProgramsContext'

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

    const handleClick = (e) => {
        e.stopPropagation()
        const item = e.target.closest('.start-item')
        if (!item) return

        const openId = item.dataset.open
        const action = item.dataset.action

        onItemClick(action, openId)
    }

    return (
        <div
            id="start-menu"
            className={`start-menu${isOpen ? ' open' : ''}`}
            aria-hidden={!isOpen}
            onClick={handleClick}
        >
            <div className="start-banner">Borges OS</div>
            <div className="start-items">
                {/* Recently used programs (dynamic) */}
                {recentPrograms.length > 0 ? (
                    <>
                        <div className="start-section-label">Recent</div>
                        {recentPrograms.map(programId => (
                            <div
                                key={programId}
                                className="start-item"
                                data-open={programId}
                            >
                                {PROGRAM_LABELS[programId] || programId}
                            </div>
                        ))}
                        <div className="start-sep"></div>
                    </>
                ) : (
                    <>
                        <div className="start-item" data-open="about">About Me</div>
                        <div className="start-item" data-open="resume">Resume</div>
                        <div className="start-item" data-open="projects">Projects</div>
                        <div className="start-item" data-open="contact">Contact</div>
                        <div className="start-sep"></div>
                    </>
                )}

                {/* Fixed items */}
                <div className="start-item" data-open="settings">Settings</div>
                <div className="start-item" data-action="run">Run...</div>
                <div className="start-item" data-action="shutdown">Shut Down...</div>
            </div>
        </div>
    )
}

export default StartMenu
