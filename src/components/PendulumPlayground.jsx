import { useRef, useEffect, useCallback } from 'react'
import styles from './PendulumPlayground.module.css'

const G = 9.81
const L1 = 1, L2 = 1
const M1 = 1, M2 = 1
const DAMPING = 0.0015

function derivatives(state) {
  const [a1, a2, w1, w2] = state
  const delta = a1 - a2
  const den = 2 * M1 + M2 - M2 * Math.cos(2 * delta)

  const w1dot =
    (-G * (2 * M1 + M2) * Math.sin(a1) -
      M2 * G * Math.sin(a1 - 2 * a2) -
      2 * Math.sin(delta) * M2 * (w2 * w2 * L2 + w1 * w1 * L1 * Math.cos(delta))) /
    (L1 * den)

  const w2dot =
    (2 *
      Math.sin(delta) *
      (w1 * w1 * L1 * (M1 + M2) +
        G * (M1 + M2) * Math.cos(a1) +
        w2 * w2 * L2 * M2 * Math.cos(delta))) /
    (L2 * den)

  return [w1, w2, w1dot - DAMPING * w1, w2dot - DAMPING * w2]
}

function rk4Step(state, dt) {
  const add = (a, b, s) => a.map((v, i) => v + s * b[i])
  const k1 = derivatives(state)
  const k2 = derivatives(add(state, k1, dt / 2))
  const k3 = derivatives(add(state, k2, dt / 2))
  const k4 = derivatives(add(state, k3, dt))
  return state.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]))
}

// True rest: both arms hanging straight down, zero velocity. [PI/2, PI/2]
// used previously is NOT a resting state — gravity acts on it immediately.
const REST_STATE = [0, 0, 0, 0]

function PendulumPlayground() {
  const canvasRef = useRef(null)
  const stateRef = useRef([...REST_STATE])
  const trailRef = useRef([])
  const draggingRef = useRef(null)

  const originX = 200
  const originY = 40
  const scale = 100

  const getBobPositions = useCallback((state) => {
    const [a1, a2] = state
    const x1 = originX + L1 * scale * Math.sin(a1)
    const y1 = originY + L1 * scale * Math.cos(a1)
    const x2 = x1 + L2 * scale * Math.sin(a2)
    const y2 = y1 + L2 * scale * Math.cos(a2)
    return { x1, y1, x2, y2 }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrame

    const draw = () => {
      if (!draggingRef.current) {
        // Several smaller steps per frame, rather than one larger step,
        // to keep numerical error (and the resulting artificial energy
        // gain during fast swings) small — standard RK4 isn't
        // energy-conserving, and error grows quickly with step size for
        // a chaotic system like this one.
        const SUBSTEPS = 6
        for (let s = 0; s < SUBSTEPS; s++) {
          stateRef.current = rk4Step(stateRef.current, 0.02 / SUBSTEPS)
        }
      }

      const { x1, y1, x2, y2 } = getBobPositions(stateRef.current)

      trailRef.current.push({ x: x2, y: y2 })
      if (trailRef.current.length > 250) trailRef.current.shift()

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.beginPath()
      trailRef.current.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.strokeStyle = 'rgba(100, 255, 218, 0.3)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(originX, originY)
      ctx.lineTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = '#8892b0'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(originX, originY, 3, 0, 2 * Math.PI)
      ctx.fillStyle = '#ccd6f6'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x1, y1, 8, 0, 2 * Math.PI)
      ctx.fillStyle = '#64ffda'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x2, y2, 8, 0, 2 * Math.PI)
      ctx.fillStyle = '#e6f1ff'
      ctx.fill()

      animationFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationFrame)
  }, [getBobPositions])

  const handlePointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const { x1, y1, x2, y2 } = getBobPositions(stateRef.current)

    const distTo = (bx, by) => Math.hypot(mx - bx, my - by)
    if (distTo(x2, y2) < 16) draggingRef.current = 'bob2'
    else if (distTo(x1, y1) < 16) draggingRef.current = 'bob1'
  }

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    // Coordinates relative to the pivot, for the kinematics math below.
    const mx = e.clientX - rect.left - originX
    const my = e.clientY - rect.top - originY

    if (draggingRef.current === 'bob1') {
      const a1 = Math.atan2(mx, my)
      stateRef.current = [a1, stateRef.current[1], 0, 0]
      return
    }

    // Dragging the outer bob: solve two-link inverse kinematics so BOTH
    // arms move to reach the drag point, matching how a real two-segment
    // pendulum behaves when you pull its tip — not just rotating the
    // second segment while leaving the first frozen.
    const r1 = L1 * scale
    const r2 = L2 * scale
    let d = Math.hypot(mx, my)

    // Clamp the target within reachable range so dragging past full
    // extension keeps the arm extended instead of producing NaN.
    const maxReach = r1 + r2 - 0.001
    const minReach = Math.abs(r1 - r2) + 0.001
    let tx = mx, ty = my
    if (d > maxReach) {
      const s = maxReach / d
      tx *= s; ty *= s; d = maxReach
    } else if (d < minReach) {
      const s = minReach / (d || 1)
      tx *= s; ty *= s; d = minReach
    }

    // Circle-circle intersection: bob1 must be exactly r1 from the origin
    // AND exactly r2 from the target — find that point.
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    const h = Math.sqrt(Math.max(r1 * r1 - a * a, 0))
    const ux = tx / d, uy = ty / d
    const midX = ux * a, midY = uy * a
    const perpX = -uy, perpY = ux

    const candidateA = { x: midX + h * perpX, y: midY + h * perpY }
    const candidateB = { x: midX - h * perpX, y: midY - h * perpY }

    // Two valid "elbow" solutions exist — pick whichever is closer to the
    // current position, so the arm doesn't jump to the opposite bend.
    const { x1: curX1, y1: curY1 } = getBobPositions(stateRef.current)
    const relX1 = curX1 - originX, relY1 = curY1 - originY
    const distA = Math.hypot(candidateA.x - relX1, candidateA.y - relY1)
    const distB = Math.hypot(candidateB.x - relX1, candidateB.y - relY1)
    const chosen = distA <= distB ? candidateA : candidateB

    const a1 = Math.atan2(chosen.x, chosen.y)
    const a2 = Math.atan2(tx - chosen.x, ty - chosen.y)

    stateRef.current = [a1, a2, 0, 0]
  }

  const handlePointerUp = () => {
    draggingRef.current = null
  }

  const handleReset = () => {
    stateRef.current = [...REST_STATE]
    trailRef.current = []
  }

  return (
    <section className={styles.wrapper} aria-label="Interactive double pendulum simulation">
      <p className={styles.label}>A bit of chaos is never too bad (drag it!)</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={280}
        className={styles.canvas}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <div className={styles.controls}>
        <button type="button" onClick={handleReset} className={styles.button}>
          Reset
        </button>
      </div>
    </section>
  )
}

export default PendulumPlayground
