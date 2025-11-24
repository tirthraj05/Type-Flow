import React from 'react'

export default function Footer(){
  return (
    <footer className="footer">
      <div className="container">
        <div style={{marginBottom:8}}>© {new Date().getFullYear()} Typing Practice — Offline demo</div>
        <div style={{color:'#94a3b8',fontSize:13}}>Ads are placeholders: header, sidebar, bottom.</div>
      </div>
    </footer>
  )
}
