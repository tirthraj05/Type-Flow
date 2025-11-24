import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="container">
      <section className="hero">
        <div>
          <h1 className="headline">Sharpen your typing. Faster. Cleaner. Smarter.</h1>
          <p>Practice with AI-generated paragraphs and track WPM, accuracy, and mistakes live. No signup — fully client-side and offline-ready.</p>
          <div className="hero-cta">
            <Link to="/test" className="btn btn-primary">Start Practicing</Link>
            <Link to="/about" className="btn btn-ghost">Learn more</Link>
          </div>
        </div>

        <div className="card">
          <div className="ad-slot">Header Ad Placeholder</div>
        </div>
      </section>

      <section style={{marginTop:24,display:'grid',gridTemplateColumns:'1fr 320px',gap:18}}>
        <div className="card">
          <h3>How it works</h3>
          <ul style={{color:'var(--muted)',marginTop:12}}>
            <li>Short generated text (150–300 chars).</li>
            <li>Real-time metrics: WPM, accuracy, mistakes.</li>
            <li>Regenerate paragraph anytime.</li>
          </ul>
        </div>
        <div className="card">
          <div className="ad-slot">Sidebar Ad Placeholder</div>
        </div>
      </section>
    </div>
  )
}
