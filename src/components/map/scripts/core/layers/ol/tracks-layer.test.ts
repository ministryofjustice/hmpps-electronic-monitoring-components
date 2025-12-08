import { Style } from 'ol/style'
import { Point } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import ArrowStyle from '../../styles/arrow'
import LineStyle from '../../styles/line'
import { OLTracksLayer } from './tracks-layer'
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
