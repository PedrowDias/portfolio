import { about } from '../data/content.js'
import styles from './Section.module.css'

function About() {
  return (
    <section id="about" className={styles.section}>
      <h2 className={styles.heading}>
        <span className={styles.number}>01.</span> About Me
      </h2>
      <div className={styles.aboutGrid}>
        <div>
          {about.paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>{p}</p>
          ))}
        </div>
        <ul className={styles.skillGrid}>
          {about.skills.map((skill) => (
            <li key={skill} className={styles.skillItem}>
              <span className={styles.bullet}>▹</span> {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default About
