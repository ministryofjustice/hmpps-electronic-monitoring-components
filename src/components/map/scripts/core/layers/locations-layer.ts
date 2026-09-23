import type BaseLayer from 'ol/layer/Base'
import { fromLonLat } from 'ol/proj'
import { boundingExtent } from 'ol/extent'
import type { Extent } from 'ol/extent'
import VectorLayer from 'ol/layer/Vector'
import Overlay from 'ol/Overlay'
import type Map from 'ol/Map'
import { Interaction } from 'ol/interaction'
import { supportsWebGL } from '../../helpers/browser'
import { OLLocationsLayer } from './ol/locations-layer'
import { OLWebGLCircleLayer } from './ol/locations-layer-webgl'

import type { ComposableLayer, LayerStateOptions } from './base'
import type { MapAdapter } from '../map-adapter'
import { Position } from '../types/position'

export type MarkerType = 'point' | 'pin' | 'image'

export type PositionWithDisplayNumber = Position & { displayPointNumber?: number }

export const getDisplayPointNumber = (position: Position, index: number): number =>
  (position as PositionWithDisplayNumber).displayPointNumber ?? index + 1

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

type OverlayInteraction = Interaction & {
  overlay?: {
    showAtCoordinate?: (coords: number[], properties?: Record<string, unknown>) => void
  }
}

export type LocationsLayerOptions = {
  id?: string
  title?: string
  visible?: boolean
  zIndex?: number

  // Layer Renderer selection
  renderer?: 'auto' | 'vector' | 'webgl'

  accessibleMarkers?: boolean

  markerLabel?: (position: Position, index: number, total: number) => string

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

  private markerOverlays: Overlay[] = []

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

  public getPrimaryLayer(): BaseLayer {
    const layers = this.getLayers()

    const vectorLayer = layers.find(layer => layer instanceof VectorLayer)
    if (vectorLayer) return vectorLayer

    return layers[0]
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

  private createMarkerOverlays(map: Map, visible: boolean): void {
    const positions = this.options.positions ?? []
    if (positions.length === 0) return

    const target = map.getTargetElement() as HTMLElement | null
    const buildLabel =
      this.options.markerLabel ??
      ((position: Position, index: number, total: number) => {
        return `Location point ${getDisplayPointNumber(position, index)} of ${total}`
      })

    positions.forEach((position, index) => {
      const displayPointNumber = getDisplayPointNumber(position, index)
      const button = document.createElement('button')
      button.className = 'map-marker-interaction'
      button.type = 'button'
      button.setAttribute('aria-label', buildLabel(position, index, positions.length))
      button.dataset.markerIndex = String(index)
      button.dataset.layerId = this.id

      const coordinate = fromLonLat([position.longitude, position.latitude])

      const overlay = new Overlay({
        element: button,
        position: coordinate,
        positioning: 'center-center',
        stopEvent: true,
      })

      button.addEventListener('click', () => {
        const clickInteraction = map
          .getInteractions()
          .getArray()
          .find((interaction: OverlayInteraction) => interaction.overlay?.showAtCoordinate)

        if (clickInteraction) {
          ;(clickInteraction as OverlayInteraction).overlay!.showAtCoordinate!(coordinate, {
            ...position,
            displayPointNumber,
          })
        }

        target?.dispatchEvent(
          new CustomEvent('em-map:marker:select', {
            bubbles: true,
            composed: true,
            detail: { position, index, layerId: this.id, coordinate },
          }),
        )
      })

      if (!visible) {
        button.style.display = 'none'
      }

      map.addOverlay(overlay)
      this.markerOverlays.push(overlay)
    })
  }

  private removeMarkerOverlays(map: Map): void {
    this.markerOverlays.forEach(overlay => map.removeOverlay(overlay))
    this.markerOverlays = []
  }

  public setMarkerOverlaysVisible(visible: boolean): void {
    this.markerOverlays.forEach(overlay => {
      const element = overlay.getElement() as HTMLElement | undefined
      if (element) {
        element.style.display = visible ? '' : 'none'
      }
    })
  }

  // Create OL layers with the provided options.
  // Layers are created lazily (only when getPrimaryLayer or getNativeLayer is called)
  private createLayers(): BaseLayer[] {
    const layers: BaseLayer[] = []

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

    const visible = this.options.visible ?? true
    const baseZIndex = this.options.zIndex ?? 0

    // WebGL circles layer
    if (useWebGL && circlePositions.length > 0) {
      layers.push(
        new OLWebGLCircleLayer({
          positions: circlePositions,
          style: this.toWebGLStyle(this.options.style),
          markerOptions: this.toWebGLMarker(this.options.marker),
          title: this.options.title ?? this.id,
          visible,
          zIndex: baseZIndex,
        }),
      )
    }

    // Vector circles fallback (if WebGL not supported or renderer explicitly set to 'vector')
    if (!useWebGL && circlePositions.length > 0) {
      layers.push(
        new OLLocationsLayer({
          positions: circlePositions,
          style: this.options.style,
          marker: this.options.marker,
          title: this.options.title ?? this.id,
          visible,
          zIndex: baseZIndex,
        }),
      )
    }

    // Vector images/pins
    if (imagePositions.length > 0) {
      layers.push(
        new OLLocationsLayer({
          positions: imagePositions,
          style: this.options.style,
          marker: this.options.marker,
          title: this.options.title ?? this.id,
          visible,
          zIndex: baseZIndex + 1,
        }),
      )
    }

    return layers
  }

  public getLayers(): BaseLayer[] {
    if (this.olLayers.length === 0) {
      this.olLayers = this.createLayers()
    }
    return this.olLayers
  }

  public getNativeLayer(): BaseLayer[] {
    return this.getLayers()
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

  public attach(adapter: MapAdapter, layerStateOptions?: LayerStateOptions): void {
    if (adapter.mapLibrary !== 'openlayers') {
      console.warn(`[LocationLayer] MapLibre not implemented ("${this.id}")`)
      return
    }

    const { map } = adapter.openlayers!

    const layers = this.getLayers()
    const visible = layerStateOptions?.visible ?? this.options.visible ?? true

    layers.forEach(layer => {
      layer.setVisible(visible)

      if (layerStateOptions?.zIndex !== undefined) {
        const existingZIndex = layer.getZIndex() ?? 0
        const baseZIndex = this.options.zIndex ?? 0
        const relativeOffset = existingZIndex - baseZIndex
        layer.setZIndex(layerStateOptions.zIndex + relativeOffset)
      }

      map.addLayer(layer)
    })
    if (this.options.accessibleMarkers !== false) {
      this.removeMarkerOverlays(map)
      this.createMarkerOverlays(map, visible)
    }
    this.setMarkerOverlaysVisible(visible)
  }

  public detach(adapter: MapAdapter): void {
    if (adapter.mapLibrary === 'openlayers') {
      this.removeMarkerOverlays(adapter.openlayers!.map)
      this.getLayers().forEach(layer => {
        adapter.openlayers!.map.removeLayer(layer)
      })
      return
    }

    console.warn(`[LocationLayer] MapLibre detach not implemented ("${this.id}")`)
  }
}
