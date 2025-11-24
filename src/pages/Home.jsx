import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="container">
      <div className="card hero">
        <h1>Practice typing — no login, fully offline</h1>
        <p style={{color:'#94a3b8'}}>Real-time WPM, accuracy, and mistakes. Generate a new short paragraph and start typing.</p>
        <div style={{display:'flex',gap:12}}> 
          <Link to="/test" className="btn">Start Test</Link>
          <Link to="/about" className="btn" style={{background:'transparent',border:'1px solid rgba(255,255,255,0.04)',color:'#cfe6ff'}}>About</Link>
        </div>
      </div>

      <div style={{height:18}} />

      <div className="grid">
        <div className="card">
          <h3>How it works</h3>
          <ul style={{color:'#94a3b8'}}>
            <li>Short generated text (150–300 chars).</li>
            <li>Start typing — metrics update live.</li>
            <li>Regenerate text anytime.</li>
          </ul>
        </div>
        <div className="card">
          <div className="ad-placeholder">Sidebar Ad Placeholder</div>
          <div style={{height:12}} />
          <div className="ad-placeholder">Header Ad Placeholder</div>
        </div>
      </div>

    </div>
  )
}
