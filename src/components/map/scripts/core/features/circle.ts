import { Feature } from 'ol'
import Polygon, { circular as circularPolygon } from 'ol/geom/Polygon'
import { Position } from '../types/position'

const DEFAULT_CIRCLE_SEGMENTS = 64

const createGeodesicCirclePolygon = (
  center: [number, number],
  radiusMeters: number,
  segments = DEFAULT_CIRCLE_SEGMENTS,
): Polygon => {
  return circularPolygon(center, radiusMeters, segments).transform('EPSG:4326', 'EPSG:3857')
}

const createCircleFeatureFromPosition = (position: Position): Feature<Polygon> => {
  const center: [number, number] = [position.longitude, position.latitude]
  const circle = createGeodesicCirclePolygon(center, position.precision)

  return new Feature({
    geometry: circle,
  })
}

const createCircleFeatureCollectionFromPositions = (positions: Array<Position>): Array<Feature<Polygon>> => {
  return positions.map(createCircleFeatureFromPosition)
}

export { createGeodesicCirclePolygon, createCircleFeatureFromPosition, createCircleFeatureCollectionFromPositions }
