import React from 'react'
import { observer, PropTypes } from 'mobx-react'

import styles from './list-item.css'

function ListItem({ item }) {
  return (
    <li className={item.selected ? styles.test : {}} onClick={() => item.setSelected()}>
      {item.displayName}
    </li>
  )
}

ListItem.propTypes = {
  item: PropTypes.objectOrObservableObject.isRequired
}

export default observer(ListItem)
