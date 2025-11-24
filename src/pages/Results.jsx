import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function Results(){
  const { state } = useLocation()
  const stats = state?.stats
  if(!stats){
    return (
      <div className="container">
        <div className="card" style={{textAlign:'center'}}>
          <h3>No results available</h3>
          <Link to="/test" className="btn btn-primary" style={{marginTop:12,display:'inline-block'}}>Take Test</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="container">
      <div className="card" style={{textAlign:'center'}}>
        <h2 style={{fontSize:28,margin:0}}>Results</h2>
        <div style={{marginTop:18,display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
          <div className="metric"><div className="label">WPM</div><div className="value">{stats.wpm}</div></div>
          <div className="metric"><div className="label">Accuracy</div><div className="value">{stats.accuracy}%</div></div>
          <div className="metric"><div className="label">Mistakes</div><div className="value">{stats.mistakes}</div></div>
          <div className="metric"><div className="label">Time</div><div className="value">{stats.time}s</div></div>
        </div>

        <div style={{marginTop:18,display:'flex',justifyContent:'center',gap:12}}>
          <Link to="/test" className="btn btn-primary">Try Again</Link>
          <Link to="/" className="btn btn-ghost">Home</Link>
        </div>
      </div>
    </div>
  )
}
