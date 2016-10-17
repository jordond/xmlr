import React from 'react'
import DevTools from 'mobx-react-devtools'

// Add components or styles

/**
 * Shell component
 *
 * Top most level of all components in the application, all routes and children will be placed inside
 * Contains mobx dev tools for development
 *
 * @param {Object} props - See proptypes
 * @returns React component
 */
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

/**
 * @property {Object} propTypes - Require prop types for app to function
 */
Shell.propTypes = {
  children: React.PropTypes.object
}

/**
 * @exports Shell
 */
export default Shell
