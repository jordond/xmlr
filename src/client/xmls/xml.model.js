import { basename } from 'path'
import { observable, action, computed } from 'mobx'
import { v4 } from 'node-uuid'

import { splitPath, cleanUnderscoresAndTrim, getLastWord } from '../utils/misc'

class XMLModel {
  @observable filepath
  @observable isTarget = false
  @observable isSelected = false
  prefix = ''
  store
  id

  constructor(store, filepath, { target = false, prefix = '' }) {
    this.id = v4()
    this.store = store
    this.filepath = filepath
    this.isTarget = target
    this.prefix = splitPath(prefix, 0)
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



    const basePath = cleanUnderscoresAndTrim(basename(this.filepath, '.xml'))
    const prefix = cleanUnderscoresAndTrim(this.prefix)

    const lastWord = getLastWord(prefix)
    return `${lastWord} ${basePath.replace(prefix, '')}`
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
      isSelected: this.isSelected,
      prefix: this.prefix
    }
  }

  static fromJS(store, { filepath, target = false, selected = false }) {
    return new XMLModel(store, filepath, target, selected)
  }
}

export default XMLModel
