import React, { Component } from 'react'
import { observer } from 'mobx-react'

import styles from './actions.css'

/**
 * Actions Component
 * Render all the elements required to perform actions on the xml list
 *
 * @exports Actions
 * @class Actions
 * @extends {Component}
 */
@observer(['xmlStore'])
export default class Actions extends Component {

  static propTypes = {
    xmlStore: React.PropTypes.any.isRequired
  }

  /**
   * Bind all of the action listeners to this
   */
  constructor() {
    super()
    this.handleLoadFiles = this.handleLoadFiles.bind(this)
    this.handleLoadFolder = this.handleLoadFolder.bind(this)
    this.handleClear = this.handleClear.bind(this)
  }

  // Open the file dialog
  handleLoadFiles() {
    this.props.xmlStore.loadFiles()
  }

  // Opens the folder dialog
  handleLoadFolder() {
    this.props.xmlStore.loadFolder()
  }

  // Clears the xml list of all instances
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
