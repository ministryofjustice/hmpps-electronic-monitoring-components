describe('<moj-map> renderer attribute', () => {
  it('uses MapLibre when renderer="maplibre"', () => {
    cy.mountMojMap({
      attrs: { renderer: 'maplibre', 'enable-3d-buildings': '' },
    })
    cy.wait('@stubMapStyle')
    cy.get('moj-map').should('have.attr', 'renderer', 'maplibre')
  })
})

describe('<moj-map> renderer attribute', () => {
  beforeEach(() => {
    cy.mountMojMap({
      attrs: {
        renderer: 'maplibre',
        'enable-3d-buildings': '',
      },
    })
    cy.wait('@stubMapStyle')
  })

  it('uses MapLibre when renderer="maplibre"', () => {
    cy.get('moj-map').should('have.attr', 'renderer', 'maplibre').and('exist')
  })
})
