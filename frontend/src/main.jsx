import React from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'

import App from './App.jsx'
import './index.css'

axios.defaults.baseURL = 'http://127.0.0.1:4000'
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
