import { dirname } from 'path'
import { action, observable, computed, autorun } from 'mobx'

import flatten from '../utils/array'

import XMLModel from './xml.model'
import { selectTargetXml, selectMultipleXMLs, selectXMLFolder } from './xml.service'

class XMLStore {
  @observable loading = false
  @observable error = {}
  @observable list = []
  @observable target = null
  @observable test = {}
  existingFilepaths = []

  constructor() {
    autorun(() => {
      // TODO implement, for now just console.log
      // this.bridge.selectedXmlChanged(this.selected)
      if (this.target) {
        console.log(`Target xml has changed -> ${this.target.filepath}`)
      }
    })

    autorun(() => console.log('Item selected -> ', this.selected.id))
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
      console.error('loadfiles failed', error)
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
      console.error('loadFolder failed', error)
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
    this.listAll().forEach(x => (x.selected = item.id === x.id))
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
