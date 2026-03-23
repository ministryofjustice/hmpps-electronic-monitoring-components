import { OLWebGLCircleLayer } from './locations-layer-webgl'
import positions from '../../../../fixtures/positions.json'

describe('OLWebGLCircleLayer', () => {
  it('creates features with correct default properties', () => {
    const layer = new OLWebGLCircleLayer({
      positions,
      title: 'test',
    })

    const features = layer.getSource()!.getFeatures()

    expect(features).toHaveLength(positions.length)

    const props = features[0].getProperties()

    expect(props.radius).toBe(6)
    expect(props.fill).toBe('#d4351c')
    expect(props.strokeColor).toBe('#505a5f')
    expect(props.strokeWidth).toBe(2)
  })

  it('applies marker options to feature properties', () => {
    const layer = new OLWebGLCircleLayer({
      positions,
      title: 'test',
      markerOptions: {
        point: {
          radius: 10,
          fill: '#fff',
          stroke: { color: '#000', width: 3 },
        },
      },
    })

    const feature = layer.getSource()!.getFeatures()[0]
    const props = feature.getProperties()

    expect(props.radius).toBe(10)
    expect(props.fill).toBe('#fff')
    expect(props.strokeColor).toBe('#000')
    expect(props.strokeWidth).toBe(3)
  })

  it('respects visibility and zIndex', () => {
    const layer = new OLWebGLCircleLayer({
      positions,
      title: 'test',
      visible: false,
      zIndex: 5,
    })

    expect(layer.getVisible()).toBe(false)
    expect(layer.getZIndex()).toBe(5)
  })
})
