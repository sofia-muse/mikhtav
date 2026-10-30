import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/data/queries'
import './i18n'
import './shared/styles/base.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}><App /></QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
