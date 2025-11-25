import { Style } from 'ol/style'
import { OLTextLayer } from './text-layer'
import positions from '../../../../fixtures/positions.json'

describe('OLTextLayer (OpenLayers library)', () => {
  it('should display a single text style for each position', () => {
    const layer = new OLTextLayer({
      positions,
      title: '',
      textProperty: 'sequenceNumber',
    })
    const source = layer.getSource()
    const features = source?.getFeatures() || []
    const styleFunction = layer.getStyleFunction()!
    const featureStyles = features.map(feature => styleFunction(feature, 0)) as Array<Array<Style>>

    expect(featureStyles).toHaveLength(7)
    expect(featureStyles[0]).toHaveLength(1)
    expect(featureStyles[0][0].getText()?.getText()).toBe('1')
    expect(featureStyles).toHaveLength(7)
    expect(featureStyles[1]).toHaveLength(1)
    expect(featureStyles[1][0].getText()?.getText()).toBe('2')
    expect(featureStyles).toHaveLength(7)
    expect(featureStyles[2]).toHaveLength(1)
    expect(featureStyles[2][0].getText()?.getText()).toBe('3')
    expect(featureStyles).toHaveLength(7)
    expect(featureStyles[3]).toHaveLength(1)
    expect(featureStyles[3][0].getText()?.getText()).toBe('4')
    expect(featureStyles).toHaveLength(7)
    expect(featureStyles[4]).toHaveLength(1)
    expect(featureStyles[4][0].getText()?.getText()).toBe('5')
    expect(featureStyles).toHaveLength(7)
    expect(featureStyles[5]).toHaveLength(1)
    expect(featureStyles[5][0].getText()?.getText()).toBe('6')
    expect(featureStyles).toHaveLength(7)
    expect(featureStyles[6]).toHaveLength(1)
    expect(featureStyles[6][0].getText()?.getText()).toBe('7')
  })

  it('should use the default style by default', () => {
    const layer = new OLTextLayer({
      positions,
      title: '',
      textProperty: 'sequenceNumber',
    })
    const source = layer.getSource()
    const features = source?.getFeatures() || []
    const styleFunction = layer.getStyleFunction()!
    const style = styleFunction(features[0], 0) as Array<Style>

    expect(style[0].getText()?.getFill()?.getColor()).toBe('black')
    expect(style[0].getText()?.getStroke()?.getColor()).toBe('white')
    expect(style[0].getText()?.getStroke()?.getWidth()).toBe(2)
    expect(style[0].getText()?.getOffsetX()).toBe(12)
    expect(style[0].getText()?.getOffsetY()).toBe(1)
    expect(style[0].getText()?.getFont()).toBe('bold 14px "GDS Transport", system-ui, sans-serif')
  })

  it('should override the default style settings', () => {
    const layer = new OLTextLayer({
      positions,
      style: {
        fill: '#fff',
        font: 'sans-serif',
        offset: {
          x: 20,
          y: 10,
        },
        stroke: {
          color: '#000',
          width: 1,
        },
      },
      title: '',
      textProperty: 'sequenceNumber',
    })
    const source = layer.getSource()
    const features = source?.getFeatures() || []
    const styleFunction = layer.getStyleFunction()!
    const style = styleFunction(features[0], 0) as Array<Style>

    expect(style[0].getText()?.getFill()?.getColor()).toBe('#fff')
    expect(style[0].getText()?.getStroke()?.getColor()).toBe('#000')
    expect(style[0].getText()?.getStroke()?.getWidth()).toBe(1)
    expect(style[0].getText()?.getOffsetX()).toBe(20)
    expect(style[0].getText()?.getOffsetY()).toBe(10)
    expect(style[0].getText()?.getFont()).toBe('sans-serif')
  })

  it('should be hidden by default', () => {
    const layer = new OLTextLayer({
      positions,
      title: '',
      textProperty: 'sequenceNumber',
    })

    expect(layer.getVisible()).toBeFalsy()
  })

  it('should override the default visibility', () => {
    const layer = new OLTextLayer({
      positions,
      title: '',
      visible: true,
      textProperty: 'sequenceNumber',
    })

    expect(layer.getVisible()).toBeTruthy()
  })
})
