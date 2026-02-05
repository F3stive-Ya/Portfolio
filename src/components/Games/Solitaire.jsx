import { useState, useEffect, useCallback } from 'react'
import PlayingCard from './PlayingCard'
import { SUITS, RANKS } from '../../config/freecell'
import '../../index.css'

const Solitaire = () => {
    const [board, setBoard] = useState({
        columns: Array(7).fill([]),
        foundations: Array(4).fill([]),
        stock: [],
        waste: []
    })
    const [draggedCard, setDraggedCard] = useState(null)
    const [dragSource, setDragSource] = useState(null) // { type: 'column'|'waste'|'foundation', index: number, cardIndex: number }

    const initializeGame = useCallback(() => {
        // 1. Create Deck
        const deck = []
        SUITS.forEach((suit) => {
            RANKS.forEach((rank, index) => {
                deck.push({
                    suit,
                    rank,
                    value: index + 1,
                    id: `${rank}${suit}`,
                    color: suit === '♥' || suit === '♦' ? 'red' : 'black',
                    faceUp: false
                })
            })
        })

        // 2. Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[deck[i], deck[j]] = [deck[j], deck[i]]
        }

        // 3. Deal Columns
        const newColumns = Array(7).fill().map(() => [])
        let cardIndex = 0

        for (let col = 0; col < 7; col++) {
            for (let row = 0; row <= col; row++) {
                const card = { ...deck[cardIndex++] }
                if (row === col) card.faceUp = true // Top card face up
                newColumns[col].push(card)
            }
        }

        // 4. Remaining to Stock
        const newStock = deck.slice(cardIndex).map(c => ({ ...c, faceUp: false }))

        setBoard({
            columns: newColumns,
            foundations: Array(4).fill([]),
            stock: newStock,
            waste: []
        })
    }, [])

    useEffect(() => {
        initializeGame()
    }, [initializeGame])

    // --- Helpers ---

    const getCardStack = (source) => {
        if (!source) return []
        if (source.type === 'column') {
            return board.columns[source.index].slice(source.cardIndex)
        }
        if (source.type === 'waste') {
            return [board.waste[board.waste.length - 1]]
        }
        if (source.type === 'foundation') {
            return [board.foundations[source.index][board.foundations[source.index].length - 1]]
        }
        return []
    }

    const isValidTableauSequence = (card, targetCard) => {
        if (!targetCard) return card.rank === 'K' // King on empty column
        return card.color !== targetCard.color && card.value === targetCard.value - 1
    }

    const isValidFoundationMove = (card, targetPile) => {
        if (targetPile.length === 0) return card.rank === 'A'
        const top = targetPile[targetPile.length - 1]
        return top.suit === card.suit && card.value === top.value + 1
    }

    const handleDrop = (targetType, targetIndex) => {
        if (!draggedCard || !dragSource) return

        const cardsToMove = getCardStack(dragSource)
        if (cardsToMove.length === 0) return

        // Validate Move
        let valid = false

        if (targetType === 'column') {
            const targetCol = board.columns[targetIndex]
            const targetCard = targetCol.length > 0 ? targetCol[targetCol.length - 1] : null
            // We can only move a stack if the head of the stack matches the target
            if (isValidTableauSequence(cardsToMove[0], targetCard)) {
                valid = true
            }
        } else if (targetType === 'foundation') {
            // Can only move single cards to foundation
            if (cardsToMove.length === 1) {
                const targetPile = board.foundations[targetIndex]
                if (isValidFoundationMove(cardsToMove[0], targetPile)) {
                    valid = true
                }
            }
        }

        if (valid) {
            const newBoard = { ...board }

            // 1. Remove from Source
            if (dragSource.type === 'column') {
                newBoard.columns[dragSource.index] = newBoard.columns[dragSource.index].slice(0, dragSource.cardIndex)
                // Reveal new top card if needed
                const sourceLen = newBoard.columns[dragSource.index].length
                if (sourceLen > 0) {
                    const newTop = { ...newBoard.columns[dragSource.index][sourceLen - 1] }
                    newTop.faceUp = true
                    newBoard.columns[dragSource.index][sourceLen - 1] = newTop
                }
            } else if (dragSource.type === 'waste') {
                newBoard.waste.pop()
            } else if (dragSource.type === 'foundation') {
                newBoard.foundations[dragSource.index].pop()
            }

            // 2. Add to Target
            if (targetType === 'column') {
                newBoard.columns[targetIndex] = [...newBoard.columns[targetIndex], ...cardsToMove]
            } else if (targetType === 'foundation') {
                newBoard.foundations[targetIndex] = [...newBoard.foundations[targetIndex], cardsToMove[0]]
            }

            setBoard(newBoard)
        }

        setDraggedCard(null)
        setDragSource(null)
    }

    const dealFromStock = () => {
        if (board.stock.length === 0) {
            // Recycle waste to stock
            if (board.waste.length === 0) return
            const newStock = [...board.waste].reverse().map(c => ({ ...c, faceUp: false }))
            setBoard(prev => ({ ...prev, stock: newStock, waste: [] }))
        } else {
            // Deal 1 card
            const newBoard = { ...board }
            const card = { ...newBoard.stock.pop() }
            card.faceUp = true
            newBoard.waste.push(card)
            setBoard(newBoard)
        }
    }

    // Custom FaceDown Card Component
    const CardBack = () => (
        <div className="card back" style={{ background: 'repeating-linear-gradient(45deg, #000080 0, #000080 5px, #fff 5px, #fff 10px)' }}>
            <div className="pattern" style={{ width: '100%', height: '100%', opacity: 0.5 }}></div>
        </div>
    )

    return (
        <div className="solitaire-container" style={{ padding: '10px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', background: '#008000', color: 'white' }}>
            {/* Top Area: Stock, Waste, Foundations */}
            <div className="top-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="stock-waste" style={{ display: 'flex', gap: '10px' }}>
                        {/* Stock */}
                        <div className="card-slot stock" onClick={dealFromStock}>
                            {board.stock.length > 0 ? <CardBack /> : <div className="empty-slot" style={{ border: '2px solid rgba(255,255,255,0.3)', borderRadius: '4px', width: '71px', height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>RELOAD</div>}
                        </div>
                        {/* Waste */}
                        <div className="card-slot waste">
                            {board.waste.length > 0 && (
                                <PlayingCard
                                    card={board.waste[board.waste.length - 1]}
                                    setDraggedCard={setDraggedCard}
                                    source={{ type: 'waste' }}
                                    setDragSource={setDragSource}
                                />
                            )}
                        </div>
                    </div>
                    <button
                        onClick={initializeGame}
                        style={{
                            height: '30px',
                            padding: '0 10px',
                            background: '#c0c0c0',
                            border: '2px outset #fff',
                            color: 'black',
                            cursor: 'pointer',
                            fontFamily: 'Tahoma, sans-serif',
                            fontSize: '12px'
                        }}
                    >
                        New Game
                    </button>
                </div>

                {/* Foundations */}
                <div className="foundations" style={{ display: 'flex', gap: '10px' }}>
                    {board.foundations.map((pile, i) => (
                        <div
                            key={`found-${i}`}
                            className="card-slot foundation"
                            style={{ border: '1px inset #fff', borderRadius: '4px', width: '71px', height: '96px' }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop('foundation', i)}
                        >
                            {pile.length > 0 ? (
                                <PlayingCard
                                    card={pile[pile.length - 1]}
                                    setDraggedCard={setDraggedCard}
                                    source={{ type: 'foundation', index: i }}
                                    setDragSource={setDragSource}
                                    draggable={true}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '24px' }}>
                                    {['♠', '♥', '♣', '♦'][i]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Columns */}
            <div className="columns" style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                {board.columns.map((col, i) => {
                    const renderRecursiveStack = (index) => {
                        if (index >= col.length) return null
                        const card = col[index]

                        return (
                            <div style={index > 0 ? { position: 'absolute', top: '25px', width: '100%', zIndex: 1 } : {}}>
                                <PlayingCard
                                    card={card}
                                    setDraggedCard={setDraggedCard}
                                    source={{ type: 'column', index: i, cardIndex: index }}
                                    setDragSource={setDragSource}
                                >
                                    {renderRecursiveStack(index + 1)}
                                </PlayingCard>
                            </div>
                        )
                    }

                    // Separation of concerns: Face-down cards (flat) vs Face-up stack (nested/recursive)
                    // Actually, simpler: nested everything is cleaner but face-down cards aren't draggable.
                    // Keep face-down flat, face-up nested.
                    const firstFaceUpIdx = col.findIndex(c => c.faceUp)

                    return (
                        <div
                            key={`col-${i}`}
                            className="column"
                            style={{ position: 'relative', width: '71px' }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop('column', i)}
                        >
                            {col.map((card, idx) => {
                                // If card is face up, it will be part of the recursive stack starting at firstFaceUpIdx
                                if (idx >= firstFaceUpIdx && firstFaceUpIdx !== -1) return null

                                // Render Face Down Cards
                                return (
                                    <div
                                        key={card.id}
                                        style={{ position: 'absolute', top: `${idx * 10}px`, zIndex: idx }}
                                    >
                                        <CardBack />
                                    </div>
                                )
                            })}

                            {/* Start Recursive Stack from first FaceUp card */}
                            {firstFaceUpIdx !== -1 && (
                                <div style={{ position: 'absolute', top: `${firstFaceUpIdx * 10}px`, zIndex: firstFaceUpIdx }}>
                                    {renderRecursiveStack(firstFaceUpIdx)}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Solitaire
