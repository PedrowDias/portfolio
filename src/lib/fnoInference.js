// In-browser inference for the trained Fourier Neural Operator, exported
// to ONNX (see export_onnx.py in the model's training repository). Each
// resolution (32/64/128/256) has its own model file, since the FFT
// operations were replaced at export time with resolution-specific
// precomputed matrices for guaranteed browser compatibility.

import * as ort from 'onnxruntime-web'
import { computeStats, encode, decode } from './normalizer.js'

// onnxruntime-web needs its WASM runtime files at inference time, and the
// JS bindings must exactly match the WASM binary version — a mismatch
// causes low-level errors like "e.getValue is not a function". Pinning an
// exact npm version (see package.json) and matching CDN URL keeps these in
// sync. Threading is disabled because it requires cross-origin-isolation
// headers (COOP/COEP) that GitHub Pages does not send by default.
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/'
ort.env.wasm.numThreads = 1

const sessionCache = new Map()

async function getSession(resolution) {
  if (sessionCache.has(resolution)) {
    return sessionCache.get(resolution)
  }
  const modelUrl = `${import.meta.env.BASE_URL}models/fno_${resolution}.onnx`
  const session = await ort.InferenceSession.create(modelUrl, {
    executionProviders: ['wasm'],
  })
  sessionCache.set(resolution, session)
  return session
}

/**
 * Run the FNO model on an initial condition and return the prediction,
 * decoded back to an approximate physical scale (see normalizer.js for
 * why this is an approximation) along with the measured inference time.
 *
 * @param {Float64Array} u0 - Initial condition, length must match resolution.
 * @param {number} resolution - One of 32, 64, 128, 256.
 * @returns {Promise<{ prediction: Float64Array, elapsedMs: number }>}
 */
export async function runFNO(u0, resolution) {
  const session = await getSession(resolution)

  const stats = computeStats(u0)
  const normalized = encode(u0, stats)

  // Don't assume the exported model's input/output names match what we
  // requested at export time — PyTorch's newer "dynamo" ONNX exporter does
  // not always honour input_names/output_names, so ask the loaded session
  // for its actual names instead of hardcoding them.
  const inputName = session.inputNames[0]
  const outputName = session.outputNames[0]

  const inputTensor = new ort.Tensor(
    'float32',
    Float32Array.from(normalized),
    [1, resolution]
  )

  const start = performance.now()
  const results = await session.run({ [inputName]: inputTensor })
  const elapsedMs = performance.now() - start

  const output = results[outputName].data
  const prediction = decode(output, stats)

  return { prediction, elapsedMs }
}

/** Preload a resolution's model so the first "Run" click isn't slowed by download. */
export function preloadModel(resolution) {
  getSession(resolution).catch(() => {
    // Silent — preloading is an optimisation, not a requirement. If it
    // fails, the first real run() call will surface the error properly.
  })
}
