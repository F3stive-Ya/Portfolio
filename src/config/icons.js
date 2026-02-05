// Shared icons configuration used by Desktop and FileExplorer
// showOnDesktop: false means it only appears in File Explorer and Start Menu

export const ICONS = [
    { id: 'about', label: 'About Me', icon: 'icons/notepad_file-0.png', showOnDesktop: true },
    { id: 'fileexplorer', label: 'File Explorer', icon: 'icons/directory_explorer-5.png', showOnDesktop: true },
    { id: 'minesweeper', label: 'Minesweeper', icon: 'icons/mine_sweeper-0.png', showOnDesktop: true },
    { id: 'terminal', label: 'Command Prompt', icon: 'icons/console_prompt-0.png', showOnDesktop: false },
    { id: 'notepad', label: 'Notepad', icon: 'icons/notepad-0.png', showOnDesktop: true },
    { id: 'outlook', label: 'Outlook Express', icon: 'icons/outlook_express-0.png', showOnDesktop: true },
    { id: 'paint', label: 'Paint', icon: 'icons/paint_file-0.png', showOnDesktop: true },
    { id: 'contact', label: 'Contact', icon: 'icons/mailbox_world-0.png', showOnDesktop: true },
    { id: 'mycomputer', label: 'My Computer', icon: 'icons/computer_explorer_cool-0.png', showOnDesktop: true },
    { id: 'resume', label: 'Resume', icon: 'icons/write_file-0.png', showOnDesktop: true },
    { id: 'settings', label: 'Settings', icon: 'icons/settings_gear-0.png', showOnDesktop: true }
]

// Projects that appear as executable programs in File Explorer
export const PROJECTS = [
    {
        id: 'dicegame',
        name: 'Dice Game',
        icon: 'icons/dice-0.png',
        description: 'A Python-based dice rolling game with betting mechanics.',
        tech: ['Python', 'Random', 'CLI'],
        github: 'https://github.com/F3stive-Ya/DiceGame',
        type: 'Python Application'
    },
    {
        id: 'carracer',
        name: 'Car Racer',
        icon: 'icons/racing_car-0.png',
        description: 'A simple car racing game built with Python and Pygame.',
        tech: ['Python', 'Pygame', 'Game Dev'],
        github: 'https://github.com/F3stive-Ya/CarRacer',
        type: 'Python Game'
    },
    {
        id: 'passwordmaker',
        name: 'Password Maker',
        icon: 'icons/key_win-0.png',
        description: 'A secure password generator with customizable options.',
        tech: ['Python', 'Security', 'CLI'],
        github: 'https://github.com/F3stive-Ya/PasswordMaker',
        type: 'Python Utility'
    },
    {
        id: 'commonfactors',
        name: 'Common Factors',
        icon: 'icons/calculator-0.png',
        description: 'A math utility for finding common factors and GCD.',
        tech: ['Python', 'Math', 'CLI'],
        github: 'https://github.com/F3stive-Ya/CommonFactors',
        type: 'Python Utility'
    },
    {
        id: 'calculator',
        name: 'Assembly Calculator',
        icon: 'icons/calculator_cool-0.png',
        description: 'A low-level calculator built in x86 Assembly.',
        tech: ['Assembly', 'x86', 'Low-level'],
        github: 'https://github.com/F3stive-Ya/AssemblyCalculator',
        type: 'Assembly Program'
    }
]
