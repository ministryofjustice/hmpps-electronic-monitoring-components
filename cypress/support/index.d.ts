declare namespace Cypress {
  interface Chainable {
    mount(html: string): Chainable<Element>
  }
}
