// Per-sample zero-mean, unit-variance normalisation — matches the
// UnitGaussianNormalizer used during FNO training (src/fno/data/transforms.py
// in the model's training repository).
//
// Note on decoding: the model was trained with the input and the true output
// normalised independently by each one's own statistics. At real inference
// time the true output's statistics are unknown (that's what we're trying to
// predict), so there is no exact way to recover the model's output in
// physical units. The best available proxy — and what any real deployment
// of this model would also have to do — is to decode using the *input's*
// statistics. This is an approximation, not a shortcut specific to this demo.

export function computeStats(arr) {
  const n = arr.length
  const mean = arr.reduce((a, b) => a + b, 0) / n
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n
  const std = Math.sqrt(variance) + 1e-8
  return { mean, std }
}

export function encode(arr, stats) {
  return Float64Array.from(arr, (v) => (v - stats.mean) / stats.std)
}

export function decode(arr, stats) {
  return Float64Array.from(arr, (v) => v * stats.std + stats.mean)
}
