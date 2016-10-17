import React from 'react'
import { observer, PropTypes } from 'mobx-react'

import styles from './list-item.css'

/**
 * Renders the individual xml instance
 *
 * @param {Object} props - Component props
 * @param {Object<XMLModel>} props.item - Instance of XMLModel
 * @returns
 */
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

/**
 * Exports a ListItem component, that is listening for changes to the XMLStore
 * @exports ListItem
 */
export default observer(ListItem)
