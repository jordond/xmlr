import React from 'react'
import { render } from 'react-dom'

import { register as registerLogger } from './utils/logger'

// Components
import Root from './root'

registerLogger()

render(<Root />, document.getElementById('root'))
