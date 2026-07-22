import { useMemo } from 'react'
import katex from 'katex'

/**
 * Renders a LaTeX math string using KaTeX. Requires 'katex/dist/katex.min.css'
 * to be imported once, globally (done in main.jsx).
 */
function Equation({ tex, className }) {
  const html = useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: true }),
    [tex]
  )
  // eslint-disable-next-line react/no-danger
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

export default Equation
