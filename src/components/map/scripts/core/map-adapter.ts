import type Map from 'ol/Map'
import { fromLonLat, toLonLat } from 'ol/proj'
import type { Coordinate } from 'ol/coordinate'

export type MapLibrary = 'openlayers' | 'maplibre'

export type AttributionOptions = {
  allowHtml?: boolean
}

/*
  MapAdapter exposes a bridge between mapping libraries so
  layers/interactions can work without knowing which map library is used.
  Currently supports OpenLayers but stubs out an implementation for MapLibre.
  Other libraries could be added in future if needed.
*/
export interface MapAdapter {
  mapLibrary: MapLibrary
  hostElement: HTMLElement

  // Convert [lon,lat] (EPSG:4326) to the library's internal map coords.
  project: (lonLat: [number, number]) => [number, number]

  // Convert internal map coords back to [lon,lat] (EPSG:4326).
  unproject: (xy: Coordinate) => [number, number]

  // Exactly one of these will be defined based on mapLibrary:
  openlayers?: { map: Map }
  mapLibre?: { map: import('maplibre-gl').Map }

  // Set custom runtime attribution text/HTML for the map container.
  setAttribution: (attribution: string, options?: AttributionOptions) => void
}

function sanitizeAttributionHtml(input: string): string {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = input

  const allElements = Array.from(wrapper.querySelectorAll('*'))

  for (const element of allElements) {
    if (element.tagName === 'A') {
      const anchor = element as HTMLAnchorElement
      const rawHref = anchor.getAttribute('href')?.trim() ?? ''
      let safeHref: string | null = null

      if (rawHref.length > 0) {
        try {
          const parsed = new URL(rawHref, window.location.origin)
          const protocol = parsed.protocol.toLowerCase()
          if (protocol === 'http:' || protocol === 'https:' || protocol === 'mailto:') {
            safeHref = parsed.href
          }
        } catch {
          safeHref = null
        }
      }

      const text = anchor.textContent ?? ''
      const replacement = document.createElement('a')
      replacement.textContent = text

      if (safeHref) {
        replacement.setAttribute('href', safeHref)
        replacement.setAttribute('target', '_blank')
        replacement.setAttribute('rel', 'noopener noreferrer')
      }

      anchor.replaceWith(replacement)
    } else {
      const textNode = document.createTextNode(element.textContent ?? '')
      element.replaceWith(textNode)
    }
  }

  return wrapper.innerHTML
}

function getAttributionContainer(root: HTMLElement): HTMLElement {
  const existing = root.querySelector('.em-map__attribution')
  if (existing instanceof HTMLElement) return existing

  const el = document.createElement('div')
  el.className = 'em-map__attribution'
  el.hidden = true
  root.appendChild(el)
  return el
}

function setContainerAttribution(
  targetContainer: HTMLElement,
  attribution: string,
  options?: AttributionOptions,
): void {
  const container = targetContainer
  const value = attribution.trim()
  if (!value) {
    container.textContent = ''
    container.hidden = true
    return
  }

  if (options?.allowHtml) {
    container.innerHTML = sanitizeAttributionHtml(value)
  } else {
    container.textContent = value
  }

  container.hidden = false
}

// Adapter for an OpenLayers-backed map instance.
export function createOpenLayersAdapter(hostElement: HTMLElement, map: Map): MapAdapter {
  return {
    mapLibrary: 'openlayers',
    hostElement,
    project: lonLat => fromLonLat(lonLat) as [number, number],
    unproject: xy => toLonLat(xy) as [number, number],
    openlayers: { map },
    setAttribution: (attribution, options) => {
      const targetElement = map.getTargetElement()
      if (!targetElement) return

      const container = getAttributionContainer(targetElement)
      setContainerAttribution(container, attribution, options)
    },
  }
}

// Adapter for an MapLibre-backed map instance.
export function createMapLibreAdapter(hostElement: HTMLElement, map: import('maplibre-gl').Map): MapAdapter {
  return {
    mapLibrary: 'maplibre',
    hostElement,
    project: lonLat => lonLat,
    unproject: xy => xy as [number, number],
    mapLibre: { map },
    setAttribution: (attribution, options) => {
      const targetElement = map.getContainer()
      if (!targetElement) return

      const container = getAttributionContainer(targetElement)
      setContainerAttribution(container, attribution, options)
    },
  }
}
