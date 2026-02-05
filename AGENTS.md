# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Windows 95-inspired portfolio website for Shane Borges (Cyber-Security student). The project recreates the classic Windows 95 desktop experience with draggable windows, a taskbar, start menu, BIOS boot sequence, and sound effects. Built with React 18 and Vite.

**Production URL:** `https://f3stive-ya.github.io/Portfolio/`

## Build System & Commands

This project uses **Vite** as the build tool with **Bun** as the package manager.

### Development Workflow

**Start development server:**

```powershell
bun run dev
```

Opens at `http://localhost:5173/` with hot module replacement.

**Build for production:**

```powershell
bun run build
```

Outputs to `dist/` directory with base path `/Portfolio/` (configured in `vite.config.js`).

**Preview production build locally:**

```powershell
bun run preview
```

**Deploy to GitHub Pages:**

```powershell
bun run deploy
```

Builds and pushes to `gh-pages` branch using the `gh-pages` package.

### CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys to GitHub Pages on push to `main`:

- Builds using Bun
- Uploads to GitHub Pages artifact
- Deploys via `actions/deploy-pages@v4`

## Architecture

### Application Structure

**Entry Point:** `src/main.jsx`

- Wraps `<App />` with `ThemeProvider` and `RecentProgramsProvider`
- Uses React StrictMode

**Core Component:** `src/App.jsx` (main state orchestrator)

- Manages system boot state machine (WAITING → BOOTING → LOGGING → RUNNING → SHUTDOWN)
- Handles all window management (open/close/minimize/maximize/z-index)
- Coordinates window drag/resize operations
- Contains window configurations (`WINDOW_CONFIGS`) and icon definitions (`ICONS`)

### State Management Architecture

**System State Machine:**
The app uses a finite state machine for boot sequence:

1. **WAITING** - Waiting for window focus to begin boot
2. **BOOTING** - BIOS screen with animated boot sequence
3. **LOGGING** - Login screen with startup sound
4. **RUNNING** - Desktop is active
5. **SHUTDOWN** - Shutdown sequence before reload

State persisted in `sessionStorage` (`borgesOS-booted`) to skip boot on page refresh within same session.

**Window State Management:**
All window states stored in `windowStates` object with structure:

```javascript
{
  [windowId]: {
    isOpen: boolean,
    isMinimized: boolean,
    isMaximized: boolean,
    zIndex: number,
    position: { top, left, width, height }
  }
}
```

**Z-Index System:**

- Uses `zCounter` (starts at 20) incremented on each `bringToFront()` call
- Active window always has highest z-index
- Prevents z-index overflow by tracking incrementally

### Context Providers

**ThemeContext** (`src/context/ThemeContext.jsx`):

- Manages color scheme (Windows 95 classic colors)
- Applies CSS custom properties to `:root`
- Persists theme to `localStorage` (`win95-theme`)
- Controls sound enable/disable state (`win95-sound`)

**RecentProgramsContext** (`src/context/RecentProgramsContext.jsx`):

- Tracks last 5 opened programs (MAX_RECENT = 5)
- Only tracks `TRACKABLE_PROGRAMS` (excludes system dialogs like run, settings)
- Persists to `localStorage` (`win95-recent-programs`)
- Used by Start Menu to display recently opened items

### Custom Hooks

**useSounds** (`src/hooks/useSounds.js`):

- Manages all system sounds (startup, click, error, minimize, close, open, chime)
- Respects `soundEnabled` from ThemeContext
- Handles base path detection for dev vs production (`/Portfolio/` prefix)
- Uses Audio API with cached audio elements
- `forcePlayStartup()` bypasses soundEnabled check for initial boot

### Key Components

**Desktop** (`src/components/Desktop.jsx`):

- Grid-based icon positioning system (GRID_SIZE = 100, GRID_ROWS = 6)
- Drag-and-drop with snap-to-grid functionality
- Selection box for multi-select (rubber band selection)
- Context menus for desktop and icons
- Icon positions persisted to `localStorage` (`desktop-icon-positions`)

**Window** (`src/components/Window.jsx`):

- Reusable draggable/resizable window component
- 8-directional resize handles (n, s, e, w, ne, nw, se, sw)
- Titlebar double-click toggles maximize
- Maximized state removes resize handles
- Controlled component (state managed by parent App)

**Taskbar** (`src/components/Taskbar.jsx`):

- Shows open windows as clickable buttons
- Active window highlighted with `--active-task-btn` color
- Start menu toggle button
- Clock display (system tray)

**StartMenu** (`src/components/StartMenu.jsx`):

- Lists all programs and recent programs
- System actions: Run, Settings, Shut Down
- Recent programs section populated from RecentProgramsContext

**BiosScreen** (`src/components/BiosScreen.jsx`):

- Animated boot sequence with system info display
- Exports `SYSTEM_INFO` object (CPU, RAM, HDD, GPU specs)
- Uses `LetterGlitch` component for matrix-style text animation

**FileExplorer** (`src/components/FileExplorer.jsx`):

- Tree view navigation
- Displays nested folder structure
- Can open windows by clicking items (receives `openWindow` prop)

