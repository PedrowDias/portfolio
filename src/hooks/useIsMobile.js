import { useState, useEffect } from 'react'

/**
 * Tracks whether the viewport is at or below a mobile breakpoint. Used to
 * skip rendering cursor-driven effects (pendulum drag, magnetic field
 * lines) on touch devices — they don't make sense without a cursor, and
 * there's no reason to run their animation loops on a phone.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  )

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handleChange = () => setIsMobile(mql.matches)
    handleChange()
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [breakpoint])

  return isMobile
}
