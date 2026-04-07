import VectorLayer from 'ol/layer/Vector'
import { Feature } from 'ol'
import { Geometry } from 'ol/geom'
import VectorSource from 'ol/source/Vector'
import BaseLayer from 'ol/layer/Base'
import type { ComposableLayer } from './base'
import type { MapAdapter } from '../map-adapter'
import { OLTracksLayer } from './ol/tracks-layer'
import { Position } from '../types/position'

type OLVecSource = VectorSource<Feature<Geometry>>
type OLVecLayer = VectorLayer<OLVecSource>

export type DirectionUnits = 'degrees' | 'radians'

export type TracksLayerOptions = {
  id?: string
  title?: string
  visible?: boolean
  zIndex?: number
  style?: {
    stroke: {
      color: string
    }
  }
  avoidPositions?: Array<Position>
  positions: Array<Position>

  entryExit?: {
    enabled?: boolean
    extensionDistanceMeters?: number
    direction?: {
      property?: string // e.g. "direction"
      units?: DirectionUnits
    }
    centre?: [number, number]
    radiusMeters?: number
  }
}

export class TracksLayer implements ComposableLayer<OLVecLayer> {
  public readonly id: string

  private readonly options: TracksLayerOptions

  private olLayer?: OLVecLayer

  constructor(options: TracksLayerOptions) {
    this.options = options
    this.id = options.id ?? 'tracks'
  }

  public getNativeLayer(): OLVecLayer | undefined {
    return this.olLayer
  }

  public getPrimaryLayer(): BaseLayer {
    if (!this.olLayer) {
      throw new Error(`[TracksLayer] Layer "${this.id}" has not been attached yet`)
    }

    return this.olLayer
  }

  public attach(adapter: MapAdapter): void {
    if (adapter.mapLibrary !== 'openlayers') {
      console.warn(`[TracksLayer] MapLibre support is not implemented yet (layer "${this.id}")`)
      return
    }

    const { map } = adapter.openlayers!

    this.olLayer = new OLTracksLayer({
      positions: this.options.positions,
      style: this.options.style,
      title: this.options.title ?? this.id,
      visible: this.options.visible,
      zIndex: this.options.zIndex,
      avoidPositions: this.options.avoidPositions,
      entryExit: this.options.entryExit,
    })

    map.addLayer(this.olLayer)
  }

  public detach(adapter: MapAdapter): void {
    if (adapter.mapLibrary !== 'openlayers') return
    if (this.olLayer) {
      adapter.openlayers!.map.removeLayer(this.olLayer)
      this.olLayer = undefined
    }
  }
}
