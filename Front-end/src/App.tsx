import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import PostDetails from './pages/PostDetails.tsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/profile' />
        <Route path='/post/:id' element={<PostDetails />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
