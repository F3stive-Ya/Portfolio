import { useState, useRef, useEffect, useCallback } from 'react'

const TOOLS = {
    PENCIL: 'pencil',
    BRUSH: 'brush',
    ERASER: 'eraser',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse',
    FILL: 'fill',
    EYEDROPPER: 'eyedropper',
    TEXT: 'text'
}

const COLOR_PALETTE = [
    '#000000',
    '#808080',
    '#800000',
    '#808000',
    '#008000',
    '#008080',
    '#000080',
    '#800080',
    '#ffffff',
    '#c0c0c0',
    '#ff0000',
    '#ffff00',
    '#00ff00',
    '#00ffff',
    '#0000ff',
    '#ff00ff',
    '#c0dcc0',
    '#a6caf0',
    '#fffbf0',
    '#a0a0a4',
    '#ff8040',
    '#00ff80',
    '#80ffff',
    '#8080ff',
    '#ff0080',
    '#804040',
    '#408040',
    '#004080',
    '#408080',
    '#804080',
    '#ff8080',
    '#80ff80'
]

const BRUSH_SIZES = [1, 2, 4, 6, 8, 12, 16, 24]

const ToolButton = ({ toolType, icon, title, currentTool, onSelectTool }) => (
    <button
        className={`paint-tool-btn ${currentTool === toolType ? 'active' : ''}`}
        onClick={() => onSelectTool(toolType)}
        title={title}
    >
        {icon}
    </button>
)

