import { SYSTEM_INFO } from './system'
import Settings from '../components/Settings'
import Notepad from '../components/Notepad'
import OutlookExpress from '../components/OutlookExpress'
import Paint from '../components/Paint'
import Minesweeper from '../components/Games/Minesweeper'
import Solitaire from '../components/Games/Solitaire'
import Pinball from '../components/Games/Pinball'

import { ICONS, PROJECTS } from './icons'

const getIcon = (id) => ICONS.find((i) => i.id === id)?.icon || 'icons/application-0.png'
const getProjectIcon = (id) => PROJECTS.find((p) => p.id === id)?.icon || 'icons/joystick-0.png'

// My Computer content
const MyComputerContent = () => (
    <div className="mycomputer-content">
        <h3>System Information</h3>
        <div className="system-info-grid">
            <div className="system-info-row">
                <span className="info-label">CPU:</span>
                <span className="info-value">{SYSTEM_INFO.cpu}</span>
            </div>
            <div className="system-info-row">
                <span className="info-label">RAM:</span>
                <span className="info-value">{SYSTEM_INFO.ram}</span>
            </div>
            <div className="system-info-row">
                <span className="info-label">Storage:</span>
                <span className="info-value">{SYSTEM_INFO.hdd}</span>
            </div>
            <div className="system-info-row">
                <span className="info-label">GPU:</span>
                <span className="info-value">{SYSTEM_INFO.gpu}</span>
            </div>
        </div>
        <div className="drives-section">
            <h4>Drives</h4>
            <p>
                Hard Drive (C:)
                <br />
                Floppy (A:)
                <br />
                CD-ROM (D:)
            </p>
        </div>
    </div>
)

