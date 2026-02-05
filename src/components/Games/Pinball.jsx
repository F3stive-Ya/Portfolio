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
                        fontFamily: 'MS Sans Serif',
                        textAlign: 'center'
                    }}
                >
                    <div style={{ marginBottom: '10px' }}>Loading Space Cadet Pinball...</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>Taking too long?</div>
                    <button
                        onClick={() => {
                            const iframe = document.querySelector('iframe[title="Space Cadet Pinball"]');
                            if (iframe) iframe.src = iframe.src;
                        }}
                        style={{
                            marginTop: '5px',
                            background: '#c0c0c0',
                            border: '2px outset #fff',
                            cursor: 'pointer',
                            fontFamily: 'MS Sans Serif'
                        }}
                    >
                        Reload
                    </button>
                </div>
            )}
            <iframe
                src="https://pinball.alula.me/"
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
