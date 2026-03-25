import type BaseLayer from 'ol/layer/Base'
import { fromLonLat } from 'ol/proj'
import { boundingExtent } from 'ol/extent'
import type { Extent } from 'ol/extent'
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
    fill?: string | CanvasPattern | CanvasGradient | null
    stroke?: {
      color?: string
      width?: number
      lineCap?: CanvasLineCap
      lineJoin?: CanvasLineJoin
      lineDash?: number[]
      lineDashOffset?: number
      miterLimit?: number
    }
  }

  marker?: MarkerOptions
  positions?: Array<Position>
}

function isWebGLCompatible(style?: LocationsLayerOptions['style']): boolean {
  if (!style) return true

  // dashed strokes not supported
  if (style.stroke?.lineDash?.length) return false

  // stroke-only shapes (confidence circles etc.)
  if (style.fill === null) return false

  // WebGL only supports string colors
  if (typeof style.fill !== 'string' && style.fill !== undefined) return false

  return true
}

export class LocationsLayer implements ComposableLayer<BaseLayer[]> {
  public readonly id: string

  private readonly options: LocationsLayerOptions

  private olLayers: BaseLayer[] = []

  constructor(options: LocationsLayerOptions) {
    this.options = options
    this.id = options.id ?? 'locations'
  }

  private toWebGLStyle(style?: LocationsLayerOptions['style']) {
    if (!style) return undefined

    return {
      radius: style.radius,
      fill: typeof style.fill === 'string' ? style.fill : undefined,
      stroke: {
        color: style.stroke?.color,
        width: style.stroke?.width,
      },
    }
  }

  private toWebGLMarker(marker?: MarkerOptions) {
    if (!marker) return undefined

    return {
      point: {
        radius: marker.point?.radius,
        fill: typeof marker.point?.fill === 'string' ? marker.point.fill : undefined,
        stroke: {
          color: marker.point?.stroke?.color,
          width: marker.point?.stroke?.width,
        },
      },
    }
  }

  getExtent(): Extent | null {
    const positions = this.options.positions ?? []
    if (!positions.length) return null

    const coords = positions.map(p => fromLonLat([p.longitude, p.latitude]))
    return boundingExtent(coords)
  }

  getPositions(): Position[] {
    return this.options.positions ?? []
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
    const webglAllowed = isWebGLCompatible(this.options.style)

    const useWebGL = webglAllowed && (renderer === 'webgl' || (renderer === 'auto' && supportsWebGL()))

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
      const webglStyle = this.toWebGLStyle(this.options.style)

      const layer = new OLWebGLCircleLayer({
        positions: circlePositions,
        style: webglStyle,
        markerOptions: this.toWebGLMarker(this.options.marker),
        title: this.options.title ?? this.id,
        visible,
        zIndex: baseZIndex,
      })

      map.addLayer(layer)
      this.olLayers.push(layer)
    }

    // Vector circles fallback (if WebGL not supported or renderer explicitly set to 'vector')
    if (!useWebGL && circlePositions.length > 0) {
      const layer = new OLLocationsLayer({
        positions: circlePositions,
        style: this.options.style,
        marker: this.options.marker,
        title: this.options.title ?? this.id,
        visible,
        zIndex: baseZIndex,
      })

      map.addLayer(layer)
      this.olLayers.push(layer)
    }

    // Vector images/pins
    if (imagePositions.length > 0) {
      const layer = new OLLocationsLayer({
        positions: imagePositions,
        style: this.options.style,
        marker: this.options.marker,
        title: this.options.title ?? this.id,
        visible,
        zIndex: baseZIndex + 1,
      })

      map.addLayer(layer)
      this.olLayers.push(layer)
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
