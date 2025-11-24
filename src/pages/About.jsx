import React from 'react'

export default function About(){
  return (
    <div className="container">
      <div className="card">
        <h2>About This App</h2>
        <p style={{color:'var(--muted)',marginTop:8}}>This is a frontend-only typing practice app inspired by TypingBolt. It uses a small AI-like generator (mock) to produce short paragraphs (150–300 chars). The app tracks keystrokes and computes WPM, accuracy and mistakes in real time. It is fully client-side and includes a service worker to work offline.</p>

        <h3 style={{marginTop:12}}>SEO</h3>
        <p style={{color:'var(--muted)'}}>Meta tags are included in the main HTML. A simple sitemap is available at <code>/sitemap.xml</code>.</p>
      </div>
    </div>
  )
}
