describe('Page not found', () => {
  it('visits a random page and read the title "Error 404"', () => {
    // Given - When
    cy.visit('/404')

    // Then
    cy.contains('h1', 'Error 404') // Header text visible
  })

  it('visits a random page and see a button "Back"', () => {
    // Given - When
    cy.visit('/404')

    // Then
    cy.get('.btn-dark').should('exist').and('contain', 'Back') // Button "Back" visible
  })

  it('visits a random page and click on the button "Back"', () => {
    // Given - When
    cy.visit('/404')

    // When
    cy.get('.btn-dark').click()

    // Then
    cy.url().should('include', '/') // Redirection button "Back" visible
  })
})
