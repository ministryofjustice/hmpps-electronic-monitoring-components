import '@map/scripts/em-map'
import { EmMap } from '@map/scripts/em-map'
import { CirclesLayer, LocationsLayer, TextLayer, TracksLayer } from '../components/map/scripts/core/layers'
import { isEmpty } from 'ol/extent'
import config from '../components/map/scripts/core/config'
import '@map/styles/em-map.scss'

// Import some sample GeoJSON data for testing
import emptyPositions from '../components/map/fixtures/empty-positions.json'
import positions from '../components/map/fixtures/positions.json'

let positionData

const map = document.createElement('em-map')

const apiKey = import.meta.env.VITE_OS_MAPS_API_KEY ?? ''
const vectorTestUrl = `${config.tiles.urls.vectorStyleUrl}${config.tiles.urls.vectorStyleUrl.includes('?') ? '&' : '?'}key=${apiKey}`

// Sandbox requires explicit vector URL (safe, as only runs in localhost using env vars)
map.setAttribute('vector-test-url', vectorTestUrl)

// Use MapLibre (not OpenLayers)
// map.setAttribute('renderer', 'maplibre')

// Add this so the 3D Buildings button shows up
map.setAttribute('enable-3d-buildings', '')

// Core setup
map.setAttribute('api-key', apiKey)
map.setAttribute('csp-nonce', '1234abcd')
map.setAttribute('uses-internal-overlays', '')

// Control options
map.setAttribute('scale-control', 'bar')
// Options:
//   'bar'   → shows an OpenLayers ScaleBar (segmented ruler-style, better for visualising distances)
//   'line'  → shows an OpenLayers ScaleLine (simple line + text label)
//   'false' → explicitly disables scale control
//   omit    → no scale control shown

map.setAttribute('location-display', 'latlon')
// Options:
//   'dms'   → shows coordinates in degrees/minutes/seconds (e.g. 51°28'40"N 0°0'5"W)
//   'latlon'  → shows coordinates in Lat/Long (e.g. 51.4778°N 0.0014°W)
//   'false' → explicitly disables coordinate display
//   omit    → no coordinate display control

map.setAttribute('rotate-control', 'true')
// Options:
//   'false'     → disables rotate control
//   'auto-hide' → hides rotate control until the map is rotated
//   default     → always shows rotate control

map.setAttribute('zoom-slider', 'true')
// Enables zoom slider control

map.setAttribute('grab-cursor', 'true')
// Enables MapLibre-style grab/grabbing cursor
// Options:
//   'true' (default) → show grab/grabbing cursor
//   'false'          → disable custom cursor, fallback to browser default

// Load some sample data

// Empty data
// positionData = emptyPositions

// Point data
positionData = positions

const positionsScript = document.createElement('script')
positionsScript.setAttribute('type', 'application/json')
positionsScript.setAttribute('slot', 'position-data')
positionsScript.textContent = JSON.stringify(positionData)
map.appendChild(positionsScript)

// Alert slot for sandbox
const alertsContainer = document.createElement('div')
alertsContainer.setAttribute('slot', 'alerts')
alertsContainer.className = 'em-map__alerts'
alertsContainer.innerHTML = `
  <div class="em-alert" role="alert">
    <div class="em-alert__content">Example alert: map data may be incomplete.</p>
  </div>
`
// map.appendChild(alertsContainer)

document.body.appendChild(map)

map.addEventListener('map:ready', () => {
  const emMap = map as EmMap
  const olMap = emMap.olMapInstance
  const positions = emMap.positions

  if (!olMap || !positions?.length) return

  const locationsLayer = emMap.addLayer(
    new LocationsLayer({
      title: 'pointsLayer',
      positions,
    }),
  )

  emMap.addLayer(
    new TracksLayer({
      title: 'tracksLayer',
      visible: true,
      positions,
    }),
  )

  emMap.addLayer(
    new TextLayer({
      positions,
      textProperty: 'sequenceNumber',
      title: 'textLayer',
      visible: true,
    }),
  )

  emMap.addLayer(
    new CirclesLayer({
      positions,
      id: 'confidence',
      title: 'confidenceLayer',
      visible: true,
    }),
  )

  const locationSource = locationsLayer?.getSource()

  if (locationSource) {
    const extent = locationSource.getExtent()
    if (isEmpty(extent) === false) {
      olMap.getView().fit(extent, {
        maxZoom: 16,
        padding: [30, 30, 30, 30],
        size: olMap.getSize(),
      })
    }
  }
})
