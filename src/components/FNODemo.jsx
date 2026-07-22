import { useState, useCallback, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { solveBurgers, generateRandomExpression, BURGERS_VISCOSITY } from '../lib/burgersSolver.js'
import { runFNO, preloadModel } from '../lib/fnoInference.js'
import { evaluateInitialCondition } from '../lib/expressionEval.js'
import Equation from './Equation.jsx'
import styles from './FNODemo.module.css'

const RESOLUTION = 256
const DEFAULT_EXPRESSION = 'sin(2*pi*x) + 0.5*cos(4*pi*x)'

function buildChartData(x, u0, classical, fno) {
  return x.map((xi, i) => ({
    x: xi.toFixed(2),
    'Initial condition': u0[i],
    'Classical solver': classical[i],
    'FNO prediction': fno ? fno[i] : null,
  }))
}

function FNODemo() {
  const [expression, setExpression] = useState(DEFAULT_EXPRESSION)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    preloadModel(RESOLUTION)
  }, [])

  const runWith = useCallback(
    async (u0) => {
      setRunning(true)
      setError(null)
      try {
        const x = Array.from({ length: RESOLUTION }, (_, i) => i / RESOLUTION)
        const { solution: classical, elapsedMs: classicalMs, steps } = solveBurgers(u0)
        const { prediction: fno, elapsedMs: fnoMs } = await runFNO(u0, RESOLUTION)

        setResult({
          chartData: buildChartData(x, u0, classical, fno),
          classicalMs,
          fnoMs,
          classicalSteps: steps,
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('FNO demo error:', err)
        setError(`${err.name || 'Error'}: ${err.message || String(err)}`)
      } finally {
        setRunning(false)
      }
    },
    []
  )

  const handleRunExpression = useCallback(() => {
    try {
      const u0 = evaluateInitialCondition(expression, RESOLUTION)
      runWith(u0)
    } catch (err) {
      setError(err.message)
    }
  }, [expression, runWith])

  const handleRandom = useCallback(() => {
    const randomExpression = generateRandomExpression()
    setExpression(randomExpression)
    try {
      const u0 = evaluateInitialCondition(randomExpression, RESOLUTION)
      runWith(u0)
    } catch (err) {
      setError(err.message)
    }
  }, [runWith])

  const speedup = result ? (result.classicalMs / result.fnoMs).toFixed(1) : null

  return (
    <div className={styles.demo}>
      <p className={styles.equationLabel}>Solving the viscous Burgers equation</p>
      <Equation
        className={styles.equation}
        tex={String.raw`\frac{\partial u}{\partial t} + u \frac{\partial u}{\partial x} = \nu \frac{\partial^2 u}{\partial x^2}, \qquad x \in [0, 1),\ t \in (0, 1]`}
      />
      <p className={styles.note}>
        Grid resolution fixed at {RESOLUTION} points, viscosity fixed at ν = {BURGERS_VISCOSITY}
        (values the model was trained on). Type an initial condition u(x, 0) below, or generate a random one.
      </p>

      <div className={styles.controls}>
        <label className={styles.exprLabel}>
          <span>u(x, 0) =</span>
          <input
            type="text"
            className={styles.exprInput}
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g. sin(2*pi*x) + 0.5*cos(4*pi*x)"
            disabled={running}
          />
        </label>

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.runButton}
            onClick={handleRunExpression}
            disabled={running || !expression.trim()}
          >
            {running ? 'Running…' : 'Run'}
          </button>
          <button
            type="button"
            className={styles.randomButton}
            onClick={handleRandom}
            disabled={running}
          >
            Random
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      {result && (
        <>
          <div className={styles.timings}>
            <div className={styles.timingCard}>
              <p className={styles.timingLabel}>Classical solver</p>
              <p className={styles.timingValue}>{result.classicalMs.toFixed(2)} ms</p>
              <p className={styles.timingSub}>{result.classicalSteps} adaptive steps</p>
            </div>
            <div className={styles.timingCard}>
              <p className={styles.timingLabel}>FNO (in-browser)</p>
              <p className={styles.timingValue}>{result.fnoMs.toFixed(2)} ms</p>
            </div>
            <div className={styles.timingCardHighlight}>
              <p className={styles.timingLabel}>Speedup</p>
              <p className={styles.timingValue}>{speedup}×</p>
            </div>
          </div>

          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={result.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Initial condition" stroke="#94a3b8" dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="Classical solver" stroke="#f8fafc" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="FNO prediction" stroke="#fb7185" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

export default FNODemo
