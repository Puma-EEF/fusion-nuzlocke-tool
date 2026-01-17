/**
 * Application Entry Point
 * 
 * Initializes and mounts the React application to the DOM.
 * Uses React 19 with StrictMode for enhanced development checks.
 * 
 * @module main
 * 
 * ## React StrictMode
 * StrictMode enables additional development-time checks:
 * - Detects unexpected side effects
 * - Warns about deprecated APIs
 * - Identifies potential problems in lifecycle methods
 * - Double-invokes effects to find bugs (dev only, removed in production)
 * 
 * ## Root Element
 * Mounts to `<div id="root"></div>` in index.html
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
