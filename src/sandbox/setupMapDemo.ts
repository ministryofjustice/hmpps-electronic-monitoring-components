import { EmMap } from '../components/map/scripts/em-map'
import { CirclesLayer, LocationsLayer, NumberingLayer, TracksLayer } from '../components/map/scripts/core/layers'
import { isEmpty } from 'ol/extent'
import config from '../components/map/scripts/core/config'
import '../components/map/styles/em-map.scss'
import { easeIn } from 'ol/easing'

import emptyPositions from '../components/map/fixtures/empty-positions.json'
import defaultPositions from '../components/map/fixtures/positions.json'

interface MapDemoOptions {
  container?: HTMLElement
  positions?: any[]
  renderer?: 'openlayers' | 'maplibre'
  enable3D?: boolean
  controls?: {
    zoomSlider?: boolean
    rotate?: 'true' | 'auto-hide' | 'false'
    scale?: 'bar' | 'line' | 'false'
    locationDisplay?: 'dms' | 'latlon' | 'false'
    grabCursor?: boolean
  }
  showPositions?: boolean
  showTracks?: boolean
  showNumbers?: boolean
  showCircles?: boolean
}

// Creates and mounts a configured <em-map> element for Demos.
export function setupMapDemo({
  container = document.body,
  positions,
  renderer = 'openlayers',
  enable3D = true,
  controls = {
    grabCursor: true,
    scale: 'bar',
    locationDisplay: 'latlon',
    rotate: 'true',
    zoomSlider: true,
  },
  showPositions = true,
  showTracks = false,
  showNumbers = false,
  showCircles = false,
}: MapDemoOptions = {}): HTMLElement {
  const map = document.createElement('em-map')
  const apiKey = (import.meta as any).env?.VITE_OS_MAPS_API_KEY ?? ''
  const vectorTestUrl = `${config.tiles.urls.vectorStyleUrl}${config.tiles.urls.vectorStyleUrl.includes('?') ? '&' : '?'}key=${apiKey}`

  // Core setup
  map.setAttribute('api-key', apiKey)
  map.setAttribute('csp-nonce', '1234abcd')
  map.setAttribute('uses-internal-overlays', '')
  map.setAttribute('vector-test-url', vectorTestUrl)

  if (renderer === 'maplibre') map.setAttribute('renderer', 'maplibre')
  if (enable3D) map.setAttribute('enable-3d-buildings', '')

  // Controls
  if (controls.scale) map.setAttribute('scale-control', controls.scale)
  if (controls.locationDisplay) map.setAttribute('location-display', controls.locationDisplay)
  if (controls.rotate) map.setAttribute('rotate-control', controls.rotate)
  if (controls.zoomSlider) map.setAttribute('zoom-slider', String(controls.zoomSlider))
  if (controls.grabCursor) map.setAttribute('grab-cursor', String(controls.grabCursor))

  // Positions data
  const positionData = positions ?? defaultPositions
  const positionsScript = document.createElement('script')
  positionsScript.type = 'application/json'
  positionsScript.slot = 'position-data'
  positionsScript.textContent = JSON.stringify(positionData)
  map.appendChild(positionsScript)

  // Alert only when positions array is empty
  if (!positions || positions.length === 0) {
    const alertsContainer = document.createElement('div')
    alertsContainer.slot = 'alerts'
    alertsContainer.className = 'em-map__alerts'
    alertsContainer.innerHTML = `
      <div class="moj-alert" role="alert">
        <div class="moj-alert__content">
          Example alert: map data may be incomplete.
        </div>
      </div>
    `
    map.appendChild(alertsContainer)
  }

  // Append to DOM
  container.appendChild(map)

  // Fit view once ready
  map.addEventListener('map:ready', () => {
    const emMap = map as EmMap
    const olMap = emMap.olMapInstance
    const positions = emMap.positions

    if (!olMap || !positions?.length) return

    const locationsLayer = emMap.addLayer(
      new LocationsLayer({
        title: 'pointsLayer',
        positions,
        visible: showPositions,
      }),
    )

    emMap.addLayer(
      new TracksLayer({
        title: 'tracksLayer',
        positions,
        visible: showTracks,
      }),
    )

    emMap.addLayer(
      new NumberingLayer({
        positions,
        numberProperty: 'sequenceNumber',
        title: 'numberingLayer',
        visible: showNumbers,
      }),
    )

    emMap.addLayer(
      new CirclesLayer({
        positions,
        id: 'confidence',
        title: 'confidenceLayer',
        visible: showCircles,
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

  return map
}
