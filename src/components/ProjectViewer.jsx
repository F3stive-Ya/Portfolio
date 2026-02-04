// Project data (matches IDs from FileExplorer)
const PROJECTS_DATA = {
    'dicegame': {
        name: 'Dice Game',
        description: 'Python program that simulates two dice being rolled. User can roll the dice as many times as they want and quit the game at any time.',
        tech: ['Python'],
        github: 'https://github.com/F3stive-Ya/DiceGame',
        icon: 'icons/dice-0.png'
    },
    'assemblycalculator': {
        name: 'Assembly Calculator',
        description: 'Assembly program that simulates a calculator. User can add, subtract, multiply, and divide two numbers.',
        tech: ['Assembly', 'x86'],
        github: 'https://github.com/F3stive-Ya/AssemblyCalculator',
        icon: 'icons/calculator_cool-0.png'
    },
    'carracer': {
        name: 'Car Racer',
        description: 'A Python program that simulates a car race. Randomly generated cars race against each other with winner presented to user.',
        tech: ['Python'],
        github: 'https://github.com/F3stive-Ya/CarRacer',
        icon: 'icons/racing_car-0.png'
    },
    'passwordmaker': {
        name: 'Password Maker',
        description: 'A Python program that generates random passwords based on input word. Adds randomly generated characters, integers, and special-characters.',
        tech: ['Python', 'Security'],
        github: 'https://github.com/F3stive-Ya/PasswordMaker',
        icon: 'icons/key_win-0.png'
    },
    'commonfactors': {
        name: 'Common Factors Finder',
        description: 'A Python program that finds the common factors of two numbers.',
        tech: ['Python', 'Math'],
        github: 'https://github.com/F3stive-Ya/CommonFactors',
        icon: 'icons/calculator-0.png'
    }
}

function ProjectViewer({ projectId }) {
    const project = PROJECTS_DATA[projectId]

    if (!project) {
        return (
            <div className="project-viewer">
                <div className="project-error">
                    <p>Project "{projectId}" not found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="project-viewer">
            <div className="project-header">
                <img
                    src={project.icon}
                    alt={project.name}
                    className="project-icon"
                    onError={(e) => { e.target.src = 'icons/application-0.png' }}
                />
                <div className="project-title-info">
                    <h2 className="project-name">{project.name}</h2>
                    <span className="project-type">{project.tech.join(' • ')}</span>
                </div>
            </div>

            <div className="project-content">
                <div className="project-section">
                    <h3>Description</h3>
                    <p>{project.description}</p>
                </div>

                <div className="project-section">
                    <h3>Technologies</h3>
                    <div className="project-tech-tags">
                        {project.tech.map((tech, i) => (
                            <span key={i} className="project-tech-tag">{tech}</span>
                        ))}
                    </div>
                </div>

                <div className="project-actions">
                    <button
                        className="project-btn primary"
                        onClick={() => window.open(project.github, '_blank')}
                    >
                        View on GitHub
                    </button>
                </div>
            </div>

            <div className="project-statusbar">
                <span>{project.tech.length} technologies</span>
                <span>|</span>
                <span>GitHub repository available</span>
            </div>
        </div>
    )
}

export default ProjectViewer
