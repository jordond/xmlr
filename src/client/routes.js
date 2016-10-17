import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import Shell from './shell'
import { XMLPage } from './xmls'

/**
 * Creates the routes elements
 *
 * @returns {Object} All routes for the application
 */
export default () => (
  <Route path="/" component={Shell}>
    <IndexRoute component={XMLPage} />
    <Redirect from="*" to="/" />
  </Route>
)
