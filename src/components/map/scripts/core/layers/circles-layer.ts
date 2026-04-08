import BaseLayer from 'ol/layer/Base'
import type { ComposableLayer, LayerStateOptions } from './base'
import type { MapAdapter } from '../map-adapter'
import { OLCirclesLayer } from './ol/circles-layer'
import type { Position, PositionWithPrecision } from '../types/position'

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

export class CirclesLayer implements ComposableLayer<BaseLayer[]> {
  public readonly id: string

  private readonly options: CirclesLayerOptions

  private olLayers: BaseLayer[] = []

  constructor(options: CirclesLayerOptions) {
    this.options = options
    this.id = options.id ?? 'circles'
  }

  private createLayers(): BaseLayer[] {
    const allPositions = this.options.positions ?? []
    const precisePositions = allPositions.filter(hasPrecision)

    return [
      new OLCirclesLayer({
        positions: precisePositions,
        style: this.options.style,
        title: this.options.title ?? this.id,
        visible: this.options.visible,
        zIndex: this.options.zIndex,
      }),
    ]
  }

  public getLayers(): BaseLayer[] {
    if (this.olLayers.length === 0) {
      this.olLayers = this.createLayers()
    }
    return this.olLayers
  }

  public getPrimaryLayer(): BaseLayer {
    return this.getLayers()[0]
  }

  public getNativeLayer(): BaseLayer[] {
    return this.getLayers()
  }

  public attach(adapter: MapAdapter, layerStateOptions?: LayerStateOptions): void {
    if (adapter.mapLibrary !== 'openlayers') {
      console.warn(`[CirclesLayer] MapLibre support is not implemented yet (layer "${this.id}")`)
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
