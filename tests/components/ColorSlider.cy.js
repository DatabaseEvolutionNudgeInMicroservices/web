// Component

import ColorSlider from '@/components/ColorSlider.component.vue'

describe('Color slider', () => {
  it('initializes correctly', () => {
    // Given - When - Then
    cy.mount(ColorSlider, { props: { label: '' } })
  })

  it('returns label', () => {
    // Given - When
    cy.mount(ColorSlider, { props: { label: 'Color' } })

    // Then
    cy.get('.label').contains('Color').should('be.visible')
  })

  it('shows the default color', () => {
    // Given - When
    cy.mount(ColorSlider, { props: { label: 'Color' } })

    // Then
    cy.get('.color-display')
      .should('have.css', 'background-color')
      .and('contain', 'rgb(255, 255, 255)')
  })

  it('changes color when slider is moved', () => {
    // Given
    cy.mount(ColorSlider, { props: { label: 'Color' } })

    // When
    cy.get('.color-slider').invoke('val', 100).trigger('input')

    // Then
    cy.get('.color-display')
      .should('have.css', 'background-color')
      .and('contain', 'rgb(170, 255, 128)')
  })

  it('resets color when slider is moved to the extreme left', () => {
    // Given
    cy.mount(ColorSlider, { props: { label: 'Color' } })

    // When
    cy.get('.color-slider').invoke('val', -1).trigger('input')

    // Then
    cy.get('.color-display')
      .should('have.css', 'background-color')
      .and('contain', 'rgb(255, 255, 255)')
  })
})
