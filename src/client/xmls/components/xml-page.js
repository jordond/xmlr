import React, { Component } from 'react'

import TargetXmlForm from './targetXml-form/targetXml-form'
import XmlList from './xml-list/list'
import XmlActions from './xml-actions/actions'

/**
 * Container page for all of the XML related React Components
 *
 * @class XMLPage
 * @extends {Component}
 */
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
