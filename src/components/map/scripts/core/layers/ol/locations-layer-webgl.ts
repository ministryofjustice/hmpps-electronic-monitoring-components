import WebGLVectorLayer from 'ol/layer/WebGLVector'
import VectorSource from 'ol/source/Vector'
import { Position } from '@map/scripts/core/types/position'
import { createPointFeatureFromPosition } from '../../features/point'

type MarkerOptions = {
  point?: {
    radius?: number
    fill?: string | CanvasPattern | CanvasGradient
    stroke?: {
      color?: string
      width?: number
    }
  }
}

type OLWebGLCircleLayerOptions = {
  positions: Array<Position>
  markerOptions?: MarkerOptions
  title: string
  visible?: boolean
  zIndex?: number
}

const DEFAULT_RADIUS = 6
const DEFAULT_FILL = '#d4351c'

type WebGLStyle = Record<string, unknown>

type PositionWithMarker = Position & {
  marker?: MarkerOptions
}

const DEFAULT_STROKE_COLOR = '#505a5f'
const DEFAULT_STROKE_WIDTH = 2

export class OLWebGLCircleLayer extends WebGLVectorLayer {
  private static style = {
    'circle-radius': ['get', 'radius'],
    'circle-fill-color': ['get', 'fill'],
    'circle-stroke-color': ['get', 'strokeColor'],
    'circle-stroke-width': ['get', 'strokeWidth'],
  }

  constructor({ positions, markerOptions, title, visible = true, zIndex }: OLWebGLCircleLayerOptions) {
    const features = positions.map(position => {
      const feature = createPointFeatureFromPosition(position)
      const marker = (position as PositionWithMarker).marker ?? markerOptions

      feature.setProperties({
        type: 'circle',
        radius: marker?.point?.radius ?? DEFAULT_RADIUS,
        fill: marker?.point?.fill ?? DEFAULT_FILL,
        strokeColor: marker?.point?.stroke?.color ?? DEFAULT_STROKE_COLOR,
        strokeWidth: marker?.point?.stroke?.width ?? DEFAULT_STROKE_WIDTH,
      })

      return feature
    })

    super({
      properties: { title },
      source: new VectorSource({ features }),
      style: OLWebGLCircleLayer.style as WebGLStyle,
      visible,
      zIndex,
    })
  }
}
