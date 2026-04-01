import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature, { FeatureLike } from 'ol/Feature'
import { Coordinate } from 'ol/coordinate'
import { Style } from 'ol/style'
import { LineString } from 'ol/geom'
import { fromLonLat } from 'ol/proj'

import {
  bearingToVector,
  calculateAngleOfInclination,
  calculateInterpolatedCoordinate,
  isCoordinateWithinDistance,
  extendCoordinate,
  metersToProjectionUnits,
  normalise,
  getNumericProperty,
  toCoordinate,
} from '../../../helpers/geometry'
import LineStyle from '../../styles/line'
import { createLineStringFeatureCollectionFromPositions } from '../../features/line-string'
import { Position } from '../../types/position'
import ArrowStyle from '../../styles/arrow'

type DirectionUnits = 'degrees' | 'radians'

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

  entryExit?: {
    enabled?: boolean
    extensionDistanceMeters?: number
    direction?: {
      property?: string
      units?: DirectionUnits
    }
    centre?: [number, number]
    radiusMeters?: number
  }
}

const ARROW_COLLISION_DISTANCE = 20 // map units (adjust to match marker radius / precision)
const ARROW_SIZE_PX = 10
const MIN_SEGMENT_RENDERED_PX = 3 * ARROW_SIZE_PX // must have a least one arrow size either side to render arrows

/**
 * Entry rules:
 * - If direction.property is set AND first point has a numeric direction, use first point direction, reversed
 * - Otherwise fallback to first segment direction, reversed
 * - If only one point: fallback to entry from the North West 315°
 */
const getEntryVector = (
  positions: Position[],
  directionProperty?: string,
  directionUnits: DirectionUnits = 'degrees',
): [number, number] | null => {
  const position1 = positions[0]
  if (!position1) return null

  const directionValue = getNumericProperty(position1, directionProperty)

  // Use direction if available
  if (typeof directionValue === 'number') {
    const directionVector = bearingToVector(directionValue, directionUnits)
    return [-directionVector[0], -directionVector[1]]
  }

  // Fallback to line direction between points if possible
  const position2 = positions[1]
  if (position2) {
    const coordinate1 = toCoordinate(position1)
    const coordinate2 = toCoordinate(position2)
    const segmentVector = normalise(coordinate2[0] - coordinate1[0], coordinate2[1] - coordinate1[1])
    return segmentVector ? [-segmentVector[0], -segmentVector[1]] : null
  }

  // Fallback for single point
  const fallback = bearingToVector(315, directionUnits)
  return [-fallback[0], -fallback[1]]
}

/**
 * Exit rules:
 * - If direction.property is set AND last point has a numeric direction:
 *   use last point direction as-is
 * - Otherwise fallback to last segment direction
 * - If only one point: fallback to exit from the North East 45°
 */
const getExitVector = (
  positions: Position[],
  directionProperty?: string,
  directionUnits: DirectionUnits = 'degrees',
): [number, number] | null => {
  const pos = positions[positions.length - 1]
  if (!pos) return null

  const directionValue = getNumericProperty(pos, directionProperty)

  // Use direction if available
  if (typeof directionValue === 'number') {
    return bearingToVector(directionValue, directionUnits)
  }

  // Fallback to geometry if possible
  const position1 = positions[positions.length - 2]
  if (position1) {
    const coordinate1 = toCoordinate(position1)
    const coordinate2 = toCoordinate(pos)
    return normalise(coordinate2[0] - coordinate1[0], coordinate2[1] - coordinate1[1])
  }

  // fallback for single point
  return bearingToVector(45, directionUnits)
}

/**
 * Extends a point in a given direction until it exits a circle,
 * then continues a bit further.
 *
 * Steps:
 * 1. Treat the direction as a ray starting from `coord`
 * 2. Find where that ray intersects the circle boundary
 * 3. Move to that boundary point, then extend beyond it
 *
 * If no intersection is found, just extend normally.
 */
const extendBeyondCircle = (
  coord: Coordinate,
  direction: [number, number],
  centre: Coordinate,
  radiusMeters: number,
  extensionMeters: number,
): Coordinate => {
  const radius = metersToProjectionUnits(coord, radiusMeters)
  const extension = metersToProjectionUnits(coord, extensionMeters)

  const [directionX, directionY] = direction

  // Vector from circle centre to starting point
  const offsetX = coord[0] - centre[0]
  const offsetY = coord[1] - centre[1]

  // Values used to calculate where the ray hits the circle
  const directionLengthSq = directionX * directionX + directionY * directionY
  const offsetAlongDirection = 2 * (offsetX * directionX + offsetY * directionY)
  const distanceFromCentreSqMinusRadiusSq = offsetX * offsetX + offsetY * offsetY - radius * radius

  const intersectionValue =
    offsetAlongDirection * offsetAlongDirection - 4 * directionLengthSq * distanceFromCentreSqMinusRadiusSq

  // No intersection → just extend forward
  if (intersectionValue < 0) {
    return [coord[0] + directionX * extension, coord[1] + directionY * extension]
  }

  const intersectionDistanceFactor = Math.sqrt(intersectionValue)

  const intersection1 = (-offsetAlongDirection - intersectionDistanceFactor) / (2 * directionLengthSq)
  const intersection2 = (-offsetAlongDirection + intersectionDistanceFactor) / (2 * directionLengthSq)

  // Only keep intersections in front of the point
  const forwardIntersections = [intersection1, intersection2].filter(t => t >= 0).sort((a, b) => a - b)

  if (!forwardIntersections.length) {
    return [coord[0] + directionX * extension, coord[1] + directionY * extension]
  }

  const distanceToBoundary = forwardIntersections[0]

  // Move to boundary, then extend beyond it
  const totalDistance = distanceToBoundary + extension

  return [coord[0] + directionX * totalDistance, coord[1] + directionY * totalDistance]
}

