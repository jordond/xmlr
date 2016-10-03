import { action, observable, computed, autorun } from 'mobx'

import XMLModel from './xml.model'

class XMLStore {
  @observable loading = false
  @observable error = null
  @observable list = []
  @observable target = null

  constructor() {
    autorun(() => {
      // TODO implement, for now just console.log
      // this.bridge.selectedXmlChanged(this.selected)
      console.log(`Selected Item has changed -> ${this.selected.id}`, this.selected)
    })
  }

  @computed
  get selected() {
    return this.loadedXmls.find(x => x.isSelected)
  }

  @action
  async selectTarget() {
    this.loading = true

    try {
      // TODO Implement file dialog, spooooofing for now
      // const targetFilePath = await this.bridge.chooseTargetXml()
      const targetFilePath = '/Users/jdhoog.ALPHA/flash/fdmb_tim_hortons/SampleXML.xml'
      this.target = new XMLModel(this, targetFilePath, true, false)
      this.resetLoading()
    } catch (error) {
      this.resetLoading(error)
    }
  }

  @action
  async loadXmls() {
    this.loading = true

    try {
      // TODO implement xml choosing
      // const filenames = await this.bridge.chooseXmls()
      const filenames = [
        `/Users/jdhoog.ALPHA/flash/Bakery Port/Bakery AP ${Math.random()}.xml`,
        `/Users/jdhoog.ALPHA/flash/Bakery Port/Bakery No Cookies.xml ${Math.random()}`,
        `/Users/jdhoog.ALPHA/flash/Bakery Port/Bakery No Donuts ${Math.random()}.xml`
      ]

      if (filenames) {
        const xmls = filenames.map(x => new XMLModel(this, x, false, false))
        this.list = this.list.concat(xmls)
      }
    } catch (error) {
      this.list = []
      this.resetLoading(error)
    }
  }

  @action
  clear() {
    this.list = []
  }

  @action
  resetLoading(error = null) {
    this.loading = false
    this.error = error
  }

}

export default XMLStore
