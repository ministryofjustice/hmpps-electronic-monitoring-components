import BaseLayer from 'ol/layer/Base'
import type { ComposableLayer, LayerStateOptions } from './base'
import type { MapAdapter } from '../map-adapter'
import { OLTracksLayer } from './ol/tracks-layer'
import { Position } from '../types/position'

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

export class TracksLayer implements ComposableLayer<BaseLayer[]> {
  public readonly id: string

  private readonly options: TracksLayerOptions

  private olLayers: BaseLayer[] = []

  constructor(options: TracksLayerOptions) {
    this.options = options
    this.id = options.id ?? 'tracks'
  }

  private createLayers(): BaseLayer[] {
    return [
      new OLTracksLayer({
        positions: this.options.positions,
        style: this.options.style,
        title: this.options.title ?? this.id,
        visible: this.options.visible,
        zIndex: this.options.zIndex,
        avoidPositions: this.options.avoidPositions,
        entryExit: this.options.entryExit,
      }),
    ]
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

  public getPrimaryLayer(): BaseLayer {
    return this.getLayers()[0]
  }

  public attach(adapter: MapAdapter, layerStateOptions?: LayerStateOptions): void {
    if (adapter.mapLibrary !== 'openlayers') {
      console.warn(`[TracksLayer] MapLibre support is not implemented yet (layer "${this.id}")`)
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
  }

  public detach(adapter: MapAdapter): void {
    if (adapter.mapLibrary !== 'openlayers') return

    this.getLayers().forEach(layer => {
      adapter.openlayers!.map.removeLayer(layer)
    })

    this.olLayers = []
  }
}
