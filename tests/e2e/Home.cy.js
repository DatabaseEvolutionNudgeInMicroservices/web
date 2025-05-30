describe('Home', () => {
  it('visits the app home and read the title "Welcome to DENIM"', () => {
    // Given - When
    cy.visit('/')

    // Then
    cy.contains('h1', 'Welcome to DENIM') // Header text visible
  })

  it('visits the app home and see a button "Get started"', () => {
    // Given - When
    cy.visit('/')

    // Then
    cy.get('.btn-dark').should('exist').and('contain', 'Get started') // Button "Get started" visible
  })

  it('visits a random page and click on the button "Get started"', () => {
    // Given
    cy.visit('/')

    // When
    cy.get('.btn-dark').click()

    // Then
    cy.url().should('include', '/Treemap') // Redirection button "Get started" active
  })
})
