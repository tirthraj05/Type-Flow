import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { generateText } from '../utils/generateText'

export default function TypingTest(){
  const navigate = useNavigate()
  const [text, setText] = useState(()=>generateText())
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)
  const [lastKey, setLastKey] = useState(null)
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(()=>{
    // focus hidden input
    inputRef.current?.focus()
  },[])

  useEffect(()=>{
    if(started && !finished){
      timerRef.current = setInterval(()=>{
        setElapsed(Math.floor((Date.now() - startTime)/1000))
      },250)
    }
    return ()=> clearInterval(timerRef.current)
  },[started, startTime, finished])

  const resetAll = (newText) =>{
    setText(newText || generateText())
    setTyped('')
    setStarted(false)
    setStartTime(null)
    setElapsed(0)
    setFinished(false)
    setLastKey(null)
  }

  const onInput = (e) =>{
    const value = e.target.value
    // start timer on first character
    if(!started && value.length>0){
      setStarted(true)
      setStartTime(Date.now())
    }
    setTyped(value)
    setLastKey(value.slice(-1))
    if(value.length >= text.length){
      // finish
      setFinished(true)
      clearInterval(timerRef.current)
      // compute final stats and navigate to results
      const stats = computeStats(value, text, elapsed || Math.max(1, Math.floor((Date.now()-startTime)/1000)))
      // pass stats via state
      navigate('/results',{state: {stats}})
    }
  }

  const computeStats = (typedStr, target, elapsedSec) =>{
    const totalTyped = typedStr.length
    let correct = 0
    let mistakes = 0
    for(let i=0;i<typedStr.length;i++){
      if(i >= target.length) break
      if(typedStr[i] === target[i]) correct++
      else mistakes++
    }
    const minutes = Math.max(elapsedSec/60, 1/60)
    const wpm = Math.round((correct/5)/minutes)
    const accuracy = Math.round((correct / Math.max(totalTyped,1)) * 100)
    return {wpm, accuracy, mistakes, time: elapsedSec, correct, totalTyped}
  }

  // derive live metrics
  const liveStats = (() => {
    const totalTyped = typed.length
    let correct = 0
    let mistakes = 0
    for(let i=0;i<typed.length;i++){
      if(i >= text.length) break
      if(typed[i]===text[i]) correct++
      else mistakes++
    }
    const minutes = Math.max((elapsed)/60, 1/60)
    const wpm = Math.round((correct/5)/minutes)
    const accuracy = Math.round((correct / Math.max(totalTyped,1)) * 100)
    return {wpm, accuracy, mistakes, totalTyped, correct}
  })()

  const progress = Math.min(100, Math.round((typed.length / text.length) * 100))

  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      <div className="lg:flex lg:gap-6">
        <div className="flex-1 bg-slate-900 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Typing Test</h2>
            <div className="text-sm text-slate-300">Time: <span className="font-medium text-white">{elapsed}s</span></div>
          </div>

          <div className="mt-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-6 cursor-text" onClick={()=> inputRef.current?.focus()}>
            <div className="text-lg leading-relaxed text-slate-200">
              {Array.from(text).map((ch, idx)=>{
                const t = typed[idx]
                const cls = idx === typed.length ? 'bg-sky-700/20 text-sky-200 rounded-sm px-0.5' : t==null ? 'text-slate-400' : (t === ch ? 'text-emerald-400' : 'text-rose-400 underline')
                return <span key={idx} className={"mx-0.5 " + cls}>{ch}</span>
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
              <div className="bg-primary h-3" style={{width: progress + '%'}} />
            </div>
            <div className="text-sm text-slate-300">{progress}%</div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-800 text-center">
              <div className="text-xs text-slate-300">WPM</div>
              <div className="text-2xl font-bold text-white">{liveStats.wpm}</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800 text-center">
              <div className="text-xs text-slate-300">Accuracy</div>
              <div className="text-2xl font-bold text-white">{liveStats.accuracy}%</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800 text-center">
              <div className="text-xs text-slate-300">Mistakes</div>
              <div className="text-2xl font-bold text-white">{liveStats.mistakes}</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800 text-center">
              <div className="text-xs text-slate-300">Typed</div>
              <div className="text-2xl font-bold text-white">{liveStats.totalTyped}</div>
            </div>
          </div>

          <textarea
            ref={inputRef}
            value={typed}
            onChange={onInput}
            className="mt-6 w-full rounded-md bg-slate-900 text-transparent caret-sky-400 placeholder-transparent h-10 resize-none"
            rows={2}
          />

          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-primary text-sky-900 font-semibold shadow hover:scale-105 transition" onClick={()=> resetAll(generateText())}>Generate Paragraph</button>
            <button className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700" onClick={()=> resetAll(text)}>Restart</button>
          </div>

          <div className="mt-3 text-sm text-slate-400">Tip: Click the paragraph and start typing. The test ends when you finish the paragraph.</div>
        </div>

        <aside className="w-full lg:w-80 mt-6 lg:mt-0">
          <div className="bg-slate-900 p-4 rounded-2xl shadow-lg">
            <h4 className="text-white font-semibold">Live Stats</h4>
            <div className="mt-3 text-slate-300 space-y-2">
              <div>WPM: <span className="font-medium text-white">{liveStats.wpm}</span></div>
              <div>Accuracy: <span className="font-medium text-white">{liveStats.accuracy}%</span></div>
              <div>Mistakes: <span className="font-medium text-white">{liveStats.mistakes}</span></div>
              <div>Progress: <span className="font-medium text-white">{progress}%</span></div>
            </div>

            <div className="mt-4 bg-slate-800 p-3 rounded-lg text-center text-slate-400">Sidebar Ad Placeholder</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
