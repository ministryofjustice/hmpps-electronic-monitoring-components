import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style, Text } from 'ol/style'
import type Feature from 'ol/Feature'
import type Geometry from 'ol/geom/Geometry'
import { TextLayer } from './text-layer'
import makeOpenLayersAdapter from '../../../../../../tests/utils/openlayers-adapter'
import positions from '../../../fixtures/positions.json'

type OLVecSource = VectorSource<Feature<Geometry>>
type OLVecLayer = VectorLayer<OLVecSource>

describe('TextLayer (OpenLayers library)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('attaches a VectorLayer with text styles from the textProperty', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TextLayer({ positions, id: 'text', textProperty: 'sequenceNumber' })

    layer.attach(adapter)

    expect(olMapMock.addLayer).toHaveBeenCalledTimes(1)
    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    expect(added).toBeInstanceOf(VectorLayer)

    const source = added.getSource() as OLVecSource
    expect(source.getFeatures().length).toBe(7)

    const styleFn = added.getStyle() as (f: Feature<Geometry>) => Array<Style>
    const first = source.getFeatures()[0]
    const style = styleFn(first)!
    expect(style[0]).toBeInstanceOf(Style)
    expect(style[0].getText()).toBeInstanceOf(Text)
    expect(style[0].getText()?.getText()).toBe('1')
  })

  it('respects visible=false and zIndex from options', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TextLayer({ positions, visible: false, zIndex: 42, textProperty: 'sequenceNumber' })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    expect(added.getVisible()).toBe(false)
    expect(added.getZIndex()).toBe(42)
  })

  it('uses custom textProperty when provided', () => {
    const customPositions = [{ latitude: 0, longitude: 0, precision: 0, sequenceNumber: 0, label: 'A' }]

    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TextLayer({ positions: customPositions, textProperty: 'label' })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const source = added.getSource() as OLVecSource
    const styleFn = added.getStyle() as (f: Feature<Geometry>) => Array<Style>
    const style = styleFn(source.getFeatures()[0])!
    expect(style[0].getText()?.getText()).toBe('A')
  })

  it('detaches by removing the same VectorLayer from the map', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TextLayer({ positions, textProperty: 'sequenceNumber' })

    layer.attach(adapter)
    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer

    layer.detach(adapter)

    expect(olMapMock.removeLayer).toHaveBeenCalledWith(added)
  })

  it('forwards all style properties to OLTextLayer', () => {
    const style = {
      fill: '#f00',
      font: '20px serif',
      offset: { x: 10, y: 5 },
      stroke: { color: '#000', width: 2 },
      rotation: 1.5,
      textAlign: 'center' as CanvasTextAlign,
      justify: 'center' as const,
      padding: [2, 4, 2, 4],
    }

    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new TextLayer({
      positions,
      textProperty: 'sequenceNumber',
      style,
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const source = added.getSource()!
    const styleFn = added.getStyle() as any
    const applied = styleFn(source.getFeatures()[0])[0].getText()

    expect(applied.getFill()?.getColor()).toBe('#f00')
    expect(applied.getFont()).toBe('20px serif')
    expect(applied.getOffsetX()).toBe(10)
    expect(applied.getOffsetY()).toBe(5)
    expect(applied.getStroke()?.getColor()).toBe('#000')
    expect(applied.getStroke()?.getWidth()).toBe(2)
    expect(applied.getRotation()).toBe(1.5)
    expect(applied.getTextAlign()).toBe('center')
    expect(applied.getJustify()).toBe('center')
    expect(applied.getPadding()).toEqual([2, 4, 2, 4])
  })
})
