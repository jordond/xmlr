import { basename } from 'path'
import { observable, action, computed } from 'mobx'
import { v4 } from 'node-uuid'

import { splitPath, cleanUnderscoresAndTrim } from '../utils/misc'

class XMLModel {
  @observable filepath
  @observable isTarget = false
  @observable selected = false
  store
  id

  constructor(store, filepath, { target = false } = {}) {
    this.id = v4()
    this.store = store
    this.filepath = filepath
    this.isTarget = target
  }

  @computed
  get parentFolder() {
    return splitPath(this.filepath, 2)
  }

  @computed
  get displayName() {
    if (this.isTarget) {
      return this.parentFolder
    }

    return cleanUnderscoresAndTrim(basename(this.filepath, '.xml'))
  }

  @action
  setSelected() {
    this.store.setSelected(this.toJS())
  }

  destroy() {
    this.store.list.remove(this)
  }

  toJS() {
    return {
      id: this.id,
      filepath: this.filepath,
      isTarget: this.isTarget,
      selected: this.selected
    }
  }

  static fromJS(store, { filepath, target = false }) {
    return new XMLModel(store, filepath, { target })
  }
}

export default XMLModel
