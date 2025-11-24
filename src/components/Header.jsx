import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="site-header container">
      <div className="brand">
        <div className="logo" aria-hidden></div>
        <div>
          <div style={{fontWeight:700}}>Typing Practice</div>
          <div style={{fontSize:12,color:'#94a3b8'}}>Fast · Minimal · Offline</div>
        </div>
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/test">Practice</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  )
}
