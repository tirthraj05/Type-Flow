import React from 'react'

export default function About(){
  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      <div className="bg-slate-900 rounded-xl p-8 shadow">
        <h2 className="text-2xl font-semibold text-white">About This App</h2>
        <p className="mt-4 text-slate-300">This is a frontend-only typing practice app inspired by TypingBolt. It uses a small AI-like generator (mock) to produce short paragraphs (150–300 chars). The app tracks keystrokes and computes WPM, accuracy and mistakes in real time. It is fully client-side and includes a service worker to work offline.</p>

        <h3 className="mt-6 text-lg font-medium text-white">SEO</h3>
        <p className="text-slate-300">Meta tags are included in the main HTML. A simple sitemap is available at <code className="text-slate-200">/sitemap.xml</code>.</p>
      </div>
    </div>
  )
}
