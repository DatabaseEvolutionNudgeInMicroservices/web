// Error

import { BadFormat } from '@/errors/BadFormat.error.js'

/**
 * @overview This class represents a treemap, from the most atomic one to composed ones.
 */
export class Treemap {
  /**
   * Instantiates a treemap.
   */
  constructor(
    type,
    data,
    childrenNumber,
    descendantsNumber,
    width,
    height,
    x,
    y,
    children,
    color,
    opacity
  ) {
    this.setType(type)
    this.setData(data)
    this.setChildrenNumber(childrenNumber)
    this.setDescendantsNumber(descendantsNumber)
    this.setWidth(width)
    this.setHeight(height)
    this.setX(x)
    this.setY(y)
    this.setChildren(children)
    this.setColor(color)
    this.setOpacity(opacity)
  }

  setType(type) {
    if (type !== null && type !== undefined && type.length > 0) {
      this.type = type
    } else {
      throw new BadFormat()
    }
  }

  getType() {
    return this.type
  }

  setData(data) {
    if (data !== null && data !== undefined) {
      this.data = data
    } else {
      throw new BadFormat()
    }
  }

  getData() {
    return this.data
  }

  setChildrenNumber(childrenNumber) {
    if (
      childrenNumber !== null &&
      childrenNumber !== undefined &&
      childrenNumber >= 0 &&
      Number.isInteger(childrenNumber)
    ) {
      this.childrenNumber = childrenNumber
    } else {
      throw new BadFormat()
    }
  }

  getChildrenNumber() {
    return this.childrenNumber
  }

  setDescendantsNumber(descendantsNumber) {
    if (
      descendantsNumber !== null &&
      descendantsNumber !== undefined &&
      descendantsNumber >= 0 &&
      Number.isInteger(descendantsNumber)
    ) {
      this.descendantsNumber = descendantsNumber
    } else {
      throw new BadFormat()
    }
  }

  getDescendantsNumber() {
    return this.descendantsNumber
  }

  setWidth(width) {
    if (width !== null && width !== undefined && Number.isFinite(width)) {
      this.width = width
    } else {
      throw new BadFormat()
    }
  }

  getWidth() {
    return this.width
  }

  setHeight(height) {
    if (height !== null && height !== undefined && Number.isFinite(height)) {
      this.height = height
    } else {
      throw new BadFormat()
    }
  }

  getHeight() {
    return this.height
  }

  setX(x) {
    if (x !== null && x !== undefined && x >= 0 && Number.isFinite(x)) {
      this.x = x
    } else {
      throw new BadFormat()
    }
  }

  getX() {
    return this.x
  }

  setY(y) {
    if (y !== null && y !== undefined && y >= 0 && Number.isFinite(y)) {
      this.y = y
    } else {
      throw new BadFormat()
    }
  }

  getY() {
    return this.y
  }

  setChildren(children) {
    if (children !== null && children !== undefined) {
      this.children = children
    } else {
      throw new BadFormat()
    }
  }

  getChildren() {
    return this.children
  }

  setColor(color) {
    if (color !== null && color !== undefined && color.length > 0) {
      this.color = color
    } else {
      throw new BadFormat()
    }
  }

  getColor() {
    return this.color
  }

  setOpacity(opacity) {
    if (opacity !== null && opacity !== undefined && opacity.length > 0) {
      this.opacity = opacity
    } else {
      throw new BadFormat()
    }
  }

  getOpacity() {
    return this.opacity
  }

  /**
   * Revives a File object.
   * @param object {Object} The given JavaScript object.
   * @return {Treemap} The related File object.
   * @throws {Error} In the case of an invalid object format.
   */
  static revive(object) {
    if (
      object !== null &&
      object !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'type') &&
      object.type !== null &&
      object.type !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'data') && // A data can be null or undefined.
      object.data !== null &&
      object.data !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'childrenNumber') &&
      object.childrenNumber !== null &&
      object.childrenNumber !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'descendantsNumber') &&
      object.descendantsNumber !== null &&
      object.descendantsNumber !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'width') &&
      object.width !== null &&
      object.width !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'height') &&
      object.height !== null &&
      object.height !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'x') &&
      object.x !== null &&
      object.x !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'y') &&
      object.y !== null &&
      object.y !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'children') &&
      object.children !== null &&
      object.children !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'color') &&
      object.color !== null &&
      object.color !== undefined &&
      Object.prototype.hasOwnProperty.call(object, 'opacity') &&
      object.opacity !== null &&
      object.opacity !== undefined
    ) {
      let children = []
      object.children.forEach((child) => children.push(Treemap.revive(child)))
      return new Treemap(
        object.type,
        object.data,
        object.childrenNumber,
        object.descendantsNumber,
        object.width,
        object.height,
        object.x,
        object.y,
        children,
        object.color,
        object.opacity
      )
    } else {
      throw new BadFormat()
    }
  }

  /**
   * Prints the object in a human-readable way (JSON).
   */
  toString() {
    return JSON.stringify(this)
  }
}
