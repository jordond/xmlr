import React, { Component } from 'react'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'mobx-react'

import routes from './routes'

import { store as XmlStore } from './xmls'

export default class Root extends Component {
  render() {
    return (
      <Provider xmlStore={new XmlStore()}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </Provider>
    )
  }
}
