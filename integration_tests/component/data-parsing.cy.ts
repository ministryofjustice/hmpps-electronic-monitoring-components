import type { EmMap } from '@map/scripts/em-map'

describe('<em-map> API', () => {
  it('parses positions from fixture slot', () => {
    cy.readFile('src/components/map/fixtures/positions.json').then(positions => {
      cy.mountEmMap({
        attrs: { 'csp-nonce': 'x' },
        slots: { 'position-data': positions },
      })

      cy.wait('@stubMapStyle')
      cy.waitForMapReady()

      cy.get('em-map').then($el => {
        const el = $el[0] as unknown as EmMap

        // Verify positions loaded from fixture
        expect(el.positions).to.have.length(positions.length)
        expect(el.positions[0]).to.include.keys(['personName', 'personNomisId', 'latitude', 'longitude'])
      })
    })
  })
})
