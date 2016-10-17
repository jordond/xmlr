import React, { Component } from 'react'
import { observer } from 'mobx-react'

import styles from './targetXml.css'

/**
 * TargetXmlForm Component
 * Renders the buttons and elements needed to choose a target file or directory
 *
 * @class TargetXmlForm
 * @extends {Component}
 */
@observer(['xmlStore'])
class TargetXmlForm extends Component {

  static propTypes = {
    xmlStore: React.PropTypes.any.isRequired
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  /**
   * Start the target selection process on click
   */
  handleClick() {
    const { loading } = this.props.xmlStore
    if (!loading) {
      this.props.xmlStore.selectTarget()
    }
  }

  render() {
    const { target, loading, error } = this.props.xmlStore
    return (
      <div className="TargetXMLForm">
        Target: {error ? error.message : ''}
        <div className={styles.inputGroup}>
          <button onClick={this.handleClick} disabled={loading}>Select</button>
          <span>{target ? target.displayName : 'No target chosen' }</span>
        </div>
      </div>
    )
  }

}

/**
 * @exports TargetXmlForm
 */
export default TargetXmlForm
