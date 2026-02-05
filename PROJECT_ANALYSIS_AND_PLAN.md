# Project Analysis & Improvement Plan

**Date:** 2026-02-05
**Target:** Windows 95 Portfolio (`react-app`)

---

## 1. Codebase Analysis Summary

### Architecture & Tech Stack

- **Framework:** React 18 with Vite.
- **Package Manager:** Bun.
- **State Management:** Centralized in `App.jsx` with window management logic encapsulated in `useWindowManager` hook.
- **Styling:** Primarily a large `index.css` file. Components recently starting to use CSS Modules (e.g., `StartMenu.module.css`).
- **Persistence:** `localStorage` for theme, recent programs, and Notepad content. `sessionStorage` for boot state.

### Implementation Patterns

- **Windows:** Defined in `src/config/windows.jsx` and rendered via the `Window.jsx` wrapper in `App.jsx`.
- **Aesthetics:** High-fidelity Windows 95 recreation using beveled borders, specific hex colors (`#c0c0c0`), and classic icons.

---

## 2. Identified Bugs & Improvement Areas

### 2.1. Accessibility (Priority: High)

- **Issue:** Many interactive elements (Desktop Icons, Taskbar buttons) are `div`s without proper ARIA roles or keyboard focus support.
- **Impact:** Keyboard-only users and screen readers cannot navigate the OS effectively.

### 2.2. Style Maintainability (Priority: Medium)

- **Issue:** `index.css` is quite large. While modularization has begun, many core styles are still global.
- **Recommendation:** Continue migrating to CSS Modules for all components to prevent style bleeding.

### 2.3. Notepad Functionality (Priority: Medium)

- **Issue:** Lacks standard File I/O operations expected of a "productivity" app.
- **Improvement:** Implement "Save to Local" and "Open from Local".

### 2.4. Minesweeper UI (Priority: Low)

- **Improvement:** Ensure the window perfectly fits the board on all difficulties without any redundant scrollbars or dead space.

---

## 3. Investigated Features & Solutions

### 3.1. Notepad: Local Device Saving

- **Feasibility:** ✅ Highly Feasible.
- **Solution:**
    - **Save:** Use the `Blob` API to create a plain text object: `new Blob([content], { type: 'text/plain' })`. Trigger download using an ephemeral `<a>` tag.
    - **Open:** Implement a hidden `<input type="file" accept=".txt">`. Use `FileReader` to read the content and update the Notepad state.

### 3.2. Solitaire (Freecell)

- **Feasibility:** ✅ Feasible (Custom Implementation).
- **Preferred Approach:** **Custom React Implementation**.
- **Details:**
    - Build a deck-shuffling utility using the Fisher-Yates algorithm.
    - Implement drag-and-drop using standard mouse events (matching the project's existing drag logic) or a lightweight library like `react-use-gesture`.
    - Aesthetics: Use the classic Windows card assets (can be sourced or recreated) and the `React95` look for the window.

---

## 4. Proposed Upgrades & Solutions

### Upgrade 1: The "Power User" Notepad

- Add **Status Bar** showing real-time cursor position (Ln/Col).
- Add **File Menu** with:
    - `New`: Clear current document (with confirmation).
    - `Open...`: Load local `.txt` files.
    - `Save`: Download as `document.txt`.
    - `Save As...`: Download with custom name.

### Upgrade 2: Classic Games Pack

- **Freecell:** A fully playable version with 8 columns, 4 free cells, and 4 home cells.

### Upgrade 3: Architectural Cleanup

- Split `index.css` further.
- Extract any remaining logic from `App.jsx` (e.g., keyboard shortcuts) into a `useKeyboardShortcuts` hook.

---

## 5. Implementation Roadmap for Next Agent

1. **Step 1: Notepad Overhaul** - Implement the Save/Open logic.
2. **Step 2: Accessibility Blitz** - Add `role="button"` and `tabIndex="0"` across the desktop.
3. **Step 3: Freecell Development** - Build the logic-heavy Freecell component.
4. **Step 4: Final Polish** - Run linting and verify responsive behavior.
