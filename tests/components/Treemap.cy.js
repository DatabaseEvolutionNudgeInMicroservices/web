// Component

import Treemap from '@/components/Treemap.component.vue'

// Data
let jsonData = {
  type: 'treemap',
  data: {},
  childrenNumber: 2,
  descendantsNumber: 16,
  width: 292.5,
  height: 122.5,
  x: 0,
  y: 0,
  children: [
    {
      type: 'repository',
      data: { location: 'https://www.github.com/user/project/blob/master/' },
      childrenNumber: 1,
      descendantsNumber: 7,
      width: 135,
      height: 107.5,
      x: 7.5,
      y: 7.5,
      children: [
        {
          type: 'directory',
          data: { location: 'https://www.github.com/user/project/blob/master/js/' },
          childrenNumber: 2,
          descendantsNumber: 6,
          width: 120,
          height: 92.5,
          x: 7.5,
          y: 7.5,
          children: [
            {
              type: 'directory',
              data: { location: 'https://www.github.com/user/project/blob/master/js/app/' },
              childrenNumber: 1,
              descendantsNumber: 4,
              width: 77.5,
              height: 77.5,
              x: 7.5,
              y: 7.5,
              children: [
                {
                  type: 'file',
                  data: {
                    location: 'https://www.github.com/user/project/blob/master/js/app/app.js'
                  },
                  childrenNumber: 3,
                  descendantsNumber: 3,
                  width: 62.5,
                  height: 62.5,
                  x: 7.5,
                  y: 7.5,
                  children: [
                    {
                      type: 'codeFragment',
                      data: {
                        location:
                          'https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2',
                        technology: { id: 'javascript-api-express-call' },
                        operation: { name: 'READ' },
                        method: { name: 'get' },
                        sample: { content: "'/user/:userId'" },
                        concepts: [{ name: 'user' }],
                        heuristics: 'E1E2E3E4E5E6E7E8',
                        score: '8'
                      },
                      childrenNumber: 0,
                      descendantsNumber: 0,
                      width: 20,
                      height: 20,
                      x: 7.5,
                      y: 7.5,
                      children: [],
                      color: '#FFFFFF',
                      opacity: '1'
                    },
                    {
                      type: 'codeFragment',
                      data: {
                        location:
                          'https://www.github.com/user/project/blob/master/js/app/app.js#L3C3L4C4',
                        technology: { id: 'javascript-db-mongo-call' },
                        operation: { name: 'READ' },
                        method: { name: 'find' },
                        sample: { content: 'user {"user_id":userId}' },
                        concepts: [{ name: 'user' }],
                        heuristics: 'M1M2M3M4M5M6',
                        score: '6'
                      },
                      childrenNumber: 0,
                      descendantsNumber: 0,
                      width: 20,
                      height: 20,
                      x: 35,
                      y: 7.5,
                      children: [],
                      color: '#FFFFFF',
                      opacity: '1'
                    },
                    {
                      type: 'codeFragment',
                      data: {
                        location:
                          'https://www.github.com/user/project/blob/master/js/app/app.js#L5C5L6C6',
                        technology: { id: 'javascript-db-redis-call' },
                        operation: { name: 'READ' },
                        method: { name: 'get' },
                        sample: { content: 'USER_ID:userId' },
                        concepts: [{ name: 'user' }],
                        heuristics: 'R1R2R3R4R5R6',
                        score: '6'
                      },
                      childrenNumber: 0,
                      descendantsNumber: 0,
                      width: 20,
                      height: 20,
                      x: 7.5,
                      y: 35,
                      children: [],
                      color: '#FFFFFF',
                      opacity: '1'
                    }
                  ],
                  color: '#FFFFFF',
                  opacity: '0.25'
                }
              ],
              color: '#000000',
              opacity: '0.05'
            },
            {
              type: 'file',
              data: { location: 'https://www.github.com/user/project/blob/master/js/app.js' },
              childrenNumber: 0,
              descendantsNumber: 0,
              width: 20,
              height: 20,
              x: 92.5,
              y: 7.5,
              children: [],
              color: '#FFFFFF',
              opacity: '0.25'
            }
          ],
          color: '#000000',
          opacity: '0.05'
        }
      ],
      color: '#000000',
      opacity: '0.05'
    },
    {
      type: 'repository',
      data: { location: 'https://www.github.com/user/projectClone/blob/master/' },
      childrenNumber: 1,
      descendantsNumber: 7,
      width: 135,
      height: 107.5,
      x: 150,
      y: 7.5,
      children: [
        {
          type: 'directory',
          data: { location: 'https://www.github.com/user/projectClone/blob/master/js/' },
          childrenNumber: 2,
          descendantsNumber: 6,
          width: 120,
          height: 92.5,
          x: 7.5,
          y: 7.5,
          children: [
            {
              type: 'directory',
              data: { location: 'https://www.github.com/user/projectClone/blob/master/js/app/' },
              childrenNumber: 1,
              descendantsNumber: 4,
              width: 77.5,
              height: 77.5,
              x: 7.5,
              y: 7.5,
              children: [
                {
                  type: 'file',
                  data: {
                    location: 'https://www.github.com/user/projectClone/blob/master/js/app/app.js'
                  },
                  childrenNumber: 3,
                  descendantsNumber: 3,
                  width: 62.5,
                  height: 62.5,
                  x: 7.5,
                  y: 7.5,
                  children: [
                    {
                      type: 'codeFragment',
                      data: {
                        location:
                          'https://www.github.com/user/projectClone/blob/master/js/app/app.js#L1C1L2C2',
                        technology: { id: 'javascript-api-express-call' },
                        operation: { name: 'READ' },
                        method: { name: 'get' },
                        sample: { content: "'/user/:userId'" },
                        concepts: [{ name: 'user' }],
                        heuristics: 'E1E2E3E4E5E6E7E8',
                        score: '8'
                      },
                      childrenNumber: 0,
                      descendantsNumber: 0,
                      width: 20,
                      height: 20,
                      x: 7.5,
                      y: 7.5,
                      children: [],
                      color: '#FFFFFF',
                      opacity: '1'
                    },
                    {
                      type: 'codeFragment',
                      data: {
                        location:
                          'https://www.github.com/user/projectClone/blob/master/js/app/app.js#L3C3L4C4',
                        technology: { id: 'javascript-db-mongo-call' },
                        operation: { name: 'READ' },
                        method: { name: 'find' },
                        sample: { content: 'user {"user_id":userId}' },
                        concepts: [{ name: 'user' }],
                        heuristics: 'M1M2M3M4M5M6',
                        score: '6'
                      },
                      childrenNumber: 0,
                      descendantsNumber: 0,
                      width: 20,
                      height: 20,
                      x: 35,
                      y: 7.5,
                      children: [],
                      color: '#FFFFFF',
                      opacity: '1'
                    },
                    {
                      type: 'codeFragment',
                      data: {
                        location:
                          'https://www.github.com/user/projectClone/blob/master/js/app/app.js#L5C5L6C6',
                        technology: { id: 'javascript-db-redis-call' },
                        operation: { name: 'READ' },
                        method: { name: 'get' },
                        sample: { content: 'USER_ID:userId' },
                        concepts: [{ name: 'user' }],
                        heuristics: 'R1R2R3R4R5R6',
                        score: '6'
                      },
                      childrenNumber: 0,
                      descendantsNumber: 0,
                      width: 20,
                      height: 20,
                      x: 7.5,
                      y: 35,
                      children: [],
                      color: '#FFFFFF',
                      opacity: '1'
                    }
                  ],
                  color: '#FFFFFF',
                  opacity: '0.25'
                }
              ],
              color: '#000000',
              opacity: '0.05'
            },
            {
              type: 'file',
              data: { location: 'https://www.github.com/user/projectClone/blob/master/js/app.js' },
              childrenNumber: 0,
              descendantsNumber: 0,
              width: 20,
              height: 20,
              x: 92.5,
              y: 7.5,
              children: [],
              color: '#FFFFFF',
              opacity: '0.25'
            }
          ],
          color: '#000000',
          opacity: '0.05'
        }
      ],
      color: '#000000',
      opacity: '0.05'
    }
  ],
  color: '#000000',
  opacity: '0.05'
}
let technologiesList = [
  'javascript-api-express-call',
  'javascript-db-mongo-call',
  'javascript-db-redis-call'
]
let operationsList = ['READ']
let conceptsList = ['user', 'doc']

