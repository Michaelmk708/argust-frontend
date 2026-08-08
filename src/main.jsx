import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ArgustProvider } from './sdk'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ArgustProvider cluster="devnet">
        <App />
      </ArgustProvider>
    </ThemeProvider>
  </React.StrictMode>,
)