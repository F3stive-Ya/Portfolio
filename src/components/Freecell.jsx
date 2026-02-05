import { useState, useEffect, useCallback } from 'react'
import PlayingCard from './PlayingCard'
import { SUITS, RANKS } from '../config/freecell'
import '../index.css'

const Freecell = () => {
    const [board, setBoard] = useState({
        columns: Array(8).fill([]),
        freecells: Array(4).fill(null),
        foundations: Array(4).fill([])
    })
    const [draggedCard, setDraggedCard] = useState(null)
    const [dragSource, setDragSource] = useState(null) // { type: 'column'|'freecell', index: number }

    const startNewGame = useCallback(() => {
        const deck = []
        SUITS.forEach((suit) => {
            RANKS.forEach((rank, index) => {
                deck.push({
                    suit,
                    rank,
                    value: index + 1,
                    id: `${rank}${suit}`,
                    color: suit === '♥' || suit === '♦' ? 'red' : 'black'
                })
            })
        })

        // Fisher-Yates Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[deck[i], deck[j]] = [deck[j], deck[i]]
        }

        const newColumns = Array(8)
            .fill()
            .map(() => [])
        deck.forEach((card, index) => {
            newColumns[index % 8].push(card)
        })

        setBoard({
            columns: newColumns,
            freecells: Array(4).fill(null),
            foundations: Array(4).fill([])
        })
    }, [])

    useEffect(() => {
        startNewGame()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isMoveValid = (card, targetType, targetIndex) => {
        if (targetType === 'freecell') {
            return board.freecells[targetIndex] === null
        }
        if (targetType === 'foundation') {
            const pile = board.foundations[targetIndex]
            if (pile.length === 0) return card.value === 1 // Ace
            const top = pile[pile.length - 1]
            return top.suit === card.suit && card.value === top.value + 1
        }
        if (targetType === 'column') {
            const col = board.columns[targetIndex]
            if (col.length === 0) return true
            const top = col[col.length - 1]
            return top.color !== card.color && top.value === card.value + 1
        }
        return false
    }

    const handleDrop = (targetType, targetIndex) => {
        if (!draggedCard || !dragSource) return

        if (isMoveValid(draggedCard, targetType, targetIndex)) {
            const newBoard = { ...board }

            // Remove from source
            if (dragSource.type === 'column') {
                newBoard.columns[dragSource.index] = newBoard.columns[dragSource.index].slice(0, -1)
            } else if (dragSource.type === 'freecell') {
                newBoard.freecells[dragSource.index] = null
            }

            // Add to target
            if (targetType === 'column') {
                newBoard.columns[targetIndex] = [...newBoard.columns[targetIndex], draggedCard]
            } else if (targetType === 'freecell') {
                newBoard.freecells[targetIndex] = draggedCard
            } else if (targetType === 'foundation') {
                newBoard.foundations[targetIndex] = [
                    ...newBoard.foundations[targetIndex],
                    draggedCard
                ]
            }

            setBoard(newBoard)
        }
        setDraggedCard(null)
        setDragSource(null)
    }

    return (
        <div className="freecell-container">
            <div className="freecell-menubar">
                <button onClick={startNewGame}>New Game</button>
            </div>

            <div className="freecell-top">
                <div className="freecells">
                    {board.freecells.map((card, i) => (
                        <div
                            key={`free-${i}`}
                            className="card-slot freecell"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop('freecell', i)}
                        >
                            {card && (
                                <PlayingCard
                                    card={card}
                                    setDraggedCard={setDraggedCard}
                                    source={{ type: 'freecell', index: i }}
                                    setDragSource={setDragSource}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="foundations">
                    {board.foundations.map((pile, i) => (
                        <div
                            key={`found-${i}`}
                            className="card-slot foundation"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop('foundation', i)}
                        >
                            {pile.length > 0 && (
                                <PlayingCard
                                    card={pile[pile.length - 1]}
                                    setDraggedCard={setDraggedCard}
                                    source={{ type: 'foundation', index: i }}
                                    setDragSource={setDragSource}
                                    draggable={false} // Foundations usually lock unless we add logic to pull back
                                />
                            )}
                            <div className="foundation-placeholder">{['♠', '♥', '♣', '♦'][i]}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="freecell-columns">
                {board.columns.map((col, i) => (
                    <div
                        key={`col-${i}`}
                        className="column"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop('column', i)}
                    >
                        {col.map((card, idx) => (
                            <div
                                key={card.id}
                                className="card-wrapper"
                                style={{ top: `${idx * 25}px`, zIndex: idx }}
                            >
                                <PlayingCard
                                    card={card}
                                    setDraggedCard={setDraggedCard}
                                    source={{ type: 'column', index: i }}
                                    setDragSource={setDragSource}
                                    draggable={idx === col.length - 1} // Only top card draggable for now
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Freecell
