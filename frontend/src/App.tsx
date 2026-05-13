import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<Auth/>} />  
        <Route path='/ask'  element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
