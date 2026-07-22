import { useState, useEffect } from 'react'
import { hero } from '../data/content.js'
import styles from './Hero.module.css'

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

/**
 * Simulates natural typing: irregular per-letter timing (slower after
 * spaces/punctuation, like a real pause in thought), and an occasional
 * typo that gets backspaced and corrected — rather than a perfectly even
 * character-by-character reveal, which reads as robotic.
 */
function useTypewriter(text) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let cancelled = false
    let current = ''
    let i = 0
    let timeoutId

    const typeNext = () => {
      if (cancelled || i >= text.length) return

      const nextChar = text[i]
      const isLastChar = i === text.length - 1
      const makeTypo = !isLastChar && nextChar !== ' ' && Math.random() < 0.2

      if (makeTypo) {
        const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26))
        current += wrongChar
        setDisplayed(current)

        timeoutId = setTimeout(() => {
          if (cancelled) return
          current = current.slice(0, -1)
          setDisplayed(current)

          timeoutId = setTimeout(() => {
            if (cancelled) return
            current += nextChar
            setDisplayed(current)
            i += 1
            timeoutId = setTimeout(typeNext, randomBetween(40, 140))
          }, randomBetween(90, 170))
        }, randomBetween(150, 320))
        return
      }

      current += nextChar
      setDisplayed(current)
      i += 1

      const pause = /[ ,.]/.test(nextChar)
        ? randomBetween(160, 320)
        : Math.random() < 0.35
          ? randomBetween(15, 45) // occasional fast burst, like real typing
          : randomBetween(50, 140)
      timeoutId = setTimeout(typeNext, pause)
    }

    timeoutId = setTimeout(typeNext, 300)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [text])

  return displayed
}

function Hero() {
  const typedName = useTypewriter(hero.name)
  const doneTyping = typedName === hero.name

  return (
    <section className={styles.hero}>
      <p className={styles.greeting}>{hero.greeting}</p>
      <h1 className={styles.name}>
        {typedName}
        <span className={doneTyping ? styles.cursorBlink : styles.cursor}>|</span>
      </h1>
      <h2 className={styles.tagline}>{hero.tagline}</h2>
      <p className={styles.subtitle}>{hero.subtitle}</p>
      <a href="#projects" className={styles.cta}>Check out my work</a>
    </section>
  )
}

export default Hero
