import type BaseLayer from 'ol/layer/Base'
import VectorLayer from 'ol/layer/Vector'
import WebGLVectorLayer from 'ol/layer/WebGLVector'
import VectorSource from 'ol/source/Vector'
import type Feature from 'ol/Feature'
import type Geometry from 'ol/geom/Geometry'
import Overlay from 'ol/Overlay'
import { Style } from 'ol/style'
import * as browserHelpers from '../../helpers/browser'
import { LocationsLayer, MarkerOptions } from './locations-layer'
import makeOpenLayersAdapter from '../../../../../../tests/utils/openlayers-adapter'
import positions from '../../../fixtures/positions.json'
import type { Position } from '../types/position'

type OLVecSrc = VectorSource<Feature<Geometry>>
type OLVecLayer = VectorLayer<OLVecSrc>

// Extend Position for tests to support marker
type PositionWithMarker = Position & {
  marker?: MarkerOptions
}

// Helper function to extract the style for testing purposes
function getStyle(layer: OLVecLayer): Style {
  const styleFn = layer.getStyle() as any
  const feature = layer.getSource()!.getFeatures()[0]
  return styleFn(feature, 1)
}

// Helper for multi-layer support
function getAddedLayers(mock: any): BaseLayer[] {
  return mock.addLayer.mock.calls.map((call: any) => call[0])
}

