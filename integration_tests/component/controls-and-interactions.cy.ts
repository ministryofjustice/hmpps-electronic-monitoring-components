import Map from 'ol/Map'
import View from 'ol/View'
import LocationDisplayControl from '@/components/map/scripts/core/controls/location-display-control'
import MapPointerInteraction from '@/components/map/scripts/core/interactions/map-pointer-interaction'
import { invokePointerHandler } from '../support/helpers'

describe('<em-map> controls & cursor', () => {
  beforeEach(() => {
    cy.mountEmMap({ attrs: { 'scale-control': 'bar', 'zoom-slider': 'true' } })
    cy.wait('@stubMapStyle')
  })

  it('applies control CSS classes and grab cursor by default', () => {
    cy.get('em-map').should('have.class', 'has-scale-control').and('have.class', 'has-zoom-slider')

    cy.get('em-map').shadow().find('#map').should('exist')
  })

  it('disables grab cursor when grab-cursor="false"', () => {
    cy.mountEmMap({
      attrs: {
        'vector-test-url': '/os-map/vector/style',
        'csp-nonce': 'x',
        'grab-cursor': 'false',
      },
    })
    cy.wait('@stubMapStyle')
    cy.get('em-map').should('exist')
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
    expect(text).to.include('°N')
    expect(text).to.include('°E')
    expect(text).to.match(/\d+\.\d+/)
  })

  it('shows coordinate in degrees-minutes-seconds when mode is DMS', () => {
    const control = new LocationDisplayControl({ mode: 'dms', source: 'pointer' })
    map.addControl(control)

    invokePointerHandler(control, 'onPointerMove', map, { coordinate: [100000, 100000] })

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
    invokePointerHandler(interaction, 'handleEvent', mockMap as unknown as Map, { type: 'pointerdown' })
    expect(viewport.style.cursor).to.equal('grabbing')
  })

  it('toggles between grab and grabbing on pointermove', () => {
    invokePointerHandler(interaction, 'handleEvent', mockMap as unknown as Map, {
      type: 'pointermove',
      dragging: false,
    })
    expect(viewport.style.cursor).to.equal('grab')

    invokePointerHandler(interaction, 'handleEvent', mockMap as unknown as Map, {
      type: 'pointermove',
      dragging: true,
    })
    expect(viewport.style.cursor).to.equal('grabbing')
  })

  it('resets to grab on pointerup', () => {
    invokePointerHandler(interaction, 'handleEvent', mockMap as unknown as Map, { type: 'pointerup' })
    expect(viewport.style.cursor).to.equal('grab')
  })
})
