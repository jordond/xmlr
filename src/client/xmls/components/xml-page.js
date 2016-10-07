import React, { Component } from 'react'

import TargetXmlForm from './targetXml-form/targetXml-form'
import XmlList from './xml-list/list'
import XmlActions from './xml-actions/actions'

export default class XMLPage extends Component {
  render() {
    return (
      <div className="XMLPage">
        <TargetXmlForm />
        <XmlList />
        <XmlActions />
      </div>
    )
  }
}
