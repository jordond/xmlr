import { action, observable, computed, autorun } from 'mobx'

import XMLModel from './xml.model'

class XMLStore {
  @observable loading = false
  @observable error = null
  @observable list = []
  @observable target = null
  @observable test = {}

  constructor() {
    autorun(() => {
      // TODO implement, for now just console.log
      // this.bridge.selectedXmlChanged(this.selected)
      if (this.target) {
        console.log(`Target xml has changed -> ${this.target.filepath}`)
      }
    })

    autorun(() => console.log('Item selected -> ', this.selected))
  }

  @computed
  get selected() {
    return this.list.find(x => x.isSelected) || {}
  }

  @action
  selectTarget() {
    this.loading = true

    try {
      // TODO Implement file dialog, spooooofing for now
      // const targetFilePath = await this.bridge.chooseTargetXml()
      const targetFilePath = `/Users/jdhoog.ALPHA/flash/fdmb_tim_hortons/SampleXML-${Math.random()}.xml`
      if (this.target) {
        this.target.filepath = targetFilePath
      } else {
        this.target = new XMLModel(this, targetFilePath, true, false)
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
      this.list.clear()
      this.resetLoading(error)
    }
  }

  @action
  setSelected(item) {
    this.list.forEach(x => (x.isSelected = item.id === x.id))
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
