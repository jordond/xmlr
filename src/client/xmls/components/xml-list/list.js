import React from 'react'
import { inject, observer } from 'mobx-react'

import ListItem from './list-item'

/**
 * Renders the list of XMLModel's
 *
 * @param {Object} props
 * @param {Object<XmlStore>} props.xmlStore - Reference to the XML Store
 * @returns
 */
function List({ xmlStore: { list } }) {
  return (
    <ul>
      {
        list.map((item) => {
          const folder = <span>{item.root}</span>
          const fileItems = item.files.map(file => <ListItem key={file.id} item={file} />)
          return [folder, ...fileItems]
        })
      }
    </ul>
  )
}

List.propTypes = {
  xmlStore: React.PropTypes.object.isRequired,
}

export default inject('xmlStore')(observer(List))
