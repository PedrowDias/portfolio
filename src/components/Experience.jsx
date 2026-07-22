import { experience } from '../data/content.js'
import sectionStyles from './Section.module.css'
import styles from './Experience.module.css'

/**
 * Computes "X years, Y months" from a start date to now, so an ongoing
 * role's displayed duration stays accurate without needing manual updates.
 */
function computeDuration(startDateStr) {
  const start = new Date(startDateStr)
  const now = new Date()

  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  if (now.getDate() < start.getDate()) months -= 1
  months = Math.max(months, 0)

  const years = Math.floor(months / 12)
  const remMonths = months % 12

  const parts = []
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`)
  if (remMonths > 0 || years === 0) parts.push(`${remMonths} month${remMonths !== 1 ? 's' : ''}`)
  return parts.join(', ')
}

function Experience() {
  return (
    <section id="experience" className={sectionStyles.section}>
      <h2 className={sectionStyles.heading}>
        <span className={sectionStyles.number}>02.</span> Where I've Worked
      </h2>
      <div className={styles.list}>
        {experience.map((job) => {
          const duration = job.duration || (job.startDate && computeDuration(job.startDate))
          return (
            <article key={job.role + job.org} className={styles.item}>
              <div className={styles.itemHeader}>
                <h3 className={styles.role}>{job.role} <span className={styles.org}>@ {job.org}</span></h3>
                <p className={styles.date}>
                  {job.date}
                  {duration && <span className={styles.duration}> · {duration}</span>}
                </p>
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
          )
        })}
      </div>
    </section>
  )
}

export default Experience
