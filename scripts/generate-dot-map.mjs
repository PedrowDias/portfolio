// One-time build script — NOT run in the browser.
//
// Precomputes a grid of dots representing world landmasses, in the style
// of a dot-matrix map graphic. For each candidate point on a regular pixel
// grid, tests whether it falls within a country's boundary (and which one),
// discarding ocean points entirely. The result is a static JSON file the
// WorldMap component renders as plain SVG circles at runtime — no live
// geographic computation needed in the browser, which is both faster and
// simpler than testing points against country polygons on every render.
//
// Run with: node scripts/generate-dot-map.mjs
// Re-run any time you want to change dot spacing or canvas size.

import { geoEquirectangular, geoContains, geoCentroid, geoDistance } from 'd3-geo'
import { feature } from 'topojson-client'
import fs from 'node:fs'
import path from 'node:path'

const WIDTH = 900
const HEIGHT = 450
const SPACING = 6 // pixels between candidate grid points
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'worldDots.json')

async function main() {
  console.log('Fetching world atlas topology...')
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
  const topology = await res.json()
  const { features } = feature(topology, topology.objects.countries)

  // Precompute a bounding box AND centroid per country. The centroid is
  // used as a sanity check below: even a point that technically passes the
  // point-in-polygon test can be a false positive from simplified/complex
  // geometry (e.g. Arctic archipelagos near the poles), so we also reject
  // matches implausibly far from the country's actual center.
  const featuresWithBounds = features.map((f) => ({
    feature: f,
    bounds: boundsOf(f),
    centroid: geoCentroid(f),
  }))

  const projection = geoEquirectangular().fitSize([WIDTH, HEIGHT], { type: 'Sphere' })

  const dots = []
  let tested = 0

  for (let px = 0; px <= WIDTH; px += SPACING) {
    for (let py = 0; py <= HEIGHT; py += SPACING) {
      const lonlat = projection.invert([px, py])
      if (!lonlat) continue
      const [lon, lat] = lonlat
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue
      if (lat > 90 || lat < -90) continue
      if (lon > 180 || lon < -180) continue

      tested += 1
      for (const { feature: feat, bounds, centroid } of featuresWithBounds) {
        if (lon < bounds[0] || lon > bounds[2] || lat < bounds[1] || lat > bounds[3]) {
          continue
        }
        if (!geoContains(feat, [lon, lat])) continue

        // Sanity check: reject matches that are implausibly far (great-
        // circle distance) from the country's own centroid. Guards against
        // rare false positives from complex or heavily simplified polygon
        // geometry — exactly what produced the stray "Canada" points near
        // the opposite side of the map.
        const distDeg = (geoDistance([lon, lat], centroid) * 180) / Math.PI
        if (distDeg > 45) continue

        dots.push({ x: Math.round(px), y: Math.round(py), country: feat.properties.name })
        break
      }
    }
  }

  console.log(`Tested ${tested} candidate points, kept ${dots.length} land dots.`)

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ width: WIDTH, height: HEIGHT, dots }))
  console.log(`Saved to ${OUTPUT_PATH}`)
}

function boundsOf(feature) {
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity
  const walk = (coords, depth) => {
    if (depth === 0) {
      const [lon, lat] = coords
      if (lon < minLon) minLon = lon
      if (lon > maxLon) maxLon = lon
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    } else {
      coords.forEach((c) => walk(c, depth - 1))
    }
  }
  const depth = feature.geometry.type === 'Polygon' ? 2 : 3
  walk(feature.geometry.coordinates, depth)
  return [minLon, minLat, maxLon, maxLat]
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
