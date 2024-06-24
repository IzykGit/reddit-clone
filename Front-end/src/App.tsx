import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import PostDetails from './pages/PostDetails.tsx'
import LoginPage from './pages/LoginPage.tsx'
import CreateAccountPage from './pages/CreateAccountPage.tsx'
import Profile from './pages/Profile.tsx'
import ProfileVisitor from './pages/ProfileVisitor.tsx'
import Notifications from './pages/Notifications.tsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/profile/:userName' element={<ProfileVisitor />}/>
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/post/:id' element={<PostDetails />}/>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/create-account' element={<CreateAccountPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
