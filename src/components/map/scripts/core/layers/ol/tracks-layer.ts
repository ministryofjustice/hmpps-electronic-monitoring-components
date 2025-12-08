import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature, { FeatureLike } from 'ol/Feature'
import { Coordinate } from 'ol/coordinate'
import { Style } from 'ol/style'
import { LineString } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
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
  avoidPositions?: Array<Position>
}

const ARROW_COLLISION_DISTANCE = 20 // map units (adjust to match marker radius / precision)
const ARROW_SIZE_PX = 10
const MIN_SEGMENT_RENDERED_PX = 3 * ARROW_SIZE_PX // must have a least one arrow size either side to render arrows

const getArrowStyles = (
  start: Coordinate,
  rotation: number,
  magnitude: number,
  resolution: number,
  avoidCoordinates?: Array<Coordinate>,
): Array<Style> => {
  // Skip arrows for very short segments
  const minSegmentLength = MIN_SEGMENT_RENDERED_PX * resolution
  if (magnitude < minSegmentLength) {
    return []
  }

  const baseIntervalDistance = 50

  // As resolution increases (i.e. zoom out), distance between arrows increases
  const adjustedDistance = baseIntervalDistance * resolution

  // As distance between arrows increases, arrow count decreases
  // Always show at least 1 arrow unless the segment is extremely short
  const arrowCount = Math.max(Math.floor(magnitude / adjustedDistance), 1)

  // Space the arrows evenly along the line segment
  const spacing = magnitude / (arrowCount + 1)

  // If spacing < arrow size, skip arrows to maintain endpoint margins
  if (spacing < ARROW_SIZE_PX * resolution) {
    return []
  }

  const styles: Style[] = []
  const adjustedCollisionDistance = ARROW_COLLISION_DISTANCE * resolution

  for (let index = 0; index < arrowCount; index += 1) {
    const distanceAlongLine = spacing * (index + 1)
    const coord = calculateInterpolatedCoordinate(start, distanceAlongLine, rotation)
    let shouldPlaceArrow = true

    // Collision avoidance
    if (avoidCoordinates && avoidCoordinates.length > 0) {
      const isBlocked = isCoordinateWithinDistance(coord, avoidCoordinates, adjustedCollisionDistance)
      if (isBlocked) shouldPlaceArrow = false
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
    avoidPositions,
  }: OLTracksLayerOptions) {
    // If avoidPositions array has been passed, merge with position data
    const allPositions = [...positions, ...(avoidPositions ?? [])]

    // Existing positions could have been duplicated in avoidPositions, so remove duplicates
    const uniquePositions = Array.from(
      new Map(allPositions.map(position => [`${position.longitude},${position.latitude}`, position])).values(),
    )

    const isProjectedCoordinate = (lon: number, lat: number) => Math.abs(lon) > 180 || Math.abs(lat) > 90

    const avoid = uniquePositions.map(position => {
      return isProjectedCoordinate(position.longitude, position.latitude)
        ? [position.longitude, position.latitude]
        : fromLonLat([position.longitude, position.latitude])
    })

    super({
      properties: {
        title,
      },
      source: new VectorSource({ features: createLineStringFeatureCollectionFromPositions(positions) }),
      style: createStyleFunction(style, avoid),
      visible,
      zIndex,
    })
  }
}
