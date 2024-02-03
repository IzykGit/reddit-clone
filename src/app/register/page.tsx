"use client"
import React from 'react'
import { useState } from 'react'
import Navbar from '../components/navbar'
import { NextResponse } from 'next/server'
import { useRouter } from 'next/navigation'

const Register = () => {

  const [data, setData] = useState({username: "", password: "", email: ""})
  const router = useRouter()



  const registerUser = async (e: any) => {
      e.preventDefault()
      
    const response = await fetch('/api/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

      if (response.ok) {
        router.push('/');
        console.log(response)
        return new NextResponse(JSON.stringify(response))
      } else {
        return NextResponse.json({ error: "Error detected "})
      }
  }



    
  return (
    <div>
        <Navbar />
          <h1>Register</h1>
          <form  onSubmit={registerUser}>
            <input value={data.username} id="username" onChange={(e) => setData({...data, username: e.target.value})} type='text' placeholder='Username'/>
            <input value={data.password} id="password" onChange={(e) => setData({...data, password: e.target.value})} type='password' placeholder='Password'/>
            <input value={data.email} id="email" onChange={(e) => setData({...data, email: e.target.value})} type="email" placeholder='Email'/>
            <button type='submit'>Register</button>
          </form>

    </div>
  )
}

export default Register