import type { ComposableLayer, LayerStateOptions } from './base'
import type { MapAdapter } from '../map-adapter'

type OlLayerLike = {
  getVisible(): boolean
  setVisible(v: boolean): void
  setZIndex(z: number): void
}

export class NativeLayerWrapper implements ComposableLayer<OlLayerLike> {
  public readonly id: string

  private readonly layer: OlLayerLike

  constructor(layer: OlLayerLike, id = 'native-layer') {
    this.layer = layer
    this.id = id
  }

  public attach(adapter: MapAdapter, options?: LayerStateOptions): void {
    if (adapter.mapLibrary !== 'openlayers') {
      console.warn('[NativeLayerWrapper] Only supported for OpenLayers')
      return
    }

    const { map } = adapter.openlayers!

    if (options?.zIndex !== undefined) {
      this.layer.setZIndex(options.zIndex)
    }

    if (options?.visible !== undefined) {
      this.layer.setVisible(options.visible)
    }

    map.addLayer(this.layer as unknown as Parameters<typeof map.addLayer>[0])
  }

  public detach(adapter: MapAdapter): void {
    if (adapter.mapLibrary !== 'openlayers') return

    const { map } = adapter.openlayers!
    map.removeLayer(this.layer as unknown as Parameters<typeof map.removeLayer>[0])
  }

  public getPrimaryLayer(): OlLayerLike {
    return this.layer
  }

  public getNativeLayer(): OlLayerLike {
    return this.layer
  }
}
