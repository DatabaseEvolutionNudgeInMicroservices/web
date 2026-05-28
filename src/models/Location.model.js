/**
 * @overview This class represents the extracted information for a function/method call location.
 */
export class Location {
  /**
   * Constructor for the LocationModel model
   * @param path {string} The location path string.
   * @param startLine {number} The start line of the call location.
   * @param startColumn {number} The start column of the call location.
   * @param endLine {number} The end line of the call location.
   * @param endColumn {number} The end column of the call location.
   */
  constructor(path, startLine, startColumn, endLine, endColumn) {
    this.path = path
    this.startLine = startLine
    this.startColumn = startColumn
    this.endLine = endLine
    this.endColumn = endColumn
  }

  getPath() {
    return this.path
  }

  getStartLine() {
    return this.startLine
  }

  getStartColumn() {
    return this.startColumn
  }

  getEndLine() {
    return this.endLine
  }

  getEndColumn() {
    return this.endColumn
  }

  toString() {
    return JSON.stringify(this)
  }
}
