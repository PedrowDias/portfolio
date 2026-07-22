import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { nav, contact } from '../data/content.js'
import styles from './Nav.module.css'

function Nav() {
  return (
    <header className={styles.nav}>
      <div className={styles.logoLinks} aria-label="Social links">
        <a href={contact.socials.find((s) => s.label === 'GitHub')?.href} target="_blank" rel="noreferrer" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href={contact.socials.find((s) => s.label === 'LinkedIn')?.href} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
        <a href={`mailto:${contact.email}`} aria-label="Email">
          <FaEnvelope />
        </a>
      </div>
      <nav aria-label="Primary">
        <ol className={styles.list}>
          {nav.map((item, i) => (
            <li key={item.href}>
              <a href={item.href}>
                <span className={styles.index}>{String(i + 1).padStart(2, '0')}.</span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  )
}

export default Nav
