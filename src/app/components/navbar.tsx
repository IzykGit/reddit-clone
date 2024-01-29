import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div style={{display: "flex", justifyContent: "space-around", fontSize: "20px"}}>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/profile">Profile</Link>
    </div>
  )
}

export default Navbar