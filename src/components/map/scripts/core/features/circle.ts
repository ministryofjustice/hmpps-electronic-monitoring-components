import { Feature } from 'ol'
import { Circle } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
import { PositionWithPrecision } from '../types/position'

const createCircleFeatureFromPosition = (position: PositionWithPrecision): Feature<Circle> => {
  return new Feature({
    geometry: new Circle(fromLonLat([position.longitude, position.latitude]), position.precision),
  })
}

const createCircleFeatureCollectionFromPositions = (
  positions: Array<PositionWithPrecision>,
): Array<Feature<Circle>> => {
  return positions.map(createCircleFeatureFromPosition)
}

export { createCircleFeatureFromPosition, createCircleFeatureCollectionFromPositions }
