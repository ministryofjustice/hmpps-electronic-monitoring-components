import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Circle } from 'ol/geom'
import Feature from 'ol/Feature'

import type { ComposableLayer } from './base'
import type { MapAdapter } from '../map-adapter'
import { OLCirclesLayer } from './ol/circles-layer'
import type { Position, PositionWithPrecision } from '../types/position'

type OLCircleFeature = Feature<Circle>
type OLVecSource = VectorSource<OLCircleFeature>
type OLVecLayer = VectorLayer<OLVecSource>

export type CirclesLayerOptions = {
  id?: string
  title?: string
  visible?: boolean
  zIndex?: number
  style?: {
    fill?: string | null
    stroke?: {
      color?: string
      width?: number
      lineDash?: number[]
      lineCap?: CanvasLineCap
      lineJoin?: CanvasLineJoin
      lineDashOffset?: number
      miterLimit?: number
    } | null
  }
  positions?: Array<Position>
}

function hasPrecision(position: Position): position is PositionWithPrecision {
  return 'precision' in position && typeof position.precision === 'number'
}

export class CirclesLayer implements ComposableLayer<OLVecLayer> {
  public readonly id: string

  private readonly options: CirclesLayerOptions

  private olLayer?: OLVecLayer

  constructor(options: CirclesLayerOptions) {
    this.options = options
    this.id = options.id ?? 'circles'
  }

  getNativeLayer(): OLVecLayer | undefined {
    return this.olLayer
  }

  attach(adapter: MapAdapter): void {
    if (adapter.mapLibrary !== 'openlayers') {
      console.warn(`[CirclesLayer] MapLibre support is not implemented yet (layer "${this.id}")`)
      return
    }

    const { map } = adapter.openlayers!

    const allPositions = this.options.positions ?? []
    const precisePositions = allPositions.filter(hasPrecision)

    this.olLayer = new OLCirclesLayer({
      positions: precisePositions,
      style: this.options.style,
      title: this.options.title ?? this.id,
      visible: this.options.visible,
      zIndex: this.options.zIndex,
    })

    map.addLayer(this.olLayer)
  }

  detach(adapter: MapAdapter): void {
    if (adapter.mapLibrary !== 'openlayers') return
    if (this.olLayer) {
      adapter.openlayers!.map.removeLayer(this.olLayer)
      this.olLayer = undefined
    }
  }
}
