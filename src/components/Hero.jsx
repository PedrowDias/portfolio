import { hero } from '../data/content.js'
import styles from './Hero.module.css'

function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.greeting}>{hero.greeting}</p>
      <h1 className={styles.name}>{hero.name}</h1>
      <h2 className={styles.tagline}>{hero.tagline}</h2>
      <p className={styles.subtitle}>{hero.subtitle}</p>
      <a href="#projects" className={styles.cta}>Check out my work</a>
    </section>
  )
}

export default Hero
