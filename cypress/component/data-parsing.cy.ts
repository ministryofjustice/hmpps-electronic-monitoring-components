import type { MojMap } from '@/scripts/moj-map'

describe('<moj-map> API', () => {
  it('parses positions from fixture slot', () => {
    cy.fixture('positions.json').then(positions => {
      cy.mountMojMap({
        attrs: { 'csp-nonce': 'x' },
        slots: { 'position-data': positions },
      })

      cy.wait('@stubMapStyle')
      cy.waitForMapReady()

      cy.get('moj-map').then($el => {
        const el = $el[0] as unknown as MojMap

        // Verify positions loaded from fixture
        expect(el.positions).to.have.length(positions.length)
        expect(el.positions[0]).to.include.keys(['personName', 'personNomisId', 'latitude', 'longitude'])
      })
    })
  })
})
