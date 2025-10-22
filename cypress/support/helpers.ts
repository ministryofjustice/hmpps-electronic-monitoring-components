import Map from 'ol/Map'
import type { MapBrowserEvent } from 'ol'
import BaseLayer from 'ol/layer/Base'

export function shouldHaveAlert(containerSelector: string, variant: string, title: string): void {
  cy.get(containerSelector).find(`[aria-label="${variant}: ${title}"]`).should('exist')
}

export function shouldNotHaveAlerts(containerSelector: string): void {
  cy.get(containerSelector).find('.moj-alert').should('have.length', 0)
}

export function shouldShowOverlay(): void {
  cy.get('moj-map').shadow().find('.ol-overlay-container').should('be.visible')
}

export function shouldNotShowOverlay(): void {
  cy.get('moj-map').shadow().find('.ol-overlay-container').should('not.be.visible')
}

// Recursively searches through all OL layers/groups and sub-layers to find a layer with the given title
export function findLayerByTitle(map: Map, title: string): BaseLayer | undefined {
  function walk(layer: BaseLayer): BaseLayer | undefined {
    if (layer.get('title') === title) return layer
    const children =
      (layer as unknown as { getLayers?: () => { getArray?: () => BaseLayer[] } }).getLayers?.().getArray?.() ?? []
    for (const child of children) {
      const found = walk(child)
      if (found) return found
    }
    return undefined
  }
  return walk(map.getLayerGroup())
}

// Create a MapBrowserEvent.
export function makeMapBrowserEvent(
  type: string,
  map: Map,
  options: Partial<MapBrowserEvent<PointerEvent>> = {},
): MapBrowserEvent<PointerEvent> {
  return {
    type,
    map,
    ...options,
  } as unknown as MapBrowserEvent<PointerEvent>
}

// Fire pointer events at a world coordinate on the OL canvas.
export function triggerPointerEventsAt(coordinate: number[], map: Map): void {
  cy.window().then(win => {
    const canvas = map.getViewport().querySelector('canvas')!
    const rect = canvas.getBoundingClientRect()
    const pixel = map.getPixelFromCoordinate(coordinate)
    const clientX = rect.left + pixel[0]
    const clientY = rect.top + pixel[1]

    const events = ['pointerdown', 'pointerup', 'click']
    events.forEach(type => {
      const event = new win.PointerEvent(type, {
        clientX,
        clientY,
        bubbles: true,
        cancelable: true,
        view: win,
      })
      canvas.dispatchEvent(event)
    })
  })
}

// Wait for the next OL postrender and force a render immediately.
// Useful before asserting pixels/features or after changing layers.
export function onNextPostRender(map: Map): Promise<void> {
  return new Promise<void>(resolve => {
    const once = () => {
      map.un('postrender', once as any)
      resolve()
    }
    map.on('postrender', once as any)
    map.render()
  })
}
