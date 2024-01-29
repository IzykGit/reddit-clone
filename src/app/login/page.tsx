"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import Navbar from '../components/navbar'

const Login = () => {

    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

  return (
    <div>
        <Navbar />
        <h1>Login</h1>
        <input onChange={(e) => setLoginUsername(e.target.value)} type='text' placeholder='username'/>
        <input onChange={(e) => setLoginPassword(e.target.value)} type='text' placeholder='username'/>
        <button>Login</button>
    </div>
  )
}

export default Login