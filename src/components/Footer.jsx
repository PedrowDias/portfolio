import { contact } from '../data/content.js'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.socials}>
        {contact.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </div>
      <p className={styles.credit}>Built by Pedro Werneck with React &amp; Vite.</p>
    </footer>
  )
}

export default Footer
