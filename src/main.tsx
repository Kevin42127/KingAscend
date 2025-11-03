import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import { LanguageProvider } from './contexts/LanguageContext'
import { registerServiceWorker } from './utils/registerSW'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)

registerServiceWorker()

