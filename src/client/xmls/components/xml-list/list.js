import React from 'react'
import { observer } from 'mobx-react'

import ListItem from './list-item'

function List(props) {
  return <ul>{ props.store.list.map(item => <ListItem key={item.id} item={item} />) }</ul>
}

List.propTypes = {
  store: React.PropTypes.object.isRequired,
}

export default observer(List)
