import { Coordinate } from 'ol/coordinate'

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

export { calculateAngleOfInclination, calculateInterpolatedCoordinate, isCoordinateWithinDistance }
