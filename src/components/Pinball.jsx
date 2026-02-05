import { useState } from 'react'

const Pinball = () => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: '#000',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {isLoading && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        fontFamily: 'MS Sans Serif'
                    }}
                >
                    Loading Space Cadet Pinball...
                </div>
            )}
            <iframe
                src="https://alula.github.io/SpaceCadetPinball/"
                style={{
                    flex: 1,
                    border: 'none',
                    visibility: isLoading ? 'hidden' : 'visible'
                }}
                title="Space Cadet Pinball"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    )
}

export default Pinball
