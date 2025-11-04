import Map from 'ol/Map'

declare global {
  namespace Cypress {
    type MountOpts = {
      attrs?: Record<string, string | boolean>
      slots?: Record<string, unknown>
      autoStub?: boolean
    }

    interface Chainable {
      stubMapMiddleware(): Chainable<void>
      mount(html: string): Chainable<void>
      mountEmMap(opts?: MountOpts): Chainable<void>
      waitForMapReady(): Chainable<void>
      mapPostRenderComplete<T = void>(map: Map, callback: () => T): Chainable<T>
    }
  }
}

export {}
