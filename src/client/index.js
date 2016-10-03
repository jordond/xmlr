import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'mobx-react'

// Routes
import routes from './routes'

// Stores
// import uiStore from './store'
import { store as XmlStore } from './xmls'

const uiStore = { title: "I'm a dummy" }

// Render the application
render(
  <Provider uiStore={uiStore} xmlStore={new XmlStore()}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
)
