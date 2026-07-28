import type { EmMap } from '@map/scripts/em-map'

describe('<em-map> initialisation', () => {
  beforeEach(() => {
    cy.mountEmMap({ attrs: { 'csp-nonce': 'x' } })
    cy.wait('@stubMapStyle')
  })

  it('injects component CSS with nonce into shadow DOM', () => {
    cy.get('em-map').shadow().find('style').should('have.length.at.least', 1)
    cy.get('em-map').shadow().find('style').first().should('have.attr', 'nonce', 'x')
  })

  it('renders map container and requests Vector tile style', () => {
    cy.get('em-map').should('exist')
    cy.get('em-map').shadow().find('#map').should('exist')
    cy.get('@stubMapStyle').its('response.statusCode').should('eq', 200)
  })

  it('fires the map:ready event once the map is initialised', () => {
    cy.waitForMapReady().then(() => {
      cy.get('em-map').then($el => {
        const el = $el[0] as EmMap
        const map = el.olMapInstance || el.maplibreMapInstance
        console.log(map)
        expect(map, 'map instance should exist').to.exist
      })
    })
  })

  it('renders declarative attribution and sanitizes unsafe links', () => {
    cy.mountEmMap({
      attrs: {
        'csp-nonce': 'x',
        attribution: '<a href="https://example.test">Safe</a> <a href="javascript:alert(1)">Unsafe</a>',
        'attribution-allow-html': '',
      },
    })
    cy.wait('@stubMapStyle')

    cy.get('em-map').shadow().find('.em-map__attribution').should('be.visible')
    cy.get('em-map').shadow().find('.em-map__attribution a').should('have.length', 1)
    cy.get('em-map').shadow().find('.em-map__attribution a').first().should('have.attr', 'href').and('include', 'https://example.test')
    cy.get('em-map').shadow().find('.em-map__attribution').should('contain.text', 'Unsafe')
  })
})
