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
    <div className="app-root">
      <Header />
      <main>
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
