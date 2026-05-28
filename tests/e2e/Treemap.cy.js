const treemap =
  '[{"location":"https://www.github.com/user/project/tree/abc/","directories":[{"location":"https://www.github.com/user/project/tree/abc/js/","directories":[{"location":"https://www.github.com/user/project/tree/abc/js/app/","directories":[],"files":[{"location":"https://www.github.com/user/project/tree/abc/js/app/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/project/tree/abc/js/app/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/doc/:docId\'"},"concepts":[{"name":"doc"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://www.github.com/user/project/tree/abc/js/app/app.js#L3C3L4C4","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"user {\\"user_id\\":userId}"},"concepts":[{"name":"user"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"https://www.github.com/user/project/tree/abc/js/app/app.js#L5C5L6C6","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"USER_ID:userId"},"concepts":[{"name":"user"}],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}],"files":[{"location":"https://www.github.com/user/project/tree/abc/js/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/project/tree/abc/js/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"}]}]}]},{"location":"https://www.github.com/user/projectClone/tree/abc/","directories":[{"location":"https://www.github.com/user/projectClone/tree/abc/js/","directories":[{"location":"https://www.github.com/user/projectClone/tree/abc/js/app/","directories":[],"files":[{"location":"https://www.github.com/user/projectClone/tree/abc/js/app/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L1C1L2C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/doc/:docId\'"},"concepts":[{"name":"doc"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L3C3L4C4","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"user {\\"user_id\\":userId}"},"concepts":[{"name":"user"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L5C5L6C6","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"USER_ID:userId"},"concepts":[{"name":"user"}],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}],"files":[{"location":"https://www.github.com/user/projectClone/tree/abc/js/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/projectClone/tree/abc/js/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"}]}]}]}]' // No need

