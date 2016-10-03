import React, { Component } from 'react'
import { observer } from 'mobx-react'

import XMLStore from '../../xml.store'

import styles from './targetXml.css'

@observer(['xmlStore'])
class TargetXmlForm extends Component {

  static propTypes = {
    xmlStore: XMLStore
  }

  handleClick() {
    console.log('Button was clicked', this)
    this.props.xmlStore.target.filepath += '1'
  }

  render() {
    const { target } = this.props.xmlStore
    return (
      <div className={styles.test}>
        Target:
        <button onClick={this.handleClick}>Select</button>
        <span>{target ? target.displayName : 'No target chosen' }</span>
      </div>
    )
  }

}

export default TargetXmlForm
