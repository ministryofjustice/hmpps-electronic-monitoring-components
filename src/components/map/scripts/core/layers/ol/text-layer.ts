import Position from '@map/scripts/core/types/position'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { FeatureLike } from 'ol/Feature'
import { createPointFeatureCollectionFromPositions } from '../../features/point'

type OLTextLayerStyle = {
  fill: string
  font: string
  offset: {
    x: number
    y: number
  }
  stroke: {
    color: string
    width: number
  }
}

type OLTextLayerOptions = {
  textProperty?: string
  positions: Array<Position>
  style?: OLTextLayerStyle
  title: string
  visible?: boolean
  zIndex?: number
}

const DEFAULT_TEXT_PROPERTY = 'sequenceNumber'
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
            textAlign: 'left',
            textBaseline: 'middle',
            font: style.font,
            fill: new Fill({ color: style.fill }),
            stroke: new Stroke({
              color: style.stroke.color,
              width: style.stroke.width,
            }),
            text: String(feature.get(property)),
            offsetX: style.offset.x,
            offsetY: style.offset.y,
          }),
        }),
      ]
    }

    return []
  }

export class OLTextLayer extends VectorLayer<VectorSource<Feature<Point>>> {
  constructor({
    textProperty = DEFAULT_TEXT_PROPERTY,
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
