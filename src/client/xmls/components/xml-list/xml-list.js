import React, { Component } from 'react'
import { observer } from 'mobx-react'

import XMLStore from '../../xml.store'

import styles from './xml-list.css'

@observer(['xmlStore'])
class XMLList extends Component {

  static propTypes = {
    xmlStore: XMLStore
  }

  handleSelectItem(item) {
    console.log(`handleSelectItem ${item.id}`, this.test)
  }

  render() {
    return (
      <div className={styles.test}>
        <ul>
          {
            this.props.xmlStore.list.map(item =>
              <li key={item.id} onClick={() => this.handleSelectItem(item)}>{item.displayName}</li>
            )
          }
        </ul>
      </div>
    )
  }

}

export default XMLList
