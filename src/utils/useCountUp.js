import { useEffect, useState } from 'react'

export default function useCountUp(target, duration = 850) {
  const [value, setValue] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? Number(target) || 0 : 0)

  useEffect(() => {
    const end = Number(target) || 0
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches || duration <= 0) {
      setValue(end)
      return undefined
    }

    let frame = 0
    let startTime
    let startValue = value
    let cancelled = false
    const animate = timestamp => {
      if (cancelled) return
      if (startTime === undefined) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(startValue + (end - startValue) * eased)
      if (progress < 1) frame = window.requestAnimationFrame(animate)
      else setValue(end)
    }

    frame = window.requestAnimationFrame(animate)
    const handleMotionChange = event => {
      if (!event.matches) return
      cancelled = true
      window.cancelAnimationFrame(frame)
      setValue(end)
    }
    motionPreference.addEventListener?.('change', handleMotionChange)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      motionPreference.removeEventListener?.('change', handleMotionChange)
    }
  }, [target, duration])

  return value
}
