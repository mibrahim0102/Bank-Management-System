import { useEffect, useRef, useState } from 'react'

export default function useShake() {
  const [shaking, setShaking] = useState(false)
  const timer = useRef(null)
  const triggerShake = () => {
    window.clearTimeout(timer.current)
    setShaking(false)
    window.requestAnimationFrame(() => setShaking(true))
    timer.current = window.setTimeout(() => setShaking(false), 380)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])
  return { shaking, triggerShake }
}
