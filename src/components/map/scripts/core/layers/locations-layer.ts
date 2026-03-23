import type BaseLayer from 'ol/layer/Base'
import { supportsWebGL } from '../../helpers/browser'
import { OLLocationsLayer } from './ol/locations-layer'
import { OLWebGLCircleLayer } from './ol/locations-layer-webgl'

import type { ComposableLayer, LayerStateOptions } from './base'
import type { MapAdapter } from '../map-adapter'
import { Position } from '../types/position'

export type MarkerType = 'point' | 'pin' | 'image'

export type MarkerOptions = {
  type?: MarkerType
  scale?: number

  point?: {
    radius?: number
    fill?: string | CanvasPattern | CanvasGradient
    stroke?: {
      color?: string
      width?: number
    }
  }

  pin?: {
    color?: string
    strokeColor?: string
    iconSrc?: string
    iconScale?: number
    iconSvg?: string
    scale?: number
  }

  image?: {
    src?: string
    svg?: string
    name?: string
    scale?: number
    anchor?: [number, number]
  }
}

export type LocationsLayerOptions = {
  id?: string
  title?: string
  visible?: boolean
  zIndex?: number

  // Layer Renderer selection
  renderer?: 'auto' | 'vector' | 'webgl'

  style?: {
    radius?: number
    fill?: string | CanvasPattern | CanvasGradient
    stroke?: {
      color?: string
      width?: number
      lineCap?: CanvasLineCap
      lineJoin?: CanvasLineJoin
      lineDash?: number[]
      lineDashOffset?: number
      miterLimit?: number
    }
    displacement?: [number, number]
    rotation?: number
    rotateWithView?: boolean
    scale?: number | [number, number]
  }

  marker?: MarkerOptions
  positions?: Array<Position>
}

export class LocationsLayer implements ComposableLayer<BaseLayer[]> {
  public readonly id: string

  private readonly options: LocationsLayerOptions

  private olLayers: BaseLayer[] = []

  constructor(options: LocationsLayerOptions) {
    this.options = options
    this.id = options.id ?? 'locations'
  }

  getNativeLayer(): BaseLayer[] {
    return this.olLayers
  }

  attach(adapter: MapAdapter, layerStateOptions?: LayerStateOptions): void {
    if (adapter.mapLibrary !== 'openlayers') {
      console.warn(`[LocationLayer] MapLibre support is not implemented yet (layer "${this.id}")`)
      return
    }

    const { map } = adapter.openlayers!
    const renderer = this.options.renderer ?? 'auto'
    const useWebGL = renderer === 'webgl' || (renderer === 'auto' && supportsWebGL())
    const positions = this.options.positions ?? []

    // Split positions into circle vs image/pin
    const circlePositions: Position[] = []
    const imagePositions: Position[] = []

    positions.forEach(position => {
      const marker = (position as Position & { marker?: MarkerOptions }).marker ?? this.options.marker
      const type = marker?.type ?? 'point'

      if (type === 'point') {
        circlePositions.push(position)
      } else {
        imagePositions.push(position)
      }
    })

    // Clear existing layers
    this.olLayers.forEach(layer => map.removeLayer(layer))
    this.olLayers = []

    const visible = layerStateOptions?.visible ?? this.options.visible ?? true

    const baseZIndex = layerStateOptions?.zIndex ?? this.options.zIndex ?? 0

    // WebGL circles layer
    if (useWebGL && circlePositions.length > 0) {
      const circleLayer = new OLWebGLCircleLayer({
        positions: circlePositions,
        markerOptions: this.options.marker,
        title: this.options.title ?? this.id,
        visible,
        zIndex: baseZIndex,
      })

      map.addLayer(circleLayer)
      this.olLayers.push(circleLayer)
    }

    // Vector circles fallback (if WebGL not supported or renderer explicitly set to 'vector')
    if (!useWebGL && circlePositions.length > 0) {
      const circleLayer = new OLLocationsLayer({
        positions: circlePositions,
        style: this.options.style,
        marker: this.options.marker,
        title: this.options.title ?? this.id,
        visible,
        zIndex: baseZIndex,
      })

      map.addLayer(circleLayer)
      this.olLayers.push(circleLayer)
    }

    // Vector images/pins
    if (imagePositions.length > 0) {
      const imageLayer = new OLLocationsLayer({
        positions: imagePositions,
        style: this.options.style,
        marker: this.options.marker,
        title: this.options.title ?? this.id,
        visible,
        zIndex: baseZIndex + 1,
      })

      map.addLayer(imageLayer)
      this.olLayers.push(imageLayer)
    }
  }

  detach(adapter: MapAdapter): void {
    if (adapter.mapLibrary === 'openlayers') {
      this.olLayers.forEach(layer => {
        adapter.openlayers!.map.removeLayer(layer)
      })

      this.olLayers = []
      return
    }

    console.warn(`[LocationLayer] MapLibre detach is not implemented yet (layer "${this.id}")`)
  }
}
