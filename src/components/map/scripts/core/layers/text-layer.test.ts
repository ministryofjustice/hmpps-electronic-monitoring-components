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
})
