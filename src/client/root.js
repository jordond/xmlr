import React, { Component } from 'react'
import { Router, hashHistory } from 'react-router'
import { Provider } from 'mobx-react'

import createRoutes from './routes'
import { store as XmlStore } from './xmls'

// TODO create class to save state of stores to file?
const xmlStore = new XmlStore()
const routes = createRoutes()

export default class Root extends Component {
  render() {
    return (
      <Provider xmlStore={xmlStore}>
        <Router history={hashHistory}>
          {routes}
        </Router>
      </Provider>
    )
  }
}
