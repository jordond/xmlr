import { basename, dirname } from 'path'

import { observable, action, computed } from 'mobx'
import { v4 } from 'node-uuid'

class XMLModel {
  store
  id
  @observable filepath
  @observable isTarget = false
  @observable isSelected = false

  constructor(store, filepath, target = false, selected = false) {
    this.id = v4()
    this.store = store
    this.filepath = filepath
    this.isTarget = target
    this.selected = selected
  }

  @computed
  get parentFolder() {
    return dirname(this.filepath)
  }

  @computed
  get displayName() {
    if (this.isTarget) {
      // Return the parent folder instead of xml name, as it is probably menuboardv2.xml
      // TODO display the folder name?
      return this.parentFolder
    }
    // TODO removing the common name ex Project1 AP.xml, Project1 No Coffee.xml => AP.xml, No Coffee.xml
    return basename(this.filepath, '.xml')
  }

  @action
  setSelected() {
    this.store.setSelected(this.toJS())
  }

  destroy() {
    this.store.loadedXmls.remove(this)
  }

  toJS() {
    return {
      id: this.id,
      filepath: this.filepath,
      isTarget: this.isTarget,
      isSelected: this.isSelected
    }
  }

  static fromJS(store, { filepath, target = false, selected = false }) {
    return new XMLModel(store, filepath, target, selected)
  }
}

export default XMLModel
