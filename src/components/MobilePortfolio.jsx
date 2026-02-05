const MobilePortfolio = () => {
    return (
        <div className="mobile-portfolio">
            <header className="mobile-header">
                <div className="mobile-warning">
                    ⚠️ Desktop Experience Recommended for Full Windows 95 Simulation
                </div>
                <h1>Shane Borges</h1>
                <h2>Cyber-Security Student</h2>
            </header>

            <main className="mobile-content">
                <section className="mobile-section contact-section">
                    <h3>Contact</h3>
                    <div className="contact-links">
                        <a href="mailto:shanemborges@gmail.com" className="mobile-link">
                            📧 shanemborges@gmail.com
                        </a>
                        <a
                            href="https://www.linkedin.com/in/shaneborges/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mobile-link"
                        >
                            🔗 LinkedIn
                        </a>
                        <a
                            href="https://github.com/F3stive-Ya"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mobile-link"
                        >
                            💻 GitHub
                        </a>
                    </div>
                </section>

                <section className="mobile-section resume-section">
                    <h3>Resume</h3>
                    <div className="resume-container">
                        <object
                            data="/resume.pdf"
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            className="resume-object"
                        >
                            <div className="pdf-fallback">
                                <p>Unable to display PDF directly.</p>
                                <a href="/resume.pdf" download className="download-btn">
                                    Download Resume (PDF)
                                </a>
                            </div>
                        </object>
                    </div>
                    <div className="resume-download-only">
                        <a href="/resume.pdf" download className="download-btn full-width">
                            Download Resume (PDF)
                        </a>
                    </div>
                </section>
            </main>

            <style>{`
                .mobile-portfolio {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    background-color: #f0f0f0;
                    color: #333;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                .mobile-header {
                    background-color: #008080;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 4px solid #004040;
                }

                .mobile-warning {
                    background-color: #ffffe0;
                    color: #333;
                    padding: 8px;
                    font-size: 0.85rem;
                    border-radius: 4px;
                    margin-bottom: 15px;
                    border: 1px solid #e0e0a0;
                }

                .mobile-header h1 {
                    margin: 0;
                    font-size: 1.8rem;
                }

                .mobile-header h2 {
                    margin: 5px 0 0;
                    font-size: 1rem;
                    font-weight: normal;
                    opacity: 0.9;
                }

                .mobile-content {
                    padding: 20px;
                    flex: 1;
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                }

                .mobile-section {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                }

                .mobile-section h3 {
                    margin-top: 0;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 10px;
                    color: #008080;
                }

                .contact-links {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .mobile-link {
                    text-decoration: none;
                    color: #333;
                    padding: 10px;
                    background: #f9f9f9;
                    border-radius: 4px;
                    border: 1px solid #eee;
                    display: block;
                    transition: background 0.2s;
                }

                .mobile-link:active {
                    background: #eef;
                }

                .resume-container {
                    height: 500px;
                    background: #eee;
                    border: 1px solid #ddd;
                }
                
                .resume-object {
                    display: block;
                    width: 100%;
                    height: 100%;
                }

                .pdf-fallback {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                    padding: 20px;
                }

                .download-btn {
                    display: inline-block;
                    background-color: #008080;
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    font-weight: bold;
                    margin-top: 10px;
                }
                
                .download-btn.full-width {
                    display: block;
                    text-align: center;
                    margin-top: 0;
                }
                
                .resume-download-only {
                    display: none;
                    margin-top: 10px;
                }

                @media (max-width: 480px) {
                    .resume-container {
                        display: none; /* Hide container on very small screens where iframe might be bad */
                    }
                    .resume-download-only {
                        display: block;
                    }
                }
            `}</style>
        </div>
    )
}

export default MobilePortfolio
