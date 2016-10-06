import React, { Component } from 'react'
import { observer } from 'mobx-react'

import TargetXmlForm from './targetXml-form/targetXml-form'
import XmlList from './xml-list/list'
import XmlActions from './xml-actions/actions'

@observer(['xmlStore'])
export default class XMLPage extends Component {
  static propTypes = {
    xmlStore: React.PropTypes.any.isRequired
  }

  render() {
    return (
      <div className="XMLPage">
        <TargetXmlForm />
        <XmlList store={this.props.xmlStore} />
        <XmlActions />
      </div>
    )
  }
}
