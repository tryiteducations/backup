import { CoinProvider } from './context/CoinContext.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider }     from './context/LanguageContext.jsx'
import { AccessibilityProvider } from './context/AccessibilityContext.jsx'
import { EquityTierProvider }    from './context/EquityTierContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <LanguageProvider>
        <CoinProvider>
        <EquityTierProvider>
          <App />
        </EquityTierProvider>
        </CoinProvider>
      </LanguageProvider>
    </AccessibilityProvider>
  </React.StrictMode>
)
