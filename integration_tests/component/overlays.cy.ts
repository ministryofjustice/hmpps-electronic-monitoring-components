import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import { LocationsLayer } from '@map/scripts/core/layers'
import type { EmMap } from '@map/scripts/em-map'
import { triggerPointerEventsAt, findLayerByTitle, shouldShowOverlay, shouldNotShowOverlay } from '../support/helpers'

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
        const el = $el[0] as unknown as EmMap
        const map = el.olMapInstance as unknown as Map

        el.addLayer(new LocationsLayer({ title: 'pointsLayer', positions }))
        map.renderSync()

        const pointsLayer = findLayerByTitle(map, 'pointsLayer') as VectorLayer
        expect(pointsLayer, 'pointsLayer should exist').to.not.equal(undefined)

        const feature = pointsLayer.getSource()!.getFeatures()[0]
        const coordinate = feature.getGeometry()!.getCoordinates()

        const pixel = map.getPixelFromCoordinate(coordinate)
        expect(pixel, 'pixel should be a valid coordinate').to.not.equal(null)

        const featureAtPixel = map.forEachFeatureAtPixel(pixel, f => f)
        expect(featureAtPixel, 'a feature should exist at the given pixel').to.not.equal(undefined)

        triggerPointerEventsAt(coordinate, map)
        shouldShowOverlay()
      })
    })
  })

  it('hides the overlay when clicking on empty map space', () => {
    cy.readFile('src/components/map/fixtures/positions.json').then(positions => {
      cy.get('em-map').then($el => {
        const el = $el[0] as unknown as EmMap
        const map = el.olMapInstance as unknown as Map

        el.addLayer(new LocationsLayer({ title: 'pointsLayer', positions }))

        const empty: [number, number] = [0, 0]
        const pixel = map.getPixelFromCoordinate(empty)
        expect(pixel, 'pixel should be valid').to.not.equal(null)
        const featureAtPixel = map.forEachFeatureAtPixel(pixel!, f => f)
        expect(featureAtPixel, 'no feature should be at this pixel').to.equal(undefined)

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
        const el = $el[0] as unknown as EmMap
        const map = el.olMapInstance as unknown as Map

        el.addLayer(new LocationsLayer({ title: 'pointsLayer', positions }))
        map.renderSync()

        const pointsLayer = findLayerByTitle(map, 'pointsLayer') as VectorLayer
        const feature = pointsLayer.getSource()!.getFeatures()[0]
        const onFeature = feature.getGeometry()!.getCoordinates()
        const empty: [number, number] = [0, 0]

        cy.window().then(() => {
          triggerPointerEventsAt(onFeature, map)
        })
        shouldShowOverlay()

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
        const el = $el[0] as unknown as EmMap
        const map = el.olMapInstance as unknown as Map

        el.addLayer(new LocationsLayer({ title: 'pointsLayer', positions }))
        map.renderSync()

        const pointsLayer = findLayerByTitle(map, 'pointsLayer') as VectorLayer
        const feature = pointsLayer.getSource()!.getFeatures()[0]
        const coordinate = feature.getGeometry()!.getCoordinates()

        cy.window().then(() => {
          triggerPointerEventsAt(coordinate, map)
        })
        shouldShowOverlay()

        cy.get('em-map').shadow().find('.app-map__overlay-close').click()
        shouldNotShowOverlay()
      })
    })
  })
})
