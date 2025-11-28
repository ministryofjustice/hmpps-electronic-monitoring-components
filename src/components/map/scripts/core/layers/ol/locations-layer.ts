import Position from '@map/scripts/core/types/position'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { createPointFeatureCollectionFromPositions } from '../../features/point'

type OLLocationsLayerStyle = {
  fill?: string | CanvasPattern | CanvasGradient
  radius?: number
  stroke?: {
    color?: string
    width?: number
    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    lineDash?: number[]
    lineDashOffset?: number
    miterLimit?: number
  }
  displacement?: [number, number]
  rotation?: number
  rotateWithView?: boolean
  scale?: number | [number, number]
}

type OLLocationsLayerOptions = {
  positions: Array<Position>
  style?: OLLocationsLayerStyle
  title: string
  visible?: boolean
  zIndex?: number
}

const DEFAULT_RADIUS = 6
const DEFAULT_FILL = '#d4351c'
const DEFAULT_STROKE_COLOR = '#505a5f'
const DEFAULT_STROKE_WIDTH = 2
const DEFAULT_VISIBILITY = true

export class OLLocationsLayer extends VectorLayer<VectorSource<Feature<Point>>> {
  constructor({ positions, style = {}, title, visible = DEFAULT_VISIBILITY, zIndex }: OLLocationsLayerOptions) {
    const radius = style.radius ?? DEFAULT_RADIUS
    const fillColor = style.fill ?? DEFAULT_FILL

    const stroke = style.stroke ?? {}
    const strokeColor = stroke.color ?? DEFAULT_STROKE_COLOR
    const strokeWidth = stroke.width ?? DEFAULT_STROKE_WIDTH

    super({
      properties: {
        title,
      },
      source: new VectorSource({
        features: createPointFeatureCollectionFromPositions(positions),
      }),
      style: new Style({
        image: new CircleStyle({
          radius,
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({
            color: strokeColor,
            width: strokeWidth,
            lineCap: stroke.lineCap,
            lineJoin: stroke.lineJoin,
            lineDash: stroke.lineDash,
            lineDashOffset: stroke.lineDashOffset,
            miterLimit: stroke.miterLimit,
          }),
          displacement: style.displacement,
          rotation: style.rotation,
          rotateWithView: style.rotateWithView,
          scale: style.scale,
        }),
      }),
      visible,
      zIndex,
    })
  }
}
