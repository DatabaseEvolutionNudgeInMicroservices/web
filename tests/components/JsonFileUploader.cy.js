// Component

import JsonFileUploader from '@/components/JsonFileUploader.component.vue'

// Helpers

import { INVALID_JSON, UNREADABLE_JSON } from '@/helpers/Text.helper'

describe('Json file uploader', () => {
  it('initializes correctly', () => {
    // Given - When - Then
    cy.mount(JsonFileUploader)
    cy.get('.json-button').should('not.exist')
    cy.get('.json-content').contains('null')
  })

  it('uploads a JSON file and returns its content', () => {
    // Given
    cy.mount(JsonFileUploader)
    const jsonContent = { name: 'Test name', type: 'Test type', content: 'Test content' }
    const blob = new Blob([JSON.stringify(jsonContent)], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('.json-button').should('be.visible')
    cy.get('.json-content').parent().should('have.class', 'd-none')
    cy.get('.json-button').click()
    cy.get('.json-content').parent().should('not.have.class', 'd-none')
    cy.get('.json-content').contains('"name": "Test name"').should('be.visible')
    cy.get('.json-content').contains('"type": "Test type"').should('be.visible')
    cy.get('.json-content').contains('"content": "Test content"').should('be.visible')
    cy.get('.json-button').click()
    cy.get('.json-content').parent().should('have.class', 'd-none')
  })

  it('uploads an invalid JSON file and returns an error', () => {
    // Given
    cy.mount(JsonFileUploader)

    // When
    const textContent = 'This is a text file'
    const blob = new Blob([textContent], { type: 'text/plain' })

    // Then
    cy.uploadFile('input[type="file"]', blob, 'test.txt', 'text/plain')
    cy.get('.alert-danger').contains(INVALID_JSON).should('be.visible')
  })

  it('uploads an unreadable JSON file and returns an error', () => {
    // Given
    cy.mount(JsonFileUploader)

    // When
    const malformedJsonContent = '{"name": "Test name", "type":'
    const blob = new Blob([malformedJsonContent], { type: 'application/json' })

    // Then
    cy.uploadFile('input[type="file"]', blob, 'malformed.json', 'application/json')
    cy.get('.alert-danger').contains(UNREADABLE_JSON).should('be.visible')
  })
})