describe('Treemap', () => {
  it('initializes correctly', () => {
    // Given - When - Then
    cy.mount(Treemap, {
      props: {
        treemap: jsonData
      }
    })
  })

  it('shows the treemap', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('rect[id="https://www.github.com/user/project/blob/master/"][type="repository"]')
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '1')
      .and('have.attr', 'descendantsNumber', '7')
    cy.get('rect[id="https://www.github.com/user/project/blob/master/js/"][type="directory"]')
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '2')
      .and('have.attr', 'descendantsNumber', '6')
    cy.get('rect[id="https://www.github.com/user/project/blob/master/js/app/"][type="directory"]')
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '1')
      .and('have.attr', 'descendantsNumber', '4')
    cy.get('rect[id="https://www.github.com/user/project/blob/master/js/app/app.js"][type="file"]')
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '3')
      .and('have.attr', 'descendantsNumber', '3')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .and('have.attr', 'childrenNumber', '0')
      .and('have.attr', 'descendantsNumber', '0')
      .find('circle')
      .should('be.visible')
      .and('have.attr', 'fill', 'hsl(0, 0%, 100%)')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('g')
      .should('be.visible')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('g')
      .find('svg')
      .should('be.visible')
  })

  it('creates color pickers per technology', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get(
      '.settings > :nth-child(1) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    ).should('be.visible')
    cy.get(
      '.settings > :nth-child(1) > :nth-child(2) > span > .color > .color-slider-display > .color-slider'
    ).should('be.visible')
    cy.get(
      '.settings > :nth-child(1) > :nth-child(3) > span > .color > .color-slider-display > .color-slider'
    ).should('be.visible')
  })

  it('colors the code fragments by technology', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get(
      '.settings > :nth-child(1) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '180'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(180, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('colors the code fragments by technology and resets it to white', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get(
      '.settings > :nth-child(1) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '180'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(180, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      '.settings > :nth-child(1) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '-1'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(0, 0%, 100%)')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('colors the code fragments by technology and changes the color', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get(
      '.settings > :nth-child(1) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '180'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(180, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      '.settings > :nth-child(1) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '100'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(100, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('creates color picker per operation', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get(
      '.settings > :nth-child(3) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    ).should('be.visible')
  })

  it('colors the code fragments by operation', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get(
      '.settings > :nth-child(3) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '200'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(200, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('colors the code fragments by operation and changes the color', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get(
      '.settings > :nth-child(3) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '10'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(10, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')

    cy.get(
      '.settings > :nth-child(3) > :nth-child(1) > span > .color > .color-slider-display > .color-slider'
    )
      .should('be.visible')
      .then(($el) => {
        const event = new Event('input', { bubbles: true, cancelable: true })
        $el[0].value = '20'
        $el[0].dispatchEvent(event)
      })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill', 'hsl(20, 100%, 75%)')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('creates dropdown list for concepts', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get('select')
      .should('be.visible')
      .find('option')
      .should('have.length', 3)
      .then((options) => {
        expect(options[0]).to.have.text('')
        expect(options[1]).to.have.text('user')
        expect(options[2]).to.have.text('doc')
      })
  })

  it('opaces code fragments by data concept', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get('select').select('user')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L3C3L4C4"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('opaces code fragments by data concept and changes', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get('select').select('user')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L3C3L4C4"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
    cy.get('select').select('doc')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '0.05')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L3C3L4C4"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '0.05')
  })

  it('de-opace code fragments by data concept', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('.settings-button').click()
    cy.get('select').select('doc')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '0.05')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L3C3L4C4"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '0.05')
    cy.get('select').select('')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L3C3L4C4"][type="codeFragment"]'
    )
      .find('circle')
      .and('have.attr', 'fill-opacity', '1')
  })

  it('shows and unshows the tooltip on code fragment hover', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    ).trigger('mouseover', { force: true })
    cy.get('.toolTip')
      .should('be.visible')
      .within(() => {
        cy.get('span').should('have.length', 6)
        cy.get('span')
          .eq(0)
          .should(
            'contain',
            'https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2'
          )
        cy.get('span').eq(1).should('contain', 'javascript-api-express-call')
        cy.get('span').eq(2).should('contain', 'READ')
        cy.get('span').eq(3).should('contain', 'get')
        cy.get('span').eq(4).should('contain', "'/user/:userId'")
        cy.get('span').eq(5).should('contain', 'user')
      })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .and('have.class', 'hovered')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    ).trigger('mouseout', { force: true })

    cy.get('.toolTip').should('not.exist')
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .and('not.have.class', 'hovered')
  })

  it('shows and unshows the tooltip on file hover', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get(
      'rect[id="https://www.github.com/user/project/blob/master/js/app/app.js"][type="file"]'
    ).trigger('mouseover', { force: true })
    cy.get('.toolTip')
      .should('be.visible')
      .within(() => {
        cy.get('span').should('have.length', 1)
        cy.get('span')
          .eq(0)
          .should('contain', 'https://www.github.com/user/project/blob/master/js/app/app.js')
      })
    cy.get('rect[id="https://www.github.com/user/project/blob/master/js/app/app.js"][type="file"]')
      .should('be.visible')
      .and('have.class', 'hovered')
    cy.get(
      'rect[id="https://www.github.com/user/project/blob/master/js/app/app.js"][type="file"]'
    ).trigger('mouseout', { force: true })
    cy.get('.toolTip').should('not.exist')
    cy.get('rect[id="https://www.github.com/user/project/blob/master/js/app/app.js"][type="file"]')
      .should('be.visible')
      .and('not.have.class', 'hovered')
  })

  it('shows and unshows the tooltip on directory hover', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('rect[id="https://www.github.com/user/project/blob/master/js/app/"][type="directory"]')
      .should('be.visible')
      .trigger('mouseover', { force: true })

    cy.get('.toolTip')
      .should('be.visible')
      .within(() => {
        cy.get('span')
          .should('have.length', 1)
          .eq(0)
          .should('contain', 'https://www.github.com/user/project/blob/master/js/app/')
      })
    cy.get('rect[id="https://www.github.com/user/project/blob/master/js/app/"][type="directory"]')
      .should('be.visible')
      .and('have.class', 'hovered')
    cy.get(
      'rect[id="https://www.github.com/user/project/blob/master/js/app/"][type="directory"]'
    ).trigger('mouseout', { force: true })
    cy.get('.toolTip').should('not.exist')
    cy.get('rect[id="https://www.github.com/user/project/blob/master/js/app/"][type="directory"]')
      .should('be.visible')
      .and('not.have.class', 'hovered')
  })

  it('shows and unshows the tooltip on repository hover', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    // Then
    cy.get('rect[id="https://www.github.com/user/project/blob/master/"][type="repository"]')
      .should('be.visible')
      .trigger('mouseover', { force: true })

    cy.get('.toolTip')
      .should('be.visible')
      .within(() => {
        cy.get('span')
          .should('have.length', 1)
          .eq(0)
          .should('contain', 'https://www.github.com/user/project/blob/master/')
      })
    cy.get('rect[id="https://www.github.com/user/project/blob/master/"][type="repository"]')
      .should('be.visible')
      .and('have.class', 'hovered')
    cy.get(
      'rect[id="https://www.github.com/user/project/blob/master/"][type="repository"]'
    ).trigger('mouseout', { force: true })
    cy.get('.toolTip').should('not.exist')
    cy.get('rect[id="https://www.github.com/user/project/blob/master/"][type="repository"]')
      .should('be.visible')
      .and('not.have.class', 'hovered')
  })

  it('clicks on a code fragment, follows the link, and gets the border around', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen') // Spy window.open
    })
    // Then
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .click({ force: true })
    cy.get('@windowOpen').should(
      'have.been.calledWith',
      'https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2'
    )
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .and('have.class', 'clicked')
  })

  it('clicks on a code fragment, gets the border around, and removes the border around', () => {
    // Given - When
    cy.mount(Treemap, {
      props: {
        treemap: jsonData,
        technologies: technologiesList,
        operations: operationsList,
        concepts: conceptsList
      }
    })
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen') // Spy window.open
    })
    // Then
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .click({ force: true })
    cy.get('@windowOpen').should(
      'have.been.calledWith',
      'https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2'
    )
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .and('have.class', 'clicked')
    cy.get('rect[type="treemap"]').click({ force: true })
    cy.get(
      'g[id="https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2"][type="codeFragment"]'
    )
      .should('be.visible')
      .and('not.have.class', 'clicked')
  })
})
