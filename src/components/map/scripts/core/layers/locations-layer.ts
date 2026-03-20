import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import type Feature from 'ol/Feature'
import type Geometry from 'ol/geom/Geometry'
import { OLLocationsLayer } from './ol/locations-layer'

import type { ComposableLayer, LayerStateOptions } from './base'
import type { MapAdapter } from '../map-adapter'
import { Position } from '../types/position'

type OLVecSrc = VectorSource<Feature<Geometry>>
type OLVecLayer = VectorLayer<OLVecSrc>

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

export class LocationsLayer implements ComposableLayer<OLVecLayer> {
  public readonly id: string

  private readonly options: LocationsLayerOptions

  private olLayer?: OLVecLayer

  constructor(options: LocationsLayerOptions) {
    this.options = options
    this.id = options.id ?? 'locations'
  }

  getNativeLayer(): OLVecLayer | undefined {
    return this.olLayer
  }

  attach(adapter: MapAdapter, layerStateOptions?: LayerStateOptions): void {
    if (adapter.mapLibrary !== 'openlayers') {
      console.warn(`[LocationLayer] MapLibre support is not implemented yet (layer "${this.id}")`)
      return
    }

    const { map } = adapter.openlayers!

    this.olLayer = new OLLocationsLayer({
      positions: this.options.positions ?? [],
      style: this.options.style,
      marker: this.options.marker,
      title: this.options.title ?? this.id,
      visible: layerStateOptions?.visible ?? this.options.visible,
      zIndex: layerStateOptions?.zIndex ?? this.options.zIndex,
    })

    map.addLayer(this.olLayer)
  }

  detach(adapter: MapAdapter): void {
    if (adapter.mapLibrary === 'openlayers') {
      if (this.olLayer) {
        adapter.openlayers!.map.removeLayer(this.olLayer)
        this.olLayer = undefined
      }
      return
    }

    // MapLibre stub
    console.warn(`[LocationLayer] MapLibre detach is not implemented yet (layer "${this.id}")`)
  }
}
