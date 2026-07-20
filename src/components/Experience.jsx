import { experience } from '../data/content.js'
import sectionStyles from './Section.module.css'
import styles from './Experience.module.css'

function Experience() {
  return (
    <section id="experience" className={sectionStyles.section}>
      <h2 className={sectionStyles.heading}>
        <span className={sectionStyles.number}>02.</span> Where I've Worked
      </h2>
      <div className={styles.list}>
        {experience.map((job) => (
          <article key={job.role + job.org} className={styles.item}>
            <div className={styles.itemHeader}>
              <h3 className={styles.role}>{job.role} <span className={styles.org}>@ {job.org}</span></h3>
              <p className={styles.date}>{job.date}</p>
            </div>
            <p className={styles.location}>{job.location}</p>
            <ul className={styles.bullets}>
              {job.bullets.map((b, i) => (
                <li key={i}>
                  <span className={sectionStyles.bullet}>▹</span> {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Experience
