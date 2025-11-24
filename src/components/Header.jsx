import React from 'react'
import { Link } from 'react-router-dom'
import { toggleTheme, getTheme } from '../theme'

export default function Header(){
  const handleToggle = ()=>{
    const next = toggleTheme()
    // optional: trigger a small animation or aria label update
    const btn = document.querySelector('.theme-toggle')
    if(btn) btn.setAttribute('aria-pressed', next === 'dark')
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <div className="brand-logo" aria-hidden></div>
          <div>
            <div className="brand-title">TypeFlow</div>
            <div className="brand-sub">Practice — fast & beautifully designed</div>
          </div>
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/test">Practice</Link>
          <Link to="/about">About</Link>
          <Link to="/test" className="btn btn-primary">Start</Link>
          <button className="btn theme-toggle" aria-pressed="false" onClick={handleToggle} title="Toggle theme">🌗</button>
        </nav>
      </div>
    </header>
  )
}
