import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="bg-transparent py-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-700 shadow-lg" />
          <div>
            <div className="font-semibold text-white text-lg">TypeFlow</div>
            <div className="text-sm text-slate-300">Practice — fast & offline</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="text-slate-300 hover:text-white">Home</Link>
          <Link to="/test" className="text-slate-300 hover:text-white">Practice</Link>
          <Link to="/about" className="text-slate-300 hover:text-white">About</Link>
          <Link to="/test" className="ml-4 inline-flex items-center px-4 py-2 bg-primary text-sky-900 rounded-md shadow hover:brightness-105 transition">Start</Link>
        </nav>
      </div>
    </header>
  )
}
