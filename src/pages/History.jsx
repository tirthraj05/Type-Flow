import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function History() {
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [isAuthenticated, token, page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch test history with pagination
      const historyResponse = await fetch(`http://localhost:5000/api/tests/history?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const historyData = await historyResponse.json();

      if (historyResponse.ok) {
        setResults(historyData.results || []);
        setTotalPages(historyData.pagination?.totalPages || 1);
      } else {
        setError(historyData.error || 'Failed to fetch history');
      }

      // Fetch statistics
      const statsResponse = await fetch('http://localhost:5000/api/tests/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const statsData = await statsResponse.json();

      if (statsResponse.ok) {
        setStats(statsData.stats);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestDetail = async (testId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tests/${testId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const testData = await response.json();
        setSelectedTest(testData);
      }
    } catch (err) {
      console.error('Error fetching test detail:', err);
    }
  };

  const handleViewDetail = (testId) => {
    fetchTestDetail(testId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = ['Date & Time', 'WPM', 'Accuracy (%)', 'Mistakes', 'Duration (s)'];
    const csvContent = [
      headers.join(','),
      ...results.map((r) =>
        `"${formatDate(r.createdAt)}",${r.wpm},${r.accuracy},${r.mistakes},${r.duration}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typing_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Your Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={() => navigate('/test')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            New Test
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Statistics Overview */}
        {stats && stats.totalTests > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="text-gray-500 text-sm font-semibold uppercase">Total Tests</div>
              <div className="text-4xl font-bold text-blue-600 mt-2">{stats.totalTests}</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="text-gray-500 text-sm font-semibold uppercase">Avg WPM</div>
              <div className="text-4xl font-bold text-purple-600 mt-2">{Math.round(stats.avgWpm || 0)}</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="text-gray-500 text-sm font-semibold uppercase">Best WPM</div>
              <div className="text-4xl font-bold text-green-600 mt-2">{Math.round(stats.maxWpm || 0)}</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="text-gray-500 text-sm font-semibold uppercase">Avg Accuracy</div>
              <div className="text-4xl font-bold text-orange-600 mt-2">{Math.round(stats.avgAccuracy || 0)}%</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="text-gray-500 text-sm font-semibold uppercase">Improvements</div>
              <div className="text-4xl font-bold text-pink-600 mt-2">{stats.improvementCount || 0}</div>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Test History</h2>
            <button
              onClick={exportToCSV}
              disabled={results.length === 0}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition text-sm"
            >
              Export CSV
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No test results yet.</p>
              <p className="text-gray-500 mt-2">Start with a typing test to see your results here.</p>
              <button
                onClick={() => navigate('/test')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
              >
                Take Test
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Date & Time</th>
                      <th className="px-6 py-4 text-right font-semibold text-gray-700">WPM</th>
                      <th className="px-6 py-4 text-right font-semibold text-gray-700">Accuracy</th>
                      <th className="px-6 py-4 text-right font-semibold text-gray-700">Mistakes</th>
                      <th className="px-6 py-4 text-right font-semibold text-gray-700">Duration</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-900">{formatDate(result.createdAt)}</td>
                        <td className="px-6 py-4 text-right font-bold text-blue-600">{result.wpm}</td>
                        <td className="px-6 py-4 text-right font-bold text-green-600">{result.accuracy}%</td>
                        <td className="px-6 py-4 text-right text-red-600">{result.mistakes}</td>
                        <td className="px-6 py-4 text-right text-gray-600">{result.duration}s</td>
                        <td className="px-6 py-4 text-center">
                          {result.improved ? (
                            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              ✓ Improved
                            </span>
                          ) : (
                            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewDetail(result.id)}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 rounded transition"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 rounded transition ${
                          page === p
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 rounded transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Test Detail Modal */}
        {selectedTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Test Details</h2>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm font-semibold">WPM</div>
                  <div className="text-3xl font-bold text-blue-600 mt-2">{selectedTest.wpm}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm font-semibold">Accuracy</div>
                  <div className="text-3xl font-bold text-green-600 mt-2">{selectedTest.accuracy}%</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm font-semibold">Mistakes</div>
                  <div className="text-3xl font-bold text-red-600 mt-2">{selectedTest.mistakes}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm font-semibold">Duration</div>
                  <div className="text-3xl font-bold text-purple-600 mt-2">{selectedTest.duration}s</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Typed Text</h3>
                <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed">{selectedTest.typedText}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="text-gray-600">
                  <strong>Test Date:</strong> {formatDate(selectedTest.createdAt)}
                </div>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
