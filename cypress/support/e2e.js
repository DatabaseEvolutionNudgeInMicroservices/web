import './commands'

beforeEach(() => {
  // POST /treemap to visualization microservice mock
  cy.intercept('post', '/treemap', {
    statusCode: 200,
    body: {
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
          data: { location: 'https://www.github.com/user/project/tree/abc/' },
          childrenNumber: 1,
          descendantsNumber: 7,
          width: 135,
          height: 107.5,
          x: 7.5,
          y: 7.5,
          children: [
            {
              type: 'directory',
              data: { location: 'https://www.github.com/user/project/tree/abc/js/' },
              childrenNumber: 2,
              descendantsNumber: 6,
              width: 120,
              height: 92.5,
              x: 7.5,
              y: 7.5,
              children: [
                {
                  type: 'directory',
                  data: { location: 'https://www.github.com/user/project/tree/abc/js/app/' },
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
                        location: 'https://www.github.com/user/project/tree/abc/js/app/app.js'
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
                              'https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2',
                            technology: { id: 'javascript-api-express-call' },
                            operation: { name: 'READ' },
                            method: { name: 'get' },
                            sample: { content: "'/doc/:docId'" },
                            concepts: [{ name: 'doc' }],
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
                              'https://www.github.com/user/project/tree/abc/js/app/app.js#L3C3L4C4',
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
                              'https://www.github.com/user/project/tree/abc/js/app/app.js#L5C5L6C6',
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
                  data: { location: 'https://www.github.com/user/project/tree/abc/js/app.js' },
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
          data: { location: 'https://www.github.com/user/projectClone/tree/abc/' },
          childrenNumber: 1,
          descendantsNumber: 7,
          width: 135,
          height: 107.5,
          x: 150,
          y: 7.5,
          children: [
            {
              type: 'directory',
              data: { location: 'https://www.github.com/user/projectClone/tree/abc/js/' },
              childrenNumber: 2,
              descendantsNumber: 6,
              width: 120,
              height: 92.5,
              x: 7.5,
              y: 7.5,
              children: [
                {
                  type: 'directory',
                  data: { location: 'https://www.github.com/user/projectClone/tree/abc/js/app/' },
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
                        location: 'https://www.github.com/user/projectClone/tree/abc/js/app/app.js'
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
                              'https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L1C1L2C2',
                            technology: { id: 'javascript-api-express-call' },
                            operation: { name: 'READ' },
                            method: { name: 'get' },
                            sample: { content: "'/doc/:docId'" },
                            concepts: [{ name: 'doc' }],
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
                              'https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L3C3L4C4',
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
                              'https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L5C5L6C6',
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
                  data: { location: 'https://www.github.com/user/projectClone/tree/abc/js/app.js' },
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
  }).as('mockedRequest')

  cy.intercept('post', '/list/locations', {
    statusCode: 200,
    body: [
      'https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1-L2C2',
      'https://www.github.com/user/project/tree/abc/js/app/app.js#L3C3-L4C4',
      'https://www.github.com/user/project/tree/abc/js/app/app.js#L5C5-L6C6',
      'https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L1C1-L2C2',
      'https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L3C3-L4C4',
      'https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L5C5-L6C6'
    ]
  }).as('mockedRequest')

  cy.intercept('post', '/list/technologies', {
    statusCode: 200,
    body: ['javascript-api-express-call', 'javascript-db-mongo-call', 'javascript-db-redis-call']
  }).as('mockedRequest')

  cy.intercept('post', '/list/operations', {
    statusCode: 200,
    body: ['READ']
  }).as('mockedRequest')

  cy.intercept('post', '/list/methods', {
    statusCode: 200,
    body: ['get', 'find']
  }).as('mockedRequest')

  cy.intercept('post', '/list/concepts', {
    statusCode: 200,
    body: ['user', 'doc']
  }).as('mockedRequest')

  cy.intercept('post', '/metric/number/directories', {
    statusCode: 200,
    body: 4
  }).as('mockedRequest')

  cy.intercept('post', '/metric/number/files', {
    statusCode: 200,
    body: 4
  }).as('mockedRequest')

  cy.intercept('post', '/metric/number/code-fragments', {
    statusCode: 200,
    body: 6
  }).as('mockedRequest')

  cy.intercept('post', '/metric/number/concepts', {
    statusCode: 200,
    body: 2
  }).as('mockedRequest')

  cy.intercept('post', '/metric/breakdown/operations-technologies', {
    statusCode: 200,
    body: {
      static: {
        'javascript-api-express-call': {
          CREATE: 0,
          READ: 2,
          UPDATE: 0,
          DELETE: 0,
          OTHER: 0,
          TOTAL: 2
        },
        'javascript-db-mongo-call': {
          CREATE: 0,
          READ: 2,
          UPDATE: 0,
          DELETE: 0,
          OTHER: 0,
          TOTAL: 2
        },
        'javascript-db-redis-call': {
          CREATE: 0,
          READ: 2,
          UPDATE: 0,
          DELETE: 0,
          OTHER: 0,
          TOTAL: 2
        }
      }
    }
  }).as('mockedRequest')

  cy.intercept('post', '/metric/breakdown/concepts', {
    statusCode: 200,
    body: {
      user: 4,
      doc: 2,
      TOTAL: 6
    }
  }).as('mockedRequest')

  cy.intercept('post', '/metric/loc', {
    statusCode: 200,
    body: 99
  }).as('mockedRequest')

  cy.intercept('post', '/metric/tir', {
    statusCode: 200,
    body: {
      'javascript-api-express-call': 1,
      'javascript-db-mongo-call': 1,
      'javascript-db-redis-call': 1
    }
  }).as('mockedRequest')

  cy.intercept('post', '/metric/cir', {
    statusCode: 200,
    body: {
      user: 1,
      doc: 1
    }
  }).as('mockedRequest')

  cy.intercept('post', '/coupling/similarity/conceptual', {
    statusCode: 200,
    body: {
      concepts: ['user', 'doc'],
      matrix: [
        [4, 0],
        [0, 2]
      ]
    }
  }).as('mockedRequest')

  cy.intercept(
    'post',
    '/coupling/similarity/code-fragment/path/-/technology/-/operation/-/method/-/concepts/doc',
    {
      statusCode: 200,
      body: [
        {
          location: 'https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2',
          technology: { id: 'javascript-api-express-call' },
          operation: { name: 'READ' },
          method: { name: 'get' },
          sample: { content: "'/doc/:docId'" },
          concepts: [{ name: 'doc' }],
          heuristics: 'E1E2E3E4E5E6E7E8',
          score: '8'
        }
      ]
    }
  ).as('mockedRequest')

  cy.intercept(
    'post',
    '/coupling/similarity/code-fragment/path/-/technology/-/operation/-/method/-/concepts/-',
    {
      statusCode: 200,
      body: [
        {
          location: 'https://www.github.com/user/project/tree/abc/js/app/app.js#L1C1L2C2',
          technology: {
            id: 'javascript-api-express-call'
          },
          operation: {
            name: 'READ'
          },
          method: {
            name: 'get'
          },
          sample: {
            content: "'/doc/:docId'"
          },
          concepts: [
            {
              name: 'doc'
            }
          ],
          heuristics: 'E1E2E3E4E5E6E7E8',
          score: '8'
        },
        {
          location: 'https://www.github.com/user/project/tree/abc/js/app/app.js#L3C3L4C4',
          technology: {
            id: 'javascript-db-mongo-call'
          },
          operation: {
            name: 'READ'
          },
          method: {
            name: 'find'
          },
          sample: {
            content: 'user {"user_id":userId}'
          },
          concepts: [
            {
              name: 'user'
            }
          ],
          heuristics: 'M1M2M3M4M5M6',
          score: '6'
        },
        {
          location: 'https://www.github.com/user/project/tree/abc/js/app/app.js#L5C5L6C6',
          technology: {
            id: 'javascript-db-redis-call'
          },
          operation: {
            name: 'READ'
          },
          method: {
            name: 'get'
          },
          sample: {
            content: 'USER_ID:userId'
          },
          concepts: [
            {
              name: 'user'
            }
          ],
          heuristics: 'R1R2R3R4R5R6',
          score: '6'
        },
        {
          location: 'https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L1C1L2C2',
          technology: {
            id: 'javascript-api-express-call'
          },
          operation: {
            name: 'READ'
          },
          method: {
            name: 'get'
          },
          sample: {
            content: "'/doc/:docId'"
          },
          concepts: [
            {
              name: 'doc'
            }
          ],
          heuristics: 'E1E2E3E4E5E6E7E8',
          score: '8'
        },
        {
          location: 'https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L3C3L4C4',
          technology: {
            id: 'javascript-db-mongo-call'
          },
          operation: {
            name: 'READ'
          },
          method: {
            name: 'find'
          },
          sample: {
            content: 'user {"user_id":userId}'
          },
          concepts: [
            {
              name: 'user'
            }
          ],
          heuristics: 'M1M2M3M4M5M6',
          score: '6'
        },
        {
          location: 'https://www.github.com/user/projectClone/tree/abc/js/app/app.js#L5C5L6C6',
          technology: {
            id: 'javascript-db-redis-call'
          },
          operation: {
            name: 'READ'
          },
          method: {
            name: 'get'
          },
          sample: {
            content: 'USER_ID:userId'
          },
          concepts: [
            {
              name: 'user'
            }
          ],
          heuristics: 'R1R2R3R4R5R6',
          score: '6'
        }
      ]
    }
  ).as('mockedRequest')
})
