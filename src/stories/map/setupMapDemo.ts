import { isEmpty } from 'ol/extent'
import { EmMap } from '../../components/map/scripts/em-map'
import { CirclesLayer, LocationsLayer, TextLayer, TracksLayer } from '../../components/map/scripts/core/layers'
import config from '../../components/map/scripts/core/config'
import '../../components/map/styles/em-map.scss'

import defaultPositions from '../../components/map/fixtures/positions.json'

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
  showText?: boolean
  showCircles?: boolean
  usesInternalOverlays?: boolean
}

/** Inject Demo templates (used by overlayTitleTemplateId / overlayBodyTemplateId) */
function ensureOverlayTemplatesOnce() {
  const TITLE_ID = 'overlay-title-test-location'
  const BODY_ID = 'overlay-body-test-location'
  if (document.getElementById(TITLE_ID) && document.getElementById(BODY_ID)) return

  const titleTmpl = document.createElement('template')
  titleTmpl.id = TITLE_ID
  titleTmpl.innerHTML = `
    <div><strong>Name (NOMIS ID): {{personName}} ({{personNomisId}})</strong></div>
  `.trim()

  const bodyTmpl = document.createElement('template')
  bodyTmpl.id = BODY_ID
  bodyTmpl.innerHTML = `
    <div class="app-map__overlay-row"><span class="app-map__overlay-label">Speed </span><span class="app-map__overlay-value">{{displaySpeed}}</span></div>
    <div class="app-map__overlay-row"><span class="app-map__overlay-label">Direction </span><span class="app-map__overlay-value">{{displayDirection}}</span></div>
    <div class="app-map__overlay-row"><span class="app-map__overlay-label">Geolocation Mechanism </span><span class="app-map__overlay-value">{{displayGeolocationMechanism}}</span></div>
    <div class="app-map__overlay-row"><span class="app-map__overlay-label">Recorded </span><span class="app-map__overlay-value">{{displayTimestamp}}</span></div>
    <div class="app-map__overlay-row"><span class="app-map__overlay-label">Confidence </span><span class="app-map__overlay-value">{{displayConfidence}}</span></div>
    <div class="app-map__overlay-row"><span class="app-map__overlay-label">Latitude </span><span class="app-map__overlay-value">{{displayLatitude}}</span></div>
    <div class="app-map__overlay-row"><span class="app-map__overlay-label">Longitude </span><span class="app-map__overlay-value">{{displayLongitude}}</span></div>
  `.trim()

  document.body.appendChild(titleTmpl)
  document.body.appendChild(bodyTmpl)
}

// Creates and mounts a configured <em-map> element for Demos / Stories.
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
  showText = false,
  showCircles = false,
  usesInternalOverlays = true,
}: MapDemoOptions = {}): HTMLElement {
  const map = document.createElement('em-map')
  const apiKey = import.meta.env.STORYBOOK_OS_MAPS_API_KEY_PUBLIC_DOCS || ''
  const vectorTestUrl = `${config.tiles.urls.vectorStyleUrl}${config.tiles.urls.vectorStyleUrl.includes('?') ? '&' : '?'}key=${apiKey}`

  // Core setup
  map.setAttribute('api-key', apiKey)
  map.setAttribute('csp-nonce', '1234abcd')
  map.setAttribute('vector-test-url', vectorTestUrl)

  // Toggle overlays on/off
  if (usesInternalOverlays) {
    map.setAttribute('uses-internal-overlays', '')
    ensureOverlayTemplatesOnce()
  }

  if (renderer === 'maplibre') map.setAttribute('renderer', 'maplibre')
  if (enable3D) map.setAttribute('enable-3d-buildings', '')

  // Controls
  if (controls.scale) map.setAttribute('scale-control', controls.scale)
  if (controls.locationDisplay) map.setAttribute('location-display', controls.locationDisplay)
  if (controls.rotate) map.setAttribute('rotate-control', controls.rotate)
  if (typeof controls.zoomSlider === 'boolean') map.setAttribute('zoom-slider', String(controls.zoomSlider))
  if (typeof controls.grabCursor === 'boolean') map.setAttribute('grab-cursor', String(controls.grabCursor))

  // Positions data
  const positionData = positions ?? defaultPositions
  const positionsScript = document.createElement('script')
  positionsScript.type = 'application/json'
  positionsScript.slot = 'position-data'
  positionsScript.textContent = JSON.stringify(positionData)
  map.appendChild(positionsScript)

  // Append + layer setup
  container.appendChild(map)

  map.addEventListener('map:ready', () => {
    const emMap = map as EmMap
    const olMap = emMap.olMapInstance
    const pos = emMap.positions
    if (!olMap || !pos?.length) return

    const locationsLayer = emMap.addLayer(
      new LocationsLayer({ title: 'pointsLayer', positions: pos, visible: showPositions }),
    )

    emMap.addLayer(new TracksLayer({ title: 'tracksLayer', positions: pos, visible: showTracks }))
    emMap.addLayer(
      new TextLayer({
        positions: pos,
        textProperty: 'sequenceNumber',
        title: 'textLayer',
        visible: showText,
      }),
    )
    emMap.addLayer(
      new CirclesLayer({ positions: pos, id: 'confidence', title: 'confidenceLayer', visible: showCircles }),
    )

    const locationSource = locationsLayer?.getSource()
    if (locationSource) {
      const extent = locationSource.getExtent()
      if (isEmpty(extent) === false) {
        olMap.getView().fit(extent, { maxZoom: 16, padding: [30, 30, 30, 30], size: olMap.getSize() })
      }
    }
  })

  return map
}
