const PlayingCard = ({ card, setDraggedCard, source, setDragSource, draggable = true }) => {
    const handleDragStart = () => {
        if (!draggable) return
        setDraggedCard(card)
        setDragSource(source)
    }

    return (
        <div className={`card ${card.color}`} draggable={draggable} onDragStart={handleDragStart}>
            <div className="card-corner top-left">
                <span>{card.rank}</span>
                <span>{card.suit}</span>
            </div>
            <div className="card-center">{card.suit}</div>
            <div className="card-corner bottom-right">
                <span>{card.rank}</span>
                <span>{card.suit}</span>
            </div>
        </div>
    )
}

export default PlayingCard
