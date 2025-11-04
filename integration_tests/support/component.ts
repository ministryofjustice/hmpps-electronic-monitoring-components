import '@map/scripts/em-map'

type MountOpts = {
  attrs?: Record<string, string | boolean>
  slots?: Record<string, unknown>
  autoStub?: boolean
  syncRender?: boolean
}

Cypress.Commands.add('mapPostRenderComplete', (map, callback) => {
  return cy.wrap(
    new Promise(resolve => {
      map.once('postrender', () => {
        const result = callback()
        resolve(result)
      })

      /**
       * Manually trigger a re-render to ensure the 'rendercomplete' event fires,
       * which in turn dispatches our custom 'map:render:complete' event.
       *
       * Without this, the map may remain in a stable state and not re-render naturally,
       * causing Cypress tests waiting on the event to hang indefinitely.
       */
      map.render()
    }),
    { log: false },
  )
})

// Resolves once <em-map> has initialized and dispatched 'map:ready'
Cypress.Commands.add('waitForMapReady', () => {
  cy.get('em-map').then($el => {
    const el = $el[0] as HTMLElement
    return new Promise<void>(resolve => {
      // If the component has already set its map instance, resolve immediately
      if ((el as any).map || (el as any).olMapInstance || (el as any).maplibreMapInstance) {
        resolve()
      } else {
        el.addEventListener('map:ready', () => resolve(), { once: true })
      }
    })
  })
})

// Middleware Vactor Tile API request stubs
Cypress.Commands.add('stubMapMiddleware', () => {
  cy.intercept('GET', '/os-map/vector/style', {
    statusCode: 200,
    body: {
      version: 8,
      sources: {
        'os-source': { type: 'vector', url: '/os-map/vector/source' },
      },
      layers: [
        { id: 'background', type: 'background', paint: {} },
        { id: 'stub-layer', type: 'fill', source: 'os-source', paint: {} },
      ],
    },
  }).as('stubMapStyle')

  cy.intercept('GET', '/os-map/vector/source', {
    statusCode: 200,
    body: {
      type: 'vector',
      tiles: ['/os-map/vector/tiles/{z}/{x}/{y}.pbf'],
    },
  }).as('stubMapSource')

  cy.intercept('GET', /\/os-map\/vector\/tiles\/.*\.pbf/, {
    statusCode: 200,
    body: '',
  }).as('stubMapTiles')
})

// Mount component
Cypress.Commands.add('mount', (html: string) => {
  cy.document().then(doc => {
    const root = doc.getElementById('cypress-root')
    if (root) root.innerHTML = html
  })
})

// Mounts a <em-map> element with default or custom attributes + slots.
// Automatically calls cy.stubMapMiddleware() unless disabled.
Cypress.Commands.add('mountEmMap', (opts: MountOpts = {}) => {
  const { autoStub = true, attrs = {}, slots = {}, syncRender = true } = opts

  if (autoStub) cy.stubMapMiddleware()

  const el = document.createElement('em-map')

  // Default attributes
  const defaultAttrs: Record<string, string | boolean> = {
    'vector-test-url': '/os-map/vector/style',
    'csp-nonce': 'test-nonce',
  }

  const merged = { ...defaultAttrs, ...attrs }
  Object.entries(merged).forEach(([key, value]) => {
    if (value === false) return
    el.setAttribute(key, value === true ? '' : String(value))
  })

  // Add <script slot="...">
  Object.entries(slots).forEach(([slotName, data]) => {
    const isHtml = typeof data === 'string' && data.trim().startsWith('<')

    if (isHtml) {
      // Attach raw HTML node for non-JSON slots (like alerts)
      const container = document.createElement('div')
      container.setAttribute('slot', slotName)
      container.innerHTML = data
      el.appendChild(container.firstElementChild ?? container)
    } else {
      // Default behaviour for JSON fixtures like position data
      const script = document.createElement('script')
      script.type = 'application/json'
      script.setAttribute('slot', slotName)
      script.textContent = JSON.stringify(data)
      el.appendChild(script)
    }
  })

  // Mount HTML
  cy.mount(el.outerHTML)

  // Optionally wait for map and trigger an initial OL render cycle
  if (syncRender) {
    cy.waitForMapReady()
    cy.get('em-map').then($el => {
      const map = ($el[0] as any).olMapInstance
      if (map?.updateSize) {
        map.updateSize()
        if (typeof map.renderSync === 'function') map.renderSync()
      }
    })
  }
})
