import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { RecentProgramsProvider } from './context/RecentProgramsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <RecentProgramsProvider>
                <App />
            </RecentProgramsProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
