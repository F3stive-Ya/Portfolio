# Project Analysis & Improvement Plan

**Date:** 2026-02-05
**Target:** Windows 95 Portfolio (`react-app`)

## 1. Executive Summary

The project is a creative, Windows 95-themed portfolio built with React and Vite. It successfully emulates the desktop experience with window management, a start menu, and various applications. The codebase is functional but exhibits signs of rapid development, such as a monolithic `App.jsx` and a massive global stylesheet. To ensure long-term maintainability and performance, architectural refactoring is recommended alongside the introduction of testing and accessibility improvements.

## 2. Codebase Health Analysis

| Category          | Status               | Notes                                                                                                                        |
| :---------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **Architecture**  | ⚠️ Needs Improvement | `App.jsx` acts as a "God Component" managing too many responsibilities (Window State, System State, Drag/Resize, Shortcuts). |
| **Styling**       | ⚠️ Unmaintainable    | Single `index.css` file (>67KB) contains all styles. Global scope collision risk is high.                                    |
| **Performance**   | ✅ Good              | Build passes. Vite ensures fast dev server.                                                                                  |
| **Testing**       | ❌ Missing           | No test runner configured. No unit or integration tests found.                                                               |
| **Accessibility** | ❌ Critical          | Many interactive elements (div buttons) lack `role`, `tabIndex`, and `aria` attributes.                                      |
| **Type Safety**   | ❌ None              | Plain JavaScript used. Prop types are not validated (missing `prop-types` or TypeScript).                                    |

## 3. Identified Issues & Bugs

### 3.1. Accessibility (Critical)

- **Issue:** Custom UI elements like Desktop Icons, Taskbar buttons, and Start Menu items are implemented as `div`s with `onClick` handlers.
- **Impact:** Users relying on keyboard navigation or screen readers cannot use the portfolio effectively.
- **Fix:**
    - Convert clickable `div`s to `<button>` elements where possible.
    - Add `tabIndex="0"`, `role="button"`, and `onKeyDown` handlers for custom elements.
    - Ensure focus management when opening/closing windows.

### 3.2. Mobile Experience

- **Issue:** The app blocks execution on mobile devices with a "Desktop Only" message.
- **Impact:** A significant portion of portfolio traffic comes from mobile. Blocking them results in lost opportunities.
- **Fix:** Implement a "Mobile Desktop" view or a fallback "Simple Portfolio" view for small screens instead of blocking access.

### 3.3. Monolithic State Manager

- **Issue:** `App.jsx` handles low-level logic (dragging math, resizing math) mixed with high-level logic (boot sequence, window orchestration).
- **Impact:** Hard to read, hard to test, and prone to regression bugs when modifying one part.

## 4. Improvement Solutions & Upgrades

### Phase 1: Stability & Standards (Immediate)

1.  **Install Linting & Formatting**:
    - Add `eslint` and `prettier` to enforce code style.
    - Fix existing lint warnings.
2.  **Setup Testing Infrastructure**:
    - Install `vitest` and `@testing-library/react`.
    - Write basic smoke tests for `App.jsx` and critical components like `Minesweeper`.

### Phase 2: Architectural Refactor (High Priority)

1.  **Extract Custom Hooks**:
    - `useWindowDrag`: Encapsulate the drag-and-drop logic currently in `App.jsx`.
    - `useWindowResize`: Encapsulate the resize logic.
    - `useWindowManager`: Manage `windowStates`, `openWindow`, `closeWindow`, `zCounter`.
    - `useSystemBoot`: Handle the BIOS -> Login -> Desktop state machine.
2.  **Component Splitting**:
    - Move `WINDOW_CONFIGS` to a separate `config/windows.jsx` file.
    - Create a `<WindowManager />` component that consumes the context and renders windows, removing the loop from `App.jsx`.

### Phase 3: CSS Modularization

1.  **Refactor `index.css`**:
    - Split the massive file into component-specific files.
    - **Recommendation**: Use **CSS Modules** (e.g., `Window.module.css`, `Taskbar.module.css`) to scope styles locally and avoid collisions.

### Phase 4: Feature Upgrades (Future)

1.  **TypeScript Migration**:
    - Gradually convert files to `.tsx` to add type safety, especially for the `windowStates` object and complex props.
2.  **Lazy Loading**:
    - Use `React.lazy` and `Suspense` for heavy "apps" like `Paint` or `Terminal` so they don't bloat the initial bundle.

## 5. Action Plan for Next Agent

If you are the agent receiving this plan, please execute the following steps in order:

1.  **Setup ESLint/Prettier** to stabilize the code style.
2.  **Create Custom Hooks** folder and extract `useWindowManager.js` from `App.jsx`.
3.  **Refactor `App.jsx`** to use the new hook.
4.  **Modularize CSS** for one component (e.g., `StartMenu`) as a proof-of-concept, then apply to others.
5.  **Address Accessibility** in the `StartMenu` and `Taskbar`.
