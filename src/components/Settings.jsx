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
    const { theme, updateTheme, resetTheme, soundEnabled, toggleSound } = useTheme()

    return (
        <div className="settings-content">
            <p className="settings-description">
                Customize the appearance of your desktop interface. Changes are saved automatically.
            </p>

            {/* Sound Settings */}
            <div className="settings-section">
                <h4 style={{ margin: '0 0 8px 0', fontSize: '12px' }}>🔊 Sound Settings</h4>
                <div className="settings-row">
                    <label htmlFor="sound-toggle">Enable Sound Effects:</label>
                    <div className="checkbox-wrapper">
                        <input
                            id="sound-toggle"
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={toggleSound}
                            className="win95-checkbox"
                        />
                        <span style={{ marginLeft: '8px', fontSize: '11px' }}>
                            {soundEnabled ? 'On' : 'Off'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Color Settings */}
            <div className="settings-section">
                <h4 style={{ margin: '12px 0 8px 0', fontSize: '12px' }}>🎨 Color Settings</h4>
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
