import { useState, useMemo } from 'react'
import worldDots from '../data/worldDots.json'
import { visitedCountries } from '../data/content.js'
import styles from './WorldMap.module.css'

// Toronto's position, computed with the same equirectangular formula used
// in scripts/generate-dot-map.mjs (which used d3's fitSize on the same
// WIDTH x HEIGHT canvas): x = (lon+180)/360 * width, y = (90-lat)/180 * height.
const TORONTO_LAT = 43.6532
const TORONTO_LON = -79.3832
const TORONTO_PIN = {
  x: ((TORONTO_LON + 180) / 360) * worldDots.width,
  y: ((90 - TORONTO_LAT) / 180) * worldDots.height,
}

function normalize(name) {
  return name.toLowerCase().replace(/^the /, '').trim()
}

const ALIASES = {
  bahamas: ['bahamas', 'the bahamas'],
  'united states of america': ['united states of america', 'united states', 'usa'],
  'united arab emirates': ['united arab emirates', 'uae'],
}

function buildVisitedSet() {
  const set = new Set()
  for (const country of visitedCountries) {
    const norm = normalize(country)
    set.add(norm)
    for (const alias of ALIASES[norm] || []) {
      set.add(alias)
    }
  }
  return set
}

function WorldMap() {
  const [hovered, setHovered] = useState(null)
  const visitedSet = useMemo(buildVisitedSet, [])

  const isVisited = (countryName) => {
    const norm = normalize(countryName)
    if (visitedSet.has(norm)) return true
    return Object.entries(ALIASES).some(
      ([canonical, aliases]) => aliases.includes(norm) && visitedSet.has(canonical)
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.statusBar}>
        <span className={styles.count}>{visitedCountries.length} countries visited</span>
        <span className={styles.hoverName}>{hovered || '\u00A0'}</span>
      </div>

      <svg
        viewBox={`0 0 ${worldDots.width} ${worldDots.height}`}
        className={styles.map}
        role="img"
        aria-label="Dot map of the world with countries I've visited highlighted"
      >
        {worldDots.dots.map((dot, i) => {
          const visited = isVisited(dot.country)
          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(dot.country)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(dot.country)}
            >
              {/* Larger invisible circle — the actual hover/click target,
                  since the small visible dot alone is too fiddly to hit
                  reliably with a mouse. */}
              <circle cx={dot.x} cy={dot.y} r={4} className={styles.hitArea} />
              <circle
                cx={dot.x}
                cy={dot.y}
                r={1.6}
                className={visited ? styles.dotVisited : styles.dot}
                pointerEvents="none"
              />
            </g>
          )
        })}

        {/* Home base marker: a stem with a dot on top, using the same
            circular dot shape as the rest of the map. */}
        <g transform={`translate(${TORONTO_PIN.x}, ${TORONTO_PIN.y})`}>
          <rect x="-0.5" y="-24" width="1" height="24" fill="#ff2d2d" />
          <circle cx="0" cy="-32" r="8" fill="#ff2d2d" />
        </g>
      </svg>

      <ul className={styles.chipList}>
        {visitedCountries.map((c) => (
          <li key={c} className={styles.chip}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

export default WorldMap
