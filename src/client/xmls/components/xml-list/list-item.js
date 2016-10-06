import React from 'react'
import { observer, PropTypes } from 'mobx-react'

import styles from './list.css'

function ListItem({ item }) {
  return (
    <li className={item.isSelected ? styles.test : {}} onClick={item.setSelected}>
      {item.displayName}
    </li>
  )
}

ListItem.propTypes = {
  item: PropTypes.objectOrObservableObject.isRequired
}

export default observer(ListItem)
