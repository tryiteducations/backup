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

// Hide the native splash screen only once the real app has mounted and painted -
// avoids a jarring blank gap between the branded splash and first content, and
// is a no-op with zero cost when running as the regular website.
import('@capacitor/core').then(({ Capacitor }) => {
  if (!Capacitor.isNativePlatform()) return
  import('@capacitor/status-bar').then(({ StatusBar }) => {
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {})
  }).catch(() => {})
  import('@capacitor/splash-screen').then(({ SplashScreen }) => {
    requestAnimationFrame(() => {
      setTimeout(() => SplashScreen.hide().catch(() => {}), 150)
    })
  }).catch(() => {})
}).catch(() => {})
