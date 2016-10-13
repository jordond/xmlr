import { dirname } from 'path'
import { action, observable, computed, autorun } from 'mobx'

import flatten from '../utils/array'
import createLog from '../utils/logger'

import XMLModel from './xml.model'
import { selectTargetXml, selectMultipleXMLs, selectXMLFolder, switchXML } from './xml.service'

class XMLStore {
  @observable loading = false
  @observable error = {}
  @observable list = []
  @observable target = null
  @observable test = {}
  existingFilepaths = []
  log

  constructor() {
    this.log = createLog('XMLStore')
    autorun(() => {
      // TODO implement, for now just console.log
      // this.bridge.selectedXmlChanged(this.selected)
      if (this.target) {
        this.log.info(`Target xml has changed -> ${this.target.filepath}`)
      }
    })

    autorun(() => {
      if (this.selected.id && this.target) {
        this.log.info(`Item selected -> ${this.selected.id}`)
        switchXML(this.target.filepath, this.selected.filepath)
      }
    })

    autorun(() => {
      if (this.error && this.error.message) {
        this.log.error(`Error -> ${this.error.message}`, this.error)
      }
    })
  }

  listAll() {
    if (this.list.length === 0) {
      return []
    }
    const list = this.list.map(x => x.files)
    return flatten(list)
  }

  @computed
  get selected() {
    return this.listAll().find(x => x.selected) || {}
  }

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

  async loadFolder() {
    this.loading = true
    try {
      const folderList = await selectXMLFolder()
      for (const filenames of folderList) {
        this.loadXmls(filenames)
      }
      this.loading = false
    } catch (error) {
      this.resetLoading(error)
    }
  }

  @action
  loadXmls(filenames = []) {
    if (filenames && filenames.length > 0) {
      const uniqueFiles = filenames
        .filter(x => !this.existingFilepaths.includes(x))
        .sort((l, r) => l.length - r.length)

      if (uniqueFiles.length > 0) {
        this.existingFilepaths.push(...uniqueFiles)

        // Create the Xml models
        const xmls = uniqueFiles.map(x => new XMLModel(this, x))

        const existingIndex = this.list.findIndex(x => x.root === dirname(uniqueFiles[0]))
        if (existingIndex === -1) {
          this.list.push({ root: dirname(uniqueFiles[0]), files: xmls })
        } else {
          this.list[existingIndex].files.push(...xmls)
        }
      }
    }
  }

  @action
  setSelected(item) {
    if (this.target) {
      this.listAll().forEach(x => (x.selected = item.id === x.id))
    } else {
      this.log.warning(`Can't select [${item.id}] because target is not chosen`)
    }
  }

  @action
  clear() {
    this.list.clear()
    this.existingFilepaths = []
  }

  @action
  resetLoading(error = null) {
    this.loading = false
    this.error = error
  }

}

export default XMLStore
