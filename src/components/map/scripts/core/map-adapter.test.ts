import Map from 'ol/Map'
import View from 'ol/View'
import { createMapLibreAdapter, createOpenLayersAdapter } from './map-adapter'

describe('createOpenLayersAdapter', () => {
  let map: Map

  beforeEach(() => {
    map = new Map({ view: new View({ center: [0, 0], zoom: 1 }) })
  })

  it('should return an adapter with mapLibrary set to openlayers', () => {
    const adapter = createOpenLayersAdapter(document.createElement('div'), map)
    expect(adapter.mapLibrary).toBe('openlayers')
  })

  it('should expose the OpenLayers map instance', () => {
    const adapter = createOpenLayersAdapter(document.createElement('div'), map)
    expect(adapter.openlayers?.map).toBe(map)
  })

  it('should project lon/lat to map coords', () => {
    const adapter = createOpenLayersAdapter(document.createElement('div'), map)
    const [x, y] = adapter.project([0, 0])
    // EPSG:3857 projection puts lon=0, lat=0 at 0,0
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(0)
  })

  it('should unproject map coords to lon/lat', () => {
    const adapter = createOpenLayersAdapter(document.createElement('div'), map)
    const [lon, lat] = adapter.unproject([0, 0])
    expect(lon).toBeCloseTo(0)
    expect(lat).toBeCloseTo(0)
  })

  it('should round-trip project/unproject', () => {
    const adapter = createOpenLayersAdapter(document.createElement('div'), map)
    const lonLat: [number, number] = [-0.1, 51.5]
    const coords = adapter.project(lonLat)
    const roundTrip = adapter.unproject(coords)
    expect(roundTrip[0]).toBeCloseTo(lonLat[0], 6)
    expect(roundTrip[1]).toBeCloseTo(lonLat[1], 6)
  })

  it('sets plain-text attribution on the map target', () => {
    const target = document.createElement('div')
    const mapWithTarget = {
      getTargetElement: jest.fn(() => target),
    } as unknown as Map

    const adapter = createOpenLayersAdapter(document.createElement('div'), mapWithTarget)
    adapter.setAttribution('Copyright map provider')

    const attribution = target.querySelector('.em-map__attribution') as HTMLElement
    expect(attribution).toBeTruthy()
    expect(attribution.hidden).toBe(false)
    expect(attribution.textContent).toBe('Copyright map provider')
  })

  it('sanitizes attribution HTML to safe links only', () => {
    const target = document.createElement('div')
    const mapWithTarget = {
      getTargetElement: jest.fn(() => target),
    } as unknown as Map

    const adapter = createOpenLayersAdapter(document.createElement('div'), mapWithTarget)
    adapter.setAttribution('<strong>x</strong> <a href="ftp://example.test">bad</a>', { allowHtml: true })

    const attribution = target.querySelector('.em-map__attribution') as HTMLElement
    expect(attribution.innerHTML).toContain('x')
    expect(attribution.innerHTML).toContain('<a>bad</a>')
    expect(attribution.innerHTML).not.toContain('ftp:')
  })

  it('hides attribution when empty string is set', () => {
    const target = document.createElement('div')
    const mapWithTarget = {
      getTargetElement: jest.fn(() => target),
    } as unknown as Map

    const adapter = createOpenLayersAdapter(document.createElement('div'), mapWithTarget)
    adapter.setAttribution('Shown first')
    adapter.setAttribution('   ')

    const attribution = target.querySelector('.em-map__attribution') as HTMLElement
    expect(attribution.hidden).toBe(true)
  })
})

describe('createMapLibreAdapter', () => {
  it('sets HTML attribution with safe https link', () => {
    const container = document.createElement('div')
    const map = {
      getContainer: jest.fn(() => container),
    } as unknown as import('maplibre-gl').Map

    const adapter = createMapLibreAdapter(document.createElement('div'), map)
    adapter.setAttribution('<a href="https://example.test">Provider</a>', { allowHtml: true })

    const attribution = container.querySelector('.em-map__attribution') as HTMLElement
    const anchor = attribution.querySelector('a') as HTMLAnchorElement
    expect(anchor).toBeTruthy()
    expect(anchor.getAttribute('href')).toBe('https://example.test/')
    expect(anchor.getAttribute('target')).toBe('_blank')
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer')
  })
})
