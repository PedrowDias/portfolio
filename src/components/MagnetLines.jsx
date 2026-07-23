import { useRef, useEffect } from 'react'
import styles from './MagnetLines.module.css'

/**
 * A grid of small line segments that rotate to point toward the cursor —
 * the classic "grass bending toward the cursor" effect (not a physically
 * accurate magnetic field, which would curve around it instead).
 *
 * Visual quality depends heavily on line length relative to grid spacing:
 * if lines are much shorter than the gap between them, the field looks
 * sparse and disconnected ("arrows"). If lines are close to the spacing
 * length, the eye connects them into a smooth, continuous-looking field.
 * Callers should size rows/columns/lineHeight together with this in mind.
 *
 * Performance: each item's position is cached as {element, x, y} on mount,
 * so the mousemove loop does pure arithmetic with zero DOM reads — no
 * getBoundingClientRect() calls during animation, which is what made a
 * large grid catastrophically expensive before. Cache is refreshed on
 * resize and on 'transitionend' bubbling from anywhere on the page (the
 * Contact section's own scroll-reveal fade/slide would otherwise leave
 * the cache stale after it finishes animating).
 */
export default function MagnetLines({
  rows = 9,
  columns = 9,
  containerSize = '80vmin',
  lineColor = 'var(--color-teal)',
  lineWidth = '1vmin',
  lineHeight = '6vmin',
  baseAngle = -10,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const spans = Array.from(container.querySelectorAll('span'))
    if (!spans.length) return

    let cachedItems = []
    let pendingPointer = null
    let rafId = null

    const measure = () => {
      cachedItems = spans.map((element) => {
        const rect = element.getBoundingClientRect()
        return { element, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
      })
    }

    const applyRotation = () => {
      rafId = null
      const pointer = pendingPointer
      if (!pointer) return
      for (const item of cachedItems) {
        const angle = (Math.atan2(pointer.y - item.y, pointer.x - item.x) * 180) / Math.PI
        item.element.style.setProperty('--rotate', `${angle}deg`)
      }
    }

    const onPointerMove = (e) => {
      pendingPointer = { x: e.clientX, y: e.clientY }
      if (rafId === null) rafId = requestAnimationFrame(applyRotation)
    }

    const remeasureAndReapply = () => {
      measure()
      if (rafId === null && pendingPointer) rafId = requestAnimationFrame(applyRotation)
    }

    measure()
    spans.forEach((el) => el.style.setProperty('--rotate', `${baseAngle}deg`))

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('resize', remeasureAndReapply)
    window.addEventListener('transitionend', remeasureAndReapply)

    if (cachedItems.length) {
      const middle = cachedItems[Math.floor(cachedItems.length / 2)]
      pendingPointer = { x: middle.x, y: middle.y }
      applyRotation()
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', remeasureAndReapply)
      window.removeEventListener('transitionend', remeasureAndReapply)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [rows, columns, baseAngle])

  const total = rows * columns
  const spanEls = Array.from({ length: total }, (_, i) => (
    <span
      key={i}
      style={{
        backgroundColor: lineColor,
        width: lineWidth,
        height: lineHeight,
      }}
    />
  ))

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: containerSize,
        height: containerSize,
        ...style,
      }}
    >
      {spanEls}
    </div>
  )
}
