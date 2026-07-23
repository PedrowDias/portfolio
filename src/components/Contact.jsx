import { contact } from '../data/content.js'
import { useInView } from '../hooks/useInView.js'
import MagnetLines from './MagnetLines.jsx'
import styles from './Contact.module.css'

function Contact() {
  const [ref, inView] = useInView()

  return (
    <section
      ref={ref}
      id="contact"
      className={`${styles.section} ${inView ? styles.sectionVisible : ''}`}
    >
      <div className={styles.magnetBackground}>
        <MagnetLines
          rows={17}
          columns={37}
          containerSize="100%"
          lineColor="var(--color-teal)"
          lineWidth="1px"
          lineHeight="21px"
          style={{ margin: 0 }}
        />
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>05. Contact Me</p>
        <h2 className={styles.heading}>{contact.subheading}</h2>
        <p className={styles.body}>{contact.body}</p>
        <a className={styles.cta} href={`mailto:${contact.email}`}>
          Say Hello
        </a>
      </div>
    </section>
  )
}

export default Contact
