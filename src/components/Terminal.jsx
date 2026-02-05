import { useState, useRef, useEffect, useCallback } from 'react'

const Terminal = ({ openWindow, triggerBSOD }) => {
    const [history, setHistory] = useState([])
    const [commandHistory, setCommandHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [currentInput, setCurrentInput] = useState('')
    const [currentDir, setCurrentDir] = useState('C:\\PORTFOLIO')
    const inputRef = useRef(null)
    const containerRef = useRef(null)

    // File system simulation
    const fileSystem = {
        'C:\\': ['PORTFOLIO', 'WINDOWS', 'PROGRAM FILES'],
        'C:\\PORTFOLIO': ['about.txt', 'projects', 'contact.txt', 'resume.pdf', 'readme.md'],
        'C:\\PORTFOLIO\\PROJECTS': [
            'dicegame.exe',
            'calculator.asm',
            'carracer.py',
            'passwordmaker.py',
            'commonfactors.py'
        ],
        'C:\\WINDOWS': ['system32', 'notepad.exe', 'explorer.exe'],
        'C:\\PROGRAM FILES': ['Internet Explorer', 'Outlook Express']
    }

    // Welcome message on mount
    useEffect(() => {
        setHistory([
            {
                type: 'system',
                text: '╔════════════════════════════════════════════════════════════╗'
            },
            {
                type: 'system',
                text: '║  Microsoft Windows 95 [Version 4.00.1111]                   ║'
            },
            {
                type: 'system',
                text: '║  (C) Copyright 1985-1996 Microsoft Corp.                    ║'
            },
            {
                type: 'system',
                text: '╠════════════════════════════════════════════════════════════╣'
            },
            {
                type: 'system',
                text: "║  Welcome to Shane's Portfolio Terminal!                    ║"
            },
            {
                type: 'system',
                text: '║  Type "help" for a list of commands.                        ║'
            },
            {
                type: 'system',
                text: '╚════════════════════════════════════════════════════════════╝'
            },
            { type: 'output', text: '' }
        ])
    }, [])

    // Auto-scroll and focus
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [history])

    // Focus input when clicking anywhere in terminal
    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    // Execute command
    const executeCommand = useCallback(
        (cmd) => {
            const trimmed = cmd.trim()
            const output = []

            if (trimmed) {
                setCommandHistory((prev) => [...prev, trimmed])
                setHistoryIndex(-1)
            }

            output.push({ type: 'command', text: `${currentDir}> ${trimmed}` })

            if (!trimmed) {
                setHistory((prev) => [...prev, ...output])
                return
            }

            const parts = trimmed.split(' ')
            const command = parts[0].toLowerCase()
            const args = parts.slice(1).join(' ')

            switch (command) {
                case 'help':
                    output.push({ type: 'output', text: 'Available commands:' })
                    output.push({ type: 'output', text: '' })
                    output.push({
                        type: 'output',
                        text: '  help          - Show this help message'
                    })
                    output.push({ type: 'output', text: '  about         - Open About Me window' })
                    output.push({ type: 'output', text: '  projects      - Open Projects window' })
                    output.push({ type: 'output', text: '  contact       - Open Contact window' })
                    output.push({ type: 'output', text: '  resume        - Open Resume window' })
                    output.push({ type: 'output', text: '  notepad       - Open Notepad' })
                    output.push({ type: 'output', text: '  paint         - Open Paint' })
                    output.push({ type: 'output', text: '  outlook       - Open Outlook Express' })
                    output.push({ type: 'output', text: '  settings      - Open Settings' })
                    output.push({ type: 'output', text: '' })
                    output.push({
                        type: 'output',
                        text: '  dir           - List files in current directory'
                    })
                    output.push({ type: 'output', text: '  cd <path>     - Change directory' })
                    output.push({ type: 'output', text: '  cls           - Clear screen' })
                    output.push({ type: 'output', text: '  echo <text>   - Print text' })
                    output.push({ type: 'output', text: '  ver           - Show version' })
                    output.push({ type: 'output', text: '  date          - Show current date' })
                    output.push({ type: 'output', text: '  time          - Show current time' })
                    output.push({ type: 'output', text: '' })
                    output.push({
                        type: 'output',
                        text: '  Easter eggs: Try some other commands... ;)'
                    })
                    break

                case 'about':
                    openWindow('about')
                    output.push({ type: 'success', text: 'Opening About Me...' })
                    break
                case 'projects':
                    openWindow('fileexplorer')
                    output.push({ type: 'success', text: 'Opening Projects...' })
                    break
                case 'contact':
                    openWindow('contact')
                    output.push({ type: 'success', text: 'Opening Contact...' })
                    break
                case 'resume':
                    openWindow('resume')
                    output.push({ type: 'success', text: 'Opening Resume...' })
                    break
                case 'notepad':
                    openWindow('notepad')
                    output.push({ type: 'success', text: 'Opening Notepad...' })
                    break
                case 'paint':
                    openWindow('paint')
                    output.push({ type: 'success', text: 'Opening Paint...' })
                    break
                case 'outlook':
                    openWindow('outlook')
                    output.push({ type: 'success', text: 'Opening Outlook Express...' })
                    break
                case 'settings':
                    openWindow('settings')
                    output.push({ type: 'success', text: 'Opening Settings...' })
                    break

                case 'cls':
                case 'clear':
                    setHistory([])
                    return

                case 'dir':
                    const files = fileSystem[currentDir.toUpperCase()] || []
                    output.push({ type: 'output', text: ` Volume in drive C is PORTFOLIO` })
                    output.push({ type: 'output', text: ` Volume Serial Number is 1337-C0DE` })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: ` Directory of ${currentDir}` })
                    output.push({ type: 'output', text: '' })
                    files.forEach((file) => {
                        const isDir = !file.includes('.')
                        const date = '02-04-26  12:00p'
                        if (isDir) {
                            output.push({ type: 'dir', text: `${date}    <DIR>          ${file}` })
                        } else {
                            const size = Math.floor(Math.random() * 10000)
                                .toString()
                                .padStart(10, ' ')
                            output.push({ type: 'file', text: `${date}${size} ${file}` })
                        }
                    })
                    output.push({ type: 'output', text: '' })
                    output.push({
                        type: 'output',
                        text: `               ${files.length} File(s)          42,069 bytes`
                    })
                    break

                case 'cd':
                    if (!args || args === '\\' || args === '/') {
                        setCurrentDir('C:\\')
                    } else if (args === '..') {
                        const parts = currentDir.split('\\').filter((p) => p)
                        if (parts.length > 1) {
                            parts.pop()
                            setCurrentDir(parts.join('\\'))
                        }
                    } else {
                        const newPath = args.startsWith('C:\\')
                            ? args.toUpperCase()
                            : `${currentDir}\\${args}`.toUpperCase()
                        if (fileSystem[newPath]) {
                            setCurrentDir(newPath)
                        } else {
                            output.push({
                                type: 'error',
                                text: 'The system cannot find the path specified.'
                            })
                        }
                    }
                    break

                case 'echo':
                    output.push({ type: 'output', text: args || '' })
                    break

                case 'ver':
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: 'Windows 95 [Version 4.00.1111]' })
                    break

                case 'date':
                    output.push({
                        type: 'output',
                        text: `The current date is: ${new Date().toLocaleDateString()}`
                    })
                    break

                case 'time':
                    output.push({
                        type: 'output',
                        text: `The current time is: ${new Date().toLocaleTimeString()}`
                    })
                    break

                case 'crash':
                case 'bsod':
                    output.push({
                        type: 'error',
                        text: '*** STOP: 0x0000007E (0xC0000005, 0x00000000, 0x00000000, 0x00000000)'
                    })
                    output.push({ type: 'error', text: 'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED' })
                    output.push({ type: 'output', text: '' })
                    output.push({
                        type: 'warning',
                        text: 'A problem has been detected and Windows has been shut down to prevent'
                    })
                    output.push({ type: 'warning', text: 'damage to your computer...' })
                    setHistory((prev) => [...prev, ...output])
                    setTimeout(() => {
                        if (triggerBSOD) triggerBSOD()
                    }, 1500)
                    return

                case 'sudo':
                    output.push({ type: 'error', text: "Nice try, but this isn't Linux! 🐧" })
                    break

                case 'rm':
                    if (args.includes('-rf')) {
                        output.push({
                            type: 'error',
                            text: "This isn't Linux! But nice try destroying everything 💀"
                        })
                    } else {
                        output.push({
                            type: 'error',
                            text: "Command not found. Try 'del' instead... just kidding."
                        })
                    }
                    break

                case 'exit':
                case 'quit':
                    output.push({ type: 'warning', text: 'Nice try, but you cannot escape! 😈' })
                    output.push({ type: 'output', text: 'Just kidding. Close the window instead.' })
                    break

                case 'hack':
                    output.push({ type: 'success', text: 'INITIATING HACK SEQUENCE...' })
                    output.push({ type: 'warning', text: '> Bypassing firewall... FAILED' })
                    output.push({ type: 'warning', text: '> Accessing mainframe... DENIED' })
                    output.push({ type: 'warning', text: '> Deploying virus... BLOCKED' })
                    output.push({ type: 'output', text: '' })
                    output.push({
                        type: 'output',
                        text: 'Just kidding! This is a portfolio, not Mr. Robot.'
                    })
                    break

                case 'matrix':
                    output.push({ type: 'success', text: 'Wake up, Neo...' })
                    output.push({ type: 'success', text: 'The Matrix has you...' })
                    output.push({ type: 'success', text: 'Follow the white rabbit.' })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'success', text: 'Knock, knock.' })
                    break

                case 'neofetch':
                    output.push({ type: 'output', text: '' })
                    output.push({
                        type: 'system',
                        text: '        ████████████           visitor@portfolio'
                    })
                    output.push({
                        type: 'system',
                        text: '      ██            ██         ─────────────────'
                    })
                    output.push({
                        type: 'system',
                        text: '    ██    ██████    ██         OS: Windows 95'
                    })
                    output.push({
                        type: 'system',
                        text: "    ██  ██      ██  ██         Host: Shane's Portfolio"
                    })
                    output.push({
                        type: 'system',
                        text: '    ██  ██████████  ██         Kernel: React 18'
                    })
                    output.push({
                        type: 'system',
                        text: '    ██              ██         Shell: cmd.exe'
                    })
                    output.push({
                        type: 'system',
                        text: '      ██          ██           Theme: Win95 Classic'
                    })
                    output.push({
                        type: 'system',
                        text: '        ████████████           Terminal: MS-DOS Prompt'
                    })
                    output.push({ type: 'output', text: '' })
                    break

                case 'cowsay':
                    const msg = args || 'Moo!'
                    const border = '─'.repeat(msg.length + 2)
                    output.push({ type: 'output', text: ` ┌${border}┐` })
                    output.push({ type: 'output', text: ` │ ${msg} │` })
                    output.push({ type: 'output', text: ` └${border}┘` })
                    output.push({ type: 'output', text: '        \\   ^__^' })
                    output.push({ type: 'output', text: '         \\  (oo)\\_______' })
                    output.push({ type: 'output', text: '            (__)\\       )\\/\\' })
                    output.push({ type: 'output', text: '                ||----w |' })
                    output.push({ type: 'output', text: '                ||     ||' })
                    break

                case 'github':
                    window.open('https://github.com/F3stive-Ya', '_blank')
                    output.push({ type: 'success', text: 'Opening GitHub profile...' })
                    break

                case 'linkedin':
                    window.open('https://www.linkedin.com/in/shaneborges/', '_blank')
                    output.push({ type: 'success', text: 'Opening LinkedIn profile...' })
                    break

                case 'hello':
                case 'hi':
                case 'hey':
                    const greetings = [
                        'Hello there! 👋',
                        'Hey! How are you?',
                        'Hi friend! 🙂',
                        'Greetings, traveler!',
                        'Howdy! 🤠'
                    ]
                    output.push({
                        type: 'system',
                        text: greetings[Math.floor(Math.random() * greetings.length)]
                    })
                    break

                case 'whoami':
                    output.push({ type: 'output', text: "You are a visitor on Shane's Portfolio!" })
                    output.push({
                        type: 'output',
                        text: 'And you are awesome for checking out the terminal 😎'
                    })
                    break

                case 'tree':
                    output.push({ type: 'warning', text: 'C:\\PORTFOLIO' })
                    output.push({ type: 'output', text: '├── about.txt' })
                    output.push({ type: 'dir', text: '├── projects' })
                    output.push({ type: 'output', text: '│   ├── dicegame.exe' })
                    output.push({ type: 'output', text: '│   ├── calculator.asm' })
                    output.push({ type: 'output', text: '│   ├── carracer.py' })
                    output.push({ type: 'output', text: '│   ├── passwordmaker.py' })
                    output.push({ type: 'output', text: '│   └── commonfactors.py' })
                    output.push({ type: 'output', text: '├── contact.txt' })
                    output.push({ type: 'output', text: '└── resume.pdf' })
                    break

                case 'rickroll':
                case 'rick':
                    output.push({ type: 'success', text: '🎵 Never gonna give you up...' })
                    output.push({ type: 'success', text: '🎵 Never gonna let you down...' })
                    output.push({
                        type: 'success',
                        text: '🎵 Never gonna run around and desert you...'
                    })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'warning', text: 'You just got rickrolled! 🕺' })
                    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
                    break

                case 'fortune':
                case 'quote':
                    const fortunes = [
                        '"The only way to do great work is to love what you do." - Steve Jobs',
                        '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
                        '"First, solve the problem. Then, write the code." - John Johnson',
                        '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
                        '"The best error message is the one that never shows up." - Thomas Fuchs',
                        '"Deleted code is debugged code." - Jeff Sickel',
                        '"640K ought to be enough for anybody." - Bill Gates (1981)',
                        '"It works on my machine." - Every developer ever'
                    ]
                    output.push({
                        type: 'system',
                        text: fortunes[Math.floor(Math.random() * fortunes.length)]
                    })
                    break

                case '8ball':
                case 'magic8ball':
                    const answers = [
                        'It is certain.',
                        'It is decidedly so.',
                        'Without a doubt.',
                        'Yes - definitely.',
                        'You may rely on it.',
                        'As I see it, yes.',
                        'Most likely.',
                        'Outlook good.',
                        'Yes.',
                        'Reply hazy, try again.',
                        'Ask again later.',
                        'Cannot predict now.',
                        "Don't count on it.",
                        'My reply is no.',
                        'My sources say no.',
                        'Outlook not so good.',
                        'Very doubtful.'
                    ]
                    output.push({
                        type: 'system',
                        text: '🎱 ' + answers[Math.floor(Math.random() * answers.length)]
                    })
                    break

                case 'joke':
                    const jokes = [
                        'Why do programmers prefer dark mode? Because light attracts bugs!',
                        'A SQL query walks into a bar, walks up to two tables and asks... "Can I join you?"',
                        "Why do Java developers wear glasses? Because they can't C#!",
                        "!false - It's funny because it's true.",
                        "There are only 10 types of people in the world: those who understand binary and those who don't.",
                        'A programmer\'s wife tells him: "Go to the store and buy a loaf of bread. If they have eggs, buy a dozen." He comes home with 12 loaves of bread.',
                        'Why did the developer go broke? Because he used up all his cache!'
                    ]
                    output.push({
                        type: 'success',
                        text: jokes[Math.floor(Math.random() * jokes.length)]
                    })
                    break

                case 'weather':
                    output.push({ type: 'system', text: "☀️ Weather for Shane's Portfolio:" })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: '  Temperature: 72°F (22°C)' })
                    output.push({ type: 'output', text: '  Conditions: Mostly Sunny ☀️' })
                    output.push({ type: 'output', text: '  Humidity: 42%' })
                    output.push({ type: 'output', text: '  Wind: Gentle breeze of creativity' })
                    output.push({ type: 'output', text: '' })
                    output.push({
                        type: 'warning',
                        text: '  Forecast: 100% chance of getting hired! 💼'
                    })
                    break

                case 'coffee':
                case 'brew':
                    output.push({ type: 'warning', text: '☕ Brewing coffee...' })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: '    ( (' })
                    output.push({ type: 'output', text: '     ) )' })
                    output.push({ type: 'output', text: '  .______.' })
                    output.push({ type: 'output', text: '  |      |]' })
                    output.push({ type: 'output', text: '  \\      /' })
                    output.push({ type: 'output', text: "   `----'" })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'success', text: "Here's your virtual coffee! ☕" })
                    break

                case 'cat':
                    if (!args) {
                        output.push({ type: 'output', text: '' })
                        output.push({ type: 'output', text: '  /\\_/\\' })
                        output.push({ type: 'output', text: ' ( o.o )' })
                        output.push({ type: 'output', text: '  > ^ <' })
                        output.push({ type: 'output', text: '' })
                        output.push({ type: 'system', text: 'Meow! 🐱' })
                    } else {
                        output.push({
                            type: 'error',
                            text: `cat: ${args}: No such file or directory`
                        })
                        output.push({ type: 'output', text: "(But here's a cat anyway 🐱)" })
                    }
                    break

                case 'dog':
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: '  / \\__' })
                    output.push({ type: 'output', text: ' (    @\\___' })
                    output.push({ type: 'output', text: ' /         O' })
                    output.push({ type: 'output', text: '/   (_____/' })
                    output.push({ type: 'output', text: '/_____/   U' })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'system', text: 'Woof woof! 🐕' })
                    break

                case 'flip':
                    output.push({ type: 'warning', text: '(╯°□°)╯︵ ┻━┻' })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: 'Table flipped!' })
                    break

                case 'unflip':
                    output.push({ type: 'success', text: '┬─┬ノ( º _ ºノ)' })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: 'Table restored. Calm down.' })
                    break

                case 'shrug':
                    output.push({ type: 'output', text: '¯\\_(ツ)_/¯' })
                    break

                case 'lenny':
                    output.push({ type: 'output', text: '( ͡° ͜ʖ ͡°)' })
                    break

                case 'facepalm':
                    output.push({ type: 'output', text: '(－‸ლ)' })
                    break

                case 'party':
                    output.push({ type: 'success', text: '🎉🎊🥳 PARTY TIME! 🥳🎊🎉' })
                    output.push({ type: 'warning', text: '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░' })
                    output.push({ type: 'system', text: '░░░▄▀▄▀▀▀▀▄▀▄░░░░░░░░░░░░░░░░░░░' })
                    output.push({ type: 'system', text: '░░░█░░░░░░░░▀▄░░░░░░░░░░░░░░░░░░' })
                    output.push({ type: 'system', text: '░░█░░▀░░▀░░░░░▀▄▄░░░░░░░░░░░░░░░' })
                    output.push({ type: 'system', text: '░░█░▄░█▀░▄░░░░░░░▀▀▄░░░░░░░░░░░░' })
                    output.push({ type: 'warning', text: '░░░▀▄░▀▀▀▀░░░░░░░░░▀▀░░░░░░░░░░░' })
                    break

                case 'konami':
                    output.push({ type: 'success', text: '↑ ↑ ↓ ↓ ← → ← → B A' })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'warning', text: '🎮 +30 LIVES!' })
                    output.push({
                        type: 'output',
                        text: 'You know the code! Classic gamer detected.'
                    })
                    break

                case 'ping':
                    output.push({
                        type: 'output',
                        text: 'Pinging portfolio.local with 32 bytes of data:'
                    })
                    output.push({
                        type: 'success',
                        text: 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=64'
                    })
                    output.push({
                        type: 'success',
                        text: 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=64'
                    })
                    output.push({
                        type: 'success',
                        text: 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=64'
                    })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: 'Ping statistics for portfolio.local:' })
                    output.push({
                        type: 'output',
                        text: '    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss)'
                    })
                    break

                case 'ipconfig':
                    output.push({ type: 'output', text: 'Windows 95 IP Configuration' })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: 'Ethernet adapter Local Area Connection:' })
                    output.push({
                        type: 'output',
                        text: '   IP Address. . . . . . . . . : 192.168.1.337'
                    })
                    output.push({
                        type: 'output',
                        text: '   Subnet Mask . . . . . . . . : 255.255.255.0'
                    })
                    output.push({
                        type: 'output',
                        text: '   Default Gateway . . . . . . : 192.168.1.1'
                    })
                    break

                case 'secret':
                case 'secrets':
                    output.push({ type: 'warning', text: '🤫 Shh... You found the secrets!' })
                    output.push({ type: 'output', text: '' })
                    output.push({ type: 'output', text: 'Try these commands:' })
                    output.push({
                        type: 'system',
                        text: '  rickroll, joke, fortune, 8ball, weather'
                    })
                    output.push({ type: 'system', text: '  coffee, cat, dog, flip, unflip' })
                    output.push({ type: 'system', text: '  party, konami, shrug, lenny, facepalm' })
                    output.push({ type: 'system', text: '  sudo, hack, matrix, crash, neofetch' })
                    break

                default:
                    output.push({
                        type: 'error',
                        text: `'${command}' is not recognized as an internal or external command,`
                    })
                    output.push({ type: 'error', text: 'operable program or batch file.' })
                    output.push({ type: 'output', text: '' })
                    output.push({
                        type: 'output',
                        text: 'Type "help" for available commands or "secrets" for easter eggs!'
                    })
            }

            setHistory((prev) => [...prev, ...output])
        },
        [currentDir, openWindow, triggerBSOD]
    )

    // Handle key events
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeCommand(currentInput)
            setCurrentInput('')
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (commandHistory.length > 0) {
                const newIndex =
                    historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
                setHistoryIndex(newIndex)
                setCurrentInput(commandHistory[newIndex])
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1
                if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1)
                    setCurrentInput('')
                } else {
                    setHistoryIndex(newIndex)
                    setCurrentInput(commandHistory[newIndex])
                }
            }
        }
    }

    // Get color class for output type
    const getColorClass = (type) => {
        switch (type) {
            case 'error':
                return 'terminal-error'
            case 'success':
                return 'terminal-success'
            case 'warning':
                return 'terminal-warning'
            case 'system':
                return 'terminal-system'
            case 'dir':
                return 'terminal-dir'
            case 'command':
                return 'terminal-command'
            default:
                return ''
        }
    }

    return (
        <div className="terminal-container" onClick={handleContainerClick} ref={containerRef}>
            <div className="terminal-output">
                {history.map((line, i) => (
                    <div key={i} className={`terminal-line ${getColorClass(line.type)}`}>
                        {line.text}
                    </div>
                ))}
            </div>
            <div className="terminal-input-line">
                <span className="terminal-prompt">{currentDir}&gt; </span>
                <input
                    ref={inputRef}
                    type="text"
                    className="terminal-input"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck={false}
                />
            </div>
        </div>
    )
}

export default Terminal
