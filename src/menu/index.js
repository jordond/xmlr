import file from './file'
import view from './view'
import tools from './tools'
import window from './window'
import help from './help'

/**
 * @const {Boolean} IS_DARWIN - Whether or not the current OS is Mac OS X
 */
const IS_DARWIN = process.platform === 'darwin'

/**
 * Mac OS X specific menu
 *
 * @param {Object} mainWindow - Instance of the main window process
 * @returns Electron menu object
 */
function darwin(mainWindow) {
  return [
    file.darwin,
    view.darwin(mainWindow),
    window,
    help
  ]
}

/**
 * Windows and Linux specific menu
 *
 * @param {Object} mainWindow - Instance of the main window process
 * @returns Electron menu object
 */
function other(mainWindow) {
  return [
    file.other(mainWindow),
    view.other(mainWindow),
    tools(mainWindow),
    help
  ]
}

/**
 * Build the Menu object based on the current system OS
 *
 * @param {any} mainWindow
 * @returns Mac OSX or Windows/Linux menu object
 */
function build(mainWindow) {
  if (!mainWindow) {
    throw new Error('Missing mainWindow argument')
  }
  return IS_DARWIN ? darwin(mainWindow) : other(mainWindow)
}

export default { build }
