import { Layer } from 'ol/layer'
import { Style } from 'ol/style'
import { TracksLayer } from './tracks-layer'
import makeOpenLayersAdapter from '../../../../../../tests/utils/openlayers-adapter'
import { Position } from '../types/position'

const samplePositions: Array<Position> = []

const timeGapsPositions: Array<Position> = [
  { latitude: 51.5, longitude: -0.1, precision: 10, timestamp: '2024-01-01T12:00:00Z' } as unknown as Position,
  { latitude: 51.6, longitude: -0.1, precision: 10, timestamp: '2024-01-01T12:10:00Z' } as unknown as Position,
  { latitude: 51.7, longitude: -0.1, precision: 10, timestamp: '2024-01-01T12:11:00Z' } as unknown as Position,
  { latitude: 51.8, longitude: -0.1, precision: 10, timestamp: '2024-01-01T12:15:00Z' } as unknown as Position,
]

const FIVE_MINUTES_MS = 5 * 60 * 1000

const shouldDash = (from: Position, to: Position): boolean => {
  const t1 = from.timestamp ? new Date(from.timestamp).getTime() : null
  const t2 = to.timestamp ? new Date(to.timestamp).getTime() : null
  if (t1 === null || t2 === null) return false
  return t2 - t1 >= FIVE_MINUTES_MS
}

describe('TracksLayer (OpenLayers library)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('attaches a Layer and adds it to the map', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TracksLayer({ positions: samplePositions })

    layer.attach(adapter)

    expect(olMapMock.addLayer).toHaveBeenCalledTimes(1)
    const added = olMapMock.addLayer.mock.calls[0][0]
    expect(added).toBeInstanceOf(Layer)
  })

  it('respects visible=false and zIndex options', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TracksLayer({ positions: samplePositions, visible: false, zIndex: 5 })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as Layer
    expect(added.getVisible()).toBe(false)
    expect(added.getZIndex()).toBe(5)
  })

  it('detaches by removing the Layer', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TracksLayer({ positions: samplePositions })

    layer.attach(adapter)
    const added = olMapMock.addLayer.mock.calls[0][0]

    layer.detach(adapter)

    expect(olMapMock.removeLayer).toHaveBeenCalledWith(added)
  })

  it('applies dashed line to gap segments and solid line to normal segments when time gaps are enabled', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TracksLayer({
      positions: timeGapsPositions,
      style: { stroke: { color: 'red' } },
      segmentStyle: ({ positions: [from, to] }) => ({
        stroke: {
          lineDash: shouldDash(from, to) ? [8, 6] : undefined,
        },
      }),
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0]
    const styleFunction = added.getStyleFunction()!
    const features = added.getSource().getFeatures()

    // segment 0→1: 10 min gap → dashed
    const gapFeature = features[0]
    const gapStyles = styleFunction(gapFeature, 1) as Style[]
    expect(gapStyles[0].getStroke()?.getLineDash()).toEqual([8, 6])

    // segment 1→2: 1 min gap → solid
    const solidFeature = features[1]
    const solidStyles = styleFunction(solidFeature, 1) as Style[]
    expect(solidStyles[0].getStroke()?.getLineDash()).toBeNull()

    expect(gapStyles[0].getStroke()?.getColor()).toBe('red')
    expect(solidStyles[0].getStroke()?.getColor()).toBe('red')
  })

  it('should not apply dashed line to gap segments when timeGap is not enabled', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TracksLayer({
      positions: timeGapsPositions,
      style: {
        stroke: {
          color: 'red',
        },
      },
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0]
    const styleFunction = added.getStyleFunction()!
    const features = added.getSource().getFeatures()

    // gap segment — but timeGap disabled, so no dashes
    const gapFeature = features[0]
    const gapStyles = styleFunction(gapFeature, 1) as Style[]
    expect(gapStyles[0].getStroke()?.getLineDash()).toBeNull()

    // solid segment — also no dashes
    const solidFeature = features[1]
    const solidStyles = styleFunction(solidFeature, 1) as Style[]
    expect(solidStyles[0].getStroke()?.getLineDash()).toBeNull()

    expect(gapStyles[0].getStroke()?.getColor()).toBe('red')
    expect(solidStyles[0].getStroke()?.getColor()).toBe('red')
  })
})
