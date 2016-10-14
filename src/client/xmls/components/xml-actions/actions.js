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
    const { loading, target } = this.props.xmlStore
    const disabled = loading || !target
    return (
      <div className={styles.test}>
        <div />
        <button onClick={this.handleLoadFiles} disabled={disabled}>Load Files</button>
        <button onClick={this.handleLoadFolder} disabled={disabled}>Load Folder</button>
        <button onClick={this.handleClear} disabled={loading}>Clear</button>
        {(() => {
          if (process.env.NODE_ENV === 'development') {
            // TODO, finish the settings saving and loading, and make this button load this.state.
            // In debug mode, auto save state, if flag is true
            return <button onClick={() => this.props.xmlStore.debug()}>DEBUG-LOAD</button>
          }
        })()}
      </div>
    )
  }

}
