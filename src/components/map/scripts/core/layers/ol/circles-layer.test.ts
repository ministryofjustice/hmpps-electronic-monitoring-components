import { Style } from 'ol/style'
import { Circle } from 'ol/geom'
import { Feature } from 'ol'
import { OLCirclesLayer } from './circles-layer'
import positions from '../../../../fixtures/positions.json'

describe('OLCirclesLayer (OpenLayers library)', () => {
  it('should display a single circle using the precision as radius for each position', () => {
    const layer = new OLCirclesLayer({
      positions,
      title: '',
    })
    const source = layer.getSource()
    const features = source?.getFeatures() || []

    expect(features).toHaveLength(7)
    expect(features.map(feature => (feature as Feature<Circle>).getGeometry()?.getRadius())).toEqual([
      50, 400, 200, 500, 300, 100, 100,
    ])
  })

  it('should use the default style by default', () => {
    const layer = new OLCirclesLayer({
      positions,
      title: '',
    })
    const style = layer.getStyle() as Style

    expect(style.getFill()?.getColor()).toBe('rgba(255, 165, 0, 0.1)')
    expect(style.getStroke()?.getColor()).toBe('orange')
    expect(style.getStroke()?.getWidth()).toBe(2)
  })

  it('should override the default style settings', () => {
    const layer = new OLCirclesLayer({
      positions,
      style: {
        fill: '#fff',
        stroke: {
          color: '#000',
          width: 1,
        },
      },
      title: '',
    })
    const style = layer.getStyle() as Style

    expect(style.getFill()?.getColor()).toBe('#fff')
    expect(style.getStroke()?.getColor()).toBe('#000')
    expect(style.getStroke()?.getWidth()).toBe(1)
  })

  it('should be hidden by default', () => {
    const layer = new OLCirclesLayer({
      positions,
      title: '',
    })

    expect(layer.getVisible()).toBeFalsy()
  })

  it('should override the default visibility', () => {
    const layer = new OLCirclesLayer({
      positions,
      title: '',
      visible: true,
    })

    expect(layer.getVisible()).toBeTruthy()
  })

  it('should remove fill when fill is null', () => {
    const layer = new OLCirclesLayer({
      positions,
      style: {
        fill: null,
        stroke: {
          color: '#000',
          width: 1,
        },
      },
      title: '',
    })

    const style = layer.getStyle() as Style

    expect(style.getFill()).toBeNull()
  })

  it('should remove stroke when stroke is null', () => {
    const layer = new OLCirclesLayer({
      positions,
      style: {
        stroke: null,
      },
      title: '',
    })

    const style = layer.getStyle() as Style

    expect(style.getStroke()).toBeNull()
  })

  it('should use default fill when style is provided but fill is omitted', () => {
    const layer = new OLCirclesLayer({
      positions,
      style: {
        stroke: {
          color: '#000',
          width: 1,
        },
      },
      title: '',
    })

    const style = layer.getStyle() as Style

    expect(style.getFill()?.getColor()).toBe('rgba(255, 165, 0, 0.1)')
  })

  it('should apply lineDash when provided', () => {
    const layer = new OLCirclesLayer({
      positions,
      style: {
        stroke: {
          color: '#000',
          width: 2,
          lineDash: [4, 2],
        },
      },
      title: '',
    })

    const style = layer.getStyle() as Style

    expect(style.getStroke()?.getLineDash()).toEqual([4, 2])
  })
})
