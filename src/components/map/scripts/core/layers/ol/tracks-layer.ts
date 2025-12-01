import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature, { FeatureLike } from 'ol/Feature'
import { Coordinate } from 'ol/coordinate'
import { Style } from 'ol/style'
import { LineString } from 'ol/geom'
import {
  calculateAngleOfInclination,
  calculateInterpolatedCoordinate,
  isCoordinateWithinDistance,
} from '../../../helpers/geometry'
import LineStyle from '../../styles/line'
import { createLineStringFeatureCollectionFromPositions } from '../../features/line-string'
import { Position } from '../../types/position'
import ArrowStyle from '../../styles/arrow'

type OLTracksLayerStyle = {
  stroke: {
    color: string
  }
}

type OLTracksLayerOptions = {
  positions: Array<Position>
  style?: OLTracksLayerStyle
  title: string
  visible?: boolean
  zIndex?: number
  avoidCoordinates?: Array<Coordinate>
}

const ARROW_COLLISION_DISTANCE = 10 // map units (e.g. metres in EPSG:3857)

const getArrowStyles = (
  start: Coordinate,
  rotation: number,
  magnitude: number,
  resolution: number,
  avoidCoordinates?: Array<Coordinate>,
): Array<Style> => {
  const baseIntervalDistance = 50

  // As resolution increases (i.e. zoom out), distance between arrows increases
  const adjustedDistance = baseIntervalDistance * resolution

  // As distance between arrows increases, arrow count decreases
  // Always show at least 1 arrow
  const arrowCount = Math.max(Math.floor(magnitude / adjustedDistance), 1)

  // Space the arrows evenly along the line segment
  const spacing = magnitude / (arrowCount + 1)

  const styles: Style[] = []

  for (let index = 0; index < arrowCount; index += 1) {
    const distanceAlongLine = spacing * (index + 1)
    const coord = calculateInterpolatedCoordinate(start, distanceAlongLine, rotation)

    // Skip arrows that are too close to any blocked coordinate
    let shouldPlaceArrow = true

    if (avoidCoordinates && avoidCoordinates.length > 0) {
      const isBlocked = isCoordinateWithinDistance(coord, avoidCoordinates, ARROW_COLLISION_DISTANCE)
      if (isBlocked) {
        shouldPlaceArrow = false
      }
    }

    if (shouldPlaceArrow) {
      styles.push(new ArrowStyle(coord, resolution, rotation))
    }
  }

  return styles
}

const createStyleFunction =
  (style: OLTracksLayerStyle, avoidCoordinates?: Array<Coordinate>) =>
  (feature: FeatureLike, resolution: number): Array<Style> => {
    const geometry = (feature as Feature<LineString>).getGeometry()!
    const coordinates = geometry.getCoordinates()
    const magnitude = geometry.getLength()
    const start = coordinates[0]
    const end = coordinates[1]
    const rotation = -calculateAngleOfInclination(start, end) + Math.PI / 2

    return [
      new LineStyle(style.stroke.color, resolution),
      ...getArrowStyles(start, rotation, magnitude, resolution, avoidCoordinates),
    ]
  }

const DEFAULT_VISIBILITY = false
const DEFAULT_STROKE_COLOR = 'black'
const DEFAULT_STYLE: OLTracksLayerStyle = {
  stroke: {
    color: DEFAULT_STROKE_COLOR,
  },
}

export class OLTracksLayer extends VectorLayer<VectorSource<Feature<LineString>>> {
  constructor({
    positions,
    style = DEFAULT_STYLE,
    title,
    visible = DEFAULT_VISIBILITY,
    zIndex,
    avoidCoordinates,
  }: OLTracksLayerOptions) {
    super({
      properties: {
        title,
      },
      source: new VectorSource({ features: createLineStringFeatureCollectionFromPositions(positions) }),
      style: createStyleFunction(style, avoidCoordinates),
      visible,
      zIndex,
    })
  }
}
