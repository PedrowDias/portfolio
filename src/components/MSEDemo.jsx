import { useState } from 'react'
import demoData from '../data/mseDemoData.json'
import styles from './MSEDemo.module.css'

const LANGUAGE_NAMES = {
  de: 'German', fr: 'French', es: 'Spanish', pt: 'Portuguese', it: 'Italian',
}

function MSEDemo() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selected = demoData[selectedIdx]

  return (
    <div className={styles.demo}>
      <p className={styles.note}>
        Real retrieval results from the trained model, precomputed offline (no live model
        running in your browser). Each query's actual correct translation is marked below
        (this isn't cherry-picked, the model finds it correctly across all curated examples).
      </p>

      <label className={styles.selectLabel}>
        <span>Query sentence</span>
        <select
          className={styles.select}
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
        >
          {demoData.map((item, i) => (
            <option key={i} value={i}>{item.query}</option>
          ))}
        </select>
      </label>

      <div className={styles.results}>
        {selected.matches.map((match, i) => (
          <div
            key={i}
            className={match.correct ? styles.resultCardCorrect : styles.resultCard}
          >
            <div className={styles.resultHeader}>
              <span className={styles.rank}>#{i + 1}</span>
              <span className={styles.language}>
                {LANGUAGE_NAMES[match.language] || match.language}
              </span>
              {match.correct && (
                <span className={styles.correctBadge}>✓ Correct translation</span>
              )}
            </div>
            <p className={styles.matchText}>{match.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MSEDemo
