import { Coordinate } from 'ol/coordinate'
import { fromLonLat, getPointResolution } from 'ol/proj'
import { Position } from '../core/types/position'

type DirectionUnits = 'degrees' | 'radians'

const calculateAngleOfInclination = (start: Coordinate, end: Coordinate): number => {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  return Math.atan2(dy, dx)
}

const calculateInterpolatedCoordinate = (start: Coordinate, distance: number, azimuth: number): Coordinate => {
  const dx = distance * Math.sin(azimuth)
  const dy = distance * Math.cos(azimuth)

  return [start[0] + dx, start[1] + dy]
}

const isCoordinateWithinDistance = (coord: Coordinate, others: Array<Coordinate>, maxDistance: number): boolean => {
  const maxDistanceSquared = maxDistance * maxDistance

  return others.some(other => {
    const dx = coord[0] - other[0]
    const dy = coord[1] - other[1]
    const distanceSquared = dx * dx + dy * dy

    return distanceSquared <= maxDistanceSquared
  })
}

// Converts a bearing (0-360 degrees or 0-2π radians) to a unit vector pointing in that direction
// Needed because OpenLayers styles use direction vectors, while input data may use bearings (degrees or radians)
const bearingToVector = (bearing: number, units: DirectionUnits = 'degrees'): [number, number] => {
  const rad = units === 'degrees' ? (bearing * Math.PI) / 180 : bearing
  return [Math.sin(rad), Math.cos(rad)]
}

// Calculates a unit vector representing the direction of movement between two coordinates,
// or from a bearing if provided. Used for track entry/exit arrows.
const toCoordinate = (position: Position): Coordinate => {
  const isProjectedCoordinate = (lon: number, lat: number) => Math.abs(lon) > 180 || Math.abs(lat) > 90

  return isProjectedCoordinate(position.longitude, position.latitude)
    ? [position.longitude, position.latitude]
    : fromLonLat([position.longitude, position.latitude])
}

// Normalises a vector to a unit vector, or returns null if the vector has zero length (e.g. for a single-point track)
const normalise = (directionX: number, directionY: number): [number, number] | null => {
  const vectorLength = Math.hypot(directionX, directionY)
  return vectorLength ? [directionX / vectorLength, directionY / vectorLength] : null
}

// Helper to extract a numeric property from a Position, returning undefined if the property
// is missing or not a numbers
const getNumericProperty = (obj: Position, key?: string): number | undefined => {
  if (!key) return undefined
  const value = (obj as Record<string, unknown>)[key]
  return typeof value === 'number' ? value : undefined
}

// Converts meters into projection units at a given coordinate
const metersToProjectionUnits = (coord: Coordinate, meters: number, projection: string = 'EPSG:3857'): number => {
  const resolution = getPointResolution(projection, 1, coord)
  return meters / resolution
}

// Extends a coordinate along a unit vector by a given distance (in meters)
const extendCoordinate = (
  coord: Coordinate,
  vector: [number, number],
  distanceMeters: number,
  projection: string = 'EPSG:3857',
): Coordinate => {
  const distance = metersToProjectionUnits(coord, distanceMeters, projection)
  return [coord[0] + vector[0] * distance, coord[1] + vector[1] * distance]
}

export {
  bearingToVector,
  calculateAngleOfInclination,
  calculateInterpolatedCoordinate,
  extendCoordinate,
  getNumericProperty,
  isCoordinateWithinDistance,
  metersToProjectionUnits,
  normalise,
  toCoordinate,
}
