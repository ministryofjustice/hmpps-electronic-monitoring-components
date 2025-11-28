import { EmMap } from './em-map'
import * as dom from './helpers/dom'
import { setupOpenLayersMap } from './core/setup/setup-openlayers-map'
import { setupMapLibreMap } from './core/setup/setup-maplibre-map'

jest.mock('./helpers/dom', () => ({
  createMapDOM: jest.fn(),
  createScopedStyle: jest.fn(),
  getMapNonce: jest.fn(),
}))

jest.mock('./core/config', () => ({
  default: {
    tiles: {
      urls: {
        vectorStyleUrl: 'https://mock-vector',
      },
      defaultTokenUrl: 'https://mock-token',
    },
  },
}))

jest.mock('./core/setup/setup-openlayers-map', () => ({
  setupOpenLayersMap: jest.fn().mockResolvedValue({ addLayer: jest.fn() }),
}))

jest.mock('./core/setup/setup-maplibre-map', () => ({
  setupMapLibreMap: jest.fn().mockResolvedValue({ addLayer: jest.fn() }),
}))

jest.mock('maplibre-gl', () => ({
  Map: jest.fn().mockImplementation(() => ({
    addControl: jest.fn(),
    addLayer: jest.fn(),
    on: jest.fn(),
  })),
}))

describe('EmMap', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()

    const getMapNonceMock = dom.getMapNonce as jest.Mock
    getMapNonceMock.mockReturnValue('test-nonce')

    const createScopedStyleMock = dom.createScopedStyle as jest.Mock
    createScopedStyleMock.mockImplementation(() => document.createElement('style'))

    const createMapDOMMock = dom.createMapDOM as jest.Mock
    createMapDOMMock.mockImplementation(() => {
      const frag = document.createDocumentFragment()
      const wrapper = document.createElement('div')
      const mapDiv = document.createElement('div')
      mapDiv.id = 'map'
      wrapper.appendChild(mapDiv)
      frag.appendChild(wrapper)
      return frag
    })
  })

  it('uses OpenLayers setup by default and passes expected options', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://attr-vector')
    emMap.setAttribute('access-token-url', 'none')
    emMap.setAttribute('api-key', 'API_KEY')

    const ready = new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
    })

    document.body.appendChild(emMap)
    await ready

    expect(setupOpenLayersMap).toHaveBeenCalledTimes(1)
    const [container, opts] = (setupOpenLayersMap as jest.Mock).mock.calls[0]
    expect(container instanceof HTMLElement).toBe(true)
    expect(opts).toEqual(
      expect.objectContaining({
        vectorUrl: 'https://attr-vector',
        usesInternalOverlays: false,
        controls: expect.any(Object),
      }),
    )
  })

  it('uses MapLibre setup when renderer="maplibre"', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'maplibre')
    emMap.setAttribute('vector-url', 'https://attr-vector')
    emMap.setAttribute('access-token-url', 'none')
    emMap.setAttribute('api-key', 'API_KEY')

    const ready = new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
    })

    document.body.appendChild(emMap)
    await ready

    expect(setupMapLibreMap).toHaveBeenCalledTimes(1)
    const [container, vectorUrl, enable3D] = (setupMapLibreMap as jest.Mock).mock.calls[0]
    expect(container instanceof HTMLElement).toBe(true)
    expect(vectorUrl).toBe('https://attr-vector')
    expect(typeof enable3D).toBe('boolean')
  })

  it('fires map:ready and exposes .map', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://attr-vector')
    emMap.setAttribute('access-token-url', 'none')
    emMap.setAttribute('api-key', 'API_KEY')

    const ready = new Promise<unknown>(resolve => {
      emMap.addEventListener('map:ready', e => resolve((e as CustomEvent).detail.map), { once: true })
    })

    document.body.appendChild(emMap)
    const map = await ready

    expect(map).toBeDefined()
    expect(emMap.map).toBeDefined()
  })

  it('addLayer attaches via adapter, and removeLayer detaches by id or title', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://attr-vector')
    emMap.setAttribute('access-token-url', 'none')
    emMap.setAttribute('api-key', 'API_KEY')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const attach = jest.fn()
    const detach = jest.fn()

    // Remove by ID
    const fakeLayerById = { id: 'test', attach, detach }
    emMap.addLayer(fakeLayerById)
    expect(attach).toHaveBeenCalledTimes(1)
    expect(attach.mock.calls[0][0]).toHaveProperty('mapLibrary', 'openlayers')

    emMap.removeLayer('test')
    expect(detach).toHaveBeenCalledTimes(1)
    expect(detach.mock.calls[0][0]).toHaveProperty('mapLibrary', 'openlayers')

    // Remove by title fallback
    const fakeLayerByTitle = {
      id: 'track',
      attach,
      detach,
      options: { title: 'tracksLayer' },
    }

    emMap.addLayer(fakeLayerByTitle)
    emMap.removeLayer('tracksLayer')
    expect(detach).toHaveBeenCalledTimes(2) // Called twice for ID and title
  })

  it('closeOverlay delegates to featureOverlay.close()', () => {
    const emMap = new EmMap()
    const closeFn = jest.fn()
    Object.defineProperty(emMap, 'featureOverlay', { value: { close: closeFn } })
    emMap.closeOverlay()
    expect(closeFn).toHaveBeenCalled()
  })

  it('passes olRotationMode="right-drag" into OpenLayers control options and applies host class', async () => {
    const emMap = document.createElement('em-map') as EmMap
    const setupOL = setupOpenLayersMap as jest.Mock
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')
    emMap.setAttribute('ol-rotation-mode', 'right-drag')

    const ready = new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
    })

    document.body.appendChild(emMap)

    const [, opts] = setupOL.mock.calls[0]

    expect(opts.controls.olRotationMode).toBe('right-drag')
    expect(emMap.classList.contains('ol-rotation-mode')).toBe(true)
  })

  it('defaults olRotationMode to "default" when no attribute is provided', async () => {
    const emMap = document.createElement('em-map') as EmMap
    const setupOL = setupOpenLayersMap as jest.Mock
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    const ready = new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
    })

    document.body.appendChild(emMap)

    const [, opts] = setupOL.mock.calls[0]

    expect(opts.controls.olRotationMode).toBe('default')
  })

  it('parses ol-rotate-tooltip="false" and applies host class removal', async () => {
    const emMap = document.createElement('em-map') as EmMap
    const setupOL = setupOpenLayersMap as jest.Mock
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')
    emMap.setAttribute('ol-rotate-tooltip', 'false')

    const ready = new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
    })

    document.body.appendChild(emMap)

    const [, opts] = setupOL.mock.calls[0]

    expect(opts.controls.olRotateTooltip).toBe(false)
    expect(emMap.classList.contains('ol-rotate-tooltip')).toBe(false)
  })

  it('defaults olRotateTooltip to true when attribute is missing', async () => {
    const emMap = document.createElement('em-map') as EmMap
    const setupOL = setupOpenLayersMap as jest.Mock
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    const ready = new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
    })

    document.body.appendChild(emMap)

    const [, opts] = setupOL.mock.calls[0]

    expect(opts.controls.olRotateTooltip).toBe(true)
    expect(emMap.classList.contains('ol-rotate-tooltip')).toBe(true)
  })
})
