import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Results() {
  const { state } = useLocation();
  const { isAuthenticated } = useAuth();
  const stats = state?.stats;
  const improved = state?.improved;
  const comparison = state?.comparison;
  const encouragementMessage = state?.encouragementMessage;

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Results Available</h3>
          <p className="text-gray-600 mb-6">Take a typing test to see your results.</p>
          <Link
            to="/test"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Take Test
          </Link>
        </div>
      </div>
    );
  }

  const getImprovementBadgeClass = () => {
    if (improved === undefined) return '';
    return improved
      ? 'bg-green-100 border-green-400 text-green-700'
      : 'bg-amber-100 border-amber-400 text-amber-700';
  };

  const getImprovementMessage = () => {
    if (improved === undefined) return null;

    const message = encouragementMessage || (improved 
      ? 'Nice! Your WPM improved — great progress!' 
      : 'Good effort — keep practicing!');

    if (improved) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <div className="font-bold">{message}</div>
            <div className="text-sm opacity-90">Keep up the momentum!</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-3">
          <span className="text-2xl">💪</span>
          <div>
            <div className="font-bold">{message}</div>
            <div className="text-sm opacity-90">Every attempt makes you better. Try again!</div>
          </div>
        </div>
      );
    }
  };

  const improvementMessage = getImprovementMessage();
  const badgeClass = getImprovementBadgeClass();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Result Status Badge */}
        {improvementMessage && (
          <div
            className={`border-2 rounded-lg p-6 mb-8 ${badgeClass}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {improvementMessage}
          </div>
        )}

        {/* Detailed Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Test Results</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-gray-600 text-sm font-semibold uppercase">WPM</div>
              <div className="text-5xl font-bold text-blue-600 mt-2">{stats.wpm}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-gray-600 text-sm font-semibold uppercase">Accuracy</div>
              <div className="text-5xl font-bold text-green-600 mt-2">{stats.accuracy}%</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-gray-600 text-sm font-semibold uppercase">Mistakes</div>
              <div className="text-5xl font-bold text-red-600 mt-2">{stats.mistakes}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-gray-600 text-sm font-semibold uppercase">Time</div>
              <div className="text-5xl font-bold text-purple-600 mt-2">{stats.time}s</div>
            </div>
          </div>

          {/* Comparison with Previous Test */}
          {isAuthenticated && comparison && (
            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Comparison with Previous Test</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm font-semibold mb-2">Previous Test</div>
                  <div className="text-gray-900">
                    <div className="text-2xl font-bold">{comparison.previousWpm} WPM</div>
                    <div className="text-gray-600">{comparison.previousAccuracy}% Accuracy</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm font-semibold mb-2">Difference</div>
                  <div className="text-gray-900">
                    <div className={`text-2xl font-bold ${comparison.wpmImproved ? 'text-green-600' : 'text-red-600'}`}>
                      {comparison.wpmDifference > 0 ? '+' : ''}{comparison.wpmDifference} WPM
                    </div>
                    <div className={comparison.accuracyImproved ? 'text-green-600' : 'text-red-600'}>
                      {comparison.accuracyDifference > 0 ? '+' : ''}{comparison.accuracyDifference}% Accuracy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/test"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
          >
            Try Again
          </Link>
          {isAuthenticated && (
            <Link
              to="/history"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              View Dashboard
            </Link>
          )}
          <Link
            to="/"
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
