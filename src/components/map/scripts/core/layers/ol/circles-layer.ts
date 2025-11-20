import { Feature } from 'ol'
import { Circle } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import Position from '../../types/position'
import { createCircleFeatureCollectionFromPositions } from '../../features/circle'

type OLCirclesLayerStyle = {
  fill?: string | null
  stroke?: {
    color?: string
    width?: number
    lineDash?: number[]
  } | null
}

type OLCirclesLayerOptions = {
  positions: Array<Position>
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
    let fillColor: string | undefined

    if (style?.fill === null) {
      fillColor = undefined
    } else {
      fillColor = style?.fill ?? DEFAULT_FILL
    }

    let strokeOptions:
      | {
          color: string
          width: number
          lineDash?: number[]
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
      }
    }

    super({
      properties: {
        title,
      },
      source: new VectorSource({
        features: createCircleFeatureCollectionFromPositions(positions),
      }),
      style: new Style({
        fill: fillColor ? new Fill({ color: fillColor }) : undefined,
        stroke: strokeOptions
          ? new Stroke({
              color: strokeOptions.color,
              width: strokeOptions.width,
              lineDash: strokeOptions.lineDash,
            })
          : undefined,
      }),
      visible,
      zIndex,
    })
  }
}