// Apply entry/exit line extensions
const applyEntryExitToFeatures = (
  features: Feature<LineString>[],
  positions: Position[],
  options?: OLTracksLayerOptions['entryExit'],
) => {
  if (!options?.enabled || !positions.length || !features.length) return

  const extensionDistance = options.extensionDistanceMeters ?? 50
  const directionProperty = options.direction?.property
  const directionUnits = options.direction?.units ?? 'degrees'

  const entryVector = getEntryVector(positions, directionProperty, directionUnits)
  const exitVector = getExitVector(positions, directionProperty, directionUnits)

  const centreCoordinates = options.centre ? fromLonLat(options.centre) : undefined
  const radius = options.radiusMeters

  const firstGeom = features[0].getGeometry()
  if (entryVector && firstGeom) {
    const coords = firstGeom.getCoordinates()
    const first = coords[0]

    const entry =
      centreCoordinates && radius
        ? extendBeyondCircle(first, entryVector, centreCoordinates, radius, extensionDistance)
        : extendCoordinate(first, entryVector, extensionDistance)

    features.unshift(
      new Feature({
        geometry: new LineString([entry, first]),
      }),
    )
  }

  const lastFeature = features[features.length - 1]
  const lastGeom = lastFeature.getGeometry()
  if (exitVector && lastGeom) {
    const coords = lastGeom.getCoordinates()
    const last = coords[coords.length - 1]

    const exit =
      centreCoordinates && radius
        ? extendBeyondCircle(last, exitVector, centreCoordinates, radius, extensionDistance)
        : extendCoordinate(last, exitVector, extensionDistance)

    features.push(
      new Feature({
        geometry: new LineString([last, exit]),
      }),
    )
  }
}

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

  const adjustedCollisionDistance = ARROW_COLLISION_DISTANCE * resolution

  return [...Array(arrowCount).keys()].reduce<Style[]>((acc, i) => {
    const coord = calculateInterpolatedCoordinate(start, spacing * (i + 1), rotation)

    if (avoidCoordinates?.length && isCoordinateWithinDistance(coord, avoidCoordinates, adjustedCollisionDistance)) {
      return acc
    }

    acc.push(new ArrowStyle(coord, resolution, rotation))
    return acc
  }, [])
}

const createStyleFunction =
  (style: OLTracksLayerStyle, avoidCoordinates?: Array<Coordinate>) =>
  (feature: FeatureLike, resolution: number): Array<Style> => {
    const geometry = (feature as Feature<LineString>).getGeometry()!
    const coords = geometry.getCoordinates()
    const magnitude = geometry.getLength()
    const start = coords[0]
    const end = coords[1]
    const rotation = -calculateAngleOfInclination(start, end) + Math.PI / 2

    return [
      new LineStyle(style.stroke.color, resolution),
      ...getArrowStyles(start, rotation, magnitude, resolution, avoidCoordinates),
    ]
  }

const DEFAULT_VISIBILITY = false
const DEFAULT_STYLE: OLTracksLayerStyle = {
  stroke: { color: 'black' },
}

export class OLTracksLayer extends VectorLayer<VectorSource<Feature<LineString>>> {
  constructor({
    positions,
    style = DEFAULT_STYLE,
    title,
    visible = DEFAULT_VISIBILITY,
    zIndex,
    avoidPositions,
    entryExit,
  }: OLTracksLayerOptions) {
    // If avoidPositions array has been passed, merge with position data
    const allPositions = [...positions, ...(avoidPositions ?? [])]

    // Existing positions could have been duplicated in avoidPositions, so remove duplicates
    const uniquePositions = Array.from(
      new Map(allPositions.map(position => [`${position.longitude},${position.latitude}`, position])).values(),
    )

    const isProjectedCoordinate = (lon: number, lat: number) => Math.abs(lon) > 180 || Math.abs(lat) > 90

    const avoid = uniquePositions.map(position =>
      isProjectedCoordinate(position.longitude, position.latitude)
        ? [position.longitude, position.latitude]
        : fromLonLat([position.longitude, position.latitude]),
    )

    const featureCollection = createLineStringFeatureCollectionFromPositions(positions)
    const features = featureCollection.getArray()

    applyEntryExitToFeatures(features, positions, entryExit)

    super({
      properties: { title },
      source: new VectorSource({ features }),
      style: createStyleFunction(style, avoid),
      visible,
      zIndex,
    })
  }
}
