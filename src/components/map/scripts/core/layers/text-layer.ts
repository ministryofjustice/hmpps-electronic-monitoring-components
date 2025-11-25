import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import type Feature from 'ol/Feature'
import type Geometry from 'ol/geom/Geometry'
import type { ComposableLayer } from './base'
import type { MapAdapter } from '../map-adapter'
import Position from '../types/position'
import { OLTextLayer } from './ol/text-layer'

type OLVecSource = VectorSource<Feature<Geometry>>
type OLVecLayer = VectorLayer<OLVecSource>

export type TextLayerOptions = {
  id?: string
  title?: string
  visible?: boolean
  zIndex?: number
  style?: {
    fill: string
    font: string
    stroke: {
      color: string
      width: number
    }
    offset: {
      x: number
      y: number
    }
  }
  textProperty: string
  positions: Array<Position>
}

export class TextLayer implements ComposableLayer<OLVecLayer> {
  public readonly id: string

  private readonly options: TextLayerOptions

  private olLayer?: OLVecLayer

  constructor(options: TextLayerOptions) {
    this.options = options
    this.id = options.id ?? 'text'
  }

  getNativeLayer(): OLVecLayer | undefined {
    return this.olLayer
  }

  attach(adapter: MapAdapter): void {
    if (adapter.mapLibrary !== 'openlayers') {
      console.warn(`[TextLayer] MapLibre support is not implemented yet (layer "${this.id}")`)
      return
    }

    const { map } = adapter.openlayers!

    this.olLayer = new OLTextLayer({
      textProperty: this.options.textProperty,
      positions: this.options.positions,
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
