// Finite-difference solver for the viscous 1D Burgers equation:
//   u_t + u * u_x = nu * u_xx,  x in [0, 1), periodic boundary conditions.
//
// A JavaScript port of the Python Burgers1DSolver used to generate the
// training data for the FNO model this demo compares against.
//
// Uses an adaptive, CFL-based time step (same approach as the 2D
// Navier-Stokes solver in the training repository): a fixed step count
// is unstable at higher resolutions, since diffusion stability requires
// dt = O(dx^2), which shrinks quadratically as the grid gets finer. A
// fixed dt that is stable at resolution 32 will blow up (NaN) at 256.

const T_END = 1.0
const NU = 0.01 // fixed to match the value the FNO model was trained on
const CFL = 0.4 // safety factor, matches the fno project's 2D NS solver

function rollArray(arr, shift) {
  const n = arr.length
  const out = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    out[i] = arr[((i - shift) % n + n) % n]
  }
  return out
}

function rhs(u, dx) {
  const n = u.length
  const uPlus = rollArray(u, -1)
  const uMinus = rollArray(u, 1)

  const out = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const ux = (uPlus[i] - uMinus[i]) / (2 * dx)
    const uxx = (uPlus[i] - 2 * u[i] + uMinus[i]) / (dx * dx)
    out[i] = -u[i] * ux + NU * uxx
  }
  return out
}

function rk4Step(u, dx, dt) {
  const n = u.length
  const add = (a, b, scale) => {
    const out = new Float64Array(n)
    for (let i = 0; i < n; i++) out[i] = a[i] + scale * b[i]
    return out
  }

  const k1 = rhs(u, dx)
  const k2 = rhs(add(u, k1, dt / 2), dx)
  const k3 = rhs(add(u, k2, dt / 2), dx)
  const k4 = rhs(add(u, k3, dt), dx)

  const out = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    out[i] = u[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
  }
  return out
}

/** Compute a stable time step from the diffusion and advection CFL limits. */
function computeStableDt(u, dx, dtMax) {
  let uMax = 0
  for (let i = 0; i < u.length; i++) {
    const abs = Math.abs(u[i])
    if (abs > uMax) uMax = abs
  }
  const dtAdvection = (CFL * dx) / Math.max(uMax, 1e-8)
  const dtDiffusion = (CFL * dx * dx) / NU
  return Math.min(dtAdvection, dtDiffusion, dtMax)
}

/**
 * Solve the Burgers equation from t=0 to t=1 using adaptive-step RK4.
 *
 * @param {Float64Array|number[]} u0 - Initial condition, length nGrid.
 * @returns {{ solution: Float64Array, elapsedMs: number, steps: number }}
 */
export function solveBurgers(u0) {
  const start = performance.now()

  const nGrid = u0.length
  const dx = 1.0 / nGrid

  let u = Float64Array.from(u0)
  let t = 0
  let steps = 0
  const maxSteps = 100000 // safety bound against pathological inputs — must exceed the step count needed at the highest supported resolution (roughly scales with resolution^2)

  while (t < T_END && steps < maxSteps) {
    const dt = computeStableDt(u, dx, T_END - t)
    u = rk4Step(u, dx, dt)
    t += dt
    steps += 1
  }

  const elapsedMs = performance.now() - start

  for (let i = 0; i < u.length; i++) {
    if (!Number.isFinite(u[i])) {
      throw new Error(
        `Classical solver became unstable (NaN) after ${steps} steps. ` +
        'Try a smaller-amplitude initial condition.'
      )
    }
  }

  return { solution: u, elapsedMs, steps }
}

function randomNormal() {
  const u1 = Math.random()
  const u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

/**
 * Generate a random initial condition as a readable formula string, rather
 * than raw numbers — so the UI can display exactly what's being simulated,
 * and the user can tweak it afterward using the same expression evaluator.
 *
 * Produces a sum of sine terms with amplitude decaying as 1/k, matching the
 * Gaussian random field used to generate the FNO's training data
 * (_sample_gaussian_random_field in the training repository).
 *
 * @returns {string} e.g. "0.83*sin(2*pi*1*x + 1.23) - 0.41*sin(2*pi*2*x + 4.56)"
 */
export function generateRandomExpression() {
  const nModes = 8
  const terms = []

  for (let k = 1; k <= nModes; k++) {
    const amplitude = randomNormal() / k
    const phase = Math.random() * 2 * Math.PI
    const roundedAmp = Math.round(Math.abs(amplitude) * 100) / 100
    const roundedPhase = Math.round(phase * 100) / 100
    if (roundedAmp < 0.01) continue // skip negligible terms for readability

    const sign = amplitude < 0 ? '-' : terms.length === 0 ? '' : '+'
    terms.push(`${sign} ${roundedAmp}*sin(2*pi*${k}*x + ${roundedPhase})`)
  }

  return terms.join(' ').replace(/^\+ /, '')
}

export const BURGERS_VISCOSITY = NU
