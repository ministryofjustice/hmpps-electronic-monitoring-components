import '@/scripts/moj-map.ts'

Cypress.Commands.add('mount', (html: string) => {
  cy.document().then(doc => {
    const root = doc.getElementById('cypress-root')
    if (root) root.innerHTML = html
  })
})
