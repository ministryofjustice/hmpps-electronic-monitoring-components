import Position from '@map/scripts/core/types/position'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { FeatureLike } from 'ol/Feature'
import { createPointFeatureCollectionFromPositions } from '../../features/point'

type OLTextLayerStyle = {
  fill?: string | CanvasPattern | CanvasGradient
  font?: string
  offset?: {
    x?: number
    y?: number
  }
  stroke?: {
    color?: string
    width?: number
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

type OLTextLayerOptions = {
  textProperty: string
  positions: Array<Position>
  style?: OLTextLayerStyle
  title: string
  visible?: boolean
  zIndex?: number
}

const DEFAULT_FONT = 'bold 14px "GDS Transport", system-ui, sans-serif'
const DEFAULT_FILL = 'black'
const DEFAULT_STROKE_COLOR = 'white'
const DEFAULT_STROKE_WIDTH = 2
const DEFAULT_OFFSET_X = 12
const DEFAULT_OFFSET_Y = 1
const DEFAULT_VISIBILITY = false
const DEFAULT_STYLE: OLTextLayerStyle = {
  fill: DEFAULT_FILL,
  font: DEFAULT_FONT,
  offset: {
    x: DEFAULT_OFFSET_X,
    y: DEFAULT_OFFSET_Y,
  },
  stroke: {
    color: DEFAULT_STROKE_COLOR,
    width: DEFAULT_STROKE_WIDTH,
  },
}

const createStyleFunction =
  (style: OLTextLayerStyle, property: string) =>
  (feature: FeatureLike): Array<Style> => {
    const value = feature.get(property)

    if (value !== undefined) {
      return [
        new Style({
          text: new Text({
            text: String(value),
            font: style.font ?? DEFAULT_FONT,
            fill: new Fill({ color: style.fill ?? DEFAULT_FILL }),
            stroke: new Stroke({
              color: style.stroke?.color ?? DEFAULT_STROKE_COLOR,
              width: style.stroke?.width ?? DEFAULT_STROKE_WIDTH,
            }),
            offsetX: style.offset?.x ?? DEFAULT_OFFSET_X,
            offsetY: style.offset?.y ?? DEFAULT_OFFSET_Y,
            textAlign: style.textAlign ?? 'left',
            textBaseline: style.textBaseline ?? 'middle',
            rotation: style.rotation,
            scale: style.scale,
            rotateWithView: style.rotateWithView,
            maxAngle: style.maxAngle,
            overflow: style.overflow,
            padding: style.padding,
            placement: style.placement,
            keepUpright: style.keepUpright,
            justify: style.justify,
            backgroundFill: style.backgroundFill ? new Fill({ color: style.backgroundFill }) : undefined,
            backgroundStroke: style.backgroundStroke
              ? new Stroke({
                  color: style.backgroundStroke.color,
                  width: style.backgroundStroke.width,
                  lineDash: style.backgroundStroke.lineDash,
                })
              : undefined,
          }),
        }),
      ]
    }

    return []
  }

export class OLTextLayer extends VectorLayer<VectorSource<Feature<Point>>> {
  constructor({
    textProperty,
    positions,
    style = DEFAULT_STYLE,
    title,
    visible = DEFAULT_VISIBILITY,
    zIndex,
  }: OLTextLayerOptions) {
    super({
      properties: {
        title,
      },
      source: new VectorSource({
        features: createPointFeatureCollectionFromPositions(positions),
      }),
      style: createStyleFunction(style, textProperty),
      visible,
      zIndex,
    })
  }
}
