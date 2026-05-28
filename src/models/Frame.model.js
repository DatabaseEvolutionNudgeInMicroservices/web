// Model

import { Technology } from '@/models/Technology.model.js'
import { Operation } from '@/models/Operation.model.js'

// Error

import { BadFormat } from '@/errors/BadFormat.error.js'
import { INPUT_INCORRECTLY_FORMATTED } from '@/helpers/Text.helper'

/**
 * @overview This class represents the view model of a function/method call.
 */
export class Frame {
  /**
   * Constructor for the Frame model.
   * @param location {string} The location string.
   * @param timestamp {number} The timestamp of the frame.
   * @param technology {Technology} The database technology of the call
   * (e.g., 'javascript-db-redis-call' or 'javascript-db-mongo-call').
   * @param operation {Operation} The database operation category performed in the call
   * (e.g., 'CREATE', 'READ', 'UPDATE', 'DELETE', 'OTHER' or '?').
   * @param argumentValues {[any]} The values passed to the called function or method.
   * @param heuristics {string} The heuristics used for identifying the code fragment.
   */
  constructor(location, timestamp, technology, operation, argumentValues, heuristics) {
    this.location = location
    this.timestamp = timestamp
    this.technology = technology
    this.operation = operation
    // Avoids defining an argumentValues property as undefined (no argumentValues property)
    if (argumentValues) {
      this.argumentValues = argumentValues
    }
    this.heuristics = heuristics
  }

  getLocation() {
    return this.location
  }

  getTimestamp() {
    return this.timestamp
  }

  getArgumentValues() {
    return this.argumentValues
  }

  getTechnology() {
    return Technology.revive(this.technology)
  }

  getOperation() {
    return Operation.revive(this.operation)
  }

  getHeuristics() {
    return this.heuristics
  }

  setColor(color) {
    if (!color || typeof color !== 'string') {
      throw new BadFormat(`${INPUT_INCORRECTLY_FORMATTED}: invalid color value`)
    }
    this.color = color
  }

  getColor() {
    return this.color
  }

  /**
   * Revives a Frame object.
   * @param object {Object} The given JavaScript object.
   * @return {Frame} The related Frame object.
   * @throws {Error} In the case of an invalid object format.
   */
  static revive(object) {
    if (
      object &&
      // Mandatory fields
      object.hasOwnProperty('location') &&
      object.location &&
      object.hasOwnProperty('timestamp') &&
      object.timestamp &&
      object.hasOwnProperty('technology') &&
      object.technology &&
      object.hasOwnProperty('operation') &&
      object.operation &&
      object.hasOwnProperty('heuristics') &&
      object.heuristics
    ) {
      return new Frame(
        object.location,
        object.timestamp,
        Technology.revive(object.technology),
        Operation.revive(object.operation),
        object?.argumentValues,
        object.heuristics
      )
    } else {
      throw new BadFormat(`${INPUT_INCORRECTLY_FORMATTED}`)
    }
  }

  toString() {
    return JSON.stringify(this)
  }
}
