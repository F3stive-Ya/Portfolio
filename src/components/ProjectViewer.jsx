import { useState, useEffect, useRef } from 'react'

const PROJECTS_DATA = {
    'dicegame': {
        name: 'Dice Game',
        description: 'Python program that simulates two dice being rolled. User can roll the dice as many times as they want.',
        tech: ['Python', 'Random Module', 'CLI'],
        github: 'https://github.com/F3stive-Ya/DiceGame',
        icon: 'icons/dice-0.png',
        version: '1.0.0'
    },
    'assemblycalculator': {
        name: 'Assembly Calculator',
        description: 'Low-level Assembly program performing basic arithmetic operations (Add, Sub, Mul, Div).',
        tech: ['Assembly x86', 'CPU Registers', 'Stack Operations'],
        github: 'https://github.com/F3stive-Ya/AssemblyCalculator',
        icon: 'icons/calculator_cool-0.png',
        version: '0.9.beta'
    },
    'carracer': {
        name: 'Car Racer',
        description: 'Simulation of a car race using Python. Random generation determines the winner.',
        tech: ['Python', 'Object Oriented', 'Game Loop'],
        github: 'https://github.com/F3stive-Ya/CarRacer',
        icon: 'icons/racing_car-0.png',
        version: '2.0-turbo'
    },
    'passwordmaker': {
        name: 'Password Maker',
        description: 'Security tool to generate strong, random passwords with customizable criteria.',
        tech: ['Python', 'Cryptography', 'String Manipulation'],
        github: 'https://github.com/F3stive-Ya/PasswordMaker',
        icon: 'icons/key_win-0.png',
        version: '3.1'
    },
    'commonfactors': {
        name: 'Common Factors',
        description: 'Mathematical utility to compute common factors efficiently between numbers.',
        tech: ['Python', 'Math Algorithms', 'Optimization'],
        github: 'https://github.com/F3stive-Ya/CommonFactors',
        icon: 'icons/calculator-0.png',
        version: '1.2'
    }
}

const WIZARD_STEPS = {
    WELCOME: 0,
    LICENSE: 1, // Optional, renaming to "Requirements" to fit content
    INSTALLING: 2,
    FINISHED: 3
}

const ProjectViewer = ({ projectId, onClose }) => {
    const project = PROJECTS_DATA[projectId]
    const [step, setStep] = useState(WIZARD_STEPS.WELCOME)
    const [progress, setProgress] = useState(0)
    const [installLog, setInstallLog] = useState([])

    // Reset state when project changes
    useEffect(() => {
        setStep(WIZARD_STEPS.WELCOME)
        setProgress(0)
        setInstallLog([])
    }, [projectId])

    // Handle installation simulation
    useEffect(() => {
        if (step === WIZARD_STEPS.INSTALLING) {
            let p = 0
            const logs = [
                'Preparing installation...',
                'Copying files...',
                'Extracting assets...',
                'Configuring dependencies...',
                'Registering components...',
                'Optimizing performance...',
                'Cleaning up...',
                'Done.'
            ]

            const interval = setInterval(() => {
                p += Math.random() * 15
                if (p >= 100) {
                    p = 100
                    setStep(WIZARD_STEPS.FINISHED)
                    clearInterval(interval)
                }
                setProgress(Math.min(p, 100))

                // Add random log
                if (Math.random() > 0.7) {
                    const log = logs[Math.floor(Math.random() * logs.length)]
                    setInstallLog(prev => [...prev.slice(-4), log])
                }
            }, 300)

            return () => clearInterval(interval)
        }
    }, [step])

    if (!project) return <div className="p-4">Project not found</div>

    const handleNext = () => {
        if (step < WIZARD_STEPS.FINISHED) {
            setStep(prev => prev + 1)
        } else {
            // Launch (Open GitHub) and Close
            window.open(project.github, '_blank')
            if (onClose) onClose() // Assuming we might pass this prop, or user manually closes
        }
    }

    const handleBack = () => {
        if (step > WIZARD_STEPS.WELCOME) {
            setStep(prev => prev - 1)
        }
    }

    return (
        <div className="wizard-container">
            <div className="wizard-sidebar">
                <img src="icons/installer_generic_old-0.png" alt="Setup" className="wizard-sidebar-img" />
                <div className="wizard-sidebar-text">
                    ShaneOS Setup
                </div>
            </div>

            <div className="wizard-content">
                {step === WIZARD_STEPS.WELCOME && (
                    <div className="wizard-step">
                        <h3>Welcome to the {project.name} Setup Wizard</h3>
                        <p className="wizard-text">
                            This wizard will guide you through the "installation" of {project.name} version {project.version}.
                        </p>
                        <div className="wizard-info-box">
                            <img src={project.icon} alt={project.name} className="wizard-project-icon" />
                            <div>
                                <strong>{project.name}</strong>
                                <p>{project.description}</p>
                            </div>
                        </div>
                        <p className="wizard-warning">
                            WARNING: This is strictly a portfolio demonstration. No actual software will be installed on your computer.
                        </p>
                        <p>
                            Click Next to continue.
                        </p>
                    </div>
                )}

                {step === WIZARD_STEPS.LICENSE && (
                    <div className="wizard-step">
                        <h3>System Requirements</h3>
                        <p>The following technologies are required and "used" by this application:</p>
                        <div className="wizard-license-box">
                            {project.tech.map((t, i) => (
                                <div key={i} className="wizard-req-item">
                                    ✅ {t}
                                </div>
                            ))}
                        </div>
                        <p>
                            This project is hosted on GitHub. Clicking "Next" will simulate the installation process.
                        </p>
                    </div>
                )}

                {step === WIZARD_STEPS.INSTALLING && (
                    <div className="wizard-step">
                        <h3>Installing {project.name}...</h3>
                        <p className="wizard-status">
                            Please wait while Setup installs the application.
                        </p>

                        <div className="wizard-progress-track">
                            <div className="wizard-progress-fill" style={{ width: `${progress}%` }}></div>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="wizard-progress-chunk"></div>
                            ))}
                        </div>

                        <div className="wizard-logs">
                            {installLog.map((log, i) => <div key={i}>{log}</div>)}
                        </div>
                    </div>
                )}

                {step === WIZARD_STEPS.FINISHED && (
                    <div className="wizard-step">
                        <h3>Installation Complete</h3>
                        <p>
                            Setup has finished "installing" {project.name} on your computer.
                        </p>
                        <p>
                            The application may be launched by selecting the installed icons.
                        </p>
                        <div className="wizard-final-option">
                            <input type="checkbox" checked readOnly />
                            <label>Launch {project.name} (Opens GitHub)</label>
                        </div>
                        <p>
                            Click Finish to exit Setup.
                        </p>
                    </div>
                )}
            </div>

            <div className="wizard-footer">
                <div className="wizard-footer-line"></div>
                <div className="wizard-buttons">
                    <button
                        className="wizard-btn"
                        disabled={step === WIZARD_STEPS.WELCOME || step === WIZARD_STEPS.INSTALLING || step === WIZARD_STEPS.FINISHED}
                        onClick={handleBack}
                    >
                        &lt; Back
                    </button>
                    <button
                        className="wizard-btn"
                        disabled={step === WIZARD_STEPS.INSTALLING}
                        onClick={handleNext}
                    >
                        {step === WIZARD_STEPS.FINISHED ? 'Finish' : 'Next >'}
                    </button>
                    <button
                        className="wizard-btn"
                        onClick={() => window.close()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProjectViewer
