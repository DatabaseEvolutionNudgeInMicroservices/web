// Helpers

import TextHeader from '@/components/TextHeader.component.vue'

describe('Text header', () => {
  it('initializes correctly', () => {
    // Given - When - Then
    cy.mount(TextHeader, { props: { message: 'My text' } })
  })

  it('shows "My text"', () => {
    // Given - When
    cy.mount(TextHeader, { props: { message: 'My text' } })

    // Then
    cy.get('h1').should('contain', 'My text')
  })
})