**LoginScreen** (`src/components/LoginScreen.jsx`):

- Windows 95 style login interface
- Triggers startup sound via `forcePlayStartup()`

**Settings** (`src/components/Settings.jsx`):

- Color scheme customization (titlebar, taskbar, buttons, accent)
- Sound toggle
- Theme reset functionality

### Window Configurations

Windows defined in `WINDOW_CONFIGS` object with:

- `title`: Window title bar text
- `defaultStyle`: { top, left, width, height }
- `content`: JSX content or component
- `bodyStyle`: Optional custom styles for window body

Special windows:

- **resume**: Embeds PDF using `<object>` and `<iframe>` fallback
- **fileexplorer**: Content dynamically rendered to receive props
- **run**: Runtime-generated "Run" dialog (not in WINDOW_CONFIGS)

### Drag and Drop System

**Icon Dragging:**

- On mousedown: Store start position and icon's current position
- On mousemove: Calculate delta and update icon position (clamped to viewport)
- On mouseup: Snap to grid using `snapToGrid()` function

**Window Dragging:**

- Handled in App.jsx using `dragRef` and mouse event handlers
- Updates window position in `windowStates`
- Prevents dragging when window is maximized

**Window Resizing:**

- 8 resize handles per window (corners and edges)
- `resizeRef` tracks resize state (windowId, direction, start position, start size)
- MIN_WIDTH = 200, MIN_HEIGHT = 150 enforced

### Session Persistence

**SessionStorage:**

- `borgesOS-booted`: Set after first boot, checked to skip BIOS on refresh
- `borgesOS-resume-opened`: Tracks if Resume window auto-opened on boot

**LocalStorage:**

- `win95-theme`: Serialized theme colors object
- `win95-sound`: Boolean sound enable state
- `win95-recent-programs`: Array of recently opened program IDs
- `desktop-icon-positions`: Object mapping icon IDs to { x, y } positions

All cleared on shutdown except theme (persists across sessions).

### Mobile Detection

The app displays a "Desktop Only" message on mobile devices:

- Checks `window.innerWidth <= 768` or touch device with width <= 1024
- Listens for resize events to update detection
- Prevents layout issues on small screens

## Asset Paths

**Base Path Handling:**

- Production: `/Portfolio/` (configured in `vite.config.js`)
- Development: `/` (root)
- Sound and icon paths must account for base path in production

**Public Assets:**

- `public/icons/` - Desktop and window icons
- `public/sounds/` - System sounds (WAV format)
- `public/resume.pdf` - Embedded PDF document

## Styling

**CSS Architecture:**

- `src/index.css` - All styles in single file (~29KB)
- Uses CSS custom properties from ThemeContext
- Windows 95 visual style: beveled borders, gradient title bars
- CSS classes: `.window`, `.taskbar`, `.start-menu`, `.desktop-icon`, etc.

**Theme Variables:**

```css
--titlebar-start, --titlebar-end
--taskbar-start, --taskbar-end
--button-bg
--active-task-btn
--start-btn-start, --start-btn-end
--accent-color
```

## Development Patterns

### Adding a New Window

1. Add window config to `WINDOW_CONFIGS` in App.jsx:

    ```javascript
    mywindow: {
      title: 'Window Title',
      defaultStyle: { top: 100, left: 100, width: 400, height: 300 },
      content: <YourComponent />
    }
    ```

2. Add desktop icon to `ICONS` array:

    ```javascript
    { id: 'mywindow', label: 'My Window', icon: 'icons/myicon.svg' }
    ```

3. Initialize window state in `windowStates` initial state (happens automatically via Object.keys loop)

4. Optionally add to `TRACKABLE_PROGRAMS` if it should appear in recent programs

### Adding Sound Effects

1. Place WAV file in `public/sounds/`
2. Add to `SOUNDS` object in `useSounds.js`
3. Create corresponding play function:
    ```javascript
    playMySound: useCallback(() => playSound('mysound', 0.5), [playSound])
    ```

### Customizing Boot Sequence

Modify system states in App.jsx:

- `SYSTEM_STATE` defines available states
- `setSystemState()` transitions between states
- Components render conditionally based on `systemState`

## Known Patterns

### Window Props Pattern

Windows receive these standard props from App.jsx:

- `id`: Window identifier
- `title`: Title bar text
- `state`: Window state object
- `isActive`: Boolean if window has focus
- `onClose`, `onMinimize`, `onMaximize`: Control callbacks
- `onTitlebarMouseDown`, `onTitlebarDoubleClick`: Drag/maximize handlers
- `onWindowMouseDown`: Focus handler
- `onResizeStart`: Resize handler

### Error Dialog Pattern

Run dialog validates commands and shows ErrorDialog on invalid input:

```javascript
setRunErrorDialog({ title: 'Error', message: 'Command not found' })
```

### Auto-Open Pattern

Resume window automatically opens after boot completes:

- Uses `useEffect` watching `systemState === RUNNING`
- `hasOpenedResumeRef` prevents duplicate opens
- Checks `sessionStorage` for first boot detection
