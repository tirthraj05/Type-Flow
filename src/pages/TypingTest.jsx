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
    <div className="container">
      <div className="grid">
        <div>
          <div className="card typing-area">
            <h2>Typing Test</h2>
            <div className="ad-placeholder" style={{marginBottom:12}}>Header Ad Placeholder</div>

            <div className="text-display" onClick={()=> inputRef.current?.focus()}>
              {Array.from(text).map((ch, idx)=>{
                const t = typed[idx]
                const cls = idx === typed.length ? 'char current' : t==null ? 'char' : (t === ch ? 'char correct' : 'char incorrect')
                return <span key={idx} className={cls}>{ch}</span>
              })}
            </div>

            <div style={{height:8}} />

            <div className="progress-bar"><div className="progress" style={{width:progress + '%'}}></div></div>

            <div style={{height:8}} />

            <div className="metrics">
              <div className="metric">WPM: <strong>{liveStats.wpm}</strong></div>
              <div className="metric">Accuracy: <strong>{liveStats.accuracy}%</strong></div>
              <div className="metric">Mistakes: <strong>{liveStats.mistakes}</strong></div>
              <div className="metric">Time: <strong>{elapsed}s</strong></div>
            </div>

            <div style={{height:8}} />

            <textarea
              ref={inputRef}
              value={typed}
              onChange={onInput}
              className="hidden-input"
              rows={4}
              />

            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button className="btn" onClick={()=> resetAll(generateText())}>Regenerate Text</button>
              <button className="btn" style={{background:'transparent',border:'1px solid rgba(255,255,255,0.04)'}} onClick={()=> resetAll(text)}>Restart</button>
            </div>

            <div style={{marginTop:12,color:'#94a3b8',fontSize:13}}>Tip: Click the text area and start typing. The test finishes when you complete all characters.</div>
          </div>
        </div>
        <div>
          <div className="card">
            <h4>Live Stats</h4>
            <div style={{display:'grid',gap:6}}>
              <div>WPM: <strong>{liveStats.wpm}</strong></div>
              <div>Accuracy: <strong>{liveStats.accuracy}%</strong></div>
              <div>Mistakes: <strong>{liveStats.mistakes}</strong></div>
              <div>Progress: <strong>{progress}%</strong></div>
            </div>
            <div style={{height:12}} />
            <div className="ad-placeholder">Sidebar Ad Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  )
}
