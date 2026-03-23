import { Style } from 'ol/style'
import { OLTextLayer } from './text-layer'
import positions from '../../../../fixtures/positions.json'

// Helper function to extract styles from the style function, handling both single and array returns
function getStyles(styleFn: any, feature: any): Style[] {
  const result = styleFn(feature, 0)

  if (!result) return []
  return Array.isArray(result) ? result : [result]
}

describe('OLTextLayer (OpenLayers library)', () => {
  it('should display a single text style for each position', () => {
    const layer = new OLTextLayer({
      positions,
      title: '',
      textProperty: 'sequenceNumber',
    })

    const features = layer.getSource()!.getFeatures()
    const styleFunction = layer.getStyleFunction()!

    const featureStyles = features.map(feature => getStyles(styleFunction, feature))

    expect(featureStyles).toHaveLength(10)
    expect(featureStyles[0]).toHaveLength(1)
    expect(featureStyles[0][0].getText()?.getText()).toBe('1.3')
    expect(featureStyles).toHaveLength(10)
    expect(featureStyles[1]).toHaveLength(1)
    expect(featureStyles[1][0].getText()?.getText()).toBe('1.2')
    expect(featureStyles).toHaveLength(10)
    expect(featureStyles[2]).toHaveLength(1)
    expect(featureStyles[2][0].getText()?.getText()).toBe('1')
    expect(featureStyles).toHaveLength(10)
    expect(featureStyles[3]).toHaveLength(1)
    expect(featureStyles[3][0].getText()?.getText()).toBe('3')
    expect(featureStyles).toHaveLength(10)
    expect(featureStyles[4]).toHaveLength(1)
    expect(featureStyles[4][0].getText()?.getText()).toBe('1.1')
    expect(featureStyles).toHaveLength(10)
    expect(featureStyles[5]).toHaveLength(1)
    expect(featureStyles[5][0].getText()?.getText()).toBe('4')
    expect(featureStyles).toHaveLength(10)
    expect(featureStyles[6]).toHaveLength(1)
    expect(featureStyles[6][0].getText()?.getText()).toBe('2')
  })

  it('should use the default style by default', () => {
    const layer = new OLTextLayer({
      positions,
      title: '',
      textProperty: 'sequenceNumber',
    })

    const features = layer.getSource()!.getFeatures()
    const styleFunction = layer.getStyleFunction()!

    const styles = getStyles(styleFunction, features[0])
    const style = styles[0]

    expect(style.getText()?.getFill()?.getColor()).toBe('black')
    expect(style.getText()?.getStroke()?.getColor()).toBe('white')
    expect(style.getText()?.getOffsetX()).toBe(12)
    expect(style.getText()?.getOffsetY()).toBe(1)
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

    const features = layer.getSource()!.getFeatures()
    const styleFunction = layer.getStyleFunction()!

    const styles = getStyles(styleFunction, features[0])
    const style = styles[0]

    expect(style.getText()?.getFill()?.getColor()).toBe('#fff')
    expect(style.getText()?.getStroke()?.getColor()).toBe('#000')
    expect(style.getText()?.getStroke()?.getWidth()).toBe(1)
    expect(style.getText()?.getOffsetX()).toBe(20)
    expect(style.getText()?.getOffsetY()).toBe(10)
    expect(style.getText()?.getFont()).toBe('sans-serif')
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

  it('should adjust offset for pin markers', () => {
    const layer = new OLTextLayer({
      positions: [
        {
          ...positions[0],
          marker: { type: 'pin' },
        },
      ],
      title: '',
      textProperty: 'sequenceNumber',
    })

    const feature = layer.getSource()!.getFeatures()[0]
    const styleFunction = layer.getStyleFunction()!

    const styles = getStyles(styleFunction, feature)
    const style = styles[0]

    expect(style.getText()?.getOffsetX()).toBe(0)
    expect(style.getText()?.getOffsetY()).toBe(24)
  })

  it('should adjust offset for image markers', () => {
    const layer = new OLTextLayer({
      positions: [
        {
          ...positions[0],
          marker: { type: 'image' },
        },
      ],
      title: '',
      textProperty: 'sequenceNumber',
    })

    const feature = layer.getSource()!.getFeatures()[0]
    const styleFunction = layer.getStyleFunction()!

    const styles = getStyles(styleFunction, feature)
    const style = styles[0]

    expect(style.getText()?.getOffsetX()).toBe(0)
    expect(style.getText()?.getOffsetY()).toBe(22)
  })
})
