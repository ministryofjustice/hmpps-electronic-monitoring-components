import { Style } from 'ol/style'
import { Point, LineString } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import Feature from 'ol/Feature'
import ArrowStyle from '../../styles/arrow'
import LineStyle from '../../styles/line'
import {
  OLTracksLayer,
  getEntryVector,
  getExitVector,
  extendBeyondCircle,
  applyEntryExitToFeatures,
} from './tracks-layer'
import positions from '../../../../fixtures/positions.json'

describe('OLTracksLayer (OpenLayers library)', () => {
  it('should display a line, and arrows only when the segment is long enough at large resolution', () => {
    const resolution = 1500
    const layer = new OLTracksLayer({ positions, title: '' })
    const source = layer.getSource()
    const features = source?.getFeatures() || []
    const styleFunction = layer.getStyleFunction()!

    // Short segment
    const shortFeature = features[1]
    const styles = styleFunction(shortFeature, resolution) as Array<Style>

    // Should only have a line, no arrows
    expect(styles[0]).toBeInstanceOf(LineStyle)
    const arrows = styles.filter(s => s instanceof ArrowStyle)
    expect(arrows.length).toBe(0)
  })

  it('should display a line, and one or more arrows for longer line segments when the resolution is small', () => {
    const resolution = 3
    const layer = new OLTracksLayer({ positions, title: '' })
    const source = layer.getSource()
    const features = source?.getFeatures() || []
    const styleFunction = layer.getStyleFunction()!

    // Long segment
    const longFeature = features[4]
    const styles = styleFunction(longFeature, resolution) as Array<Style>

    expect(styles[0]).toBeInstanceOf(LineStyle)

    // Should include arrows
    const arrowStyles = styles.filter(s => s instanceof ArrowStyle)
    expect(arrowStyles.length).toBeGreaterThan(0)

    const line = styles[0] as LineStyle
    expect(line.getStroke()?.getWidth()).toBeCloseTo(1.78)
    expect(line.getStroke()?.getColor()).toBe('black')
  })

  it('should override the default style settings', () => {
    const layer = new OLTracksLayer({
      positions,
      style: { stroke: { color: 'red' } },
      title: '',
    })
    const source = layer.getSource()
    const features = source?.getFeatures() || []
    const styleFunction = layer.getStyleFunction()!
    const style = styleFunction(features[0], 1) as Array<Style>
    expect(style[0].getStroke()?.getColor()).toBe('red')
  })

  it('should be hidden by default', () => {
    const layer = new OLTracksLayer({ positions, title: '' })
    expect(layer.getVisible()).toBeFalsy()
  })

  it('should override the default visibility', () => {
    const layer = new OLTracksLayer({ positions, title: '', visible: true })
    expect(layer.getVisible()).toBeTruthy()
  })

  it('should skip arrows that are within the collision distance of avoidCoordinates', () => {
    const resolution = 3
    const layer = new OLTracksLayer({ positions, title: '' })
    const source = layer.getSource()
    const features = source?.getFeatures() || []
    const styleFunction = layer.getStyleFunction()!

    // Long segment
    const longFeature = features[4]
    const styles = styleFunction(longFeature, resolution) as Array<Style>
    const arrowStyles = styles.filter(s => s instanceof ArrowStyle)
    expect(arrowStyles.length).toBeGreaterThan(0)

    // pick an arrow coordinate to block
    const arrowPoint = arrowStyles[0].getGeometry() as Point
    const avoidPosition = arrowPoint.getCoordinates()
    const toPosition = (coord: Coordinate) => ({ longitude: coord[0], latitude: coord[1] })

    // Re-create layer with avoidPositions containing that coordinate
    const avoidLayer = new OLTracksLayer({
      positions,
      title: '',
      avoidPositions: [toPosition(avoidPosition)],
    })
    const avoidSource = avoidLayer.getSource()
    const avoidFeatures = avoidSource?.getFeatures() || []
    const avoidStyleFunction = avoidLayer.getStyleFunction()!
    const avoidStyles = avoidStyleFunction(avoidFeatures[4], resolution) as Array<Style>
    const avoidArrowStyles = avoidStyles.filter(s => s instanceof ArrowStyle)

    // Expect one less arrow
    expect(avoidArrowStyles.length).toBe(arrowStyles.length - 1)
  })
})

describe('Entry / Exit vector logic', () => {
  it('getEntryVector uses direction property (reversed)', () => {
    const testPositions = [{ longitude: 0, latitude: 0, direction: 90 }] as any

    const result = getEntryVector(testPositions, 'direction', 'degrees')

    expect(result![0]).toBeCloseTo(-1)
    expect(result![1]).toBeCloseTo(0)
  })

  it('getEntryVector falls back to segment direction', () => {
    const testPositions = [
      { longitude: 0, latitude: 0 },
      { longitude: 10, latitude: 0 },
    ] as any

    const result = getEntryVector(testPositions)

    expect(result![0]).toBeCloseTo(-1)
  })

  it('getExitVector uses direction property', () => {
    const testPositions = [{ longitude: 0, latitude: 0, direction: 90 }] as any

    const result = getExitVector(testPositions, 'direction', 'degrees')

    expect(result![0]).toBeCloseTo(1)
    expect(result![1]).toBeCloseTo(0)
  })

  it('getExitVector falls back to segment direction', () => {
    const testPositions = [
      { longitude: 0, latitude: 0 },
      { longitude: 10, latitude: 0 },
    ] as any

    const result = getExitVector(testPositions)

    expect(result![0]).toBeCloseTo(1)
  })
})

describe('extendBeyondCircle', () => {
  it('extends beyond boundary when intersecting', () => {
    const coord: Coordinate = [1, 0]
    const direction: [number, number] = [1, 0]
    const centre: Coordinate = [5, 0]

    const result = extendBeyondCircle(coord, direction, centre, 5, 5)

    expect(result[0]).toBeGreaterThan(5)
  })

  it('falls back when no intersection', () => {
    const coord: Coordinate = [0, 0]
    const direction: [number, number] = [1, 0]
    const centre: Coordinate = [0, 1000]

    const result = extendBeyondCircle(coord, direction, centre, 5, 5)

    expect(result[0]).toBeGreaterThan(0)
  })
})

describe('applyEntryExitToFeatures', () => {
  it('adds entry and exit features', () => {
    const features = [
      new Feature({
        geometry: new LineString([
          [0, 0],
          [10, 0],
        ]),
      }),
    ]

    const testPositions = [
      { longitude: 0, latitude: 0 },
      { longitude: 10, latitude: 0 },
    ] as any

    applyEntryExitToFeatures(features, testPositions, {
      enabled: true,
      extensionDistanceMeters: 10,
    })

    expect(features.length).toBe(3)
  })

  it('does nothing when disabled', () => {
    const features = [
      new Feature({
        geometry: new LineString([
          [0, 0],
          [10, 0],
        ]),
      }),
    ]

    const testPositions = [
      { longitude: 0, latitude: 0 },
      { longitude: 10, latitude: 0 },
    ] as any

    applyEntryExitToFeatures(features, testPositions, { enabled: false })

    expect(features.length).toBe(1)
  })
})
