import { PROJECTS } from '../config/icons'

function ProjectViewer({ projectId, onOpenWindow }) {
    const project = PROJECTS.find(p => p.id === projectId)

    if (!project) {
        return (
            <div className="project-viewer">
                <div className="project-error">
                    <p>Project not found.</p>
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
                    <span className="project-type">{project.type}</span>
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
                        <img src="icons/github.png" alt="" className="btn-icon" onError={(e) => { e.target.style.display = 'none' }} />
                        View on GitHub
                    </button>
                </div>
            </div>

            <div className="project-statusbar">
                <span>Type: {project.type}</span>
                <span>|</span>
                <span>{project.tech.length} technologies</span>
            </div>
        </div>
    )
}

export default ProjectViewer
