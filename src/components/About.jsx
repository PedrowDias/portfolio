import { about } from '../data/content.js'
import sectionStyles from './Section.module.css'
import styles from './About.module.css'
import WorldMap from './WorldMap.jsx'

function About() {
  return (
    <section id="about" className={sectionStyles.section}>
      <h2 className={sectionStyles.heading}>
        <span className={sectionStyles.number}>01.</span> About Me
      </h2>

      {/* Block 1: text left, skills right */}
      <div className={styles.row}>
        <div className={styles.text}>
          {about.paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>{p}</p>
          ))}
        </div>
        <div className={styles.visual}>
          <img
            src={import.meta.env.BASE_URL + about.profilePhoto}
            alt="Pedro Werneck"
            className={styles.photo}
          />
        </div>
      </div>

      {/* Block 2: text right, world map left (alternating) */}
      <div className={styles.row + ' ' + styles.rowReversed}>
        <div className={styles.text}>
          {about.travel.paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>{p}</p>
          ))}
        </div>
        <div className={styles.visual}>
          <WorldMap />
        </div>
      </div>
    </section>
  )
}

export default About
