import { projects } from '../data/content.js'
import sectionStyles from './Section.module.css'
import styles from './Projects.module.css'
import FNODemo from './FNODemo.jsx'
import MSEDemo from './MSEDemo.jsx'

function Projects() {
  return (
    <section id="projects" className={sectionStyles.section}>
      <h2 className={sectionStyles.heading}>
        <span className={sectionStyles.number}>04.</span> Things I've Built
      </h2>
      <div className={styles.list}>
        {projects.map((project) => (
          <article key={project.title} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.title}>{project.title}</h3>
              {project.paperRef && (
                <span className={styles.paperRef}>{project.paperRef}</span>
              )}
            </div>

            <ul className={styles.stack}>
              {project.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            {project.coverImage && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className={styles.coverWrapper}
              >
                <img
                  src={import.meta.env.BASE_URL + project.coverImage}
                  alt={`${project.title} cover`}
                  className={styles.coverImage}
                />
                <span className={styles.coverOverlay}>Read it →</span>
              </a>
            )}

            <p className={styles.description}>{project.description}</p>

            <ul className={styles.results}>
              {project.results.map((r, i) => (
                <li key={i}>
                  <span className={sectionStyles.bullet}>▹</span> {r}
                </li>
              ))}
            </ul>

            <div className={styles.links}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer">
                  GitHub →
                </a>
              )}
              {project.link && !project.coverImage && (
                <a href={project.link} target="_blank" rel="noreferrer">
                  View →
                </a>
              )}
            </div>

            {project.demoType === 'retrieval' && <MSEDemo />}
            {project.interactive && !project.demoType && <FNODemo />}
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
