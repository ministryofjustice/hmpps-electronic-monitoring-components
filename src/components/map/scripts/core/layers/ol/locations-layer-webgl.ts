import WebGLVectorLayer from 'ol/layer/WebGLVector'
import VectorSource from 'ol/source/Vector'
import { createPointFeatureFromPosition } from '../../features/point'
import { Position } from '../../types/position'

type PositionWithMarker = Position & {
  marker?: MarkerOptions
}

type MarkerOptions = {
  point?: {
    radius?: number
    fill?: string
    stroke?: {
      color?: string
      width?: number
    }
  }
}

type StyleOptions = {
  radius?: number
  fill?: string
  stroke?: {
    color?: string
    width?: number
  }
}

type OLWebGLCircleLayerOptions = {
  positions: Array<Position>
  style?: StyleOptions
  markerOptions?: MarkerOptions
  title: string
  visible?: boolean
  zIndex?: number
}

const DEFAULT_RADIUS = 6
const DEFAULT_FILL = '#d4351c'
const DEFAULT_STROKE_COLOR = '#505a5f'
const DEFAULT_STROKE_WIDTH = 2

// Resolves the style for a given position, checking marker options first,
// then layer style, then defaults
function resolveStyle(position: Position, style?: StyleOptions, marker?: MarkerOptions) {
  const markerOptions = (position as PositionWithMarker).marker ?? marker

  return {
    radius: markerOptions?.point?.radius ?? style?.radius ?? DEFAULT_RADIUS,
    fill: markerOptions?.point?.fill ?? style?.fill ?? DEFAULT_FILL,
    strokeColor: markerOptions?.point?.stroke?.color ?? style?.stroke?.color ?? DEFAULT_STROKE_COLOR,
    strokeWidth: markerOptions?.point?.stroke?.width ?? style?.stroke?.width ?? DEFAULT_STROKE_WIDTH,
  }
}

export class OLWebGLCircleLayer extends WebGLVectorLayer {
  private static style = {
    'circle-radius': ['get', 'radius'],
    'circle-fill-color': ['get', 'fill'],
    'circle-stroke-color': ['get', 'strokeColor'],
    'circle-stroke-width': ['get', 'strokeWidth'],
  }

  constructor({ positions, style, markerOptions, title, visible = true, zIndex }: OLWebGLCircleLayerOptions) {
    const features = positions.map(position => {
      const feature = createPointFeatureFromPosition(position)

      const resolved = resolveStyle(position, style, markerOptions)

      feature.setProperties({
        radius: resolved.radius,
        fill: resolved.fill,
        strokeColor: resolved.strokeColor,
        strokeWidth: resolved.strokeWidth,
      })

      return feature
    })

    super({
      properties: { title },
      source: new VectorSource({ features }),
      style: OLWebGLCircleLayer.style,
      visible,
      zIndex,
    })
  }
}
