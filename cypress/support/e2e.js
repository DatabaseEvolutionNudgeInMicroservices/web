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
                  data: {
                    location: 'https://www.github.com/user/projectClone/blob/master/js/app/'
                  },
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
                        location:
                          'https://www.github.com/user/projectClone/blob/master/js/app/app.js'
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
                  data: {
                    location: 'https://www.github.com/user/projectClone/blob/master/js/app.js'
                  },
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

  cy.intercept('post', '/technologies', {
    statusCode: 200,
    body: ['javascript-api-express-call', 'javascript-db-mongo-call', 'javascript-db-redis-call']
  }).as('mockedRequest')

  cy.intercept('post', '/operations', {
    statusCode: 200,
    body: ['READ']
  }).as('mockedRequest')

  cy.intercept('post', '/concepts', {
    statusCode: 200,
    body: ['user', 'doc']
  }).as('mockedRequest')
})
