import BaseLayer from 'ol/layer/Base'
import type { ComposableLayer, LayerStateOptions } from './base'
import type { MapAdapter } from '../map-adapter'

export class NativeLayerWrapper implements ComposableLayer<BaseLayer> {
  public readonly id: string

  private readonly layer: BaseLayer

  constructor(layer: BaseLayer, id = 'native-layer') {
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

    map.addLayer(this.layer)
  }

  public detach(adapter: MapAdapter): void {
    if (adapter.mapLibrary !== 'openlayers') return

    const { map } = adapter.openlayers!
    map.removeLayer(this.layer)
  }

  public getPrimaryLayer(): BaseLayer {
    return this.layer
  }

  public getNativeLayer(): BaseLayer {
    return this.layer
  }
}
