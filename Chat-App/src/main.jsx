import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route , Routes} from "react-router"
import { Toaster } from 'react-hot-toast'
import ChatPage from './Components/ChatPage.jsx'
import { ChatProvider } from './Context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
 
    <ChatProvider>
      <BrowserRouter>
       <Toaster position="top-right" />
     <Routes>
     
      <Route path="/" element={<App />} />
       <Route path="chat" element={<ChatPage/>} />
     </Routes>
    </BrowserRouter>
    </ChatProvider>
  
)
