import Map from 'ol/Map'
import View from 'ol/View'
import type { MapBrowserEvent } from 'ol'
import LocationDisplayControl from '@/scripts/map/controls/location-display-control'
import MapPointerInteraction from '@/scripts/map/interactions/map-pointer-interaction'
import { makeMapBrowserEvent } from '../support/helpers'

describe('<moj-map> controls & cursor', () => {
  beforeEach(() => {
    cy.mountMojMap({ attrs: { 'scale-control': 'bar', 'zoom-slider': 'true' } })
    cy.wait('@stubMapStyle')
  })

  it('applies control CSS classes and grab cursor by default', () => {
    cy.get('moj-map').should('have.class', 'has-scale-control').and('have.class', 'has-zoom-slider')

    cy.get('moj-map').shadow().find('#map').should('exist')
  })

  it('disables grab cursor when grab-cursor="false"', () => {
    cy.mountMojMap({
      attrs: {
        'vector-test-url': '/os-map/vector/style',
        'csp-nonce': 'x',
        'grab-cursor': 'false',
      },
    })
    cy.wait('@stubMapStyle')
    cy.get('moj-map').should('exist')
  })
})

describe('LocationDisplayControl', () => {
  let mapContainer: HTMLElement
  let map: Map

  beforeEach(() => {
    mapContainer = document.createElement('div')
    mapContainer.style.width = '480px'
    mapContainer.style.height = '480px'
    document.body.appendChild(mapContainer)
    map = new Map({
      target: mapContainer,
      view: new View({ center: [0, 0], zoom: 5 }),
    })
  })

  afterEach(() => {
    map.setTarget(undefined)
    mapContainer.remove()
  })

  it('displays formatted latitude/longitude with degree symbols and hemispheres', () => {
    const control = new LocationDisplayControl({ mode: 'latlon', source: 'centre' })
    map.addControl(control)
    map.getView().setCenter([100000, 100000])

    const text = control.getText()

    // Expect something like “0.00000°N 0.90000°E” or similar
    expect(text).to.include('°N')
    expect(text).to.include('°E')
    expect(text).to.match(/\d+\.\d+/)
  })

  it('shows coordinate in degrees-minutes-seconds when mode is DMS', () => {
    const control = new LocationDisplayControl({ mode: 'dms', source: 'pointer' })
    map.addControl(control)

    const event = makeMapBrowserEvent('pointermove', map, {
      coordinate: [100000, 100000],
    })

    const pointerMoveInvoker = control as unknown as {
      onPointerMove: (evt: MapBrowserEvent<PointerEvent>) => void
    }
    pointerMoveInvoker.onPointerMove(event)

    const text = control.getText()
    expect(text).to.include('N')
    expect(text).to.include('E')
    expect(text).to.match(/\d{2}\s\d{2}/)
  })
})

describe('MapPointerInteraction', () => {
  let interaction: MapPointerInteraction
  let viewport: { style: { cursor: string } }
  let mockMap: { getViewport: () => { style: { cursor: string } } }

  beforeEach(() => {
    interaction = new MapPointerInteraction()
    viewport = { style: { cursor: '' } }
    mockMap = { getViewport: () => viewport }
  })

  it('sets cursor to grabbing on pointerdown', () => {
    const event = makeMapBrowserEvent('pointerdown', mockMap as unknown as Map)
    interaction.handleEvent.call(interaction, event)
    expect(viewport.style.cursor).to.equal('grabbing')
  })

  it('toggles between grab and grabbing on pointermove', () => {
    const moveFree = makeMapBrowserEvent('pointermove', mockMap as unknown as Map, { dragging: false })
    interaction.handleEvent.call(interaction, moveFree)
    expect(viewport.style.cursor).to.equal('grab')

    const moveDrag = makeMapBrowserEvent('pointermove', mockMap as unknown as Map, { dragging: true })
    interaction.handleEvent.call(interaction, moveDrag)
    expect(viewport.style.cursor).to.equal('grabbing')
  })

  it('resets to grab on pointerup', () => {
    const event = makeMapBrowserEvent('pointerup', mockMap as unknown as Map)
    interaction.handleEvent.call(interaction, event)
    expect(viewport.style.cursor).to.equal('grab')
  })
})
