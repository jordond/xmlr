import { basename } from 'path'
import { observable, action, computed } from 'mobx'
import { v4 } from 'node-uuid'

import { splitPath, cleanUnderscoresAndTrim } from '../utils/misc'

/**
 * XMLModel Class
 * Contains all the relevant information about the XML object
 *
 * @class XMLModel
 */
class XMLModel {
  @observable filepath
  @observable isTarget = false
  @observable selected = false
  store
  id

  /**
   * Creates an new XMLModel object
   * @param {Object} store - A reference to the MobX XMLStore object @see xml.store
   * @param {String} filepath - Path to the xml
   * @param {Object} [options] - Optional options for creating a xml object
   *
   * @deprecated Selecting a target xml will soon be dropped in favour of selecting a target directory instead
   * @param {Boolean} [options.target] - XML is the target xml to be switched
   */
  constructor(store, filepath, { target = false } = {}) {
    this.id = v4()
    this.store = store
    this.filepath = filepath
    this.isTarget = target
  }

  /**
   * Get the parent folder
   *
   * @returns {String} Parent folder of this xml instance
   */
  @computed
  get parentFolder() {
    return splitPath(this.filepath, 2)
  }

  /**
   * Get the display name of the xml instance
   *
   * @returns {String} Cleaned up filename used for displaying to user
   */
  @computed
  get displayName() {
    if (this.isTarget) {
      return this.parentFolder
    }

    return cleanUnderscoresAndTrim(basename(this.filepath, '.xml'))
  }

  /**
   * Sets this xml to the selected xml
   */
  @action
  setSelected() {
    this.store.setSelected(this.toJS())
  }

  /**
   * Removes the model from the store
   */
  destroy() {
    this.store.list.remove(this)
  }

  /**
   * Converts the xml model into a plain javascript object
   * Used for persisting model into a json file
   *
   * @returns {Object} - Plain javascript object
   */
  toJS() {
    return {
      id: this.id,
      filepath: this.filepath,
      isTarget: this.isTarget,
      selected: this.selected
    }
  }

  /**
   * Creates an XMLModel from a javascript object
   * Used for restoring an xml model from a json file
   *
   * @static
   * @param {Object} store - Reference to the XMLStore
   * @param {Object} options - Options for creating the model
   * @param {String} options.filepath - Path to the xml file
   *
   * @deprecated
   * @see xml.model#constructor
   * @param {Boolean} [options.target] - Flag to determine if xml is the target xml
   */
  static fromJS(store, { filepath, target = false }) {
    return new XMLModel(store, filepath, { target })
  }
}

export default XMLModel
