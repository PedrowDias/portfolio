import { nav } from '../data/content.js'
import styles from './Nav.module.css'

function Nav() {
  return (
    <header className={styles.nav}>
      <a href="#top" className={styles.logo} aria-label="Home">PW</a>
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
