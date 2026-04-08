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

jest.mock('./core/setup/setup-openlayers-map', () => {
  const mockView = {
    fit: jest.fn(),
    animate: jest.fn(),
    setCenter: jest.fn(),
    setResolution: jest.fn(),
    getResolutionForExtent: jest.fn(() => 123),
    getZoom: jest.fn(() => 10),
  }

  const mockMap = {
    getView: () => mockView,
    getSize: jest.fn(() => [800, 600]),
    getLayers: jest.fn(() => ({
      getArray: jest.fn(() => []),
    })),
  }

  return {
    setupOpenLayersMap: jest.fn().mockResolvedValue(mockMap),
    getMockView: () => mockView,
  }
})

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

const { getMockView } = jest.requireMock('./core/setup/setup-openlayers-map')

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

    new Promise<void>(resolve => {
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

    new Promise<void>(resolve => {
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

    new Promise<void>(resolve => {
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

    new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
    })

    document.body.appendChild(emMap)

    const [, opts] = setupOL.mock.calls[0]

    expect(opts.controls.olRotateTooltip).toBe(true)
    expect(emMap.classList.contains('ol-rotate-tooltip')).toBe(true)
  })

  // Viewport tests
  it('fitTo calls view.fit with merged extent', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const view = getMockView()
    const fitSpy = jest.spyOn(view, 'fit')

    emMap.fitTo({
      targets: [
        {
          type: 'points',
          points: [
            { latitude: 0, longitude: 0 },
            { latitude: 1, longitude: 1 },
          ],
        },
      ],
    })

    expect(fitSpy).toHaveBeenCalledTimes(1)
  })

  it('fitTo does nothing when no valid targets', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const view = getMockView()
    const fitSpy = jest.spyOn(view, 'fit')

    emMap.fitTo({
      targets: [{ type: 'points', points: [] }],
    })

    expect(fitSpy).not.toHaveBeenCalled()
  })

  it('fitTo uses view.animate for a single-point extent', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const view = getMockView()
    const animateSpy = jest.spyOn(view, 'animate')

    emMap.fitTo({
      targets: [{ type: 'points', points: [{ latitude: 1, longitude: 1 }] }],
    })

    expect(animateSpy).toHaveBeenCalledTimes(1)
  })

  it('fitTo with animate=false sets center and resolution directly', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const view = getMockView()

    const setCenterSpy = jest.spyOn(view, 'setCenter')
    const setResolutionSpy = jest.spyOn(view, 'setResolution')
    const fitSpy = jest.spyOn(view, 'fit')

    emMap.fitTo({
      animate: false,
      targets: [
        {
          type: 'points',
          points: [
            { latitude: 0, longitude: 0 },
            { latitude: 1, longitude: 1 },
          ],
        },
      ],
    })

    expect(fitSpy).not.toHaveBeenCalled()
    expect(setCenterSpy).toHaveBeenCalled()
    expect(setResolutionSpy).toHaveBeenCalled()
  })

  it('fitTo passes duration when animate=true', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const view = getMockView()
    const fitSpy = jest.spyOn(view, 'fit')

    emMap.fitTo({
      animate: true,
      durationMs: 999,
      targets: [
        {
          type: 'points',
          points: [
            { latitude: 0, longitude: 0 },
            { latitude: 1, longitude: 1 },
          ],
        },
      ],
    })

    const [, options] = fitSpy.mock.calls[0] as [unknown, { duration?: number }]
    expect(options.duration).toBe(999)
  })

  it('fitTo uses layer extent when target is layer', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const fakeLayer = {
      id: 'test-layer',
      attach: jest.fn(),
      detach: jest.fn(),
      getExtent: jest.fn(() => [0, 0, 100, 100]),
    }

    emMap.addLayer(fakeLayer as any)

    const view = getMockView()
    const fitSpy = jest.spyOn(view, 'fit')

    emMap.fitTo({
      targets: [{ type: 'layer', layerId: 'test-layer' }],
    })

    expect(fakeLayer.getExtent).toHaveBeenCalled()
    expect(fitSpy).toHaveBeenCalled()
  })

  it('fitTo ignores missing layer', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const view = getMockView()
    const fitSpy = jest.spyOn(view, 'fit')

    emMap.fitTo({
      targets: [{ type: 'layer', layerId: 'does-not-exist' }],
    })

    expect(fitSpy).not.toHaveBeenCalled()
  })
})