function Paint() {
    const canvasRef = useRef(null)
    const overlayCanvasRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [tool, setTool] = useState(TOOLS.PENCIL)
    const [color, setColor] = useState('#000000')
    const [secondaryColor, setSecondaryColor] = useState('#ffffff')
    const [brushSize, setBrushSize] = useState(2)
    const [startPos, setStartPos] = useState({ x: 0, y: 0 })
    const [history, setHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

    // Save canvas state to history
    const saveToHistory = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const imageData = canvas.toDataURL()
        setHistory((prev) => {
            const newHistory = prev.slice(0, historyIndex + 1)
            newHistory.push(imageData)
            return newHistory.slice(-20) // Keep last 20 states
        })
        setHistoryIndex((prev) => Math.min(prev + 1, 19))
    }, [historyIndex])

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current
        const overlay = overlayCanvasRef.current
        if (!canvas || !overlay) return

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Save initial state
        saveToHistory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Undo
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            const img = new Image()
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0)
            }
            img.src = history[historyIndex - 1]
            setHistoryIndex((prev) => prev - 1)
        }
    }, [history, historyIndex])

    // Redo
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            const img = new Image()
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0)
            }
            img.src = history[historyIndex + 1]
            setHistoryIndex((prev) => prev + 1)
        }
    }, [history, historyIndex])

    // Clear canvas
    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = secondaryColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        saveToHistory()
    }, [secondaryColor, saveToHistory])

    // Get mouse position relative to canvas
    const getMousePos = (e) => {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        return {
            x: Math.floor((e.clientX - rect.left) * scaleX),
            y: Math.floor((e.clientY - rect.top) * scaleY)
        }
    }

    // Drawing functions
    const drawLine = (ctx, x1, y1, x2, y2, strokeColor, size) => {
        ctx.beginPath()
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = size
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }

    const drawRectangle = (ctx, x1, y1, x2, y2, strokeColor, size, fill = false) => {
        const x = Math.min(x1, x2)
        const y = Math.min(y1, y2)
        const w = Math.abs(x2 - x1)
        const h = Math.abs(y2 - y1)

        ctx.beginPath()
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = size
        ctx.rect(x, y, w, h)
        if (fill) {
            ctx.fillStyle = strokeColor
            ctx.fill()
        }
        ctx.stroke()
    }

    const drawEllipse = (ctx, x1, y1, x2, y2, strokeColor, size, fill = false) => {
        const centerX = (x1 + x2) / 2
        const centerY = (y1 + y2) / 2
        const radiusX = Math.abs(x2 - x1) / 2
        const radiusY = Math.abs(y2 - y1) / 2

        ctx.beginPath()
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = size
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        if (fill) {
            ctx.fillStyle = strokeColor
            ctx.fill()
        }
        ctx.stroke()
    }

    // Flood fill algorithm
    const floodFill = (startX, startY, fillColor) => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        const startIdx = (startY * canvas.width + startX) * 4
        const startR = data[startIdx]
        const startG = data[startIdx + 1]
        const startB = data[startIdx + 2]

        // Parse fill color
        const hex = fillColor.replace('#', '')
        const fillR = parseInt(hex.substring(0, 2), 16)
        const fillG = parseInt(hex.substring(2, 4), 16)
        const fillB = parseInt(hex.substring(4, 6), 16)

        // If same color, return
        if (startR === fillR && startG === fillG && startB === fillB) return

        const stack = [[startX, startY]]
        const visited = new Set()

        while (stack.length > 0) {
            const [x, y] = stack.pop()
            const key = `${x},${y}`

            if (visited.has(key)) continue
            if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue

            const idx = (y * canvas.width + x) * 4
            if (data[idx] !== startR || data[idx + 1] !== startG || data[idx + 2] !== startB)
                continue

            visited.add(key)
            data[idx] = fillR
            data[idx + 1] = fillG
            data[idx + 2] = fillB
            data[idx + 3] = 255

            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
        }

        ctx.putImageData(imageData, 0, 0)
    }

    // Eyedropper
    const pickColor = (x, y) => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const pixel = ctx.getImageData(x, y, 1, 1).data
        const hex =
            '#' +
            [pixel[0], pixel[1], pixel[2]].map((c) => c.toString(16).padStart(2, '0')).join('')
        setColor(hex)
    }

    // Mouse event handlers
    const handleMouseDown = (e) => {
        const pos = getMousePos(e)
        setStartPos(pos)
        setIsDrawing(true)

        if (tool === TOOLS.FILL) {
            floodFill(pos.x, pos.y, e.button === 2 ? secondaryColor : color)
            saveToHistory()
        } else if (tool === TOOLS.EYEDROPPER) {
            pickColor(pos.x, pos.y)
        } else if (tool === TOOLS.PENCIL || tool === TOOLS.BRUSH || tool === TOOLS.ERASER) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            const drawColor =
                tool === TOOLS.ERASER ? secondaryColor : e.button === 2 ? secondaryColor : color
            const size = tool === TOOLS.BRUSH ? brushSize * 2 : brushSize

            ctx.beginPath()
            ctx.arc(pos.x, pos.y, size / 2, 0, 2 * Math.PI)
            ctx.fillStyle = drawColor
            ctx.fill()
        }
    }

    const handleMouseMove = (e) => {
        const pos = getMousePos(e)
        setCursorPos(pos)

        if (!isDrawing) return

        const canvas = canvasRef.current
        const overlay = overlayCanvasRef.current
        const ctx = canvas.getContext('2d')
        const overlayCtx = overlay.getContext('2d')

        const drawColor = tool === TOOLS.ERASER ? secondaryColor : color
        const size = tool === TOOLS.BRUSH ? brushSize * 2 : brushSize

        if (tool === TOOLS.PENCIL || tool === TOOLS.BRUSH || tool === TOOLS.ERASER) {
            drawLine(ctx, startPos.x, startPos.y, pos.x, pos.y, drawColor, size)
            setStartPos(pos)
        } else if (tool === TOOLS.LINE || tool === TOOLS.RECTANGLE || tool === TOOLS.ELLIPSE) {
            // Clear overlay and draw preview
            overlayCtx.clearRect(0, 0, overlay.width, overlay.height)

            if (tool === TOOLS.LINE) {
                drawLine(overlayCtx, startPos.x, startPos.y, pos.x, pos.y, drawColor, size)
            } else if (tool === TOOLS.RECTANGLE) {
                drawRectangle(overlayCtx, startPos.x, startPos.y, pos.x, pos.y, drawColor, size)
            } else if (tool === TOOLS.ELLIPSE) {
                drawEllipse(overlayCtx, startPos.x, startPos.y, pos.x, pos.y, drawColor, size)
            }
        }
    }

    const handleMouseUp = (e) => {
        if (!isDrawing) return

        const pos = getMousePos(e)
        const canvas = canvasRef.current
        const overlay = overlayCanvasRef.current
        const ctx = canvas.getContext('2d')
        const overlayCtx = overlay.getContext('2d')

        const drawColor = tool === TOOLS.ERASER ? secondaryColor : color
        const size = tool === TOOLS.BRUSH ? brushSize * 2 : brushSize

        // Finalize shape tools
        if (tool === TOOLS.LINE) {
            drawLine(ctx, startPos.x, startPos.y, pos.x, pos.y, drawColor, size)
        } else if (tool === TOOLS.RECTANGLE) {
            drawRectangle(ctx, startPos.x, startPos.y, pos.x, pos.y, drawColor, size)
        } else if (tool === TOOLS.ELLIPSE) {
            drawEllipse(ctx, startPos.x, startPos.y, pos.x, pos.y, drawColor, size)
        }

        // Clear overlay
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height)

        setIsDrawing(false)

        if (tool !== TOOLS.EYEDROPPER && tool !== TOOLS.FILL) {
            saveToHistory()
        }
    }

    // Save image
    const saveImage = () => {
        const canvas = canvasRef.current
        const link = document.createElement('a')
        link.download = 'my-painting.png'
        link.href = canvas.toDataURL()
        link.click()
    }

    return (
        <div className="paint-container">
            {/* Menu bar */}
            <div className="paint-menubar">
                <div className="paint-menu-item">
                    <span className="paint-menu-label">File</span>
                    <div className="paint-dropdown">
                        <button onClick={clearCanvas}>New</button>
                        <button onClick={saveImage}>Save As...</button>
                    </div>
                </div>
                <div className="paint-menu-item">
                    <span className="paint-menu-label">Edit</span>
                    <div className="paint-dropdown">
                        <button onClick={undo} disabled={historyIndex <= 0}>
                            Undo
                        </button>
                        <button onClick={redo} disabled={historyIndex >= history.length - 1}>
                            Redo
                        </button>
                    </div>
                </div>
            </div>

            <div className="paint-main">
                {/* Toolbar */}
                <div className="paint-toolbar">
                    <ToolButton
                        toolType={TOOLS.PENCIL}
                        icon="✏️"
                        title="Pencil"
                        currentTool={tool}
                        onSelectTool={setTool}
                    />
                    <ToolButton
                        toolType={TOOLS.BRUSH}
                        icon="🖌️"
                        title="Brush"
                        currentTool={tool}
                        onSelectTool={setTool}
                    />
                    <ToolButton
                        toolType={TOOLS.ERASER}
                        icon="🧹"
                        title="Eraser"
                        currentTool={tool}
                        onSelectTool={setTool}
                    />
                    <ToolButton
                        toolType={TOOLS.FILL}
                        icon="🪣"
                        title="Fill"
                        currentTool={tool}
                        onSelectTool={setTool}
                    />
                    <ToolButton
                        toolType={TOOLS.EYEDROPPER}
                        icon="💉"
                        title="Eyedropper"
                        currentTool={tool}
                        onSelectTool={setTool}
                    />
                    <div className="paint-tool-separator" />
                    <ToolButton
                        toolType={TOOLS.LINE}
                        icon="📏"
                        title="Line"
                        currentTool={tool}
                        onSelectTool={setTool}
                    />
                    <ToolButton
                        toolType={TOOLS.RECTANGLE}
                        icon="⬜"
                        title="Rectangle"
                        currentTool={tool}
                        onSelectTool={setTool}
                    />
                    <ToolButton
                        toolType={TOOLS.ELLIPSE}
                        icon="⭕"
                        title="Ellipse"
                        currentTool={tool}
                        onSelectTool={setTool}
                    />

                    <div className="paint-tool-separator" />

                    {/* Brush size */}
                    <div className="paint-size-selector">
                        {BRUSH_SIZES.slice(0, 4).map((size) => (
                            <button
                                key={size}
                                className={`paint-size-btn ${brushSize === size ? 'active' : ''}`}
                                onClick={() => setBrushSize(size)}
                                title={`Size ${size}`}
                            >
                                <span
                                    style={{
                                        width: Math.min(size * 2, 16),
                                        height: Math.min(size * 2, 16),
                                        background: '#000',
                                        borderRadius: '50%',
                                        display: 'inline-block'
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Canvas area */}
                <div className="paint-canvas-area">
                    <div className="paint-canvas-wrapper">
                        <canvas
                            ref={canvasRef}
                            width={640}
                            height={400}
                            className="paint-canvas"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onContextMenu={(e) => e.preventDefault()}
                        />
                        <canvas
                            ref={overlayCanvasRef}
                            width={640}
                            height={400}
                            className="paint-overlay"
                            style={{ pointerEvents: 'none' }}
                        />
                    </div>
                </div>

                {/* Color palette */}
                <div className="paint-palette">
                    <div className="paint-current-colors">
                        <div
                            className="paint-color-display primary"
                            style={{ backgroundColor: color }}
                            title="Primary color (left click)"
                        />
                        <div
                            className="paint-color-display secondary"
                            style={{ backgroundColor: secondaryColor }}
                            title="Secondary color (right click)"
                        />
                    </div>
                    <div className="paint-colors">
                        {COLOR_PALETTE.map((c, i) => (
                            <button
                                key={i}
                                className={`paint-color-btn ${color === c ? 'active' : ''}`}
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                                onContextMenu={(e) => {
                                    e.preventDefault()
                                    setSecondaryColor(c)
                                }}
                                title={c}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Status bar */}
            <div className="paint-statusbar">
                <span>
                    Position: {cursorPos.x}, {cursorPos.y}
                </span>
                <span>Tool: {tool}</span>
                <span>Size: {brushSize}px</span>
            </div>
        </div>
    )
}

export default Paint
