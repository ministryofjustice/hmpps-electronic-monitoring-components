import { Style, Icon } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { OLLocationsLayer } from './locations-layer'
import positions from '../../../../fixtures/positions.json'

describe('OLLocationsLayer (OpenLayers library)', () => {
  it('should display a single point for each position', () => {
    const layer = new OLLocationsLayer({
      positions,
      title: '',
    })
    const source = layer.getSource()
    const features = source?.getFeatures() || []

    expect(features).toHaveLength(10)
  })

  it('should use the default style by default', () => {
    const layer = new OLLocationsLayer({
      positions,
      title: '',
    })
    const styleFn = layer.getStyle() as any
    const feature = layer.getSource()?.getFeatures()[0]
    const style = styleFn(feature, 1) as Style
    const image = style.getImage() as CircleStyle

    expect(image).toBeInstanceOf(CircleStyle)
    expect(image.getRadius()).toBe(6)
    expect(image.getFill()?.getColor()).toBe('#d4351c')
    expect(image.getStroke()?.getColor()).toBe('#505a5f')
    expect(image.getStroke()?.getWidth()).toBe(2)
  })

  it('should override the default style settings', () => {
    const layer = new OLLocationsLayer({
      positions,
      style: {
        fill: '#fff',
        radius: 10,
        stroke: {
          color: '#000',
          width: 1,
        },
      },
      title: '',
    })

    const styleFn = layer.getStyle() as any
    const feature = layer.getSource()?.getFeatures()[0]
    const style = styleFn(feature, 1) as Style

    const image = style.getImage() as CircleStyle

    expect(image).toBeInstanceOf(CircleStyle)
    expect(image.getRadius()).toBe(10)
    expect(image.getFill()?.getColor()).toBe('#fff')
    expect(image.getStroke()?.getColor()).toBe('#000')
    expect(image.getStroke()?.getWidth()).toBe(1)
  })

  it('should be visible by default', () => {
    const layer = new OLLocationsLayer({
      positions,
      title: '',
    })

    expect(layer.getVisible()).toBeTruthy()
  })

  it('should override the default visibility', () => {
    const layer = new OLLocationsLayer({
      positions,
      title: '',
      visible: false,
    })

    expect(layer.getVisible()).toBeFalsy()
  })

  it('should render image marker using Icon style', () => {
    const layer = new OLLocationsLayer({
      positions: [
        {
          ...positions[0],
          marker: {
            type: 'image',
            image: {
              src: 'test.png',
              scale: 1,
            },
          },
        },
      ],
      title: '',
    })

    const styleFn = layer.getStyle() as any
    const feature = layer.getSource()?.getFeatures()[0]
    const style = styleFn(feature, 1) as Style

    const image = style.getImage()
    expect(image).toBeInstanceOf(Icon)
  })

  it('should render pin marker using Icon style', () => {
    const layer = new OLLocationsLayer({
      positions: [
        {
          ...positions[0],
          marker: {
            type: 'pin',
            pin: {
              color: '#ff0000',
            },
          },
        },
      ],
      title: '',
    })

    const styleFn = layer.getStyle() as any
    const feature = layer.getSource()?.getFeatures()[0]
    const style = styleFn(feature, 1) as Style

    const image = style.getImage()
    expect(image).toBeInstanceOf(Icon)
  })

  it('should fallback to point style when marker type is not provided', () => {
    const layer = new OLLocationsLayer({
      positions: [
        {
          ...positions[0],
        },
      ],
      title: '',
    })

    const styleFn = layer.getStyle() as any
    const feature = layer.getSource()?.getFeatures()[0]
    const style = styleFn(feature, 1) as Style

    expect(style.getImage()).toBeInstanceOf(CircleStyle)
  })
})
