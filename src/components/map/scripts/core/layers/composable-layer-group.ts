import { extend } from 'ol/extent'
import type { Extent } from 'ol/extent'
import type { ComposableLayer, LayerStateOptions, VisibilityLayer } from './base'
import type { MapAdapter } from '../map-adapter'

export type ComposableLayerGroupOptions = {
  id: string
  layers: ComposableLayer[]
}

export class ComposableLayerGroup implements ComposableLayer<unknown[]> {
  public readonly id: string

  private readonly layers: ComposableLayer[]

  private visible = true

  private zIndex = 0

  constructor(options: ComposableLayerGroupOptions) {
    this.id = options.id
    this.layers = options.layers
  }

  public getExtent(): Extent | null {
    let combined: Extent | null = null

    this.layers.forEach(layer => {
      const extent = layer.getExtent?.()
      if (!extent) return

      if (!combined) {
        combined = [...extent] as Extent
      } else {
        extend(combined, extent)
      }
    })

    return combined
  }

  public getVisible(): boolean {
    return this.visible
  }

  public setVisible(visible: boolean): void {
    this.visible = visible

    this.layers.forEach(layer => {
      const primary = layer.getPrimaryLayer()
      primary.setVisible(visible)
    })
  }

  public setZIndex(zIndex: number): void {
    this.zIndex = zIndex

    this.layers.forEach((layer, index) => {
      const primary = layer.getPrimaryLayer()
      primary.setZIndex(zIndex + index)
    })
  }

  public getNativeLayer(): unknown[] {
    return this.layers.flatMap(layer => {
      const native = layer.getNativeLayer?.()
      if (!native) return []
      return Array.isArray(native) ? native : [native]
    })
  }

  public getPrimaryLayer(): VisibilityLayer {
    if (this.layers.length === 0) {
      throw new Error(`[ComposableLayerGroup] "${this.id}" has no child layers`)
    }

    return this.layers[0].getPrimaryLayer()
  }

  public attach(adapter: MapAdapter, options?: LayerStateOptions): void {
    this.visible = options?.visible ?? this.visible
    this.zIndex = options?.zIndex ?? this.zIndex

    this.layers.forEach((layer, index) => {
      layer.attach(adapter, {
        ...options,
        visible: this.visible,
        zIndex: this.zIndex + index,
      })
    })
  }

  public detach(adapter: MapAdapter): void {
    this.layers.forEach(layer => {
      layer.detach(adapter)
    })
  }
}
