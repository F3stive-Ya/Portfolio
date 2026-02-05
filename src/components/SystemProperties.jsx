import React, { useState } from 'react'
import { SYSTEM_INFO } from './BiosScreen'

const SystemProperties = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('general')

    return (
        <div className="system-properties">
            <div className="props-tabs">
                <div
                    className={`props-tab ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    General
                </div>
                <div
                    className={`props-tab ${activeTab === 'devicemanager' ? 'active' : ''}`}
                    onClick={() => setActiveTab('devicemanager')}
                >
                    Device Manager
                </div>
                <div
                    className={`props-tab ${activeTab === 'performance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('performance')}
                >
                    Performance
                </div>
            </div>

            <div className="props-body">
                {activeTab === 'general' && (
                    <div className="props-content general">
                        <div className="props-section">
                            <div className="props-icon system-icon"></div>
                            <div className="props-info">
                                <p>System:</p>
                                <p className="indent">Microsoft Windows 95</p>
                                <p className="indent">4.00.950 B</p>
                            </div>
                        </div>

                        <div className="props-section">
                            <div className="props-info">
                                <p>Registered to:</p>
                                <p className="indent">Shane Borges</p>
                                <p className="indent">Cyber-Security Student</p>
                            </div>
                        </div>

                        <div className="props-section">
                            <div className="props-icon computer-icon"></div>
                            <div className="props-info">
                                <p>Computer:</p>
                                <p className="indent">{SYSTEM_INFO.cpu}</p>
                                <p className="indent">{SYSTEM_INFO.ram}</p>
                                <p className="indent">32-bit System</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'devicemanager' && (
                    <div className="props-content devicemanager">
                        <div className="device-tree">
                            <div className="tree-node">
                                <span className="tree-icon computer-small"></span>
                                <span>Desktop Computer</span>
                            </div>
                            <div className="tree-branches">
                                <div className="tree-node">
                                    <span className="tree-expand">+</span>
                                    <span className="tree-icon disk"></span>
                                    <span>Disk drives</span>
                                </div>
                                <div className="tree-node">
                                    <span className="tree-expand">+</span>
                                    <span className="tree-icon display"></span>
                                    <span>Display adapters</span>
                                </div>
                                <div className="tree-node">
                                    <span className="tree-expand">+</span>
                                    <span className="tree-icon keyboard"></span>
                                    <span>Keyboard</span>
                                </div>
                                <div className="tree-node">
                                    <span className="tree-expand">+</span>
                                    <span className="tree-icon mouse"></span>
                                    <span>Mouse</span>
                                </div>
                            </div>
                        </div>
                        <div className="device-buttons">
                            <button disabled>Properties</button>
                            <button disabled>Refresh</button>
                            <button disabled>Remove</button>
                            <button disabled>Print...</button>
                        </div>
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="props-content performance">
                        <div className="perf-grid">
                            <div className="perf-label">Memory:</div>
                            <div className="perf-value">{SYSTEM_INFO.ram} of RAM</div>

                            <div className="perf-label">System Resources:</div>
                            <div className="perf-value">85% free</div>

                            <div className="perf-label">File System:</div>
                            <div className="perf-value">32-bit</div>

                            <div className="perf-label">Virtual Memory:</div>
                            <div className="perf-value">32-bit</div>

                            <div className="perf-label">Disk Compression:</div>
                            <div className="perf-value">Not installed</div>

                            <div className="perf-label">PC Cards (PCMCIA):</div>
                            <div className="perf-value">No PC Card sockets are installed</div>
                        </div>
                        <div className="perf-advanced">
                            <div className="group-box">
                                <span className="group-label">Advanced settings</span>
                                <div className="perf-btns">
                                    <button disabled>File System...</button>
                                    <button disabled>Graphics...</button>
                                    <button disabled>Virtual Memory...</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="props-footer">
                <button onClick={onClose}>OK</button>
                <button onClick={onClose}>Cancel</button>
            </div>

            <style>{`
                .system-properties {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    font-family: "MS Sans Serif", sans-serif;
                    font-size: 11px;
                }
                
                .props-tabs {
                    display: flex;
                    padding: 4px 4px 0;
                    gap: 2px;
                }
                
                .props-tab {
                    padding: 3px 8px;
                    background: #c0c0c0;
                    border: 1px solid #fff;
                    border-bottom: none;
                    border-top-left-radius: 3px;
                    border-top-right-radius: 3px;
                    cursor: pointer;
                    position: relative;
                    top: 1px;
                }
                
                .props-tab.active {
                    background: #c0c0c0;
                    border: 1px outset #fff;
                    border-bottom: 2px solid #c0c0c0;
                    z-index: 2;
                    padding-bottom: 4px;
                    margin-top: -2px;
                }
                
                .props-body {
                    flex: 1;
                    padding: 12px;
                    border: 2px outset #fff;
                    background: #c0c0c0;
                    position: relative;
                    z-index: 1;
                }
                
                .props-content {
                    height: 100%;
                }
                
                .props-content.general {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .props-section {
                    display: flex;
                    gap: 20px;
                }
                
                .props-icon {
                    width: 32px;
                    height: 32px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }
                
                .system-icon {
                    background-image: url('icons/computer_explorer_cool-0.png');
                }
                
                .computer-icon {
                    background-image: url('icons/processor-0.png');
                }
                
                .props-info p {
                    margin: 2px 0;
                }
                
                .props-info .indent {
                    margin-left: 16px;
                }
                
                .device-tree {
                    border: 2px inset #fff;
                    background: #fff;
                    padding: 4px;
                    height: 200px;
                    overflow-y: auto;
                    margin-bottom: 10px;
                }
                
                .device-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }
                
                .device-buttons button {
                    min-width: 75px;
                }
                
                .perf-grid {
                    display: grid;
                    grid-template-columns: 140px 1fr;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                
                .group-box {
                    border: 2px groove #fff;
                    padding: 12px;
                    position: relative;
                    margin-top: 8px;
                }
                
                .group-label {
                    position: absolute;
                    top: -6px;
                    left: 8px;
                    background: #c0c0c0;
                    padding: 0 4px;
                }
                
                .perf-btns {
                    display: flex;
                    justify-content: space-around;
                }
                
                .props-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    padding: 10px;
                }
                
                .props-footer button {
                    min-width: 75px;
                }
            `}</style>
        </div>
    )
}

export default SystemProperties
