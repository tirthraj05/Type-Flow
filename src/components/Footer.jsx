import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-bold text-white text-lg mb-2">TypeFlow</div>
            <p className="text-sm text-gray-400">
              Master your typing speed and accuracy with engaging practice tests.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-white mb-4">Product</h3>
            <ul className="text-sm space-y-2">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/test" className="hover:text-white transition">Practice</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold text-white mb-4">Account</h3>
            <ul className="text-sm space-y-2">
              <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link to="/signup" className="hover:text-white transition">Sign Up</Link></li>
              <li><Link to="/history" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-white mb-4">Info</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} TypeFlow. All rights reserved. | Built with React & Node.js</p>
        </div>
      </div>
    </footer>
  );
}
