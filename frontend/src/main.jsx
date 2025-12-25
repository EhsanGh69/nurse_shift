import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios'

import App from './App.jsx'
import { BACKEND_URL } from './config.js'
import './index.css'

axios.defaults.baseURL = BACKEND_URL
axios.defaults.withCredentials = true

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
