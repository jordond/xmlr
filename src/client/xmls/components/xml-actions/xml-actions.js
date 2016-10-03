import React, { Component } from 'react'
import { observer } from 'mobx-react'

import XMLStore from '../../xml.store'

import styles from './xml-actions.css'

@observer(['xmlStore'])
class TargetXmlForm extends Component {

  static propTypes = {
    xmlStore: XMLStore
  }

  constructor() {
    super()
    this.store = this.props.xmlStore
  }

  handleLoad() {
    console.log('HandleLoad')
    this.store.loadXmls()
  }

  handleClear() {
    console.log('Handleclear', this)
    this.store.clear()
  }

  render() {
    return (
      <div className={styles.test}>
        <button onClick={this.handleLoad}>Load</button>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    )
  }

}

export default TargetXmlForm
