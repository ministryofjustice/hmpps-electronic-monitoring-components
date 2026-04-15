import { Feature } from 'ol'
import Polygon, { circular as circularPolygon } from 'ol/geom/Polygon'
import { PositionWithPrecision } from '../types/position'

const createCircleFeatureFromPosition = (position: PositionWithPrecision): Feature<Polygon> => {
  const center = [position.longitude, position.latitude]
  
  const circle = circularPolygon(center, position.precision, 64)
    circle.transform('EPSG:4326', 'EPSG:3857')
  
  return new Feature({
    geometry: circle,
  })
}

const createCircleFeatureCollectionFromPositions = (
  positions: Array<PositionWithPrecision>,
): Array<Feature<Polygon>> => {
  return positions.map(createCircleFeatureFromPosition)
}

export { createCircleFeatureFromPosition, createCircleFeatureCollectionFromPositions }