export const WINDOW_CONFIGS = {
    about: {
        title: 'About Me',
        icon: getIcon('about'),
        defaultStyle: { top: 100, left: 100, width: 360, height: 260 },
        content: (
            <p>
                Hello there! My name is Shane Borges, and I am a Cyber-Security student studying at
                Sheridan College. On this page you can find ways to contact me, my projects, and my
                resume. Enjoy!
            </p>
        )
    },
    projects: {
        title: 'Projects',
        icon: 'icons/directory_open_file_mydocs-4.png', // Custom Folder Icon
        defaultStyle: { top: 140, left: 220, width: 420, height: 320 },
        content: (
            <>
                <div className="project">
                    <h3>Dice Game</h3>
                    <ul>
                        <li>Python program that simulates two dice being rolled.</li>
                        <li>User can roll the dice as many times as they want.</li>
                        <li>User can quit the game at any time.</li>
                        <li>
                            <a href="https://github.com/F3stive-Ya/DiceGame">GitHub</a>
                        </li>
                    </ul>
                </div>
                <div className="project">
                    <h3>Assembly Calculator</h3>
                    <ul>
                        <li>Assembly program that simulates a calculator.</li>
                        <li>User can add, subtract, multiply, and divide two numbers.</li>
                        <li>User can quit the program at any time.</li>
                        <li>
                            <a href="https://github.com/F3stive-Ya/AssemblyCalculator">GitHub</a>
                        </li>
                    </ul>
                </div>
                <div className="project">
                    <h3>Car Racer</h3>
                    <ul>
                        <li>A Python program that simulates a car race.</li>
                        <li>Randomly generated cars race against each other.</li>
                        <li>Winner is presented to user with distance traveled.</li>
                        <li>
                            <a href="https://github.com/F3stive-Ya/CarRacer">GitHub</a>
                        </li>
                    </ul>
                </div>
                <div className="project">
                    <h3>Password Maker</h3>
                    <ul>
                        <li>
                            A Python program that generates random passwords based on input word
                        </li>
                        <li>
                            Adds randomly generated characters, integers, and special-characters
                            resulting in an 8 character password
                        </li>
                        <li>
                            <a href="https://github.com/F3stive-Ya/PasswordMaker">GitHub</a>
                        </li>
                    </ul>
                </div>
                <div className="project">
                    <h3>Common Factors Finder</h3>
                    <ul>
                        <li>A Python program that finds the common factors of two numbers</li>
                        <li>
                            <a href="https://github.com/F3stive-Ya/CommonFactors">GitHub</a>
                        </li>
                    </ul>
                </div>
            </>
        )
    },
    contact: {
        title: 'Contact',
        icon: getIcon('contact'),
        defaultStyle: { top: 120, left: 320, width: 360, height: 240 },
        content: (
            <>
                <p>
                    Email: <a href="mailto:shanemborges@gmail.com">shanemborges@gmail.com</a>
                </p>
                <p>
                    LinkedIn:{' '}
                    <a
                        href="https://www.linkedin.com/in/shaneborges/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Shane Borges
                    </a>
                </p>
            </>
        )
    },
    mycomputer: {
        title: 'My Computer',
        icon: getIcon('mycomputer'),
        defaultStyle: { top: 200, left: 150, width: 420, height: 340 },
        content: <MyComputerContent />
    },
    resume: {
        title: 'Resume',
        icon: getIcon('resume'),
        defaultStyle: { top: 170, left: 180, width: 760, height: 520 },
        content: (
            <div style={{ padding: 0, height: '100%' }}>
                <object data="resume.pdf" type="application/pdf" width="100%" height="100%">
                    <iframe src="resume.pdf" width="100%" height="100%" title="Resume PDF"></iframe>
                </object>
            </div>
        ),
        bodyStyle: { padding: 0 }
    },
    fileexplorer: {
        title: 'File Explorer',
        icon: getIcon('fileexplorer'),
        defaultStyle: { top: 80, left: 140, width: 600, height: 440 },
        // Content rendered dynamically to receive openWindow prop
        content: null,
        bodyStyle: { padding: 0 }
    },
    settings: {
        title: 'Settings',
        icon: getIcon('settings'),
        defaultStyle: { top: 130, left: 200, width: 400, height: 420 },
        content: <Settings />,
        bodyStyle: { padding: '12px' }
    },
    terminal: {
        title: 'Command Prompt',
        icon: getIcon('terminal'),
        defaultStyle: { top: 100, left: 150, width: 680, height: 420 },
        // Content rendered dynamically to receive props
        content: null,
        bodyStyle: { padding: 0 }
    },
    notepad: {
        title: 'Notepad - Untitled',
        icon: getIcon('notepad'),
        defaultStyle: { top: 120, left: 180, width: 500, height: 400 },
        content: <Notepad />,
        bodyStyle: { padding: 0 }
    },
    outlook: {
        title: 'Outlook Express',
        icon: getIcon('outlook'),
        defaultStyle: { top: 90, left: 160, width: 560, height: 440 },
        content: <OutlookExpress />,
        bodyStyle: { padding: 0 }
    },
    paint: {
        title: 'Paint',
        icon: getIcon('paint'),
        defaultStyle: { top: 60, left: 100, width: 720, height: 540 },
        content: <Paint />,
        bodyStyle: { padding: 0 }
    },
    minesweeper: {
        title: 'Minesweeper',
        icon: getIcon('minesweeper'),
        defaultStyle: { top: 100, left: 100, width: 220, height: 320 },
        content: <Minesweeper />,
        bodyStyle: { padding: 0, background: '#c0c0c0' },
        resizable: false
    },
    solitaire: {
        title: 'Solitaire',
        icon: getIcon('solitaire'),
        defaultStyle: { top: 50, left: 50, width: 640, height: 480 },
        content: <Solitaire />,
        bodyStyle: { padding: 0 }
    },
    pinball: {
        title: '3D Pinball for Windows - Space Cadet',
        icon: getIcon('pinball'),
        defaultStyle: { top: 20, left: 20, width: 650, height: 520 },
        content: <Pinball />,
        bodyStyle: { padding: 0, background: '#000' },
        resizable: false
    },
    // Project windows - dynamically created based on project ID
    project_dicegame: {
        title: 'Dice Game - Project',
        icon: getProjectIcon('dicegame'),
        defaultStyle: { top: 80, left: 120, width: 480, height: 450 },
        content: null, // Rendered dynamically
        bodyStyle: { padding: 0 }
    },
    project_carracer: {
        title: 'Car Racer - Project',
        icon: getProjectIcon('carracer'),
        defaultStyle: { top: 90, left: 140, width: 480, height: 450 },
        content: null,
        bodyStyle: { padding: 0 }
    },
    project_passwordmaker: {
        title: 'Password Maker - Project',
        icon: getProjectIcon('passwordmaker'),
        defaultStyle: { top: 100, left: 160, width: 480, height: 450 },
        content: null,
        bodyStyle: { padding: 0 }
    },
    project_commonfactors: {
        title: 'Common Factors - Project',
        icon: getProjectIcon('commonfactors'),
        defaultStyle: { top: 110, left: 180, width: 480, height: 450 },
        content: null,
        bodyStyle: { padding: 0 }
    },
    project_assemblycalculator: {
        title: 'Assembly Calculator - Project',
        icon: getProjectIcon('calculator'),
        defaultStyle: { top: 120, left: 200, width: 500, height: 480 },
        content: null,
        bodyStyle: { padding: 0 }
    }
}
