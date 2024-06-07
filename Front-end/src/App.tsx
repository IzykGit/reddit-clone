import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Post from './pages/Post'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/profile' />
        <Route path='/post' element={<Post />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
