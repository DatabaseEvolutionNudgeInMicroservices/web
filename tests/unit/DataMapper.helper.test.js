// Libraries

import { describe, it, expect } from 'vitest'

// Helper

import { DataMapper } from '@/helpers/DataMapper.helper'

// Model

import { Treemap } from '@/models/Treemap.model'

// Error

import { BadFormat } from '@/errors/BadFormat.error'

const treemap = new Treemap(
  'treemap',
  {},
  2,
  16,
  292.5,
  122.5,
  0,
  0,
  [
    new Treemap(
      'repository',
      { location: 'https://www.github.com/user/project/blob/master/' },
      1,
      7,
      135,
      107.5,
      7.5,
      7.5,
      [
        new Treemap(
          'directory',
          { location: 'https://www.github.com/user/project/blob/master/js/' },
          2,
          6,
          120,
          92.5,
          7.5,
          7.5,
          [
            new Treemap(
              'directory',
              { location: 'https://www.github.com/user/project/blob/master/js/app/' },
              1,
              4,
              77.5,
              77.5,
              7.5,
              7.5,
              [
                new Treemap(
                  'file',
                  {
                    location: 'https://www.github.com/user/project/blob/master/js/app/app.js'
                  },
                  3,
                  3,
                  62.5,
                  62.5,
                  7.5,
                  7.5,
                  [
                    new Treemap(
                      'codeFragment',
                      {
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
                      0,
                      0,
                      20,
                      20,
                      7.5,
                      7.5,
                      [],
                      '#FFFFFF',
                      '1'
                    ),
                    new Treemap(
                      'codeFragment',
                      {
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
                      0,
                      0,
                      20,
                      20,
                      35,
                      7.5,
                      [],
                      '#FFFFFF',
                      '1'
                    ),
                    new Treemap(
                      'codeFragment',
                      {
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
                      0,
                      0,
                      20,
                      20,
                      7.5,
                      35,
                      [],
                      '#FFFFFF',
                      '1'
                    )
                  ],
                  '#FFFFFF',
                  '0.25'
                )
              ],
              '#000000',
              '0.05'
            ),
            new Treemap(
              'file',
              { location: 'https://www.github.com/user/project/blob/master/js/app.js' },
              0,
              0,
              20,
              20,
              92.5,
              7.5,
              [],
              '#FFFFFF',
              '0.25'
            )
          ],
          '#000000',
          '0.05'
        )
      ],
      '#000000',
      '0.05'
    ),
    new Treemap(
      'repository',
      { location: 'https://www.github.com/user/projectClone/blob/master/' },
      1,
      7,
      135,
      107.5,
      150,
      7.5,
      [
        new Treemap(
          'directory',
          { location: 'https://www.github.com/user/projectClone/blob/master/js/' },
          2,
          6,
          120,
          92.5,
          7.5,
          7.5,
          [
            new Treemap(
              'directory',
              { location: 'https://www.github.com/user/projectClone/blob/master/js/app/' },
              1,
              4,
              77.5,
              77.5,
              7.5,
              7.5,
              [
                new Treemap(
                  'file',
                  {
                    location: 'https://www.github.com/user/projectClone/blob/master/js/app/app.js'
                  },
                  3,
                  3,
                  62.5,
                  62.5,
                  7.5,
                  7.5,
                  [
                    new Treemap(
                      'codeFragment',
                      {
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
                      0,
                      0,
                      20,
                      20,
                      7.5,
                      7.5,
                      [],
                      '#FFFFFF',
                      '1'
                    ),
                    new Treemap(
                      'codeFragment',
                      {
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
                      0,
                      0,
                      20,
                      20,
                      35,
                      7.5,
                      [],
                      '#FFFFFF',
                      '1'
                    ),
                    new Treemap(
                      'codeFragment',
                      {
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
                      0,
                      0,
                      20,
                      20,
                      7.5,
                      35,
                      [],
                      '#FFFFFF',
                      '1'
                    )
                  ],
                  '#FFFFFF',
                  '0.25'
                )
              ],
              '#000000',
              '0.05'
            ),
            new Treemap(
              'file',
              { location: 'https://www.github.com/user/projectClone/blob/master/js/app.js' },
              0,
              0,
              20,
              20,
              92.5,
              7.5,
              [],
              '#FFFFFF',
              '0.25'
            )
          ],
          '#000000',
          '0.05'
        )
      ],
      '#000000',
      '0.05'
    )
  ],
  '#000000',
  '0.05'
)

describe('Data mapper helper', function () {
  // ---------------------------------------------------------------
  // Color
  // ---------------------------------------------------------------

  it('colors code fragments by technology id', function () {
    // Given
    let dataMapper = new DataMapper()

    // When

    let treemapObject = dataMapper.colorTreemap(treemap, (item) => {
      if (
        item.getType() === 'codeFragment' &&
        item.getData().technology.id === 'javascript-api-express-call'
      ) {
        item.setColor('#EEEEEE')
      }
    })

    // Then
    expect(
      treemapObject
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getColor()
    ).toEqual('#EEEEEE')
    expect(
      treemapObject
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[1]
        .getColor()
    ).toEqual('#FFFFFF')
  })

  it('colors code fragments by operation name', function () {
    // Given
    let dataMapper = new DataMapper()

    // When

    let treemapObject = dataMapper.colorTreemap(treemap, (item) => {
      if (item.getType() === 'codeFragment' && item.getData().operation.name === 'READ') {
        item.setColor('#EEEEEE')
      }
    })

    // Then
    expect(
      treemapObject
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getColor()
    ).toEqual('#EEEEEE')
    expect(
      treemapObject
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[1]
        .getColor()
    ).toEqual('#EEEEEE')
    expect(
      treemapObject
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[2]
        .getColor()
    ).toEqual('#EEEEEE')
  })

  it('opace code fragments by concept name', function () {
    // Given
    let dataMapper = new DataMapper()
    let conceptName = 'project'

    // When

    let treemapObject = dataMapper.colorTreemap(treemap, (item) => {
      if (item.getType() === 'codeFragment') {
        if (
          conceptName.length !== 0 &&
          item.getData().concepts.filter((concept) => concept.name === conceptName).length === 0
        ) {
          item.setOpacity('0.05')
        } else {
          item.setOpacity('1')
        }
      }
      return item
    })

    // Then
    expect(
      treemapObject
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getOpacity()
    ).toEqual('0.05')
    expect(
      treemapObject
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[0]
        .getChildren()[1]
        .getOpacity()
    ).toEqual('0.05')
  })

  it('tries to color code fragments by technology id when treemap is undefined', function () {
    // Given
    let dataMapper = new DataMapper()

    // When Then
    expect(() => {
      dataMapper.colorTreemap(undefined, (item) => {
        if (
          item.getType() === 'codeFragment' &&
          item.getData().technology.id === 'javascript-api-express-call'
        ) {
          item.setColor('#EEEEEE')
        }
      })
    }).toThrow(new BadFormat())
  })

  it('tries to color code fragments by technology id when treemap is null', function () {
    // Given
    let dataMapper = new DataMapper()

    // When Then
    expect(() => {
      dataMapper.colorTreemap(null, (item) => {
        if (
          item.getType() === 'codeFragment' &&
          item.getData().technology.id === 'javascript-api-express-call'
        ) {
          item.setColor('#EEEEEE')
        }
      })
    }).toThrow(new BadFormat())
  })

  it('tries to color code fragments by technology id when colorization function is null', function () {
    // Given
    let dataMapper = new DataMapper()

    // When Then
    expect(() => {
      dataMapper.colorTreemap(treemap, null).toThrow(new BadFormat())
    })
  })
})
