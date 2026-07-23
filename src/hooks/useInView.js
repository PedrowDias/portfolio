import { useEffect, useRef, useState } from 'react'

/**
 * Tracks whether an element has entered the viewport, using
 * IntersectionObserver. Triggers once and stays true afterward — sections
 * shouldn't fade back out if the user scrolls past and back.
 *
 * @param {IntersectionObserverInit} options
 * @returns {[React.RefObject, boolean]} ref to attach, and whether it's in view
 */
export function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.unobserve(node)
      }
    }, options)

    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [ref, inView]
}
