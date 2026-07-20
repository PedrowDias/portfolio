import styles from './Hero.module.css'

/**
 * Landing section — name, one-line role description, and a short intro.
 * This is a placeholder to confirm the build pipeline works end to end;
 * full content and styling come in a later pass.
 */
function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.greeting}>Hi, my name is</p>
      <h1 className={styles.name}>Pedro Werneck.</h1>
      <h2 className={styles.tagline}>I build things at the intersection of physics and machine learning.</h2>
    </section>
  )
}

export default Hero
