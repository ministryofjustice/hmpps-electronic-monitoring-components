describe('<em-map> renderer attribute', () => {
  it('uses MapLibre when renderer="maplibre"', () => {
    cy.mountEmMap({
      attrs: { renderer: 'maplibre', 'enable-3d-buildings': '' },
    })
    cy.wait('@stubMapStyle')
    cy.get('em-map').should('have.attr', 'renderer', 'maplibre')
  })
})

describe('<em-map> renderer attribute', () => {
  beforeEach(() => {
    cy.mountEmMap({
      attrs: {
        renderer: 'maplibre',
        'enable-3d-buildings': '',
      },
    })
    cy.wait('@stubMapStyle')
  })

  it('uses MapLibre when renderer="maplibre"', () => {
    cy.get('em-map').should('have.attr', 'renderer', 'maplibre').and('exist')
  })
})
