import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 mt-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-white leading-tight">Sharpen your typing. Faster. Cleaner. Smarter.</h1>
            <p className="mt-4 text-slate-300 max-w-xl">Practice with AI-generated paragraphs and track WPM, accuracy, and mistakes live. No signup — fully client-side and offline-ready.</p>
            <div className="mt-6 flex items-center gap-4">
              <Link to="/test" className="inline-flex items-center px-5 py-3 bg-primary text-sky-900 rounded-lg font-semibold shadow hover:scale-105 transition">Start Practicing</Link>
              <Link to="/about" className="text-slate-200/80 hover:text-white">Learn more</Link>
            </div>
          </div>
          <div className="w-full lg:w-96 bg-gradient-to-tr from-slate-700/40 to-transparent rounded-lg p-4">
            <div className="text-slate-300 text-sm">Ad Placeholder</div>
            <div className="mt-4 bg-slate-900 p-4 rounded-lg text-slate-200 text-sm">Header Ad Placeholder</div>
          </div>
        </div>
      </div>

      <section className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-lg bg-slate-900 p-6 shadow">
          <h3 className="text-lg font-semibold text-white">How it works</h3>
          <ul className="mt-3 text-slate-300 list-disc ml-5 space-y-2">
            <li>Short generated text (150–300 chars).</li>
            <li>Real-time metrics: WPM, accuracy, mistakes.</li>
            <li>Regenerate paragraph anytime.</li>
          </ul>
        </div>
        <div className="rounded-lg bg-slate-900 p-6 shadow flex flex-col gap-4">
          <div className="text-slate-300">Sidebar Ad Placeholder</div>
          <div className="h-32 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">Ad Slot</div>
        </div>
      </section>
    </div>
  )
}
