import { useEffect, useRef, useState } from 'react'

export default function useExitAnimation(duration = 220) {
  const [exitingIds, setExitingIds] = useState(() => new Set())
  const timers = useRef(new Map())

  useEffect(() => () => timers.current.forEach(timer => window.clearTimeout(timer)), [])

  const removeWithExit = (id, remove) => {
    if (exitingIds.has(id)) return
    setExitingIds(previous => new Set(previous).add(id))
    const timer = window.setTimeout(() => {
      timers.current.delete(id)
      setExitingIds(previous => {
        const next = new Set(previous)
        next.delete(id)
        return next
      })
      remove()
    }, duration)
    timers.current.set(id, timer)
  }

  return { exitingIds, removeWithExit }
}
