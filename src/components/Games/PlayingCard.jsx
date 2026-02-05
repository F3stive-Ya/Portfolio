const PlayingCard = ({ card, setDraggedCard, source, setDragSource, draggable = true, onDoubleClick, ...props }) => {
    const handleDragStart = () => {
        if (!draggable) return
        setDraggedCard(card)
        setDragSource(source)
    }

    return (
        <div
            className={`card ${card.color}`}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDoubleClick={() => onDoubleClick && onDoubleClick(card, source)}
        >
            <div className="card-corner top-left">
                <span>{card.rank}</span>
                <span>{card.suit}</span>
            </div>
            <div className="card-center">{card.suit}</div>
            <div className="card-corner bottom-right">
                <span>{card.rank}</span>
                <span>{card.suit}</span>
            </div>
            {/* Allow rendering children (stacked cards) */}
            {props.children}
        </div>
    )
}

export default PlayingCard
