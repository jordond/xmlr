import { basename, dirname } from 'path'

import { observable, action, computed } from 'mobx'
import { v4 } from 'node-uuid'

class XMLModel {
  store
  id
  @observable filepath
  @observable isTarget
  @observable isSelected

  constructor(store, filepath, target = false, selected = false) {
    this.id = v4()
    this.store = store
    this.filepath = filepath
    this.isTarget = target
    this.selected = selected
  }

  @action
  setSelected(selected = false) {
    this.isSelected = selected
  }

  @computed
  get displayName() {
    if (this.isTarget) {
      // Return the parent folder instead of xml name, as it is probably menuboardv2.xml
      // TODO display the folder name?
      return dirname(this.filepath)
    }
    // TODO removing the common name ex Project1 AP.xml, Project1 No Coffee.xml => AP.xml, No Coffee.xml
    return basename(this.filepath, '.xml')
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
