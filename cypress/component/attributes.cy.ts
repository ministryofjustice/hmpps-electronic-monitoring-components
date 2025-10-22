describe('<moj-map> attributes', () => {
  beforeEach(() => {
    cy.mountMojMap({
      attrs: {
        'csp-nonce': 'x',
        'scale-control': 'bar',
        'zoom-slider': 'true',
        'rotate-control': 'auto-hide',
      },
    })
    cy.wait('@stubMapStyle')
  })

  it('applies host classes based on attributes', () => {
    cy.get('moj-map').should('have.class', 'has-scale-control').and('have.class', 'has-zoom-slider')
  })

  it('toggles rotate class based on rotate-control', () => {
    cy.mountMojMap({ attrs: { 'csp-nonce': 'x', 'rotate-control': 'false' } })
    cy.wait('@stubMapStyle')
    cy.get('moj-map').should('not.have.class', 'has-rotate-control')

    cy.mountMojMap({ attrs: { 'csp-nonce': 'x', 'rotate-control': 'auto-hide' } })
    cy.wait('@stubMapStyle')
    cy.get('moj-map').should('have.class', 'has-rotate-control')
  })

  it('supports  scale-line attribute', () => {
    cy.mountMojMap({ attrs: { 'csp-nonce': 'x', 'scale-line': 'true' } })
    cy.wait('@stubMapStyle')
    cy.get('moj-map').should('have.class', 'has-scale-control')
  })

  it('adds class for DMS location display', () => {
    cy.mountMojMap({ attrs: { 'csp-nonce': 'x', 'location-display': 'dms' } })
    cy.wait('@stubMapStyle')
    cy.get('moj-map').should('have.class', 'has-location-dms')
  })

  it('does not add DMS class for latlon', () => {
    cy.mountMojMap({ attrs: { 'csp-nonce': 'x', 'location-display': 'latlon' } })
    cy.wait('@stubMapStyle')
    cy.get('moj-map').should('not.have.class', 'has-location-dms')
  })

  it('removes classes when controls are disabled', () => {
    cy.mountMojMap({
      attrs: { 'csp-nonce': 'x', 'scale-control': 'false', 'zoom-slider': 'false' },
    })
    cy.wait('@stubMapStyle')
    cy.get('moj-map').should('not.have.class', 'has-scale-control').and('not.have.class', 'has-zoom-slider')
  })
})
