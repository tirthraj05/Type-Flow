import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function Results(){
  const { state } = useLocation()
  const stats = state?.stats
  if(!stats){
    return (
      <div className="container card">
        <h3>No results available</h3>
        <Link to="/test" className="btn">Take Test</Link>
      </div>
    )
  }
  return (
    <div className="container card">
      <h2>Results</h2>
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <div className="metric">WPM: <strong>{stats.wpm}</strong></div>
        <div className="metric">Accuracy: <strong>{stats.accuracy}%</strong></div>
        <div className="metric">Mistakes: <strong>{stats.mistakes}</strong></div>
        <div className="metric">Time: <strong>{stats.time}s</strong></div>
      </div>
      <div style={{height:12}} />
      <div style={{display:'flex',gap:8}}>
        <Link to="/test" className="btn">Try Again</Link>
        <Link to="/" className="btn" style={{background:'transparent',border:'1px solid rgba(255,255,255,0.04)'}}>Home</Link>
      </div>
    </div>
  )
}