describe('Treemap', () => {
  it('visits the treemap page and see the starting message', () => {
    // Given - When
    cy.visit('/Treemap')

    // Then
    cy.get('.json-button').should('not.exist') // JSON button invisible
    cy.get('.json-content').should('not.exist') // JSON content empty
    cy.get('.treemap').should('not.exist') // Treemap invisible
    cy.get('.alert-info').contains('Upload a JSON file to start.').should('be.visible') // Starting message visible
  })

  it('visits the treemap page, uploads a JSON file, displays its content, and displays the treemap', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('.alert-info').should('not.exist') // Starting message invisible
    cy.get('.json-button').should('be.visible') // JSON button visible
    cy.get('.json-content').should('not.exist') // JSON content invisible
    cy.get('.json-button').click() // JSON button clicked
    cy.get('.json-content').should('be.visible') // JSON content visible
    cy.get('.json-content')
      .contains('https://www.github.com/user/project/tree/abc/js/app/app.js#L0C0L0C0')
      .should('be.visible') // JSON content element visible
    cy.get('.json-button').click() // JSON button clicked
    cy.get('.json-content').should('not.exist') // JSON content invisible
    cy.get('rect[id="https://www.github.com/user/project/tree/abc/"][type="repository"]')
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '1')
      .and('have.attr', 'descendantsNumber', '7')
    cy.get('rect[id="https://www.github.com/user/project/tree/abc/js/"][type="directory"]')
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '2')
      .and('have.attr', 'descendantsNumber', '6')
    cy.get('rect[id="https://www.github.com/user/project/tree/abc/js/app/"][type="directory"]')
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '1')
      .and('have.attr', 'descendantsNumber', '4')
    cy.get('rect[id="https://www.github.com/user/project/tree/abc/js/app/app.js"][type="file"]')
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '3')
      .and('have.attr', 'descendantsNumber', '3')
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '0')
      .and('have.attr', 'descendantsNumber', '0')
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '0')
      .and('have.attr', 'descendantsNumber', '0')
      .find('circle')
      .should('be.visible')
      .and('have.attr', 'fill', 'hsl(0, 0%, 100%)')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('g')
      .should('be.visible')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('g')
      .find('svg')
      .should('be.visible')
  })

  it('visits the treemap page, tries to upload an invalid files, and displays an error', () => {
    // Given
    cy.visit('/Treemap')
    const textContent = 'This is a text file'
    const blob = new Blob([textContent], { type: 'text/plain' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.txt', 'text/plain')

    // Then
    cy.get('.alert-info').contains('Upload a JSON file to start.').should('be.visible') // Starting message visible
    cy.get('.alert-danger')
      .contains('Invalid JSON file. Please try with a JSON file.') // Error message for invalid JSON visible
      .should('be.visible')
  })

  it('visits the treemap page, tries to upload an unreadable files, and displays an error', () => {
    // Given
    cy.visit('/Treemap')
    const malformedJsonContent = '[{"location": '
    const blob = new Blob([malformedJsonContent], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'malformed.json', 'application/json')

    // Then
    cy.get('.alert-info').contains('Upload a JSON file to start.').should('be.visible') // Starting message visible
    cy.get('.alert-danger').contains('JSON file unreadable. Please try again.').should('be.visible') // Error message for unreadable JSON visible
  })

  it('visits the treemap page, tries to upload an empty files, and displays an error', () => {
    // Given
    cy.visit('/Treemap')
    const textContent = ''
    const blob = new Blob([textContent], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'empty.json', 'application/json')

    // Then
    cy.get('.alert-info').contains('Upload a JSON file to start.').should('be.visible') // Starting message visible
    cy.get('.alert-danger').contains('JSON file unreadable. Please try again.').should('be.visible') // Error message for empty JSON visible
  })

  it('visits the treemap page, tries to upload an unreadable files, retries and then display the treemap', () => {
    // Given
    cy.visit('/Treemap')
    const malformedJsonContent = '[{"location": '
    const blobMalformed = new Blob([malformedJsonContent], { type: 'application/json' })
    const blobOk = new Blob([treemap], { type: 'application/json' })
    cy.uploadFile('input[type="file"]', blobMalformed, 'malformed.json', 'application/json')
    cy.get('.alert-info').contains('Upload a JSON file to start.').should('be.visible') // Starting message invisible
    cy.get('.alert-danger').contains('JSON file unreadable. Please try again.').should('be.visible') // Error message for unreadable JSON invisible

    // When
    cy.uploadFile('input[type="file"]', blobOk, 'test.json', 'application/json')

    // Then
    cy.get('.alert-info').should('not.exist') // Starting message invisible
    cy.get('.alert-danger').should('not.exist') // Error message for unreadable JSON invisible
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, and colors the treemap by technology', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('.settings-button').eq(1).click()
    cy.get(
      '.settings > :nth-child(1) > :nth-child(1) > span > .color-slider > .color-slider-input-display > .color-slider-input'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '180'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(180, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, colors the treemap by technology, and changes the color', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('.settings-button').eq(1).click()
    cy.get(
      '.settings > :nth-child(1) > :nth-child(1) > span > .color-slider > .color-slider-input-display > .color-slider-input'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '180'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(180, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')

    cy.get(
      '.settings > :nth-child(1) > :nth-child(1) > span > .color-slider > .color-slider-input-display > .color-slider-input'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '-1'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(0, 0%, 100%)')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, and colors the treemap by operation', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('.settings-button').eq(1).click()
    cy.get(
      '.settings > :nth-child(3) > :nth-child(1) > span > .color-slider > .color-slider-input-display > .color-slider-input'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '200'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(200, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, colors the treemap by operation, and changes the color', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('.settings-button').eq(1).click()
    cy.get(
      '.settings > :nth-child(3) > :nth-child(1) > span > .color-slider > .color-slider-input-display > .color-slider-input'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '200'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(200, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')

    cy.get(
      '.settings > :nth-child(3) > :nth-child(1) > span > .color-slider > .color-slider-input-display > .color-slider-input'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '-1'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(0, 0%, 100%)')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, and opacifies the code fragment by concept', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('.settings-button').eq(1).click()
    cy.get('.settings-select').eq(4).should('be.visible').click()
    cy.get('.multiselect-dropdown')
      .eq(4)
      .should('be.visible')
      .find('.multiselect-option')
      .eq(1)
      .click()
    cy.get('.multiselect-multiple-label').should('be.visible')
    cy.get('.selected-span').first().should('contain.text', 'doc')
    cy.get('.thin-button').click()
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L3C3L4C4"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '0.05')
    cy.get('.settings-button').eq(1).click()
    cy.get('.metrics-content').eq(0).should('contain.text', '# Code Fragments: 1')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, opacifies the code fragment by concept, and resets', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('.settings-button').eq(1).click()
    cy.get('.settings-select').eq(4).should('be.visible').click()
    cy.get('.multiselect-dropdown')
      .eq(4)
      .should('be.visible')
      .find('.multiselect-option')
      .eq(1) // Select
      .click()
    cy.get('.multiselect-multiple-label').should('be.visible')
    cy.get('.selected-span').first().should('contain.text', 'doc')
    cy.get('.thin-button').click()

    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L3C3L4C4"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '0.05')

    cy.get('.settings-select').eq(4).should('be.visible').click()
    cy.get('.multiselect-dropdown')
      .eq(4)
      .should('be.visible')
      .find('.multiselect-option')
      .eq(1)
      .click() // Unselect
    cy.get('.selected-span').should('have.length', 0)
    cy.get('.thin-button').click()

    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L3C3L4C4"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, shows and unshows the tool tip on code fragment hover', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('.settings-button').eq(1).click()
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
    .trigger('mouseover', { force: true })
    .should('have.class', 'hovered')
    cy.get('.toolTip')
      .should('exist')
      .within(() => {
        cy.get('span').should('have.length', 6)
        cy.get('span')
          .eq(0)
          .should(
            'contain',
            'https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2'
          )
        cy.get('span').eq(1).should('contain', 'javascript-api-express-call')
        cy.get('span').eq(2).should('contain', 'READ')
        cy.get('span').eq(3).should('contain', 'get')
        cy.get('span').eq(4).should('contain', "'/doc/:docId'")
        cy.get('span').eq(5).should('contain', 'doc')
      })
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
    .trigger('mouseout', { force: true })
    .and('not.have.class', 'hovered')
    cy.get('.toolTip').should('not.exist')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, shows and unshows the tool tip on file hover', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get(
      'rect[id="https://www.github.com/user/project/tree/abc/js/app/app.js"][type="file"]'
    )
    .trigger('mouseover', { force: true })
    .should('have.class', 'hovered')
    cy.get('.toolTip')
      .should('exist')
      .within(() => {
        cy.get('span').should('have.length', 1)
        cy.get('span')
          .eq(0)
          .should('contain', 'https://www.github.com/user/project/tree/abc/js/app/app.js')
      })
    cy.get(
      'rect[id="https://www.github.com/user/project/tree/abc/js/app/app.js"][type="file"]'
    )
    .trigger('mouseout', { force: true })
    .and('not.have.class', 'hovered')
    cy.get('.toolTip').should('not.exist')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, shows and unshows the tool tip on directory hover', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('rect[id="https://www.github.com/user/project/tree/abc/js/app/"][type="directory"]')
      .trigger('mouseover', { force: true })
      .should('have.class', 'hovered')
    cy.get('.toolTip')
      .should('exist')
      .within(() => {
        cy.get('span')
          .should('have.length', 1)
          .eq(0)
          .should('contain', 'https://www.github.com/user/project/tree/abc/js/app/')
      })
    cy.get('rect[id="https://www.github.com/user/project/tree/abc/js/app/"][type="directory"]')
      .trigger('mouseout', { force: true })
      .and('not.have.class', 'hovered')
    cy.get('.toolTip').should('not.exist')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, shows and unshows the tool tip on repository hover', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')

    // Then
    cy.get('rect[id="https://www.github.com/user/project/tree/abc/"][type="repository"]')
    .trigger('mouseover', { force: true })
    .should('have.class', 'hovered')
    cy.get('.toolTip')
      .should('exist')
      .within(() => {
        cy.get('span')
          .should('have.length', 1)
          .eq(0)
          .should('contain', 'https://www.github.com/user/project/tree/abc/')
      })
    cy.get(
      'rect[id="https://www.github.com/user/project/tree/abc/"][type="repository"]'
    )
    .trigger('mouseout', { force: true })
    .and('not.have.class', 'hovered')
    cy.get('.toolTip').should('not.exist')
  })

  /*
  it('visits the treemap page, uploads a JSON file, displays the treemap, clicks on a code fragment, follows the link, and gets the border around', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen') // Spy window.open
    })

    // Then
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    ).click({ force: true })
    cy.get('@windowOpen').should(
      'have.been.calledWith',
      'https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2'
    )
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    ).should('have.class', 'clicked')
  })

  it('visits the treemap page, uploads a JSON file, displays the treemap, clicks on a code fragment, follows the link, gets the border around, and removes the border around', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen') // Spy window.open
    })

    // Then
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .click({ force: true })
    cy.get('@windowOpen').should(
      'have.been.calledWith',
      'https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2'
    )
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('have.class', 'clicked')
    cy.get('rect[type="treemap"]').click({ force: true })
    cy.get(
      'g[id="https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('not.have.class', 'clicked')
  })
  */

  it('visits the treemap page, uploads a JSON file, displays the treemap, and checks the metrics', () => {
    // Given
    cy.visit('/Treemap')

    const blob = new Blob([treemap], { type: 'application/json' })

    // When
    cy.uploadFile('input[type="file"]', blob, 'test.json', 'application/json')
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen') // Spy window.open
    })

    // Then
    cy.get('.settings-button').eq(2).click()
    cy.get('.metrics').eq(1).should('be.visible')
    cy.get('.metrics-value').eq(0).should('contain.text', '# Directories: 4')
    cy.get('.metrics-value').eq(1).should('contain.text', '# Files: 4')
    cy.get('.metrics-value').eq(2).should('contain.text', '# Code Fragments: 6')
    cy.get('.metrics-value').eq(3).should('contain.text', '# Concepts: 2')
    cy.get('.metrics-value').eq(4).should('contain.text', 'LoC: 99')
  })
})
