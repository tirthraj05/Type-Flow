import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TypingTest from './pages/TypingTest'
import Results from './pages/Results'
import About from './pages/About'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg via-slate-900 to-bg text-white">
      <Header />
      <main className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<TypingTest />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
