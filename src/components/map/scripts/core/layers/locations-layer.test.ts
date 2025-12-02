import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import type Feature from 'ol/Feature'
import type Geometry from 'ol/geom/Geometry'
import { Style } from 'ol/style'
import { LocationsLayer } from './locations-layer'
import makeOpenLayersAdapter from '../../../../../../tests/utils/openlayers-adapter'
import positions from '../../../fixtures/positions.json'

type OLVecSrc = VectorSource<Feature<Geometry>>
type OLVecLayer = VectorLayer<OLVecSrc>

describe('LocationLayer (OpenLayers library)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('attaches a VectorLayer with expected properties and features', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new LocationsLayer({ positions, id: 'locations', title: 'Locations' })

    layer.attach(adapter)

    expect(olMapMock.addLayer).toHaveBeenCalledTimes(1)
    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    expect(added).toBeInstanceOf(VectorLayer)

    const source = added.getSource() as OLVecSrc
    expect(source).toBeInstanceOf(VectorSource)
    expect(source.getFeatures().length).toBe(7)

    expect(added.get('title')).toBe('Locations')

    const style = added.getStyle()
    expect(style).toBeInstanceOf(Style)
  })

  it('respects placement options: visible=false and zIndex', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new LocationsLayer({ positions, id: 'locations' })

    layer.attach(adapter, { visible: false, zIndex: 10 })

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    expect(added.getVisible()).toBe(false)
    expect(added.getZIndex()).toBe(10)
  })

  it('detaches by removing the same VectorLayer from the map', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new LocationsLayer({ positions, id: 'locations' })

    layer.attach(adapter)
    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer

    layer.detach(adapter)

    expect(olMapMock.removeLayer).toHaveBeenCalledTimes(1)
    const removed = olMapMock.removeLayer.mock.calls[0][0]
    expect(removed).toBe(added)
  })

  it('applies custom circle style location options', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new LocationsLayer({
      positions,
      id: 'locations',
      style: { radius: 8, fill: '#0b0c0c', stroke: { color: '#ffffff', width: 1 } },
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const style = added.getStyle() as Style
    expect(style).toBeInstanceOf(Style)
    expect(style.getImage()).toBeDefined()
  })

  it('applies lineDash when provided', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new LocationsLayer({
      positions,
      style: {
        radius: 6,
        fill: '#F5CA2C',
        stroke: { color: '#000', width: 2, lineDash: [4, 2] },
      },
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const style = added.getStyle() as Style
    const image = style.getImage() as any
    const stroke = image.getStroke()

    expect(stroke.getLineDash()).toEqual([4, 2])
  })

  it('supports CanvasPattern or CanvasGradient for fill', () => {
    const pattern = {} as CanvasPattern
    const { adapter, olMapMock } = makeOpenLayersAdapter()

    const layer = new LocationsLayer({
      positions,
      style: {
        radius: 5,
        fill: pattern,
        stroke: { color: '#000', width: 1 },
      },
    })

    layer.attach(adapter)

    const added = olMapMock.addLayer.mock.calls[0][0] as OLVecLayer
    const style = added.getStyle() as Style
    const image: any = style.getImage()!

    expect(image.getFill()).toBeTruthy()
  })
})
