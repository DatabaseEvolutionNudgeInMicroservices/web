// Component

import Loader from '@/components/Loader.component.vue'

describe('Loader', () => {
  it('initializes correctly', () => {
    // Given - When - Then
    cy.mount(Loader, { props: { visibility: true } })
  })

  it('shows the spinner when the visibility is true', () => {
    // Given - When
    cy.mount(Loader, { props: { visibility: true } })

    // Then
    cy.get('.spinner-border').should('be.visible')
  })

  it('hides the spinner when the visibility is false', () => {
    // Given - When
    cy.mount(Loader, { props: { visibility: false } })

    // Then
    cy.get('.spinner-border').should('not.exist')
  })
})
