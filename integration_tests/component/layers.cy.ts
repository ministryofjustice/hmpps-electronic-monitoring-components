import Map from 'ol/Map'
import CircleStyle from 'ol/style/Circle'
import VectorLayer from 'ol/layer/Vector'
import { CirclesLayer, LocationsLayer, TextLayer, TracksLayer } from '@map/scripts/core/layers'
import type { EmMap } from '@map/scripts/em-map'
import { findLayerByTitle } from '../support/helpers'

describe('<em-map> layers', () => {
  it('renders and attaches all expected layer types', () => {
    cy.readFile('src/components/map/fixtures/positions.json').then(positions => {
      cy.mountEmMap({
        attrs: { 'csp-nonce': 'x' },
        slots: { 'position-data': positions },
      })

      cy.wait('@stubMapStyle')
      cy.waitForMapReady()

      cy.get('em-map').then($el => {
        const el = $el[0] as EmMap
        const olMap = el.olMapInstance as Map
        expect(olMap, 'OL map should exist').to.exist

        // Attach the layers
        el.addLayer(new LocationsLayer({ title: 'pointsLayer', positions }))
        el.addLayer(new TracksLayer({ title: 'tracksLayer', positions, visible: true }))
        el.addLayer(
          new TextLayer({
            title: 'textLayer',
            positions,
            visible: true,
            textProperty: 'sequenceNumber',
          }),
        )
        el.addLayer(
          new CirclesLayer({
            id: 'circles',
            title: 'circlesLayer',
            positions,
            visible: true,
          }),
        )

        // Verify layers are present
        const confidenceLayer = findLayerByTitle(olMap, 'circlesLayer')
        const tracksLayer = findLayerByTitle(olMap, 'tracksLayer')
        const pointsLayer = findLayerByTitle(olMap, 'pointsLayer') as VectorLayer
        const textLayer = findLayerByTitle(olMap, 'textLayer')

        expect(confidenceLayer, 'Confidence layer should exist').to.exist
        expect(tracksLayer, 'Tracks layer should exist').to.exist
        expect(pointsLayer, 'Points layer should exist').to.exist
        expect(textLayer, 'Text layer should exist').to.exist

        // Verify point features count matches positions data
        const featureCount = pointsLayer.getSource()!.getFeatures().length
        expect(featureCount).to.equal(positions.length)
      })
    })
  })
})

describe('<em-map> LocationsLayer', () => {
  beforeEach(() => {
    cy.stubMapMiddleware()
    cy.readFile('src/components/map/fixtures/positions.json').as('positions')
    cy.mountEmMap({ attrs: { 'csp-nonce': 'x' } })
    cy.wait('@stubMapStyle')
    cy.waitForMapReady()
  })

  it('adds and removes LocationsLayer with correct visibility, zIndex, and style', function () {
    cy.get('em-map').then($el => {
      const el = $el[0] as EmMap
      const map = el.olMapInstance as Map
      const positions = this.positions as any[]

      const customStyle = {
        radius: 10,
        fill: '#008000',
        stroke: { color: '#ffffff', width: 4 },
      }

      el.addLayer(
        new LocationsLayer({
          title: 'locationsLayer',
          positions,
          visible: true,
          zIndex: 3,
          style: customStyle,
        }),
      )

      const layer = findLayerByTitle(map, 'locationsLayer')
      expect(layer).to.exist

      const layerInstance = layer!
      expect(layerInstance.getVisible(), 'Layer should be visible').to.be.true
      expect(layerInstance.get('title')).to.equal('locationsLayer')
      expect(layerInstance.getZIndex()).to.equal(3)

      const source = (layer as any).getSource?.()
      expect(source, 'Layer source should exist').to.exist
      expect(source!.getFeatures().length, 'Should contain features').to.be.greaterThan(0)

      const styleFn = (layer as any).getStyleFunction?.()

      if (styleFn) {
        const styles = styleFn(source.getFeatures()[0], 1)
        const firstStyle = Array.isArray(styles) ? styles[0] : styles

        const image = firstStyle.getImage() as CircleStyle | null
        expect(image).to.exist

        const imageInstance = image!

        const fill = imageInstance.getFill()
        const stroke = imageInstance.getStroke()

        expect(fill).to.exist
        expect(stroke).to.exist

        expect(imageInstance.getRadius()).to.equal(10)
        expect(fill!.getColor()).to.equal('#008000')
        expect(stroke!.getColor()).to.equal('#ffffff')
        expect(stroke!.getWidth()).to.equal(4)
      }

      // Detach and verify removal
      el.removeLayer('locationsLayer')
      const allTitles = map
        .getLayers()
        .getArray()
        .map(layerByTitle => layerByTitle.get('title'))
      expect(allTitles).to.not.include('locationsLayer')
    })
  })
})

