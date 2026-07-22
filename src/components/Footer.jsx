import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { contact } from '../data/content.js'
import styles from './Footer.module.css'

const ICONS = { GitHub: FaGithub, LinkedIn: FaLinkedin }

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.socials}>
        {contact.socials.map((s) => {
          const Icon = ICONS[s.label]
          return (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
              {Icon ? <Icon /> : s.label}
            </a>
          )
        })}
        <a href={`mailto:${contact.email}`} aria-label="Email">
          <FaEnvelope />
        </a>
      </div>
      <p className={styles.credit}>Built by Pedro Werneck with React &amp; Vite.</p>
    </footer>
  )
}

export default Footer
