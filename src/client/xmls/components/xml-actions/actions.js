import React, { Component } from 'react'
import { observer } from 'mobx-react'

import styles from './actions.css'

@observer(['xmlStore'])
export default class TargetXmlForm extends Component {

  static propTypes = {
    xmlStore: React.PropTypes.any.isRequired
  }

  constructor() {
    super()
    this.handleLoadFiles = this.handleLoadFiles.bind(this)
    this.handleLoadFolder = this.handleLoadFolder.bind(this)
    this.handleClear = this.handleClear.bind(this)
  }

  handleLoadFiles() {
    this.props.xmlStore.loadFiles()
  }

  handleLoadFolder() {
    this.props.xmlStore.loadFolder()
  }

  handleClear() {
    this.props.xmlStore.clear()
  }

  render() {
    const { loading } = this.props.xmlStore
    return (
      <div className={styles.test}>
        <div />
        <button onClick={this.handleLoadFiles} disabled={loading}>Load Files</button>
        <button onClick={this.handleLoadFolder} disabled={loading}>Load Folder</button>
        <button onClick={this.handleClear} disabled={loading}>Clear</button>
      </div>
    )
  }

}
