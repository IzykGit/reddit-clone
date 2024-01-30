"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import axios from 'axios'

const Register = () => {

  const [data, setData] = useState({name: "", password: "", email: ""})

  const registerUser = async (e: any) => {
    e.preventDefault()

    axios.post('/api/register', data).then(() => alert("User has been registered")).catch((error) => console.log("An error:", error))
  }
  
    
  return (
    <div>
        <Navbar />
          <h1>Register</h1>
          <form  onSubmit={registerUser}>
            <input value={data.email} id="email" onChange={(e) => setData({...data, email: e.target.value})} type="email" placeholder='Email'/>
            <input value={data.name} id="username" onChange={(e) => setData({...data, name: e.target.value})} type='text' placeholder='Username'/>
            <input value={data.password} id="password" onChange={(e) => setData({...data, password: e.target.value})} type='password' placeholder='Password'/>
            <button type='submit'>Register</button>
          </form>


    </div>
  )
}

export default Register