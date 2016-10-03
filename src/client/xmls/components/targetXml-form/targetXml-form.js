import React, { Component } from 'react'
import { observer } from 'mobx-react'

import styles from './targetXml.css'

@observer(['xmlStore'])
class TargetXmlForm extends Component {

  static propTypes = {
    xmlStore: React.PropTypes.any.isRequired
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  test = 5

  handleClick() {
    console.log('Button was clicked', this)
    this.props.xmlStore.selectTarget()
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
