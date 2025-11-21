import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style } from 'ol/style'
import type Feature from 'ol/Feature'
import type { Circle } from 'ol/geom'
import { CirclesLayer } from './circles-layer'
import makeOpenLayersAdapter from '../../../../../../tests/utils/openlayers-adapter'
import positions from '../../../fixtures/positions.json'

type OLCircleFeature = Feature<Circle>
type OLVecSource = VectorSource<OLCircleFeature>
type OLVecLayer = VectorLayer<OLVecSource>

describe('CirclesLayer (OpenLayers library)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('attaches a VectorLayer with circle features from points', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new CirclesLayer({ positions, id: 'circles' })

    layer.attach(adapter)

    expect(olMapMock.addLayer).toHaveBeenCalledTimes(1)
    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    expect(added).toBeInstanceOf(VectorLayer)

    const source = added.getSource() as OLVecSource
    expect(source.getFeatures().length).toBe(7)

    const geomTypes = source.getFeatures().map(f => f.getGeometry()?.getType())
    expect(geomTypes.every(t => t === 'Circle')).toBe(true)
  })

  it('respects visible=false and zIndex from options', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new CirclesLayer({ positions, visible: false, zIndex: 99 })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    expect(added.getVisible()).toBe(false)
    expect(added.getZIndex()).toBe(99)
  })

  it('applies custom style when provided', () => {
    const customStyle = { fill: '#fff', stroke: { color: '#000', width: 1 } }
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new CirclesLayer({
      positions,
      style: customStyle,
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const style = added.getStyle() as Style
    expect(style.getFill()?.getColor()).toBe('#fff')
    expect(style.getStroke()?.getColor()).toBe('#000')
    expect(style.getStroke()?.getWidth()).toBe(1)
    expect(style.getStroke()?.getLineDash()).toBeNull()
  })

  it('detaches by removing the same VectorLayer', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new CirclesLayer({ positions })

    layer.attach(adapter)
    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer

    layer.detach(adapter)

    expect(olMapMock.removeLayer).toHaveBeenCalledTimes(1)
    expect(olMapMock.removeLayer).toHaveBeenCalledWith(added)
  })

  it('uses default fill and stroke when no style is provided', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new CirclesLayer({ positions })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const style = added.getStyle() as Style

    expect(style.getFill()?.getColor()).toBe('rgba(255, 165, 0, 0.1)')
    expect(style.getStroke()?.getColor()).toBe('orange')
    expect(style.getStroke()?.getWidth()).toBe(2)
  })

  it('uses default fill when style is provided but fill is omitted', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new CirclesLayer({
      positions,
      style: { stroke: { color: '#000', width: 1 } },
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const style = added.getStyle() as Style

    expect(style.getFill()?.getColor()).toBe('rgba(255, 165, 0, 0.1)')
  })

  it('omits fill when fill is null', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new CirclesLayer({
      positions,
      style: { fill: null, stroke: { color: '#000', width: 1 } },
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const style = added.getStyle() as Style

    expect(style.getFill()).toBeNull()
  })

  it('omits stroke when stroke is null', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new CirclesLayer({
      positions,
      style: { stroke: null },
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const style = added.getStyle() as Style

    expect(style.getStroke()).toBeNull()
  })

  it('applies lineDash when provided', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new CirclesLayer({
      positions,
      style: { stroke: { color: '#000', width: 2, lineDash: [4, 2] } },
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const style = added.getStyle() as Style

    expect(style.getStroke()?.getLineDash()).toEqual([4, 2])
  })
})
