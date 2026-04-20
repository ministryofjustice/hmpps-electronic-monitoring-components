import { Feature } from 'ol'
import Polygon, { circular as circularPolygon } from 'ol/geom/Polygon'
import { Position } from '../types/position'

const createCircleFeatureFromPosition = (position: Position): Feature<Polygon> => {
  const center = [position.longitude, position.latitude]
  const circle = circularPolygon(center, position.precision, 64).transform('EPSG:4326', 'EPSG:3857')

  return new Feature({
    geometry: circle,
  })
}

const createCircleFeatureCollectionFromPositions = (positions: Array<Position>): Array<Feature<Polygon>> => {
  return positions.map(createCircleFeatureFromPosition)
}

export { createCircleFeatureFromPosition, createCircleFeatureCollectionFromPositions }
