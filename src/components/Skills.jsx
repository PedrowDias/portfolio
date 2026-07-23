import { skills } from '../data/content.js'
import { useInView } from '../hooks/useInView.js'
import sectionStyles from './Section.module.css'
import styles from './Skills.module.css'

function Skills() {
  const [ref, inView] = useInView()

  return (
    <section
      ref={ref}
      id="skills"
      className={`${sectionStyles.section} ${inView ? sectionStyles.sectionVisible : ''}`}
    >
      <h2 className={sectionStyles.heading}>
        <span className={sectionStyles.number}>03.</span> Skills &amp; Awards
      </h2>
      <div className={styles.grid}>
        <div>
          <h3 className={styles.subheading}>Technical</h3>
          <ul className={styles.tagList}>
            {skills.technical.map((s) => (
              <li key={s} className={styles.tag}>{s}</li>
            ))}
          </ul>
          <h3 className={styles.subheading} style={{ marginTop: '1.5rem' }}>Coursework</h3>
          <ul className={styles.tagList}>
            {skills.coursework.map((s) => (
              <li key={s} className={styles.tag}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={styles.subheading}>Awards</h3>
          <ul className={styles.awardList}>
            {skills.awards.map((a, i) => (
              <li key={i}>
                <span className={sectionStyles.bullet}>▹</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Skills
