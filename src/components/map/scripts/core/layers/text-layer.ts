import BaseLayer from 'ol/layer/Base'
import type { ComposableLayer, LayerStateOptions } from './base'
import type { MapAdapter } from '../map-adapter'
import { Position } from '../types/position'
import { OLTextLayer } from './ol/text-layer'

export type TextLayerOptions = {
  id?: string
  title?: string
  visible?: boolean
  zIndex?: number
  style?: {
    fill?: string | CanvasPattern | CanvasGradient
    font?: string
    stroke?: {
      color?: string
      width?: number
      lineDash?: number[]
      lineCap?: CanvasLineCap
      lineJoin?: CanvasLineJoin
      lineDashOffset?: number
      miterLimit?: number
    }
    offset?: {
      x?: number
      y?: number
    }
    textAlign?: CanvasTextAlign
    textBaseline?: CanvasTextBaseline
    rotation?: number
    scale?: number | [number, number]
    rotateWithView?: boolean
    maxAngle?: number
    overflow?: boolean
    padding?: number[]
    placement?: 'point' | 'line'
    keepUpright?: boolean
    justify?: 'left' | 'center' | 'right'
    backgroundFill?: string | CanvasPattern | CanvasGradient
    backgroundStroke?: {
      color?: string
      width?: number
      lineDash?: number[]
    }
  }
  textProperty: string
  positions: Array<Position>
}

export class TextLayer implements ComposableLayer<BaseLayer[]> {
  public readonly id: string

  private readonly options: TextLayerOptions

  private olLayers: BaseLayer[] = []

  constructor(options: TextLayerOptions) {
    this.options = options
    this.id = options.id ?? 'text'
  }

  private createLayers(): BaseLayer[] {
    return [
      new OLTextLayer({
        textProperty: this.options.textProperty,
        positions: this.options.positions,
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
      console.warn(`[TextLayer] MapLibre support is not implemented yet (layer "${this.id}")`)
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
