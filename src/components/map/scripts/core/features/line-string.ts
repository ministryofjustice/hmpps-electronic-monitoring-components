import { Collection, Feature } from 'ol'
import { LineString } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
import { Position } from '../types/position'

const GAP_THRESHOLD_MS = 5 * 60 * 1000

const getTimestamp = (position: Position): number | null => {
  const timeStamp = position.timestamp ?? (position.properties?.timestamp as string | undefined)
  return timeStamp ? new Date(timeStamp).getTime() : null
}

const createLineStringFeatureFromPosition = (position: Position, nextPosition: Position): Feature<LineString> => {
  const timestamp1 = getTimestamp(position)
  const timestamp2 = getTimestamp(nextPosition)
  const timeDiff = timestamp1 !== null && timestamp2 !== null ? timestamp2 - timestamp1 : 0

  return new Feature({
    geometry: new LineString([
      fromLonLat([position.longitude, position.latitude]),
      fromLonLat([nextPosition.longitude, nextPosition.latitude]),
    ]),
    isTimeGap: timeDiff > GAP_THRESHOLD_MS,
  })
}

const createLineStringFeatureCollectionFromPositions = (
  positions: Array<Position>,
): Collection<Feature<LineString>> => {
  return new Collection(
    positions.reduce(
      (acc, position, index) => {
        if (index !== positions.length - 1) {
          acc.push(createLineStringFeatureFromPosition(position, positions[index + 1]))
        }
        return acc
      },
      [] as Array<Feature<LineString>>,
    ),
  )
}

export { createLineStringFeatureFromPosition, createLineStringFeatureCollectionFromPositions }
