import React, { Component } from 'react'
import { Router, hashHistory } from 'react-router'
import { Provider } from 'mobx-react'

import createRoutes from './routes'
import { store as XmlStore } from './xmls'

// TODO create class to save state of stores to file?
const xmlStore = new XmlStore()
const routes = createRoutes()

/**
 * Root element of application
 *
 * @class Root
 * @extends {Component}
 */
class Root extends Component {
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

/**
 * @exports Root
 */
export default Root
