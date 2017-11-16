import { dirname } from 'path'
import { action, observable, computed, autorun } from 'mobx'

import flatten from '../utils/array'
import createLog from '../utils/logger'

import XMLModel from './xml.model'
import { selectTargetXml, selectMultipleXMLs, selectXMLFolder, switchXML } from './xml.service'

/**
 * XMLStore Class
 * Central location for keeping track of all the data relating to the XMLs
 *
 * @class XMLStore
 */
class XMLStore {
  @observable loading = false
  @observable error = {}
  @observable list = []
  @observable target = null
  @observable test = {}
  @observable filterText = ''
  existingFilepaths = []
  log

  /**
   * Creates a new XMLStore instance
   * Create a new logger object and register the autorun functions
   */
  constructor() {
    this.log = createLog('XMLStore')

    /**
     * Run whenever a new XML is selected
     */
    autorun(() => {
      if (this.selected.id && this.target) {
        this.log.info(`Item selected -> ${this.selected.id}`)
        switchXML(this.target.filepath, this.selected.filepath)
      }
    })

    // autorun(() => {

    // })

    /**
     * Run whenever an error message has been caught
     */
    autorun(() => {
      if (this.error && this.error.message) {
        this.log.error(`Error -> ${this.error.message}`, this.error)
      }
    })
  }

  /**
   * Creates a flat list of all the currently loaded XML files
   * @returns {Object<XmlModel>[]} A list of XMLModel objects
   */
  listAll() {
    if (this.list.length === 0) {
      return []
    }
    const list = this.list.map(x => x.files)
    return flatten(list)
  }

  /**
   * Gets the currently selected XMLModel from the list of all models
   * @returns {Object<XMLModel} Selected xml
   */
  @computed
  get selected() {
    return this.listAll().find(x => x.selected) || {}
  }

  @computed
  get filteredItems() {
    if (this.filterText !== '') {
      return this.listAll().filter(x => x.filepath.indexOf(this.filterText) !== -1)
    }
    return this.listAll()
  }

  /**
   * Select a target xml to be the base for switching xmls
   * @deprecated Soon to be dropped in favour of selecting a root folder instead of a file
   */
  @action
  async selectTarget() {
    this.loading = true
    try {
      const results = await selectTargetXml()
      if (results && results[0]) {
        if (this.target) {
          this.target.filepath = results[0]
        } else {
          this.target = new XMLModel(this, results[0], { target: true })
        }
      }
      this.resetLoading()
    } catch (error) {
      this.resetLoading(error)
    }
  }

  /**
   * Open a file dialog and select one or more xml files to add to the list
   */
  async loadFiles() {
    this.loading = true
    try {
      const filenames = await selectMultipleXMLs()
      this.loadXmls(filenames)
      this.loading = false
    } catch (error) {
      this.resetLoading(error)
    }
  }

  /**
   * Load all xml files in a selected folder(s)
   * Opens a dialog window to choose folders
   */
  async loadFolder() {
    this.loading = true
    try {
      const folderList = await selectXMLFolder()

      // For each folder chosen, load the xmls
      for (const filenames of folderList) {
        this.loadXmls(filenames)
      }
      this.loading = false
    } catch (error) {
      this.resetLoading(error)
    }
  }

  /**
   * Takes a list of xml files and creates XMLModel instances
   * If the filepath already exists in the global array then it will be ignored
   *
   * @param {String[]} filenames - List of xml files to create
   */
  @action
  loadXmls(filenames = []) {
    if (filenames && filenames.length > 0) {
      // Filter out existing files, and sort the remaining
      const uniqueFiles = filenames
        .filter(x => !this.existingFilepaths.includes(x))
        .sort((l, r) => l.length - r.length)

      // Only continue if there are some new files to create
      if (uniqueFiles.length > 0) {
        // Keep track of filepaths that are loaded
        this.existingFilepaths.push(...uniqueFiles)

        // Create the Xml models
        const xmls = uniqueFiles.map(x => new XMLModel(this, x))

        // Check to see if the root folder path already exists
        const existingIndex = this.list.findIndex(x => x.root === dirname(uniqueFiles[0]))

        // If the root folder doesn't exist, then create a new root object, and add the xml instances
        if (existingIndex === -1) {
          this.list.push({ root: dirname(uniqueFiles[0]), files: xmls })
        } else {
          // Add the new instances to the existing folder
          this.list[existingIndex].files.push(...xmls)
        }
      }
    }
  }

  /**
   * Mark the item as selected
   * If the target path is not chosen, do not select the xml
   *
   * @param {Object<XMLModel} item - Item to select
   */
  @action
  setSelected(item) {
    if (this.target) {
      this.listAll().forEach(x => (x.selected = item.id === x.id))
    } else {
      this.log.warning(`Can't select [${item.id}] because target is not chosen`)
    }
  }

  /**
   * Clear the store of all loaded xmls
   * Also deletes the lookup table of added files
   */
  @action
  clear() {
    this.list.clear()
    this.existingFilepaths = []
  }

  /**
   * Resets the loading flag, and the error object
   * @param {Object} [error=null] - Object containing error information
   */
  @action
  resetLoading(error = null) {
    this.loading = false
    this.error = error
  }

  /**
   * DEBUG Function
   * TODO: Delete
   *
   * Populates the fields for testing
   */
  debug() {
    console.log('debug for now', this)
  }

}

/**
 * @exports XMLStore
 */
export default XMLStore
