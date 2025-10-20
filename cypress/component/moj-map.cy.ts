// cypress/component/moj-map.cy.ts
describe('<moj-map>', () => {
  it('renders and dispatches ready event', () => {
    cy.intercept('GET', '/os-map/vector/style', { fixture: 'style.json' }).as('style')

    cy.mount('<moj-map></moj-map>')

    cy.wait('@style')
    cy.get('moj-map').should('exist')
  })
})
