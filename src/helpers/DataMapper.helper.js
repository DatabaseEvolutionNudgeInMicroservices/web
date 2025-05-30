// Model

import { Treemap } from '@/models/Treemap.model'

// Error

import { BadFormat } from '@/errors/BadFormat.error'

export class DataMapper {
  // ------------------------------------------------------------------------
  //                            JSON -> Object
  // ------------------------------------------------------------------------

  /**
   * Revives the treemap model from a given string representing the JSON object.
   * @param {*} json The given JSON object in string.
   * @returns The revived treemap model.
   */
  revive(json) {
    try {
      return Treemap.revive(json)
    } catch (e) {
      throw new BadFormat()
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
      throw new BadFormat()
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
}
