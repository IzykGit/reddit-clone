"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import Navbar from '../components/navbar'

const Register = () => {

    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

  return (
    <div>
        <Navbar />
        <h1>Register</h1>
        <input onChange={(e) => setRegisterUsername(e.target.value)} type='text' placeholder='username'/>
        <input onChange={(e) => setRegisterPassword(e.target.value)} type='text' placeholder='username'/>
        <button>Register</button>
    </div>
  )
}

export default Register