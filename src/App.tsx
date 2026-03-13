import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useTheme } from './hooks/useTheme'

const MILESTONES = [10, 25, 50, 100]

function App() {
  const [count, setCount] = useState(0)
  const { theme, toggleTheme } = useTheme()
  const [celebrating, setCelebrating] = useState(false)
  const celebratedRef = useRef<Set<number>>(new Set())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function increment() {
    setCount((prev) => {
      const next = prev + 1
      if (MILESTONES.includes(next) && !celebratedRef.current.has(next)) {
        celebratedRef.current.add(next)
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
        setCelebrating(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCelebrating(false), 2500)
      }
      return next
    })
  }

  function reset() {
    setCount(0)
    celebratedRef.current.clear()
    setCelebrating(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={increment}>
          count is {count}
        </button>
        {count > 0 && (
          <button onClick={reset}>Reset</button>
        )}
        {celebrating && (
          <p role="status" aria-live="polite">🎉 Milestone reached!</p>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
      </button>
    </>
  )
}

export default App
