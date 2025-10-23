import { shouldHaveAlert, shouldNotHaveAlerts } from '../support/helpers'

describe('<moj-map> alerts slot', () => {
  it('renders alert content when alerts slot is provided', () => {
    const alertHtml = `
      <div slot="alerts" class="moj-map__alerts">
        <div class="moj-alert moj-alert--warning" role="alert" aria-label="Warning: No matching location data">
          <p class="moj-alert__message">Test alert: map data may be incomplete.</p>
        </div>
      </div>
    `

    cy.mountMojMap({
      attrs: { 'csp-nonce': 'x' },
      slots: {
        alerts: Cypress.$(alertHtml).prop('outerHTML'),
      },
    })

    cy.wait('@stubMapStyle')
    shouldHaveAlert('moj-map', 'Warning', 'No matching location data')
  })

  it('does not render alerts when no alerts slot is present', () => {
    cy.mountMojMap({ attrs: { 'csp-nonce': 'x' } })
    cy.wait('@stubMapStyle')
    shouldNotHaveAlerts('moj-map')
  })
})
