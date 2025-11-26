import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateText } from '../utils/generateText';
import { useAuth } from '../context/AuthContext';

export default function TypingTest() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const [text, setText] = useState(() => generateText());
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (started && !paused && !finished) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime + pausedTime) / 1000));
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [started, paused, startTime, pausedTime, finished]);

  const resetAll = (newText) => {
    setText(newText || generateText());
    setTyped('');
    setStarted(false);
    setPaused(false);
    setStartTime(null);
    setPausedTime(0);
    setElapsed(0);
    setFinished(false);
    inputRef.current?.focus();
  };

  const togglePause = () => {
    if (!started) return;
    if (paused) {
      setStartTime(Date.now());
      setPausedTime(pausedTime + (Date.now() - pausedTime));
    } else {
      setPausedTime(Date.now());
    }
    setPaused(!paused);
  };

  const onInput = (e) => {
    const value = e.target.value;
    
    // start timer on first character
    if (!started && value.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
      setPaused(false);
    }
    
    // Don't allow typing beyond the text
    if (value.length > text.length) {
      return;
    }
    
    setTyped(value);

    // Check if finished
    if (value.length >= text.length && value.length > 0) {
      finishTest(value);
    }
  };

  const finishTest = (finalTyped) => {
    setFinished(true);
    clearInterval(timerRef.current);
    setPaused(true);

    const stats = computeStats(finalTyped, text, elapsed || 1);

    if (isAuthenticated && token) {
      saveTestResult(stats, finalTyped);
    } else {
      navigate('/results', { state: { stats } });
    }
  };

  const saveTestResult = async (stats, typedText) => {
    try {
      // Get device info
      const deviceInfo = `${navigator.platform} - ${navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)/) ? navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)/)[0] : 'Browser'}`;
      
      const response = await fetch('http://localhost:5000/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          mistakes: stats.mistakes,
          typed_text: typedText,
          duration_seconds: stats.time,
          device_info: deviceInfo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/results', {
          state: { 
            stats, 
            improved: data.improved, 
            comparison: data.comparison, 
            testId: data.testId,
            encouragementMessage: data.encouragementMessage,
          },
        });
      } else {
        console.error('Failed to save test result:', data.error);
        navigate('/results', { state: { stats } });
      }
    } catch (err) {
      console.error('Error saving test result:', err);
      navigate('/results', { state: { stats } });
    }
  };

  const computeStats = (typedStr, target, elapsedSec) => {
    const totalTyped = typedStr.length;
    let correct = 0;
    let mistakes = 0;
    
    for (let i = 0; i < typedStr.length; i++) {
      if (i >= target.length) break;
      if (typedStr[i] === target[i]) correct++;
      else mistakes++;
    }
    
    const minutes = Math.max(elapsedSec / 60, 0.1);
    const wpm = Math.round((correct / 5) / minutes);
    const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 0;
    
    return { wpm, accuracy, mistakes, time: elapsedSec, correct, totalTyped };
  };

  // derive live metrics
  const liveStats = (() => {
    const totalTyped = typed.length;
    let correct = 0;
    let mistakes = 0;
    
    for (let i = 0; i < typed.length; i++) {
      if (i >= text.length) break;
      if (typed[i] === text[i]) correct++;
      else mistakes++;
    }
    
    const minutes = Math.max(elapsed / 60, 0.1);
    const wpm = Math.round((correct / 5) / minutes);
    const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 0;
    
    return { wpm, accuracy, mistakes, totalTyped, correct };
  })();

  const progress = Math.min(100, Math.round((typed.length / text.length) * 100));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login or create an account to practice typing.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Metrics Header */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
            <div className="text-gray-500 text-sm font-semibold uppercase">WPM</div>
            <div className="text-4xl font-bold text-blue-600">{liveStats.wpm}</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
            <div className="text-gray-500 text-sm font-semibold uppercase">Accuracy</div>
            <div className="text-4xl font-bold text-green-600">{liveStats.accuracy}%</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
            <div className="text-gray-500 text-sm font-semibold uppercase">Mistakes</div>
            <div className="text-4xl font-bold text-red-600">{liveStats.mistakes}</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
            <div className="text-gray-500 text-sm font-semibold uppercase">Time</div>
            <div className="text-4xl font-bold text-purple-600">{elapsed}s</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-gray-600 text-sm mt-2">{progress}% Complete</div>
        </div>

        {/* Typing Area */}
        <div
          className="bg-white rounded-lg p-8 shadow-lg mb-8 cursor-text"
          onClick={() => !finished && inputRef.current?.focus()}
          role="article"
          aria-label="Text to type"
        >
          <div className="text-xl leading-relaxed font-serif text-gray-800 mb-8 min-h-24">
            {Array.from(text).map((ch, idx) => {
              const t = typed[idx];
              let className = 'relative ';

              if (idx === typed.length) {
                className += 'text-gray-400 bg-blue-100 rounded px-0.5';
              } else if (t == null) {
                className += 'text-gray-400';
              } else if (t === ch) {
                className += 'text-green-600 font-semibold';
              } else {
                className += 'text-red-600 font-semibold bg-red-100 rounded px-0.5';
              }

              return (
                <span key={idx} className={className}>
                  {ch}
                </span>
              );
            })}
          </div>

          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={onInput}
            disabled={finished}
            className="sr-only"
            aria-label="Type here"
            aria-live="polite"
            aria-atomic="true"
            maxLength={text.length}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => resetAll(generateText())}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            aria-label="Generate new paragraph"
          >
            Generate Paragraph
          </button>
          <button
            onClick={() => resetAll(text)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            aria-label="Restart test"
          >
            Restart
          </button>
          <button
            onClick={togglePause}
            disabled={!started || finished}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            aria-label={paused ? 'Resume test' : 'Pause test'}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>

        {/* Status Messages */}
        {paused && started && !finished && (
          <div className="mt-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-3 rounded-lg text-center">
            Test Paused — Click Resume to continue
          </div>
        )}

        {finished && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg text-center">
            Test Complete! Check your results below.
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">Tips for Better Typing</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Focus on accuracy first — speed will follow</li>
            <li>• Keep your hands in the home row position</li>
            <li>• Use all fingers, not just your dominant hand</li>
            <li>• Practice regularly for best improvement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
