import { Feature } from 'ol'
import { Circle } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import { PositionWithPrecision } from '../../types/position'
import { createCircleFeatureCollectionFromPositions } from '../../features/circle'

type OLCirclesLayerStyle = {
  fill?: string | CanvasPattern | CanvasGradient | null
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

type OLCirclesLayerOptions = {
  positions?: Array<PositionWithPrecision>
  style?: OLCirclesLayerStyle
  title: string
  visible?: boolean
  zIndex?: number
}

const DEFAULT_FILL = 'rgba(255, 165, 0, 0.1)'
const DEFAULT_STROKE_COLOR = 'orange'
const DEFAULT_STROKE_WIDTH = 2
const DEFAULT_VISIBILITY = false

export class OLCirclesLayer extends VectorLayer<VectorSource<Feature<Circle>>> {
  constructor({ positions, style, title, visible = DEFAULT_VISIBILITY, zIndex }: OLCirclesLayerOptions) {
    // Resolve fill: null explicitly disables it
    let fillColor: string | CanvasPattern | CanvasGradient | undefined
    if (style?.fill === null) {
      fillColor = undefined
    } else {
      fillColor = style?.fill ?? DEFAULT_FILL
    }

    // Resolve stroke: null explicitly disables it
    let strokeOptions:
      | {
          color: string
          width: number
          lineDash?: number[]
          lineCap?: CanvasLineCap
          lineJoin?: CanvasLineJoin
          lineDashOffset?: number
          miterLimit?: number
        }
      | undefined

    if (style?.stroke === null) {
      strokeOptions = undefined
    } else {
      const stroke = style?.stroke

      strokeOptions = {
        color: stroke?.color ?? DEFAULT_STROKE_COLOR,
        width: stroke?.width ?? DEFAULT_STROKE_WIDTH,
        lineDash: stroke?.lineDash,
        lineCap: stroke?.lineCap,
        lineJoin: stroke?.lineJoin,
        lineDashOffset: stroke?.lineDashOffset,
        miterLimit: stroke?.miterLimit,
      }
    }

    super({
      properties: {
        title,
      },
      source: new VectorSource({
        features: createCircleFeatureCollectionFromPositions(positions ?? []),
      }),
      style: new Style({
        fill: fillColor ? new Fill({ color: fillColor }) : undefined,
        stroke: strokeOptions
          ? new Stroke({
              color: strokeOptions.color,
              width: strokeOptions.width,
              lineDash: strokeOptions.lineDash,
              lineCap: strokeOptions.lineCap,
              lineJoin: strokeOptions.lineJoin,
              lineDashOffset: strokeOptions.lineDashOffset,
              miterLimit: strokeOptions.miterLimit,
            })
          : undefined,
      }),
      visible,
      zIndex,
    })
  }
}
