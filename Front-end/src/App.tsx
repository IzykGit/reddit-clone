import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import CreatePost from './pages/CreatePost.tsx'
import Post from './pages/Post.tsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/profile' />
        <Route path='/createpost' element={<CreatePost />}/>
        <Route path='/post/:id' element={<Post />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
