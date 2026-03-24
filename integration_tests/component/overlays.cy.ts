import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import { LocationsLayer } from '@map/scripts/core/layers'
import type { EmMap } from '@map/scripts/em-map'
import { triggerPointerEventsAt, findLayerByTitle, shouldShowOverlay, shouldNotShowOverlay } from '../support/helpers'

function waitForMapRender(map: Map) {
  return new Cypress.Promise(resolve => {
    map.once('rendercomplete', resolve)
    map.renderSync()
  })
}

describe('<em-map> overlays (interaction)', () => {
  beforeEach(() => {
    cy.mountEmMap({ attrs: { 'csp-nonce': 'x', 'uses-internal-overlays': '' } })
    cy.wait('@stubMapStyle')
    cy.waitForMapReady()
  })

  it('shows the overlay when a location feature is clicked', () => {
    cy.get('em-map').should('have.attr', 'uses-internal-overlays')

    cy.readFile('src/components/map/fixtures/positions.json').then(positions => {
      cy.get('em-map').then($el => {
        const el = $el[0] as EmMap
        const map = el.olMapInstance as Map

        el.addLayer(new LocationsLayer({ title: 'pointsLayer', positions }))
        map.renderSync()

        const pointsLayer = findLayerByTitle(map, 'pointsLayer') as VectorLayer
        expect(pointsLayer).to.exist

        const feature = pointsLayer.getSource()!.getFeatures()[0]
        const coordinate = feature.getGeometry()!.getCoordinates()

        // wait for render
        cy.window().then(() => waitForMapRender(map))

        // trigger click AFTER render
        cy.window().then(() => {
          triggerPointerEventsAt(coordinate, map)
        })

        shouldShowOverlay()
      })
    })
  })

  it('hides the overlay when clicking on empty map space', () => {
    cy.readFile('src/components/map/fixtures/positions.json').then(positions => {
      cy.get('em-map').then($el => {
        const el = $el[0] as EmMap
        const map = el.olMapInstance as Map

        el.addLayer(new LocationsLayer({ title: 'pointsLayer', positions }))

        const empty: [number, number] = [0, 0]

        // wait for render
        cy.window().then(() => waitForMapRender(map))

        cy.window().then(() => {
          triggerPointerEventsAt(empty, map)
        })

        shouldNotShowOverlay()
      })
    })
  })

  it('hides the overlay when map is clicked outside a feature', () => {
    cy.readFile('src/components/map/fixtures/positions.json').then(positions => {
      cy.get('em-map').then($el => {
        const el = $el[0] as EmMap
        const map = el.olMapInstance as Map

        el.addLayer(new LocationsLayer({ title: 'pointsLayer', positions }))

        const pointsLayer = findLayerByTitle(map, 'pointsLayer') as VectorLayer
        const feature = pointsLayer.getSource()!.getFeatures()[0]
        const onFeature = feature.getGeometry()!.getCoordinates()
        const empty: [number, number] = [0, 0]

        // wait for render
        cy.window().then(() => waitForMapRender(map))

        // click feature
        cy.window().then(() => {
          triggerPointerEventsAt(onFeature, map)
        })
        shouldShowOverlay()

        // click empty space
        cy.window().then(() => {
          triggerPointerEventsAt(empty, map)
        })
        shouldNotShowOverlay()
      })
    })
  })

  it('hides the overlay when the close button is clicked', () => {
    cy.readFile('src/components/map/fixtures/positions.json').then(positions => {
      cy.get('em-map').then($el => {
        const el = $el[0] as EmMap
        const map = el.olMapInstance as Map

        el.addLayer(new LocationsLayer({ title: 'pointsLayer', positions }))

        const pointsLayer = findLayerByTitle(map, 'pointsLayer') as VectorLayer
        const feature = pointsLayer.getSource()!.getFeatures()[0]
        const coordinate = feature.getGeometry()!.getCoordinates()

        // wait for render
        cy.window().then(() => waitForMapRender(map))

        // click feature
        cy.window().then(() => {
          triggerPointerEventsAt(coordinate, map)
        })
        shouldShowOverlay()

        // close overlay
        cy.get('em-map').shadow().find('.app-map__overlay-close').click()

        shouldNotShowOverlay()
      })
    })
  })
})
