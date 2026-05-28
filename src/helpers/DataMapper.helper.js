// Model

import { Treemap } from '@/models/Treemap.model'
import { Location } from '@/models/Location.model.js'
import { Frame } from '@/models/Frame.model.js'

// Error

import { BadFormat } from '@/errors/BadFormat.error'
import { INPUT_INCORRECTLY_FORMATTED } from '@/helpers/Text.helper'

/**
 * @overview This class represents the data mapper between a visualization static analysis report and any request regarding rendering purposes.
 */
export class DataMapper {
  // ------------------------------------------------------------------------
  //                            JSON -> Object
  // ------------------------------------------------------------------------

  /**
   * Revives the treemap model from a given string representing the JSON object.
   * @param {*} json The given JSON object in string.
   * @returns The revived treemap model.
   */
  reviveTreemap(json) {
    try {
      return Treemap.revive(json)
    } catch (e) {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }

  /**
   * Revives an array of the frame model from a given string representing the JSON object.
   * @param {*} objects The given JSON object in string.
   * @returns An array of revived frame models.
   */
  reviveFrames(objects) {
    try {
      return objects.map((frame) => Frame.revive(frame))
    } catch (e) {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }

  /**
   * Extracts the location path, line and column numbers from a given location string.
   * @param location {string} The location string, typically in the format:
   * @returns an object containing the path, start line, start column, end line and end column.
   */
  extractLocation(location) {
    const pathRegex = /\/tree\/[^\/]+\/(.+)/
    const linesRegex = /#L(\d+)C(\d+)-L(\d+)C(\d+)/

    const linesMatch = location.match(linesRegex)
    const pathMatch = location.match(pathRegex)

    if (pathMatch && linesMatch) {
      const path = pathMatch[1].split('#')[0]
      const startLine = parseInt(linesMatch[1], 10)
      const startColumn = parseInt(linesMatch[2], 10)
      const endLine = parseInt(linesMatch[3], 10)
      const endColumn = parseInt(linesMatch[4], 10)
      return new Location(path, startLine, startColumn, endLine, endColumn)
    } else {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }

  // ------------------------------------------------------------------------
  //                         Treemap -> Treemap
  // ------------------------------------------------------------------------

  /**
   * Colors the given treemap model.
   * @param {Treemap} treeMap The given model.
   * @param {() => {}} colorization A colorization function pointing a given property.
   * @returns The updated treemap model.
   */
  colorTreemap(treeMap, colorization) {
    if (treeMap !== undefined && treeMap !== null) {
      colorization(treeMap)
      treeMap
        .getChildren()
        .forEach((repository) => this.colorTreemapRepository(repository, colorization))
      return treeMap
    } else {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }

  colorTreemapRepository(repository, colorization) {
    colorization(repository)
    repository
      .getChildren()
      .forEach((repository) => this.colorTreemapDirectory(repository, colorization))
    return repository
  }

  colorTreemapDirectory(directory, colorization) {
    colorization(directory)
    directory.getChildren().forEach((child) => {
      if (child.type === 'directory') {
        this.colorTreemapDirectory(child, colorization)
      } else {
        this.colorTreemapFile(child, colorization)
      }
    })
    return directory
  }

  colorTreemapFile(file, colorization) {
    colorization(file)
    file
      .getChildren()
      .forEach((codeFragment) => this.colorTreemapCodeFragment(codeFragment, colorization))
    return file
  }

  colorTreemapCodeFragment(codeFragment, colorization) {
    colorization(codeFragment)
    return codeFragment
  }

  /**
   * Colors the given frame.
   * @param {Frame} frame The given model.
   * @param {() => {}} colorization A colorization function pointing a given property.
   * @returns The updated frame model.
   */
  colorFrame(frame, colorization) {
    if (frame && colorization) {
      colorization(frame)
      return frame
    } else {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }
}
