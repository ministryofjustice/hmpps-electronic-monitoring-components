import type { MojMap } from '@/scripts/moj-map'

describe('<moj-map> initialisation', () => {
  beforeEach(() => {
    cy.mountMojMap({ attrs: { 'csp-nonce': 'x' } })
    cy.wait('@stubMapStyle')
  })

  it('injects component CSS with nonce into shadow DOM', () => {
    cy.get('moj-map').shadow().find('style').should('have.length.at.least', 1)
    cy.get('moj-map').shadow().find('style').first().should('have.attr', 'nonce', 'x')
  })

  it('renders map container and requests Vector tile style', () => {
    cy.get('moj-map').should('exist')
    cy.get('moj-map').shadow().find('#map').should('exist')
    cy.get('@stubMapStyle').its('response.statusCode').should('eq', 200)
  })

  it('fires the map:ready event once the map is initialised', () => {
    cy.waitForMapReady().then(() => {
      cy.get('moj-map').then($el => {
        const el = $el[0] as MojMap
        const map = el.olMapInstance || el.maplibreMapInstance
        console.log(map)
        expect(map, 'map instance should exist').to.exist
      })
    })
  })
})
