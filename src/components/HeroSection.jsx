import Hero from './Hero.jsx'
import PendulumPlayground from './PendulumPlayground.jsx'
import DotField from './DotField.jsx'
import { useIsMobile } from '../hooks/useIsMobile.js'
import styles from './HeroSection.module.css'

/**
 * Combines Hero and the pendulum widget under one shared DotField
 * background, spanning both sections together (rather than being trapped
 * inside Hero alone), full-bleed to the viewport edges, fading out toward
 * the bottom so it blends smoothly into the sections that follow.
 */
function HeroSection() {
  const isMobile = useIsMobile()

  return (
    <div className={styles.wrapper}>
      <div className={styles.dotFieldLayer}>
        <DotField />
      </div>
      <Hero />
      {!isMobile && <PendulumPlayground />}
    </div>
  )
}

export default HeroSection
