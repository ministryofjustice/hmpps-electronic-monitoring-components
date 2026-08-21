import * as maplibregl from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { MapLibreMapInstance } from '../maplibre-map-instance'
import config from '../config'

maplibregl.setWorkerUrl(workerUrl)

export async function setupMapLibreMap(
  target: HTMLElement,
  vectorUrl?: string,
  enable3DControls = false,
): Promise<MapLibreMapInstance> {
  const styleUrl = vectorUrl || config.tiles.urls.localVectorStyleUrl

  const map = new MapLibreMapInstance({
    target,
    styleUrl,
    enable3DControls,
    minZoom: 6,
    maxZoom: 18,
    zoom: 15,
    pitch: 0,
    bearing: 0,
    center: [-0.125, 51.501],
    attributionControl: false,
  })

  map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')

  if (enable3DControls) {
    const { add3DBuildingsControl } = await import('../controls/maplibre-3d-buildings-control')
    add3DBuildingsControl(map)
  }

  return map
}
