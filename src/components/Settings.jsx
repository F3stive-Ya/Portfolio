import { useTheme } from '../context/ThemeContext'

const colorOptions = [
    { key: 'titlebarStart', label: 'Titlebar Start' },
    { key: 'titlebarEnd', label: 'Titlebar End' },
    { key: 'taskbarStart', label: 'Taskbar Start' },
    { key: 'taskbarEnd', label: 'Taskbar End' },
    { key: 'buttonBg', label: 'Button Background' },
    { key: 'startBtnStart', label: 'Start Button Start' },
    { key: 'startBtnEnd', label: 'Start Button End' },
    { key: 'accentColor', label: 'Accent Color' }
]

function Settings() {
    const { theme, updateTheme, resetTheme } = useTheme()

    return (
        <div className="settings-content">
            <p className="settings-description">
                Customize the appearance of your desktop interface. Changes are saved automatically.
            </p>
            <div className="settings-grid">
                {colorOptions.map(({ key, label }) => (
                    <div key={key} className="settings-row">
                        <label htmlFor={`color-${key}`}>{label}:</label>
                        <div className="color-input-wrapper">
                            <input
                                id={`color-${key}`}
                                type="color"
                                value={theme[key]}
                                onChange={(e) => updateTheme(key, e.target.value)}
                                className="color-input"
                            />
                            <span className="color-value">{theme[key]}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="settings-actions">
                <button onClick={resetTheme} className="settings-btn">
                    Reset to Defaults
                </button>
            </div>
        </div>
    )
}

export default Settings
