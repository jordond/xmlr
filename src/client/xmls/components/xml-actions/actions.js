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
    this.handleLoad = this.handleLoad.bind(this)
    this.handleClear = this.handleClear.bind(this)
  }

  handleLoad() {
    this.props.xmlStore.loadXmls()
  }

  handleClear() {
    this.props.xmlStore.clear()
  }

  render() {
    return (
      <div className={styles.test}>
        <div />
        <button onClick={this.handleLoad}>Load</button>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    )
  }

}
