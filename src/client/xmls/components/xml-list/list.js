import React from 'react'
import { inject, observer } from 'mobx-react'

import ListItem from './list-item'

function List({ xmlStore: { list } }) {
  let prefix = ''
  return (
    <ul>
      {
        list.map((item) => {
          const elements = []
          if (item.prefix !== prefix) {
            elements.push(<span>{item.filepath}</span>)
            prefix = item.prefix
          }
          elements.push(<ListItem key={item.id} item={item} />)
          return elements
        })
      }
    </ul>
  )
}

List.propTypes = {
  xmlStore: React.PropTypes.object.isRequired,
}

export default inject('xmlStore')(observer(List))
