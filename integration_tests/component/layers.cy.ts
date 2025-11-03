import Map from 'ol/Map'
import CircleStyle from 'ol/style/Circle'
import VectorLayer from 'ol/layer/Vector'
import { CirclesLayer, LocationsLayer, NumberingLayer, TracksLayer } from '@map/scripts/core/layers'
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
          new NumberingLayer({
            title: 'numberingLayer',
            positions,
            visible: true,
            numberProperty: 'sequenceNumber',
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
        const numberingLayer = findLayerByTitle(olMap, 'numberingLayer')

        expect(confidenceLayer, 'Confidence layer should exist').to.exist
        expect(tracksLayer, 'Tracks layer should exist').to.exist
        expect(pointsLayer, 'Points layer should exist').to.exist
        expect(numberingLayer, 'Numbers layer should exist').to.exist

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

      const layer = findLayerByTitle(map, 'locationsLayer') as VectorLayer
      expect(layer, 'LocationsLayer should exist').to.exist
      expect(layer.getVisible(), 'Layer should be visible').to.be.true
      expect(layer.get('title')).to.equal('locationsLayer')

      const source = layer.getSource()
      expect(source, 'Layer source should exist').to.exist
      expect(source!.getFeatures().length, 'Should contain features').to.be.greaterThan(0)

      expect(layer.getZIndex()).to.equal(3)

      const styleFn = layer.getStyleFunction()
      const styles = styleFn!(source!.getFeatures()[0], 1)
      const firstStyle = Array.isArray(styles) ? styles[0] : styles

      expect(firstStyle, 'Style should exist').to.exist

      const image = firstStyle!.getImage() as CircleStyle
      expect(image, 'Style should have an image (circle)').to.exist
      expect(image!.getRadius()).to.equal(10)
      expect(image!.getFill()!.getColor()).to.equal('#008000')
      expect(image!.getStroke()!.getColor()).to.equal('#ffffff')
      expect(image!.getStroke()!.getWidth()).to.equal(4)

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

      const source = layer.getSource()
      expect(source, 'Layer source should exist').to.exist
      expect(source!.getFeatures().length, 'TracksLayer should contain features').to.be.greaterThan(0)

      // Validate zIndex and stroke color style
      expect(layer.getZIndex()).to.equal(5)

      const feature = source!.getFeatures()[0]
      const styleFn = layer.getStyleFunction()!
      const styles = styleFn(feature, 1)
      const firstStyle = Array.isArray(styles) ? styles[0] : styles

      expect(firstStyle, 'Style function should return at least one style').to.exist
      expect(firstStyle!.getStroke()?.getColor()).to.equal('red')

      // Detach and verify removal
      el.removeLayer('tracksLayer')

      // Verify by checking the map’s current layers
      const allTitles = map
        .getLayers()
        .getArray()
        .map(layerByTitle => layerByTitle.get('title'))

      expect(allTitles).to.not.include('tracksLayer')
    })
  })
})

describe('<em-map> NumberingLayer', () => {
  beforeEach(() => {
    cy.stubMapMiddleware()
    cy.readFile('src/components/map/fixtures/positions.json').as('positions')
    cy.mountEmMap({ attrs: { 'csp-nonce': 'x' } })
    cy.wait('@stubMapStyle')
    cy.waitForMapReady()
  })

  it('adds and removes NumberingLayer with correct visibility, zIndex, and text style', function () {
    cy.get('em-map').then($el => {
      const el = $el[0] as EmMap
      const map = el.olMapInstance as Map
      const positions = this.positions as any[]

      const customStyle = {
        fill: '#111111',
        font: 'bold 18px Arial',
        offset: { x: 10, y: 5 },
        stroke: { color: '#eeeeee', width: 3 },
      }

      el.addLayer(
        new NumberingLayer({
          title: 'numberingLayer',
          positions,
          visible: true,
          zIndex: 7,
          numberProperty: 'sequenceNumber',
          style: customStyle,
        }),
      )

      const layer = findLayerByTitle(map, 'numberingLayer') as VectorLayer
      expect(layer, 'NumberingLayer should exist').to.exist
      expect(layer.getVisible(), 'Layer should be visible').to.be.true
      expect(layer.get('title')).to.equal('numberingLayer')
      expect(layer.getZIndex()).to.equal(7)

      const source = layer.getSource()
      expect(source, 'Source should exist').to.exist
      expect(source!.getFeatures().length, 'Should contain features').to.be.greaterThan(0)

      // Validate text style
      const styleFn = layer.getStyleFunction()!
      const feature = source!.getFeatures()[0]
      const styles = styleFn(feature, 1)
      const firstStyle = Array.isArray(styles) ? styles[0] : styles

      expect(firstStyle, 'Style should exist').to.exist
      const textStyle = firstStyle!.getText()
      expect(textStyle, 'Should have a text style').to.exist

      expect(textStyle!.getFont()).to.equal('bold 18px Arial')
      expect(textStyle!.getFill()!.getColor()).to.equal('#111111')
      expect(textStyle!.getStroke()!.getColor()).to.equal('#eeeeee')
      expect(textStyle!.getStroke()!.getWidth()).to.equal(3)
      expect(textStyle!.getOffsetX()).to.equal(10)
      expect(textStyle!.getOffsetY()).to.equal(5)

      // Verify the text value corresponds to the numberProperty
      const textValue = textStyle!.getText()
      expect(textValue, 'Text should show the sequence number').to.match(/^\d+$/)

      // Detach and verify removal
      el.removeLayer('numberingLayer')
      const allTitles = map
        .getLayers()
        .getArray()
        .map(layerByTitle => layerByTitle.get('title'))
      expect(allTitles).to.not.include('numberingLayer')
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

      const customStyle = {
        fill: 'rgba(0, 128, 255, 0.3)',
        stroke: { color: '#0055aa', width: 4 },
      }

      el.addLayer(
        new CirclesLayer({
          title: 'confidenceLayer',
          positions,
          visible: true,
          zIndex: 10,
          style: customStyle,
        }),
      )

      const layer = findLayerByTitle(map, 'confidenceLayer') as VectorLayer
      expect(layer, 'CirclesLayer should exist').to.exist
      expect(layer.getVisible(), 'Layer should be visible').to.be.true
      expect(layer.get('title')).to.equal('confidenceLayer')
      expect(layer.getZIndex()).to.equal(10)

      const source = layer.getSource()
      expect(source, 'Source should exist').to.exist
      expect(source!.getFeatures().length, 'Should contain circle features').to.be.greaterThan(0)

      // Validate style
      const styleFn = layer.getStyleFunction()!
      const feature = source!.getFeatures()[0]
      const styles = styleFn(feature, 1)
      const firstStyle = Array.isArray(styles) ? styles[0] : styles

      expect(firstStyle, 'Style should exist').to.exist
      const fill = firstStyle!.getFill()
      const stroke = firstStyle!.getStroke()

      expect(fill, 'Should have a fill style').to.exist
      expect(fill!.getColor()).to.equal('rgba(0, 128, 255, 0.3)')

      expect(stroke, 'Should have a stroke style').to.exist
      expect(stroke!.getColor()).to.equal('#0055aa')
      expect(stroke!.getWidth()).to.equal(4)

      // Detach and verify removal
      el.removeLayer('confidenceLayer')
      const allTitles = map
        .getLayers()
        .getArray()
        .map(layerByTitle => layerByTitle.get('title'))
      expect(allTitles).to.not.include('confidenceLayer')
    })
  })
})
