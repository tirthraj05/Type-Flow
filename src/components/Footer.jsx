import React from 'react'

export default function Footer(){
  return (
    <footer className="mt-12 py-8">
      <div className="max-w-5xl mx-auto px-4 text-center text-slate-400">
        <div className="mb-2">© {new Date().getFullYear()} TypeFlow — Demo</div>
        <div className="text-sm">Ads are placeholders: header, sidebar, bottom.</div>
      </div>
    </footer>
  )
}
