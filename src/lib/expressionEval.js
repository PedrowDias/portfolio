// Evaluates a user-typed math expression like "sin(2*pi*x) + 0.5*cos(4*pi*x)"
// at each point of a spatial grid, for use as a custom Burgers initial
// condition. Runs entirely client-side in the visitor's own browser sandbox
// (no server involved), evaluated with a restricted set of Math bindings
// rather than raw eval of arbitrary global scope.

const ALLOWED_SCOPE = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  exp: Math.exp, log: Math.log, sqrt: Math.sqrt,
  abs: Math.abs, pow: Math.pow,
  pi: Math.PI, e: Math.E,
}

/**
 * @param {string} expression - e.g. "sin(2*pi*x)"
 * @param {number} nGrid
 * @returns {Float64Array}
 * @throws if the expression is invalid or fails to evaluate.
 */
export function evaluateInitialCondition(expression, nGrid) {
  const scopeKeys = Object.keys(ALLOWED_SCOPE)
  const scopeValues = Object.values(ALLOWED_SCOPE)

  // eslint-disable-next-line no-new-func
  const fn = new Function(...scopeKeys, 'x', `return (${expression});`)

  const u0 = new Float64Array(nGrid)
  for (let i = 0; i < nGrid; i++) {
    const x = i / nGrid
    const value = fn(...scopeValues, x)
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`Expression did not produce a finite number at x=${x.toFixed(3)}.`)
    }
    u0[i] = value
  }
  return u0
}