describe('<em-map> TracksLayer', () => {
  beforeEach(() => {
    cy.stubMapMiddleware()
    cy.readFile('src/components/map/fixtures/positions.json').as('positions')
    cy.mountEmMap({ attrs: { 'csp-nonce': 'x' } })
    cy.wait('@stubMapStyle')
    cy.waitForMapReady()
  })

  it('adds and removes TracksLayer with correct visibility, zIndex, and style', function () {
    cy.get('em-map').then($el => {
      const el = $el[0] as EmMap
      const map = el.olMapInstance as Map
      const positions = this.positions as any[]
      const customStyle = { stroke: { color: 'red' } }

      el.addLayer(
        new TracksLayer({
          title: 'tracksLayer',
          positions,
          visible: true,
          zIndex: 5,
          style: customStyle,
        }),
      )

      const layer = findLayerByTitle(map, 'tracksLayer') as VectorLayer
      expect(layer, 'TracksLayer should exist').to.exist
      expect(layer.getVisible(), 'TracksLayer visibility should be true').to.be.true
      expect(layer.get('title')).to.equal('tracksLayer')

      const source = (layer as any).getSource?.()
      expect(source.getFeatures().length).to.be.greaterThan(0)

      const styleFn = (layer as any).getStyleFunction?.()

      if (styleFn) {
        const styles = styleFn(source.getFeatures()[0], 1)
        const firstStyle = Array.isArray(styles) ? styles[0] : styles
        expect(firstStyle.getStroke()?.getColor()).to.equal('red')
      }

      el.removeLayer('tracksLayer')
    })
  })
})

describe('<em-map> TextLayer', () => {
  beforeEach(() => {
    cy.stubMapMiddleware()
    cy.readFile('src/components/map/fixtures/positions.json').as('positions')
    cy.mountEmMap({ attrs: { 'csp-nonce': 'x' } })
    cy.wait('@stubMapStyle')
    cy.waitForMapReady()
  })

  it('adds and removes TextLayer with correct visibility, zIndex, and text style', function () {
    cy.get('em-map').then($el => {
      const el = $el[0] as EmMap
      const map = el.olMapInstance as Map
      const positions = this.positions as any[]

      el.addLayer(
        new TextLayer({
          title: 'textLayer',
          positions,
          visible: true,
          zIndex: 7,
          textProperty: 'sequenceNumber',
        }),
      )

      const layer = findLayerByTitle(map, 'textLayer') as VectorLayer
      expect(layer, 'TextLayer should exist').to.exist
      expect(layer.getVisible(), 'Layer should be visible').to.be.true

      const layerInstance = layer!
      expect(layerInstance.getVisible()).to.be.true
      expect(layerInstance.getZIndex()).to.equal(7)

      const source = (layer as any).getSource?.()
      expect(source.getFeatures().length).to.be.greaterThan(0)

      el.removeLayer('textLayer')
    })
  })
})

describe('<em-map> CirclesLayer', () => {
  beforeEach(() => {
    cy.stubMapMiddleware()
    cy.readFile('src/components/map/fixtures/positions.json').as('positions')
    cy.mountEmMap({ attrs: { 'csp-nonce': 'x' } })
    cy.wait('@stubMapStyle')
    cy.waitForMapReady()
  })

  it('adds and removes CirclesLayer with correct visibility, zIndex, and fill/stroke style', function () {
    cy.get('em-map').then($el => {
      const el = $el[0] as EmMap
      const map = el.olMapInstance as Map
      const positions = this.positions as any[]

      el.addLayer(
        new CirclesLayer({
          title: 'confidenceLayer',
          positions,
          visible: true,
          zIndex: 10,
        }),
      )

      const layer = findLayerByTitle(map, 'confidenceLayer') as VectorLayer
      expect(layer, 'CirclesLayer should exist').to.exist
      expect(layer.getVisible(), 'Layer should be visible').to.be.true

      const layerInstance = layer!
      expect(layerInstance.getVisible()).to.be.true
      expect(layerInstance.getZIndex()).to.equal(10)

      const source = (layer as any).getSource?.()
      expect(source.getFeatures().length).to.be.greaterThan(0)

      el.removeLayer('confidenceLayer')
    })
  })
})
