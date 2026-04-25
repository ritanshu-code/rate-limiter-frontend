import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AnalyticsProvider } from './context/Analytics.jsx'

createRoot(document.getElementById('root')).render(
  <AnalyticsProvider>
    <App />

  </AnalyticsProvider>
  
)
