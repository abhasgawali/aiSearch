import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastProvider } from './lib/ToastContext'

function App() {


  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<Auth/>} />
          <Route path='/ask' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
