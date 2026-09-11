import { useState, useRef, useCallback, useEffect } from 'react'
import styles from './PhotoDeck.module.css'

// How many cards get the visible "fanned" treatment; the rest sit hidden
// behind them. Four is enough to read as a real stack without paying to
// render depth nobody can see.
const VISIBLE = 4

// Must stay in sync with the exit transition duration in
// PhotoDeck.module.css — this is how long we wait before actually
// reordering the stack, so the outgoing card finishes sliding away first.
const EXIT_MS = 340

function PhotoDeck({ photos }) {
  // order[0] is the card currently on top. Advancing rotates this array,
  // so the deck cycles forever rather than running out.
  const [order, setOrder] = useState(() => photos.map((_, i) => i))
  const [leaving, setLeaving] = useState(false)
  const timeoutRef = useRef(null)
  const dragStartX = useRef(null)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const advance = useCallback(() => {
    if (leaving) return // ignore clicks mid-animation
    setLeaving(true)
    timeoutRef.current = setTimeout(() => {
      setOrder(prev => [...prev.slice(1), prev[0]])
      setLeaving(false)
    }, EXIT_MS)
  }, [leaving])

  // Going back doesn't need an exit animation — the card simply flies in
  // from the front, which reads naturally as "undo".
  const goBack = useCallback(() => {
    if (leaving) return
    setOrder(prev => [prev[prev.length - 1], ...prev.slice(0, -1)])
  }, [leaving])

  const onKeyDown = e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      advance()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goBack()
    }
  }

  const onPointerDown = e => {
    dragStartX.current = e.clientX
  }

  const onPointerUp = e => {
    if (dragStartX.current === null) return
    const dx = e.clientX - dragStartX.current
    dragStartX.current = null
    if (dx < -60) advance()
    else if (dx > 60) goBack()
    else advance() // a plain click (no meaningful drag) also advances
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.deck}
        role="button"
        tabIndex={0}
        aria-label={`Photo ${order[0] + 1} of ${photos.length}. Click or press arrow keys to browse.`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { dragStartX.current = null }}
      >
        {order.map((photoIndex, depth) => {
          const photo = photos[photoIndex]
          const isTop = depth === 0
          const hidden = depth >= VISIBLE

          const classNames = [
            styles.card,
            isTop && leaving ? styles.cardLeaving : '',
            hidden ? styles.cardHidden : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <figure
              key={photoIndex}
              className={classNames}
              style={{
                // Depth-based fan: each card sits slightly up, over and
                // rotated relative to the one in front of it.
                '--depth': depth,
                zIndex: photos.length - depth,
              }}
              aria-hidden={!isTop}
            >
              <img
                src={import.meta.env.BASE_URL + photo.src}
                alt={photo.caption || `CERN summer photo ${photoIndex + 1}`}
                className={styles.image}
                draggable={false}
                loading={depth < VISIBLE ? 'eager' : 'lazy'}
              />
              {photo.caption && (
                <figcaption className={styles.caption}>{photo.caption}</figcaption>
              )}
            </figure>
          )
        })}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={goBack}
          aria-label="Previous photo"
        >
          ←
        </button>
        <span className={styles.counter}>
          {order[0] + 1} / {photos.length}
        </span>
        <button
          type="button"
          className={styles.arrow}
          onClick={advance}
          aria-label="Next photo"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default PhotoDeck
