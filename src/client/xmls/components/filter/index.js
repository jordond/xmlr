import React, { Component } from 'react'
import { observer } from 'mobx-react'

/**
 * Filter Component
 * Render all the elements required to perform actions on the xml list
 *
 * @exports Filter
 * @class Filter
 * @extends {Component}
 */
@observer(['xmlStore'])
export default class Filter extends Component {

  static propTypes = {
    xmlStore: React.PropTypes.any.isRequired
  }

  /**
   * Bind all of the action listeners to this
   */
  constructor() {
    super()
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleFilterChange(e) {
    this.props.xmlStore.filterText = e.target.value;
  }

  render() {
    const { filterText, list } = this.props.xmlStore
    return (
      <div className="filter-container">
        {
          list.length > 0 &&
            <div className="filter">
              Filter XMLS:
              <input type="text" className="filter-text" value={this.filterText} onChange={this.handleFilterChange} />
            </div>
        }
      </div>
    )
  }

}
