import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your Typing Speed
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice with engaging typing tests and track your progress over time
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <>
                <Link
                  to="/test"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
                >
                  Start Practicing
                </Link>
                <Link
                  to="/history"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
                >
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose TypeFlow?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zm-2-6a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Feedback</h3>
              <p className="text-gray-600">
                Instant WPM, accuracy, and mistake tracking as you type to help you improve instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600">
                View detailed statistics and charts showing your improvement over time and celebrate wins.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.756a3.066 3.066 0 01-3.062 3.062H7.065a3.066 3.066 0 01-3.062-3.062V6.517a3.066 3.066 0 012.812-3.062zM9 12a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Stay Motivated</h3>
              <p className="text-gray-600">
                Get encouragement messages when you improve and supportive feedback to keep practicing.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Diverse Texts</h3>
              <p className="text-gray-600">
                Practice with a variety of typing exercises that keep your practice sessions engaging.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Persistent History</h3>
              <p className="text-gray-600">
                All your test results are saved and searchable so you can review your journey anytime.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 010 2v1h1a1 1 0 110 2H6v1a1 1 0 01-2 0v-1H3a1 1 0 010-2h1v-1a1 1 0 010-2H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a2 2 0 11-4 0 2 2 0 014 0zm7-7a2 2 0 11-4 0 2 2 0 014 0zm-9 7a2 2 0 110-4 2 2 0 010 4zm14-8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Accessible Design</h3>
              <p className="text-gray-600">
                Keyboard navigation and accessibility features ensure everyone can use TypeFlow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Improve Your Typing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users improving their typing speed and accuracy
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
            >
              Start Free Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
