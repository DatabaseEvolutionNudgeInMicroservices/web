/**
 * @overview Represents a bad operation error.
 */
import { BAD_OPERATION } from '@/helpers/Text.helper.js'

export class BadOperation extends Error {
  constructor(message) {
    super()
    this.name = BAD_OPERATION
    this.message = message !== undefined ? message : ''
  }
}
