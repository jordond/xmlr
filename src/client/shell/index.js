import React from 'react'
import DevTools from 'mobx-react-devtools'

// Add components or styles

function Shell(props) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div>
        {props.children}
        <DevTools />
      </div>
    )
  }
  return <div>{props.children}</div>
}

Shell.propTypes = {
  children: React.PropTypes.object
}

export default Shell
