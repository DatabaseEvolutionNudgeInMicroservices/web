// Component

import UserMessage from '@/components/UserMessage.component.vue'

describe('Message', () => {
  it('initializes correctly', () => {
    // Given - When - Then
    cy.mount(UserMessage, { props: { message: 'Alert', type: 'danger' } })
  })

  it('shows "Alert" with the correct color', () => {
    // Given - When
    cy.mount(UserMessage, { props: { message: 'Alert', type: 'danger' } })

    // Then
    cy.get('.alert-danger').should('contain', 'Alert')
  })
})
