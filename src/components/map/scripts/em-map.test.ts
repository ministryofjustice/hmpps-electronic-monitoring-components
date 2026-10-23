import { EmMap } from './em-map'
import * as dom from './helpers/dom'
import { setupOpenLayersMap } from './core/setup/setup-openlayers-map'
import { setupMapLibreMap } from './core/setup/setup-maplibre-map'

const mockOlTargetElement = document.createElement('div')
const mockMapLibreContainer = document.createElement('div')

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
    getTargetElement: jest.fn(() => mockOlTargetElement),
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
  setupMapLibreMap: jest
    .fn()
    .mockResolvedValue({ addLayer: jest.fn(), getContainer: jest.fn(() => mockMapLibreContainer) }),
}))

jest.mock(
  'maplibre-gl',
  () => ({
    Map: jest.fn().mockImplementation(() => ({
      addControl: jest.fn(),
      addLayer: jest.fn(),
      on: jest.fn(),
    })),
  }),
  { virtual: true },
)

const { getMockView } = jest.requireMock('./core/setup/setup-openlayers-map')

describe('EmMap', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
    mockOlTargetElement.innerHTML = ''
    mockMapLibreContainer.innerHTML = ''

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
    emMap.addLayer(fakeLayerById as any)
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

    emMap.addLayer(fakeLayerByTitle as any)
    emMap.removeLayer('tracksLayer')
    expect(detach).toHaveBeenCalledTimes(2) // Called twice for ID and title
  })

  describe('csp-nonce', () => {
    const getMapNonceMock = dom.getMapNonce as jest.Mock

    const mountAndWait = async (emMap: EmMap) => {
      emMap.setAttribute('renderer', 'openlayers')
      emMap.setAttribute('vector-url', 'https://test-vector')
      await new Promise<void>(resolve => {
        emMap.addEventListener('map:ready', () => resolve(), { once: true })
        document.body.appendChild(emMap)
      })
    }

    it('renders the map container and initialises the map without a nonce', async () => {
      getMapNonceMock.mockReturnValue(null)
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      const emMap = document.createElement('em-map') as EmMap

      await mountAndWait(emMap)

      expect(emMap.shadowRoot?.querySelector('#map')).not.toBeNull()
      expect(emMap.olMapInstance?.getTargetElement()).not.toBeNull()
      expect(dom.createScopedStyle).toHaveBeenCalledWith(expect.anything(), null)
      warnSpy.mockRestore()
    })

    it('warns when no nonce is provided', async () => {
      getMapNonceMock.mockReturnValue(null)
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

      await mountAndWait(document.createElement('em-map') as EmMap)

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain('no csp-nonce attribute provided')
      warnSpy.mockRestore()
    })

    it('does not warn when a nonce is provided', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      const emMap = document.createElement('em-map') as EmMap

      await mountAndWait(emMap)

      expect(warnSpy).not.toHaveBeenCalled()
      expect(emMap.shadowRoot?.querySelector('#map')).not.toBeNull()
      expect(dom.createScopedStyle).toHaveBeenCalledWith(expect.anything(), 'test-nonce')
      warnSpy.mockRestore()
    })
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
            { latitude: 0, longitude: 0, precision: 0 },
            { latitude: 1, longitude: 1, precision: 0 },
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

  const mountMap = async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    return emMap
  }

  const twoPoints = [
    { latitude: 0, longitude: 0, precision: 0 },
    { latitude: 1, longitude: 1, precision: 0 },
  ]
  const onePoint = [{ latitude: 1, longitude: 1, precision: 0 }]

  it('fitTo fits a single-point extent with view.fit at zoom 16, honouring padding and maxZoom', async () => {
    const emMap = await mountMap()
    const fitSpy = jest.spyOn(getMockView(), 'fit')

    const result = emMap.fitTo({ targets: [{ type: 'points', points: onePoint }], padding: [10, 20, 30, 40] })
    emMap.fitTo({ targets: [{ type: 'points', points: onePoint }], maxZoom: 12 })

    expect(result).toBe(true)
    expect(fitSpy.mock.calls[0][1]).toMatchObject({ padding: [10, 20, 30, 40], maxZoom: 16, duration: 500 })
    expect(fitSpy.mock.calls[1][1]).toMatchObject({ maxZoom: 12 })
  })

  it('fitTo with animate=false uses view.fit with zero duration, maxZoom and padding', async () => {
    const emMap = await mountMap()
    const view = getMockView()
    const fitSpy = jest.spyOn(view, 'fit')
    const setCenterSpy = jest.spyOn(view, 'setCenter')

    const result = emMap.fitTo({
      animate: false,
      maxZoom: 10,
      padding: [0, 0, 0, 100],
      targets: [{ type: 'points', points: twoPoints }],
    })

    expect(result).toBe(true)
    expect(fitSpy).toHaveBeenCalledTimes(1)
    expect(fitSpy.mock.calls[0][1]).toMatchObject({ duration: 0, maxZoom: 10, padding: [0, 0, 0, 100] })
    expect(setCenterSpy).not.toHaveBeenCalled()
  })

  it('fitTo returns false when there is nothing to fit', async () => {
    const emMap = await mountMap()

    expect(emMap.fitTo({ targets: [{ type: 'points', points: [] }] })).toBe(false)
    expect(emMap.fitToLayer('does-not-exist')).toBe(false)
  })

  it('fitTo resolves extents from a registered layer whose title differs from its id', async () => {
    const emMap = await mountMap()
    const fitSpy = jest.spyOn(getMockView(), 'fit')

    const nativeLayer = { getSource: () => ({ getExtent: () => [0, 0, 100, 100] }) }
    emMap.addLayer({
      id: 'my-layer',
      attach: jest.fn(),
      detach: jest.fn(),
      getNativeLayer: () => [nativeLayer],
      getPrimaryLayer: jest.fn(),
    } as any)

    expect(emMap.fitToLayer('my-layer')).toBe(true)
    expect(fitSpy.mock.calls[0][0]).toEqual([0, 0, 100, 100])
  })

  it('fitTo resolves extents from a registered layer that exposes a single native layer', async () => {
    const emMap = await mountMap()

    emMap.addLayer({
      id: 'single',
      attach: jest.fn(),
      detach: jest.fn(),
      getNativeLayer: () => ({ getSource: () => ({ getExtent: () => [1, 1, 2, 2] }) }),
      getPrimaryLayer: jest.fn(),
    } as any)

    expect(emMap.fitToLayer('single')).toBe(true)
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
            { latitude: 0, longitude: 0, precision: 0 },
            { latitude: 1, longitude: 1, precision: 0 },
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

  it('setAttribution applies runtime text attribution for OpenLayers', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    emMap.setAttribution('Map data provider')

    const attribution = mockOlTargetElement.querySelector('.em-map__attribution') as HTMLElement
    expect(attribution).toBeTruthy()
    expect(attribution.textContent).toBe('Map data provider')
    expect(attribution.hidden).toBe(false)
  })

  it('setAttribution queues value before map is ready', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')

    emMap.setAttribution('Queued attribution')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const attribution = mockOlTargetElement.querySelector('.em-map__attribution') as HTMLElement
    expect(attribution.textContent).toBe('Queued attribution')
  })

  it('setAttribution allows safe hyperlink HTML for MapLibre', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'maplibre')
    emMap.setAttribute('vector-url', 'https://test-vector')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    emMap.setAttribution('<a href="https://example.test">OS Attribution</a>', { allowHtml: true })

    const attribution = mockMapLibreContainer.querySelector('.em-map__attribution') as HTMLElement
    const anchor = attribution.querySelector('a') as HTMLAnchorElement
    expect(anchor).toBeTruthy()
    expect(anchor.getAttribute('href')).toBe('https://example.test/')
    expect(anchor.textContent).toBe('OS Attribution')
  })

  it('applies attribution from HTML attributes on initialization', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')
    emMap.setAttribute('attribution', 'Crown copyright')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const attribution = mockOlTargetElement.querySelector('.em-map__attribution') as HTMLElement
    expect(attribution).toBeTruthy()
    expect(attribution.textContent).toBe('Crown copyright')
    expect(attribution.hidden).toBe(false)
  })

  it('applies HTML attribution from attributes when allow flag is present', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'maplibre')
    emMap.setAttribute('vector-url', 'https://test-vector')
    emMap.setAttribute('attribution', '<a href="https://example.test">OS Link</a>')
    emMap.setAttribute('attribution-allow-html', '')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const attribution = mockMapLibreContainer.querySelector('.em-map__attribution') as HTMLElement
    const anchor = attribution.querySelector('a') as HTMLAnchorElement
    expect(anchor).toBeTruthy()
    expect(anchor.getAttribute('href')).toBe('https://example.test/')
    expect(anchor.textContent).toBe('OS Link')
  })

  it('does not show attribution when only attribution-allow-html is set', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')
    emMap.setAttribute('attribution-allow-html', '')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const attribution = mockOlTargetElement.querySelector('.em-map__attribution')
    expect(attribution).toBeNull()
  })

  it('treats attribution-allow-html="false" as plain text', async () => {
    const emMap = document.createElement('em-map') as EmMap
    emMap.setAttribute('renderer', 'openlayers')
    emMap.setAttribute('vector-url', 'https://test-vector')
    emMap.setAttribute('attribution', '<a href="https://example.test">OS Link</a>')
    emMap.setAttribute('attribution-allow-html', 'false')

    await new Promise<void>(resolve => {
      emMap.addEventListener('map:ready', () => resolve(), { once: true })
      document.body.appendChild(emMap)
    })

    const attribution = mockOlTargetElement.querySelector('.em-map__attribution') as HTMLElement
    const anchor = attribution.querySelector('a')
    expect(anchor).toBeNull()
    expect(attribution.textContent).toContain('OS Link')
  })
})
