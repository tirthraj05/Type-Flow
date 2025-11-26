import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-bold text-xl text-gray-900">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
            T
          </div>
          TypeFlow
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
            Home
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 transition">
            About
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/test" className="text-gray-600 hover:text-gray-900 transition">
                Practice
              </Link>
              <Link to="/history" className="text-gray-600 hover:text-gray-900 transition">
                Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Hi, {user?.name}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1"
          aria-label="Toggle menu"
        >
          <div className={`h-1 w-6 bg-gray-900 transition ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`h-1 w-6 bg-gray-900 transition ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`h-1 w-6 bg-gray-900 transition ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gray-50 border-t px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-gray-600 hover:text-gray-900 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-gray-600 hover:text-gray-900 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/test"
                className="block text-gray-600 hover:text-gray-900 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Practice
              </Link>
              <Link
                to="/history"
                className="block text-gray-600 hover:text-gray-900 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="pt-2 border-t">
                <p className="text-gray-700 mb-3">Hi, {user?.name}!</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2 border-t">
              <Link
                to="/login"
                className="block text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
