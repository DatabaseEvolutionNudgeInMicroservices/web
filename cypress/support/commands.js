Cypress.Commands.add('uploadFile', (selector, file, fileName, mimeType) => {
  cy.get(selector).then((subject) => {
    const testFile = new File([file], fileName, { type: mimeType })
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(testFile)
    const element = subject[0]
    element.files = dataTransfer.files
    cy.wrap(subject).trigger('change', { force: true })
  })
})
