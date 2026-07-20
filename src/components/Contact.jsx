import { contact } from '../data/content.js'
import styles from './Contact.module.css'

function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <p className={styles.eyebrow}>05. What's Next?</p>
      <h2 className={styles.heading}>{contact.subheading}</h2>
      <p className={styles.body}>{contact.body}</p>
      <a className={styles.cta} href={`mailto:${contact.email}`}>
        Say Hello
      </a>
    </section>
  )
}

export default Contact
