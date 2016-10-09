import { action, observable, computed, autorun } from 'mobx'

import { findPrefix } from '../utils/misc'
import XMLModel from './xml.model'
import { selectTargetXml, selectMultipleXMLs } from './xml.service'

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

  @computed
  get selected() {
    return this.list.find(x => x.isSelected) || {}
  }

  // @computed
  // function toMap() {
  //   const prefixes = Array.from(this.list, )
  // }

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

  @action
  async loadXmls() {
    this.loading = true
    try {
      const filenames = await selectMultipleXMLs()
      if (filenames) {
        const uniqueFiles = filenames
          .filter(x => !this.existingFilepaths.includes(x))
          .sort((l, r) => l.length - r.length)

        if (uniqueFiles.length > 0) {
          this.existingFilepaths.push(...uniqueFiles)

          // Create the Xml models
          const prefix = findPrefix(this.existingFilepaths)
          const xmls = uniqueFiles.map(x => new XMLModel(this, x, { prefix }))

          // TODO change array to be [ { root: 'path/to/xmls', files: [] }]
          this.list.push(...xmls)
        }
      }
      this.loading = false
    } catch (error) {
      this.resetLoading(error)
      console.error('loadXmls failed', error)
    }
  }

  @action
  setSelected(item) {
    this.list.forEach(x => (x.isSelected = item.id === x.id))
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
