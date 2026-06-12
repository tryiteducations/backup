import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initSecurityLayer, initScreenshotProtection } from './lib/security'
import { applyTheme } from './lib/themes'

// Apply saved theme instantly (before first render)
const savedTheme = localStorage.getItem('tryit_theme') || 'default'
applyTheme(savedTheme)

// Security (production only)
initSecurityLayer()
initScreenshotProtection()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
