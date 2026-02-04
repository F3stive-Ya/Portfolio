import { useEffect, useRef, useCallback } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from '@xterm/addon-fit'
import 'xterm/css/xterm.css'

const Terminal = ({ openWindow, triggerBSOD }) => {
    const terminalRef = useRef(null)
    const xtermRef = useRef(null)
    const fitAddonRef = useRef(null)
    const currentLineRef = useRef('')
    const commandHistoryRef = useRef([])
    const historyIndexRef = useRef(-1)
    const currentDirRef = useRef('C:\\PORTFOLIO')

    // File system simulation
    const fileSystem = {
        'C:\\': ['PORTFOLIO', 'WINDOWS', 'PROGRAM FILES'],
        'C:\\PORTFOLIO': ['about.txt', 'projects', 'contact.txt', 'resume.pdf', 'readme.md'],
        'C:\\PORTFOLIO\\projects': ['dicegame.exe', 'calculator.asm', 'carracer.py', 'passwordmaker.py', 'commonfactors.py'],
        'C:\\WINDOWS': ['system32', 'notepad.exe', 'explorer.exe'],
        'C:\\PROGRAM FILES': ['Internet Explorer', 'Outlook Express']
    }

    // Command execution
    const executeCommand = useCallback((cmd) => {
        const xterm = xtermRef.current
        if (!xterm) return

        const trimmed = cmd.trim()
        if (!trimmed) {
            xterm.writeln('')
            return
        }

        // Add to history
        commandHistoryRef.current.push(trimmed)
        historyIndexRef.current = -1

        const parts = trimmed.split(' ')
        const command = parts[0].toLowerCase()
        const args = parts.slice(1).join(' ')

        xterm.writeln('')

        const commands = {
            help: () => {
                xterm.writeln('\x1b[1;36mAvailable commands:\x1b[0m')
                xterm.writeln('')
                xterm.writeln('  \x1b[1;33mhelp\x1b[0m          - Show this help message')
                xterm.writeln('  \x1b[1;33mabout\x1b[0m         - Open About Me window')
                xterm.writeln('  \x1b[1;33mprojects\x1b[0m      - Open Projects window')
                xterm.writeln('  \x1b[1;33mcontact\x1b[0m       - Open Contact window')
                xterm.writeln('  \x1b[1;33mresume\x1b[0m        - Open Resume window')
                xterm.writeln('  \x1b[1;33mnotepad\x1b[0m       - Open Notepad')
                xterm.writeln('  \x1b[1;33moutlook\x1b[0m       - Open Outlook Express')
                xterm.writeln('  \x1b[1;33msettings\x1b[0m      - Open Settings')
                xterm.writeln('')
                xterm.writeln('  \x1b[1;33mdir\x1b[0m           - List files in current directory')
                xterm.writeln('  \x1b[1;33mcd <path>\x1b[0m     - Change directory')
                xterm.writeln('  \x1b[1;33mcls\x1b[0m           - Clear screen')
                xterm.writeln('  \x1b[1;33mecho <text>\x1b[0m   - Print text')
                xterm.writeln('  \x1b[1;33mver\x1b[0m           - Show version')
                xterm.writeln('  \x1b[1;33mdate\x1b[0m          - Show current date')
                xterm.writeln('  \x1b[1;33mtime\x1b[0m          - Show current time')
                xterm.writeln('  \x1b[1;33mexit\x1b[0m          - Close terminal')
                xterm.writeln('')
                xterm.writeln('  \x1b[1;35mEaster eggs:\x1b[0m Try some other commands... ;)')
            },
            about: () => { openWindow('about'); xterm.writeln('\x1b[32mOpening About Me...\x1b[0m') },
            projects: () => { openWindow('projects'); xterm.writeln('\x1b[32mOpening Projects...\x1b[0m') },
            contact: () => { openWindow('contact'); xterm.writeln('\x1b[32mOpening Contact...\x1b[0m') },
            resume: () => { openWindow('resume'); xterm.writeln('\x1b[32mOpening Resume...\x1b[0m') },
            notepad: () => { openWindow('notepad'); xterm.writeln('\x1b[32mOpening Notepad...\x1b[0m') },
            outlook: () => { openWindow('outlook'); xterm.writeln('\x1b[32mOpening Outlook Express...\x1b[0m') },
            settings: () => { openWindow('settings'); xterm.writeln('\x1b[32mOpening Settings...\x1b[0m') },
            cls: () => { xterm.clear() },
            clear: () => { xterm.clear() },
            dir: () => {
                const files = fileSystem[currentDirRef.current.toUpperCase()] || []
                xterm.writeln(` Volume in drive C is \x1b[1;33mPORTFOLIO\x1b[0m`)
                xterm.writeln(` Volume Serial Number is \x1b[36m1337-C0DE\x1b[0m`)
                xterm.writeln('')
                xterm.writeln(` Directory of \x1b[1;37m${currentDirRef.current}\x1b[0m`)
                xterm.writeln('')
                files.forEach(file => {
                    const isDir = !file.includes('.')
                    const date = '02-04-26  12:00p'
                    if (isDir) {
                        xterm.writeln(`${date}    \x1b[1;34m<DIR>\x1b[0m          \x1b[1;34m${file}\x1b[0m`)
                    } else {
                        const size = Math.floor(Math.random() * 10000).toString().padStart(10, ' ')
                        xterm.writeln(`${date}${size} ${file}`)
                    }
                })
                xterm.writeln('')
                xterm.writeln(`               ${files.length} File(s)          42,069 bytes`)
            },
            cd: () => {
                if (!args || args === '\\' || args === '/') {
                    currentDirRef.current = 'C:\\'
                    return
                }
                if (args === '..') {
                    const parts = currentDirRef.current.split('\\').filter(p => p)
                    if (parts.length > 1) {
                        parts.pop()
                        currentDirRef.current = parts.join('\\')
                    }
                    return
                }
                const newPath = args.startsWith('C:\\') ? args.toUpperCase() : `${currentDirRef.current}\\${args}`.toUpperCase()
                if (fileSystem[newPath]) {
                    currentDirRef.current = newPath
                } else {
                    xterm.writeln(`\x1b[31mThe system cannot find the path specified.\x1b[0m`)
                }
            },
            echo: () => { xterm.writeln(args || '') },
            ver: () => {
                xterm.writeln('')
                xterm.writeln('\x1b[1;37mWindows 95 [Version 4.00.1111]\x1b[0m')
            },
            date: () => {
                const now = new Date()
                xterm.writeln(`The current date is: \x1b[1;33m${now.toLocaleDateString()}\x1b[0m`)
            },
            time: () => {
                const now = new Date()
                xterm.writeln(`The current time is: \x1b[1;33m${now.toLocaleTimeString()}\x1b[0m`)
            },
            exit: () => { openWindow('terminal') },
            // Easter eggs
            crash: () => { if (triggerBSOD) triggerBSOD() },
            bsod: () => { if (triggerBSOD) triggerBSOD() },
            sudo: () => { xterm.writeln(`\x1b[31mNice try, but this isn't Linux! 🐧\x1b[0m`) },
            rm: () => { xterm.writeln(`\x1b[31mThis isn't Linux! Try 'del' instead... just kidding.\x1b[0m`) },
            hack: () => {
                xterm.writeln('\x1b[32mINITIATING HACK SEQUENCE...\x1b[0m')
                xterm.writeln('\x1b[33m> Bypassing firewall... \x1b[31mFAILED\x1b[0m')
                xterm.writeln('\x1b[33m> Accessing mainframe... \x1b[31mDENIED\x1b[0m')
                xterm.writeln('\x1b[33m> Deploying virus... \x1b[31mBLOCKED\x1b[0m')
                xterm.writeln('')
                xterm.writeln('\x1b[35mJust kidding! This is a portfolio, not Mr. Robot.\x1b[0m')
            },
            matrix: () => {
                xterm.writeln('\x1b[32mWake up, Neo...\x1b[0m')
                xterm.writeln('\x1b[32mThe Matrix has you...\x1b[0m')
                xterm.writeln('\x1b[32mFollow the white rabbit.\x1b[0m')
                xterm.writeln('')
                xterm.writeln('\x1b[1;32mKnock, knock.\x1b[0m')
            },
            doom: () => { xterm.writeln(`\x1b[33mYou don't have DOOM installed. Maybe try 'install doom'?\x1b[0m`) },
            install: () => {
                if (args && args.toLowerCase() === 'doom') {
                    xterm.writeln('\x1b[36mDownloading DOOM...\x1b[0m')
                    xterm.writeln('\x1b[32m████████████████████ 100%\x1b[0m')
                    xterm.writeln('')
                    xterm.writeln('\x1b[31mError: Insufficient disk space.\x1b[0m')
                    xterm.writeln('\x1b[33mRequired: 10MB, Available: 640KB\x1b[0m')
                    xterm.writeln('')
                    xterm.writeln('\x1b[35m"640K ought to be enough for anybody." - Bill Gates, 1981\x1b[0m')
                } else {
                    xterm.writeln('Usage: install <program>')
                }
            },
            hello: () => { xterm.writeln('\x1b[36mHello there! 👋\x1b[0m') },
            hi: () => { xterm.writeln('\x1b[36mHello there! 👋\x1b[0m') },
            whoami: () => { xterm.writeln(`\x1b[1;33mYou are a visitor on Shane's Portfolio!\x1b[0m`) },
            neofetch: () => {
                xterm.writeln('')
                xterm.writeln('\x1b[36m        ████████████        \x1b[0m   \x1b[1;36mvisitor\x1b[0m@\x1b[1;36mportfolio\x1b[0m')
                xterm.writeln('\x1b[36m      ██            ██      \x1b[0m   ─────────────────')
                xterm.writeln('\x1b[36m    ██    ██████    ██      \x1b[0m   \x1b[1;33mOS:\x1b[0m Windows 95')
                xterm.writeln('\x1b[36m    ██  ██      ██  ██      \x1b[0m   \x1b[1;33mHost:\x1b[0m Shane\'s Portfolio')
                xterm.writeln('\x1b[36m    ██  ██████████  ██      \x1b[0m   \x1b[1;33mKernel:\x1b[0m React 18')
                xterm.writeln('\x1b[36m    ██              ██      \x1b[0m   \x1b[1;33mShell:\x1b[0m xterm.js')
                xterm.writeln('\x1b[36m      ██          ██        \x1b[0m   \x1b[1;33mTheme:\x1b[0m Win95 Classic')
                xterm.writeln('\x1b[36m        ████████████        \x1b[0m   \x1b[1;33mTerminal:\x1b[0m MS-DOS Prompt')
                xterm.writeln('')
            },
            github: () => {
                window.open('https://github.com/F3stive-Ya', '_blank')
                xterm.writeln('\x1b[32mOpening GitHub profile...\x1b[0m')
            },
            linkedin: () => {
                window.open('https://www.linkedin.com/in/shaneborges/', '_blank')
                xterm.writeln('\x1b[32mOpening LinkedIn profile...\x1b[0m')
            },
            tree: () => {
                xterm.writeln('\x1b[1;33mC:\\PORTFOLIO\x1b[0m')
                xterm.writeln('├── \x1b[37mabout.txt\x1b[0m')
                xterm.writeln('├── \x1b[1;34mprojects\x1b[0m')
                xterm.writeln('│   ├── dicegame.exe')
                xterm.writeln('│   ├── calculator.asm')
                xterm.writeln('│   ├── carracer.py')
                xterm.writeln('│   ├── passwordmaker.py')
                xterm.writeln('│   └── commonfactors.py')
                xterm.writeln('├── \x1b[37mcontact.txt\x1b[0m')
                xterm.writeln('└── \x1b[37mresume.pdf\x1b[0m')
            },
            cowsay: () => {
                const msg = args || 'Hello!'
                const border = '─'.repeat(msg.length + 2)
                xterm.writeln(` ┌${border}┐`)
                xterm.writeln(` │ ${msg} │`)
                xterm.writeln(` └${border}┘`)
                xterm.writeln('        \\   ^__^')
                xterm.writeln('         \\  (oo)\\_______')
                xterm.writeln('            (__)\\       )\\/\\')
                xterm.writeln('                ||----w |')
                xterm.writeln('                ||     ||')
            }
        }

        if (commands[command]) {
            commands[command]()
        } else {
            xterm.writeln(`\x1b[31m'${command}' is not recognized as an internal or external command,\x1b[0m`)
            xterm.writeln(`\x1b[31moperable program or batch file.\x1b[0m`)
        }
    }, [openWindow, triggerBSOD])

    // Write prompt
    const writePrompt = useCallback(() => {
        const xterm = xtermRef.current
        if (xterm) {
            xterm.write(`\r\n\x1b[1;33m${currentDirRef.current}>\x1b[0m `)
        }
    }, [])

    // Initialize terminal
    useEffect(() => {
        if (!terminalRef.current || xtermRef.current) return

        const xterm = new XTerm({
            theme: {
                background: '#0c0c0c',
                foreground: '#cccccc',
                cursor: '#cccccc',
                cursorAccent: '#0c0c0c',
                selectionBackground: '#264f78',
                black: '#0c0c0c',
                red: '#c50f1f',
                green: '#13a10e',
                yellow: '#c19c00',
                blue: '#0037da',
                magenta: '#881798',
                cyan: '#3a96dd',
                white: '#cccccc',
                brightBlack: '#767676',
                brightRed: '#e74856',
                brightGreen: '#16c60c',
                brightYellow: '#f9f1a5',
                brightBlue: '#3b78ff',
                brightMagenta: '#b4009e',
                brightCyan: '#61d6d6',
                brightWhite: '#f2f2f2'
            },
            fontFamily: '"Cascadia Code", "Consolas", "Courier New", monospace',
            fontSize: 14,
            cursorBlink: true,
            cursorStyle: 'block',
            scrollback: 1000,
        })

        const fitAddon = new FitAddon()
        xterm.loadAddon(fitAddon)

        xterm.open(terminalRef.current)
        fitAddon.fit()

        xtermRef.current = xterm
        fitAddonRef.current = fitAddon

        // Welcome message
        xterm.writeln('\x1b[1;36m╔════════════════════════════════════════════════════════════╗\x1b[0m')
        xterm.writeln('\x1b[1;36m║\x1b[0m  \x1b[1;37mMicrosoft Windows 95 [Version 4.00.1111]\x1b[0m                   \x1b[1;36m║\x1b[0m')
        xterm.writeln('\x1b[1;36m║\x1b[0m  \x1b[90m(C) Copyright 1985-1996 Microsoft Corp.\x1b[0m                    \x1b[1;36m║\x1b[0m')
        xterm.writeln('\x1b[1;36m╠════════════════════════════════════════════════════════════╣\x1b[0m')
        xterm.writeln('\x1b[1;36m║\x1b[0m  \x1b[1;33mWelcome to Shane\'s Portfolio Terminal!\x1b[0m                    \x1b[1;36m║\x1b[0m')
        xterm.writeln('\x1b[1;36m║\x1b[0m  Type \x1b[1;32m"help"\x1b[0m for a list of commands.                        \x1b[1;36m║\x1b[0m')
        xterm.writeln('\x1b[1;36m║\x1b[0m  Try \x1b[1;35m"neofetch"\x1b[0m or \x1b[1;35m"cowsay hello"\x1b[0m for fun!                  \x1b[1;36m║\x1b[0m')
        xterm.writeln('\x1b[1;36m╚════════════════════════════════════════════════════════════╝\x1b[0m')

        writePrompt()

        // Handle input
        xterm.onKey(({ key, domEvent }) => {
            const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey

            if (domEvent.key === 'Enter') {
                executeCommand(currentLineRef.current)
                currentLineRef.current = ''
                writePrompt()
            } else if (domEvent.key === 'Backspace') {
                if (currentLineRef.current.length > 0) {
                    currentLineRef.current = currentLineRef.current.slice(0, -1)
                    xterm.write('\b \b')
                }
            } else if (domEvent.key === 'ArrowUp') {
                if (commandHistoryRef.current.length > 0) {
                    if (historyIndexRef.current === -1) {
                        historyIndexRef.current = commandHistoryRef.current.length - 1
                    } else if (historyIndexRef.current > 0) {
                        historyIndexRef.current--
                    }
                    // Clear current line
                    while (currentLineRef.current.length > 0) {
                        xterm.write('\b \b')
                        currentLineRef.current = currentLineRef.current.slice(0, -1)
                    }
                    // Write history item
                    const historyItem = commandHistoryRef.current[historyIndexRef.current]
                    currentLineRef.current = historyItem
                    xterm.write(historyItem)
                }
            } else if (domEvent.key === 'ArrowDown') {
                if (historyIndexRef.current !== -1) {
                    // Clear current line
                    while (currentLineRef.current.length > 0) {
                        xterm.write('\b \b')
                        currentLineRef.current = currentLineRef.current.slice(0, -1)
                    }
                    historyIndexRef.current++
                    if (historyIndexRef.current >= commandHistoryRef.current.length) {
                        historyIndexRef.current = -1
                    } else {
                        const historyItem = commandHistoryRef.current[historyIndexRef.current]
                        currentLineRef.current = historyItem
                        xterm.write(historyItem)
                    }
                }
            } else if (printable) {
                currentLineRef.current += key
                xterm.write(key)
            }
        })

        // Handle resize
        const handleResize = () => {
            if (fitAddonRef.current) {
                fitAddonRef.current.fit()
            }
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            xterm.dispose()
            xtermRef.current = null
        }
    }, [executeCommand, writePrompt])

    // Fit on container resize
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (fitAddonRef.current) {
                fitAddonRef.current.fit()
            }
        })
        if (terminalRef.current) {
            observer.observe(terminalRef.current)
        }
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={terminalRef}
            className="xterm-container"
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0c0c0c'
            }}
        />
    )
}

export default Terminal
