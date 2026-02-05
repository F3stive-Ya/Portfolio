import { useState } from 'react'

const OutlookExpress = () => {
    const [formData, setFormData] = useState({
        from: '',
        subject: '',
        message: ''
    })
    const [sent, setSent] = useState(false)
    const [sentItems, setSentItems] = useState(() => {
        const saved = localStorage.getItem('win95-sent-emails')
        return saved ? JSON.parse(saved) : []
    })
    const [view, setView] = useState('compose') // 'compose' or 'sent'

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.from || !formData.subject || !formData.message) {
            alert('Please fill in all fields.')
            return
        }

        // Create mailto link
        const mailtoLink = `mailto:shanemborges@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.from}\n\n${formData.message}`)}`

        // Save to sent items
        const newEmail = {
            ...formData,
            date: new Date().toLocaleString(),
            id: Date.now()
        }
        const updatedSent = [newEmail, ...sentItems]
        setSentItems(updatedSent)
        localStorage.setItem('win95-sent-emails', JSON.stringify(updatedSent))

        // Open mail client
        window.location.href = mailtoLink

        setSent(true)
        setTimeout(() => setSent(false), 3000)

        // Clear form
        setFormData({ from: '', subject: '', message: '' })
    }

    const handleClearSent = () => {
        if (window.confirm('Clear all sent items?')) {
            setSentItems([])
            localStorage.removeItem('win95-sent-emails')
        }
    }

    return (
        <div className="outlook-container">
            <div className="outlook-toolbar">
                <button
                    className={`outlook-toolbar-btn ${view === 'compose' ? 'active' : ''}`}
                    onClick={() => setView('compose')}
                >
                    📝 New Message
                </button>
                <button
                    className={`outlook-toolbar-btn ${view === 'sent' ? 'active' : ''}`}
                    onClick={() => setView('sent')}
                >
                    📤 Sent Items ({sentItems.length})
                </button>
            </div>

            {view === 'compose' ? (
                <form className="outlook-form" onSubmit={handleSubmit}>
                    <div className="outlook-header">
                        <div className="outlook-field">
                            <label>To:</label>
                            <input
                                type="email"
                                value="shanemborges@gmail.com"
                                disabled
                                className="outlook-input disabled"
                            />
                        </div>
                        <div className="outlook-field">
                            <label>From:</label>
                            <input
                                type="email"
                                name="from"
                                value={formData.from}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                className="outlook-input"
                                required
                            />
                        </div>
                        <div className="outlook-field">
                            <label>Subject:</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Hello from your portfolio!"
                                className="outlook-input"
                                required
                            />
                        </div>
                    </div>

                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Type your message here..."
                        className="outlook-body"
                        required
                    />

                    <div className="outlook-actions">
                        <button type="submit" className="outlook-send-btn">
                            📧 Send
                        </button>
                        {sent && <span className="outlook-sent-msg">✓ Opening mail client...</span>}
                    </div>
                </form>
            ) : (
                <div className="outlook-sent-view">
                    {sentItems.length === 0 ? (
                        <div className="outlook-empty">
                            <p>No sent items.</p>
                        </div>
                    ) : (
                        <>
                            <div className="outlook-sent-list">
                                {sentItems.map((email) => (
                                    <div key={email.id} className="outlook-sent-item">
                                        <div className="outlook-sent-header">
                                            <strong>To:</strong> shanemborges@gmail.com
                                        </div>
                                        <div className="outlook-sent-header">
                                            <strong>Subject:</strong> {email.subject}
                                        </div>
                                        <div className="outlook-sent-header">
                                            <strong>Date:</strong> {email.date}
                                        </div>
                                        <div className="outlook-sent-preview">
                                            {email.message.substring(0, 100)}
                                            {email.message.length > 100 ? '...' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="outlook-clear-btn" onClick={handleClearSent}>
                                🗑️ Clear Sent Items
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default OutlookExpress
