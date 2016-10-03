import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import Shell from './shell'
import { XMLPage } from './xmls'

export default (
  <Route path="/" component={Shell}>
    <IndexRoute component={XMLPage} />
    <Redirect from="*" to="/" />
  </Route>
)

// export default (
//   <Route path="/" component={Shell}>
//     <IndexRoute component={GithubPage} />
//     <Route path="clock" component={ClockPage} />
//     <Redirect from="*" to="/" />
//   </Route>
// )
