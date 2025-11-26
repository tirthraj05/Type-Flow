import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TypingTest from './pages/TypingTest'
import Results from './pages/Results'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import History from './pages/History'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TypingTest />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
