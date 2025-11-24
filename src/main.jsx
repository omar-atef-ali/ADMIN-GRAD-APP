import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import UserContextProvider from './context/userContext.jsx';

import "bootstrap/dist/css/bootstrap.min.css"


import "bootstrap/dist/js/bootstrap.bundle.min.js"



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </StrictMode>,
)
