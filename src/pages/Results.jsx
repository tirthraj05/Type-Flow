import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function Results(){
  const { state } = useLocation()
  const stats = state?.stats
  if(!stats){
    return (
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-slate-900 p-6 rounded-xl shadow text-center">
          <h3 className="text-white">No results available</h3>
          <Link to="/test" className="mt-4 inline-block px-4 py-2 bg-primary text-sky-900 rounded-md">Take Test</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-3xl font-bold text-white">Results</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-800">
            <div className="text-sm text-slate-300">WPM</div>
            <div className="text-2xl font-semibold text-white">{stats.wpm}</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800">
            <div className="text-sm text-slate-300">Accuracy</div>
            <div className="text-2xl font-semibold text-white">{stats.accuracy}%</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800">
            <div className="text-sm text-slate-300">Mistakes</div>
            <div className="text-2xl font-semibold text-white">{stats.mistakes}</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800">
            <div className="text-sm text-slate-300">Time</div>
            <div className="text-2xl font-semibold text-white">{stats.time}s</div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/test" className="px-5 py-3 bg-primary text-sky-900 rounded-md font-semibold">Try Again</Link>
          <Link to="/" className="px-5 py-3 bg-slate-800 text-slate-200 rounded-md">Home</Link>
        </div>
      </div>
    </div>
  )
}
