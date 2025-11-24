import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container">
        <div>© {new Date().getFullYear()} TypeFlow — Demo</div>
        <div className="text-muted">Ads are placeholders: header, sidebar, bottom.</div>
      </div>
    </footer>
  )
}
