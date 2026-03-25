import Map from 'ol/Map'
import { LocationsLayer } from '@map/scripts/core/layers'
import type { EmMap } from '@map/scripts/em-map'

describe('<em-map> viewport', () => {
  beforeEach(() => {
    cy.stubMapMiddleware()
    cy.mountEmMap({ attrs: { 'csp-nonce': 'x' } })
    cy.wait('@stubMapStyle')
    cy.waitForMapReady()
  })

  it('fitToPoints moves the map to include all points', () => {
    const points = [
      { latitude: 51.5, longitude: -0.1 },
      { latitude: 51.6, longitude: -0.12 },
    ]

    cy.get('em-map').then($el => {
      const el = $el[0] as EmMap
      const map = el.olMapInstance as Map
      const view = map.getView()

      const initialCenter = view.getCenter()

      el.fitToPoints(points, { animate: false })

      const newCenter = view.getCenter()

      expect(newCenter, 'Centre should change after fitToPoints').to.not.deep.equal(initialCenter)
    })
  })

  it('fitToLayer fits the map to a layer extent', () => {
    cy.readFile('src/components/map/fixtures/positions.json').then(positions => {
      cy.get('em-map').then($el => {
        const el = $el[0] as EmMap
        const map = el.olMapInstance as Map
        const view = map.getView()

        el.addLayer(
          new LocationsLayer({
            id: 'pointsLayer',
            title: 'pointsLayer',
            positions,
          }),
        )

        el.fitToLayer('pointsLayer', { animate: false })

        const center = view.getCenter()
        const zoom = view.getZoom()

        expect(center, 'Centre should be defined after fitToLayer').to.exist
        expect(zoom, 'Zoom should be defined after fitToLayer').to.be.a('number')

        const layer = el.getLayer('pointsLayer') as any
        const extent = layer.getExtent()

        expect(center, 'Centre should be defined after fitToLayer').to.exist

        if (!center) {
          throw new Error('Expected centre to be defined')
        }

        expect(center[0], 'Centre X within extent').to.be.within(extent[0], extent[2])
        expect(center[1], 'Centre Y within extent').to.be.within(extent[1], extent[3])
      })
    })
  })

  it('fitToAllLayers fits the map to all layers combined', () => {
    cy.readFile('src/components/map/fixtures/positions.json').then(positions => {
      const subset = positions.slice(0, 2)

      cy.get('em-map').then($el => {
        const el = $el[0] as EmMap
        const map = el.olMapInstance as Map
        const view = map.getView()

        el.addLayer(new LocationsLayer({ title: 'layer1', positions }))
        el.addLayer(new LocationsLayer({ title: 'layer2', positions: subset }))

        const initialCenter = view.getCenter()

        el.fitToAllLayers({ animate: false })

        const newCenter = view.getCenter()

        expect(newCenter, 'Centre should change after fitting all layers').to.not.deep.equal(initialCenter)
      })
    })
  })

  it('fitToPoints with animate=false updates immediately', () => {
    const points = [
      { latitude: 51.5, longitude: -0.1 },
      { latitude: 51.6, longitude: -0.12 },
    ]

    cy.get('em-map').then($el => {
      const el = $el[0] as EmMap
      const map = el.olMapInstance as Map
      const view = map.getView()

      const initialCenter = view.getCenter()

      el.fitToPoints(points, { animate: false })

      const newCenter = view.getCenter()

      expect(newCenter, 'Centre should update immediately when animate=false').to.not.deep.equal(initialCenter)
    })
  })
})