describe('LocationLayer (OpenLayers library)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('attaches a VectorLayer with expected properties and features', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new LocationsLayer({
      positions,
      id: 'locations',
      title: 'Locations',
      renderer: 'vector',
    })

    layer.attach(adapter)

    const addedLayers = getAddedLayers(olMapMock)

    expect(addedLayers).toHaveLength(1)

    const added = addedLayers[0] as OLVecLayer
    expect(added).toBeInstanceOf(VectorLayer)

    const source = added.getSource() as OLVecSrc
    expect(source).toBeInstanceOf(VectorSource)
    expect(source.getFeatures().length).toBe(10)

    expect(added.get('title')).toBe('Locations')

    const styleFn = added.getStyle()
    expect(typeof styleFn).toBe('function')

    const style = getStyle(added)
    expect(style).toBeInstanceOf(Style)
  })

  it('respects placement options: visible=false and zIndex', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new LocationsLayer({
      positions,
      id: 'locations',
      renderer: 'vector',
    })

    layer.attach(adapter, { visible: false, zIndex: 10 })

    const added = getAddedLayers(olMapMock)[0] as OLVecLayer
    expect(added.getVisible()).toBe(false)
    expect(added.getZIndex()).toBe(10)
  })

  it('detaches by removing the same VectorLayer from the map', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()
    const layer = new LocationsLayer({
      positions,
      id: 'locations',
      renderer: 'vector',
    })

    layer.attach(adapter)
    const added = getAddedLayers(olMapMock)[0]

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
      renderer: 'vector',
    })

    layer.attach(adapter)

    const added = getAddedLayers(olMapMock)[0] as OLVecLayer
    const style = getStyle(added)

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
      renderer: 'vector',
    })

    layer.attach(adapter)

    const added = getAddedLayers(olMapMock)[0] as OLVecLayer
    const style = getStyle(added)

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
      renderer: 'vector',
    })

    layer.attach(adapter)

    const added = getAddedLayers(olMapMock)[0] as OLVecLayer
    const style = getStyle(added)

    const image: any = style.getImage()!
    expect(image.getFill()).toBeTruthy()
  })

  it('splits point and image markers into separate layers', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()

    const mixedPositions: PositionWithMarker[] = [
      { ...positions[0] },
      {
        ...positions[1],
        marker: { type: 'image', image: { src: 'test.png' } },
      },
    ]

    const layer = new LocationsLayer({
      positions: mixedPositions,
      renderer: 'vector',
    })

    layer.attach(adapter)

    const addedLayers = getAddedLayers(olMapMock)

    expect(addedLayers).toHaveLength(2)

    expect(addedLayers[0]).toBeInstanceOf(VectorLayer)
    expect(addedLayers[1]).toBeInstanceOf(VectorLayer)

    const z0 = addedLayers[0].getZIndex() ?? 0
    const z1 = addedLayers[1].getZIndex() ?? 0

    expect(z1).toBeGreaterThan(z0)
  })

  it('uses WebGL layer when renderer is auto and supported', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()

    jest.spyOn(browserHelpers, 'supportsWebGL').mockReturnValue(true)

    const layer = new LocationsLayer({
      positions,
      renderer: 'auto',
    })

    layer.attach(adapter)

    const addedLayers = getAddedLayers(olMapMock)

    expect(addedLayers[0]).toBeInstanceOf(WebGLVectorLayer)
  })

  it('falls back to vector when style is not WebGL compatible', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()

    const layer = new LocationsLayer({
      positions,
      renderer: 'auto',
      style: {
        fill: null,
      },
    })

    layer.attach(adapter)

    const addedLayers = getAddedLayers(olMapMock)

    expect(addedLayers[0]).toBeInstanceOf(VectorLayer)
  })

  it('respects renderer=vector even if WebGL is available', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()

    jest.spyOn(browserHelpers, 'supportsWebGL').mockReturnValue(true)

    const layer = new LocationsLayer({
      positions,
      renderer: 'vector',
    })

    layer.attach(adapter)

    const addedLayers = getAddedLayers(olMapMock)

    expect(addedLayers[0]).toBeInstanceOf(VectorLayer)
  })

  it('detaches all created layers', () => {
    const { adapter, olMapMock } = makeOpenLayersAdapter()

    const mixedPositions: PositionWithMarker[] = [
      { ...positions[0] },
      {
        ...positions[1],
        marker: { type: 'image', image: { src: 'test.png' } },
      },
    ]

    const layer = new LocationsLayer({
      positions: mixedPositions,
    })

    layer.attach(adapter)
    const addedLayers = getAddedLayers(olMapMock)

    layer.detach(adapter)

    expect(olMapMock.removeLayer).toHaveBeenCalledTimes(addedLayers.length)
  })

  describe('LocationsLayer marker overlays', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('creates one overlay per position by default', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()
      const layer = new LocationsLayer({ positions, renderer: 'vector' })

      layer.attach(adapter)

      expect(olMapMock.addOverlay).toHaveBeenCalledTimes(positions.length)
    })

    it('does not create marker overlays when accessibleMarkers is false', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()
      const layer = new LocationsLayer({ positions, renderer: 'vector', accessibleMarkers: false })

      layer.attach(adapter)

      expect(olMapMock.addOverlay).not.toHaveBeenCalled()
    })

    it('creates a button element with stopEvent and center-center positioning', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()
      const layer = new LocationsLayer({ positions, renderer: 'vector' })

      layer.attach(adapter)

      const overlay = olMapMock.addOverlay.mock.calls[0][0]
      expect(overlay.getElement().tagName).toBe('BUTTON')
      expect(overlay.getElement().className).toBe('map-marker-interaction')
      expect(overlay.getPositioning()).toBe('center-center')
    })

    it('labels each button using displayPointLabel when present, else index + 1', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()
      const withDisplayNumber = [{ ...positions[0], displayPointLabel: '42' }, { ...positions[1] }]
      const layer = new LocationsLayer({ positions: withDisplayNumber, renderer: 'vector' })

      layer.attach(adapter)

      const firstButton = olMapMock.addOverlay.mock.calls[0][0].getElement()
      const secondButton = olMapMock.addOverlay.mock.calls[1][0].getElement()

      expect(firstButton.getAttribute('aria-label')).toBe('Location point 42 of 2')
      expect(secondButton.getAttribute('aria-label')).toBe('Location point 2 of 2')
    })

    it('uses a custom markerLabel function when provided', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()
      const markerLabel = jest.fn(() => 'Custom label')
      const layer = new LocationsLayer({ positions, renderer: 'vector', markerLabel })

      layer.attach(adapter)

      expect(markerLabel).toHaveBeenCalledTimes(positions.length)
      const firstButton = olMapMock.addOverlay.mock.calls[0][0].getElement()
      expect(firstButton.getAttribute('aria-label')).toBe('Custom label')
    })

    it('hides marker buttons when the layer is attached with visible: false', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()
      const layer = new LocationsLayer({ positions, renderer: 'vector' })

      layer.attach(adapter, { visible: false })

      const button = olMapMock.addOverlay.mock.calls[0][0].getElement()
      expect(button.style.display).toBe('none')
    })

    it('does not duplicate overlays when attach is called twice', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()
      const layer = new LocationsLayer({ positions, renderer: 'vector' })

      layer.attach(adapter)
      layer.attach(adapter)

      // one removeOverlay call per position (from the second attach's cleanup),
      // and two full sets of addOverlay calls (one per attach)
      expect(olMapMock.removeOverlay).toHaveBeenCalledTimes(positions.length)
      expect(olMapMock.addOverlay).toHaveBeenCalledTimes(positions.length * 2)
    })

    it('removes all marker overlays on detach', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()
      const layer = new LocationsLayer({ positions, renderer: 'vector' })

      layer.attach(adapter)
      const addedOverlays = olMapMock.addOverlay.mock.calls.map((call: any) => call[0])

      layer.detach(adapter)

      expect(olMapMock.removeOverlay).toHaveBeenCalledTimes(positions.length)
      addedOverlays.forEach((overlay: Overlay) => {
        expect(olMapMock.removeOverlay).toHaveBeenCalledWith(overlay)
      })
    })

    it('invokes the map click interaction and dispatches a custom event on button click', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()

      const showAtCoordinate = jest.fn()
      olMapMock.getInteractions.mockReturnValue({
        getArray: () => [{ overlay: { showAtCoordinate } }],
      })

      const target = document.createElement('div')
      olMapMock.getTargetElement.mockReturnValue(target)

      const dispatchSpy = jest.spyOn(target, 'dispatchEvent')

      const layer = new LocationsLayer({ positions, renderer: 'vector' })
      layer.attach(adapter)

      const button = olMapMock.addOverlay.mock.calls[0][0].getElement() as HTMLButtonElement
      button.click()

      expect(showAtCoordinate).toHaveBeenCalledTimes(1)
      expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'em-map:marker:select' }))
    })

    it('does not throw when clicked and no click interaction exists on the map', () => {
      const { adapter, olMapMock } = makeOpenLayersAdapter()
      olMapMock.getInteractions.mockReturnValue({ getArray: () => [] })

      const layer = new LocationsLayer({ positions, renderer: 'vector' })
      layer.attach(adapter)

      const button = olMapMock.addOverlay.mock.calls[0][0].getElement() as HTMLButtonElement

      expect(() => button.click()).not.toThrow()
    })
  })
})
