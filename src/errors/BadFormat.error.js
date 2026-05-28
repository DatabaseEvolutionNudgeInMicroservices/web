// Helpers

import { BAD_FORMAT } from '@/helpers/Text.helper'

/**
 * @overview Represents a bad format error.
 */
export class BadFormat extends Error {
  constructor(message) {
    super()
    this.name = BAD_FORMAT
    this.message = message !== undefined ? message : ''
  }
}
